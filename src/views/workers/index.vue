<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="10">
          <el-input v-model="listQuery.name" placeholder="员工名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" style="margin-left: 90px;" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
          <el-button v-if="roles.includes('ADMIN')" v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleCreate">
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
        highlight-current-row
        style="width: 100%; margin-top: 15px;"
      >
        <el-table-column draggable align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column draggable align="center" label="员工编号">
          <template slot-scope="scope">
            {{ scope.row.employeeNum }}
          </template>
        </el-table-column>
        <el-table-column draggable align="center" label="员工名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column draggable align="center" label="所属单位">
          <template slot-scope="scope">
            {{ scope.row.unitName }}
          </template>
        </el-table-column>
        <el-table-column draggable align="center" label="性别">
          <template slot-scope="scope">
            {{ scope.row.gender }}
          </template>
        </el-table-column>
        <el-table-column draggable align="center" label="工位名称">
          <template slot-scope="scope">
            {{ scope.row.stationName }}
          </template>
        </el-table-column>
        <el-table-column draggable align="center" label="电话">
          <template slot-scope="scope">
            {{ scope.row.phoneNumber }}
          </template>
        </el-table-column>
        <el-table-column draggable align="center" label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark }}
          </template>
        </el-table-column>
        <el-table-column v-if="roles.includes('ADMIN')" fixed="right" align="center" label="操作" width="200">
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
        <el-form-item prop="employeeNum" label="员工编号" style="width: 220px">
          <el-input v-model="temp.employeeNum" :disabled="dialogStatus==='update'" style="width: 220px" />
        </el-form-item>
        <el-form-item prop="name" label="员工名称" style="width: 220px">
          <el-input v-model="temp.name" style="width: 220px" />
        </el-form-item>
        <el-form-item prop="gender" label="员工性别" style="width: 220px">
          <el-select v-model="temp.gender" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in sexList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="gender" label="所属单位" style="width: 220px">
          <el-select v-model="temp.unitid" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in unitidList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="stationId" label="工位名称" style="width: 220px">
          <el-select v-model="temp.stationId" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in workspaceList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="phone" label="电话" style="width: 220px">
          <el-input v-model="temp.phone" style="width: 220px" />
        </el-form-item>
        <el-form-item label="备注" style="width: 220px">
          <el-input v-model="temp.remark" style="width: 220px" />
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
import { getList, getSpace, create, update, getUnits, deleteWorker } from '@/api/workers'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      data: null,
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined
      },
      dialogFormVisible: false,
      list: [],
      listLoading: false,
      temp: {
        stationId: '',
        gender: '',
        employeeNum: '',
        name: '',
        phone: '',
        remark: '',
        unitid: ''
      },
      unitidList: [],
      sexList: [{
        value: '男',
        label: '男'
      },
      {
        value: '女',
        label: '女'
      }],
      workspaceList: [],
      rules: {
        employeeNum: [{ required: true, message: '员工编号不为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不为空', trigger: 'blur' }],
        phone: [{ required: true, message: '电话不为空', trigger: 'blur' }],
        stationId: [{ required: true, message: '工位不为空', trigger: 'blur' }],
        gender: [{ required: true, message: '性别不为空', trigger: 'blur' }]
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
      getList({ pageNumber: this.listQuery.page, pageSize: this.listQuery.pageSize, name: this.listQuery.name }).then(res => {
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
            stationId: this.temp.stationId,
            gender: this.temp.gender,
            employeeNum: this.temp.employeeNum,
            name: this.temp.name,
            phoneNumber: this.temp.phone,
            remark: this.temp.remark,
            unitId: this.temp.unitid
          }
          create(tempData).then(response => {
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
      this.setTemp()
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const flagdata = {
            stationId: this.temp.stationId,
            gender: this.temp.gender,
            employeeNum: this.temp.employeeNum,
            name: this.temp.name,
            phoneNumber: this.temp.phone,
            remark: this.temp.remark,
            unitId: this.temp.unitid
          }
          update(flagdata).then(response => {
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
      this.temp.unitid = row.unitName
      this.temp.stationId = row.stationName
      this.temp.gender = row.gender
      this.temp.name = row.name
      this.temp.phone = row.phoneNumber
      this.temp.remark = row.remark
      this.temp.employeeNum = row.employeeNum
      this.getSelect()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.listQuery.page = 1
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteWorker(row.employeeNum).then(response => {
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
    setTemp() {
      var that = this
      this.workspaceList.forEach(function(item) {
        if (item.name === that.temp.stationId) {
          that.temp.stationId = item.id
        }
      })
      this.unitidList.forEach(function(item) {
        if (item.name === that.temp.unitid) {
          that.temp.unitid = item.id
        }
      })
    },
    resetTemp() {
      this.temp = {
        stationId: '',
        gender: '',
        employeeNum: '',
        name: '',
        phone: '',
        remark: '',
        unitid: ''
      }
    },
    getSelect() {
      getSpace().then(res => {
        this.workspaceList = res.data
      })
      getUnits().then(res => {
        this.unitidList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tagstyle {
  border-radius: 90px;
}
</style>
