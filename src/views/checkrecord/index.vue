<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="14">
          <span class="demonstration">截止日期</span>
          <el-date-picker
            v-model="datetime"
            style="margin-left: 20px;"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            @change="handleFilter"
          />
        </el-col>
        <el-col :span="10">
          <el-input v-model="listQuery.name" placeholder="产品名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" style="margin-left: 90px;" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button v-if="roles.includes('ADMIN')" v-waves class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
            添加
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="filter-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        style="width: 100%; margin-top: 15px;"
      >
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="抽检产线">
          <template slot-scope="scope">
            {{ scope.row.plineName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="抽检产品">
          <template slot-scope="scope">
            {{ scope.row.goodName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="抽检类型">
          <template slot-scope="scope">
            {{ typemap[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="抽检内容">
          <template slot-scope="scope">
            {{ scope.row.context }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="抽检备注">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="抽检人">
          <template slot-scope="scope">
            {{ scope.row.spotChecker }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="抽检时间">
          <template slot-scope="scope">
            {{ scope.row.spotCheckDate }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否合格">
          <template slot-scope="scope">
            {{ scope.row.isQualified }}
          </template>
        </el-table-column>
        <el-table-column v-if="roles.includes('ADMIN')" fixed="right" align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="success" icon="el-icon-edit" @click="handleUpdate(scope.row)" />
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchdata" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px" style="width: 800px; margin-left:50px;">
        <el-form-item label="抽检产线" prop="line">
          <el-select v-model="temp.line" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in selecttemp.lineslect" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="抽检产品" prop="product">
          <el-select v-model="temp.product" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in selecttemp.productselect" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="抽检人" prop="peopleName">
          <el-input v-model="temp.peopleName" placeholder="请输入内容" style="width: 220px;" @input="chanege($event)" />
        </el-form-item>
        <el-form-item label="抽检类型" prop="typevalue">
          <el-select v-model="temp.typevalue" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否合格" prop="qualifiedvalue">
          <el-select v-model="temp.qualifiedvalue" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in qualified" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="抽检内容" style="width: 150px">
          <el-input v-model="temp.context" placeholder="请输入内容" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="备注" style="width: 150px">
          <el-input
            v-model="temp.remarks"
            type="textarea"
            placeholder="请输入内容"
            maxlength="40"
            show-word-limit
            style="width: 240px;"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getList, deleteList, getProduct, getLine, createRecord, updateRecord } from '@/api/checkrecord'
import { mapGetters } from 'vuex'

export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      datetime: this.$moment(new Date()).format('YYYY-MM-DD'),
      list: [],
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined
      },
      temp: {
        peopleName: '',
        remarks: '',
        context: '',
        line: '',
        product: '',
        typevalue: '',
        qualifiedvalue: '',
        id: ''
      },
      rules: {
        line: [{ required: true, message: '抽检产线不为空', trigger: 'blur' }],
        product: [{ required: true, message: '抽检产品不为空', trigger: 'blur' }],
        typevalue: [{ required: true, message: '抽检类型不为空', trigger: 'blur' }],
        qualifiedvalue: [{ required: true, message: '抽检结果不为空', trigger: 'blur' }],
        peopleName: [{ required: true, message: '抽检人不为空', trigger: 'blur' }]
      },
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      qualified: [{
        value: '合格',
        label: '合格'
      },
      {
        value: '不合格',
        label: '不合格'
      }],
      type: [{
        value: 'SmallBox',
        label: '小盒装'
      },
      {
        value: 'FullBox',
        label: '大箱装'
      }],
      typemap: {
        FullBox: '大箱装',
        SmallBox: '小盒装'
      },
      selecttemp: {
        lineslect: [],
        productselect: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.fetchdata()
  },
  methods: {
    fetchdata() {
      getList({ pageNumber: this.listQuery.page, pageSize: this.listQuery.pageSize,
        goodName: this.listQuery.name, spotCheckDate: this.datetime }).then(res => {
        this.list = res.data.rows
        this.total = res.data.count
        this.listLoading = false
      })
    },
    chanege(e) {
      this.$forceUpdate()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchdata()
    },
    handleCreate() {
      this.getSelect()
      this.resetTemp()
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var tempData = {
            type: this.temp.typevalue, context: this.temp.context,
            isQualified: this.temp.qualifiedvalue, remark: this.temp.remarks,
            plineId: this.temp.line, goodId: this.temp.product,
            spotChecker: this.temp.peopleName
          }
          createRecord(tempData).then(response => {
            if (response.data === true) {
              this.fetchdata()
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })
            } else {
              this.fetchdata()
              this.dialogFormVisible = false
              this.$notify({
                title: 'Failed',
                message: 'Created Failed',
                type: 'info',
                duration: 2000
              })
            }
          })
        }
      })
    },
    updateData() {
      this.setSelect()
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const flagdata = {
            type: this.temp.typevalue, context: this.temp.context,
            isQualified: this.temp.qualifiedvalue, remark: this.temp.remarks,
            plineId: this.temp.line, goodId: this.temp.product, id: this.temp.id,
            spotChecker: this.temp.peopleName
          }
          updateRecord(flagdata).then(response => {
            if (response.data === true) {
              this.fetchdata()
              this.dialogFormVisible = false
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
            } else {
              this.fetchdata()
              this.dialogFormVisible = false
              this.$notify({
                title: 'Failed',
                message: 'Update Failed',
                type: 'info',
                duration: 2000
              })
            }
          })
        }
      })
    },
    setSelect() {
      for (let i = 0; i < this.selecttemp.lineslect.length; i++) {
        if (this.selecttemp.lineslect[i].name === this.temp.line) {
          this.temp.line = this.selecttemp.lineslect[i].id
        }
      }
      for (let i = 0; i < this.selecttemp.productselect.length; i++) {
        if (this.selecttemp.productselect[i].name === this.temp.product) {
          this.temp.product = this.selecttemp.productselect[i].id
        }
      }
    },
    setDataForm() {
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async handleUpdate(scope) {
      await this.getSelect()
      this.resetTemp()
      this.temp.remarks = scope.remark
      this.temp.context = scope.context
      this.temp.qualifiedvalue = scope.isQualified
      this.temp.typevalue = scope.type
      this.temp.id = scope.id
      this.temp.line = scope.plineName
      this.temp.product = scope.goodName
      this.temp.peopleName = scope.spotChecker
      this.setDataForm()
    },
    handleDelete(item) {
      this.listQuery.page = 1
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteList(item.id).then(response => {
          if (response.data === true) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchdata()
          } else {
            this.$message({
              type: 'info',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getSelect() {
      getProduct().then(res => {
        this.selecttemp.productselect = res.data
      })
      getLine().then(res => {
        this.selecttemp.lineslect = res.data
      })
    },
    resetTemp() {
      this.temp = {
        remarks: '',
        context: '',
        line: '',
        product: '',
        typevalue: '',
        qualifiedvalue: '',
        id: ''
      }
    }
  }
}
</script>

<style>

</style>
