<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="14">
          <div />
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
        <el-table-column align="center" label="产品编号">
          <template slot-scope="scope">
            {{ scope.row.goodId }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="产品名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="包装规格">
          <template slot-scope="scope">
            {{ scope.row.normsName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="国际码">
          <template slot-scope="scope">
            {{ scope.row.barCode }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="有效天数">
          <template slot-scope="scope">
            {{ scope.row.qualityDay }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="码垛层数">
          <template slot-scope="scope">
            {{ scope.row.pallet }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="生产原料">
          <template slot-scope="scope">
            {{ scope.row.materialName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="打标文件">
          <template slot-scope="scope">
            {{ scope.row.dbFile }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="喷码文件">
          <template slot-scope="scope">
            {{ scope.row.pmFile }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="PN码">
          <template slot-scope="scope">
            {{ scope.row.pnNumber }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.productDate }}
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
        <el-row>
          <el-col :span="10">
            <el-form-item prop="goodId" label="产品编号" style="width: 240px">
              <el-input v-model="temp.goodId" :disabled="dialogStatus==='update'" placeholder="请输入" style="width: 180px" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="name" label="产品名称" style="width: 240px">
              <el-input v-model="temp.name" placeholder="请输入" style="width: 180px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="normsName" label="包装规格" style="width: 250px">
              <el-input v-model="temp.normsName" placeholder="请输入" style="width: 140px" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="barCode" label="国际码" style="width: 240px">
              <el-input v-model="temp.barCode" placeholder="请输入" style="width: 180px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item prop="qualityDay" label="有效天数" style="width: 220px">
              <el-input v-model="temp.qualityDay" placeholder="单位：天" style="width: 100px" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="pallet" label="码垛层数" style="width: 250px">
              <el-input v-model="temp.pallet" placeholder="请输入" style="width: 140px" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="pnNumber" label="PN码" style="width: 250px">
          <el-input v-model="temp.pnNumber" placeholder="不可重复" style="width: 220px" />
        </el-form-item>
        <el-form-item prop="materialName" label="生产原料" style="width: 250px">
          <el-select v-model="temp.materialName" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in materialList " :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="dbFile" label="打标文件" style="width: 250px">
          <el-input v-model="temp.dbFile" placeholder="请输入" style="width: 220px" />
        </el-form-item>
        <el-form-item prop="pmFile" label="喷码文件" style="width: 250px">
          <el-input v-model="temp.pmFile" placeholder="请输入" style="width: 220px" />
        </el-form-item>
        <el-form-item label="备注" style="width: 250px">
          <el-input v-model="temp.remark" placeholder="请输入" style="width: 220px" />
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
import { getList, getMatieral, updateProduct, createProduct, deleteProduct } from '@/api/pruduct'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      data: null,
      total: 0,
      list: [],
      listLoading: false,
      datetime: this.$moment(new Date()).format('YYYY-MM-DD'),
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined
      },
      materialList: [],
      temp: {
        goodId: '',
        pnNumber: '',
        name: '',
        normsName: '',
        barCode: '',
        qualityDay: '',
        materialName: '',
        pallet: '',
        pmFile: '',
        dbFile: '',
        remark: ''
      },
      rules: {
        goodId: [{ required: true, message: '编号不为空', trigger: 'blur' }],
        name: [{ required: true, message: '名称不为空', trigger: 'blur' }],
        normsName: [{ required: true, message: '包装规格不为空', trigger: 'blur' }],
        pnNumber: [{ required: true, message: 'PN码不为空', trigger: 'blur' }],
        qualityDay: [{ required: true, message: '保质期不为空', trigger: 'blur' }],
        materialName: [{ required: true, message: '原料不为空', trigger: 'blur' }],
        dbFile: [{ required: true, message: '喷码不为空', trigger: 'blur' }],
        pmFile: [{ required: true, message: '打标不为空', trigger: 'blur' }],
        pallet: [{ required: true, message: '层数不为空', trigger: 'blur' }],
        barCode: [{ required: true, message: '国际码不为空', trigger: 'blur' }]
      },
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
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
        name: this.listQuery.name }).then(res => {
        this.list = res.data.rows
        this.total = res.data.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchdata()
    },
    handleCreate() {
      this.getSelectList()
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
            goodId: this.temp.goodId, name: this.temp.name,
            pnNumber: this.temp.pnNumber, normsName: this.temp.normsName,
            dbFile: this.temp.dbFile, pmFile: this.temp.pmFile,
            pallet: this.temp.pallet, barCode: this.temp.barCode,
            qualityDay: this.temp.qualityDay, remark: this.temp.remark,
            materialId: this.temp.materialName
          }
          createProduct(tempData).then(response => {
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
      this.setSelectToTemp()
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const flagdata = {
            goodId: this.temp.goodId, name: this.temp.name,
            pnNumber: this.temp.pnNumber, normsName: this.temp.normsName,
            dbFile: this.temp.dbFile, pmFile: this.temp.pmFile,
            pallet: this.temp.pallet, barCode: this.temp.barCode,
            qualityDay: this.temp.qualityDay, remark: this.temp.remark,
            materialId: this.temp.materialName
          }
          updateProduct(flagdata).then(response => {
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
    handleUpdate(row) {
      this.getSelectList()
      this.temp.materialName = row.materialName
      this.temp.name = row.name
      this.temp.remark = row.remark
      this.temp.barCode = row.barCode
      this.temp.normsName = row.normsName
      this.temp.qualityDay = row.qualityDay
      this.temp.dbFile = row.dbFile
      this.temp.pmFile = row.pmFile
      this.temp.pallet = row.pallet
      this.temp.pnNumber = row.pnNumber
      this.temp.goodId = row.goodId
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getSelectList() {
      getMatieral().then(res => {
        this.materialList = res.data
      })
    },
    setSelectToTemp() {
      var that = this
      this.materialList.forEach(function(item) {
        if (item.name === that.temp.materialName) {
          that.temp.materialName = item.id
        }
      })
    },
    handleDelete(row) {
      this.listQuery.page = 1
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(row.goodId).then(response => {
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
    resetTemp() {
      this.temp = {
        goodId: '',
        pnNumber: '',
        name: '',
        normsName: '',
        barCode: '',
        qualityDay: '',
        materialName: '',
        pallet: '',
        pmFile: '',
        dbFile: '',
        remark: ''
      }
    }
  }
}
</script>

<style>

</style>
