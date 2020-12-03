<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="14" />
        <el-col :span="10">
          <el-input v-model="listQuery.name" placeholder="设备名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
        <el-table-column align="center" label="设备类型">
          <template slot-scope="scope">
            {{ scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="设备编号">
          <template slot-scope="scope">
            {{ scope.row.code }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="设备状态">
          <template slot-scope="scope">
            {{ mapstyle[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="设备名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="设备IP">
          <template slot-scope="scope">
            {{ scope.row.ip }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="设备端口">
          <template slot-scope="scope">
            {{ scope.row.port }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属产线">
          <template slot-scope="scope">
            {{ scope.row.plineName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属工位">
          <template slot-scope="scope">
            {{ scope.row.stationName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="控制区域">
          <template slot-scope="scope">
            {{ scope.row.controlArea }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="plc地址一">
          <template slot-scope="scope">
            {{ scope.row.plcAddress1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="plc地址二">
          <template slot-scope="scope">
            {{ scope.row.plcAddress2 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark }}
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
        <el-form-item prop="code" label="设备编号" style="width: 250px">
          <el-input v-model="temp.code" placeholder="请输入" style="width: 220px" />
        </el-form-item>
        <el-form-item prop="type" label="设备类型" style="width: 250px">
          <el-input v-model="temp.type" placeholder="请输入" style="width: 220px" />
        </el-form-item>
        <el-form-item label="设备名称" style="width: 180px">
          <el-input v-model="temp.name" placeholder="请输入" style="width: 220px" />
        </el-form-item>
        <el-form-item prop="statusvalue" label="设备状态" style="width: 250px">
          <el-select v-model="temp.statusvalue" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item prop="plineName" label="所属产线" style="width: 250px">
          <el-select v-model="temp.plineName" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in lineList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备IP和端口" prop="ip" style="width: 250px">
          <el-col :span="11">
            <el-input v-model="temp.ip" placeholder="IP地址" style="width: 220px;" />
          </el-col>
          <el-col :span="11">
            <el-input v-model="temp.port" placeholder="端口" style="width: 220px; margin-left: 230px;" />
          </el-col>
        </el-form-item>
        <el-form-item prop="stationId" label="设备所属工位" style="width: 250px">
          <el-select v-model="temp.stationId" placeholder="请选择" style="width: 220px">
            <el-option v-for="item in stationIdList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" style="width: 150px">
          <el-input v-model="temp.remark" placeholder="请输入" style="width: 220px" />
        </el-form-item>
        <el-form-item label="设备控制区域" style="width: 150px">
          <el-input v-model="temp.controlArea" placeholder="请输入" style="width: 220px" />
        </el-form-item>
        <el-form-item label="plc地址1和2" style="width: 150px">
          <el-col :span="11">
            <el-input v-model="temp.plcAddress1" placeholder="PLC地址一" style="width: 220px" />
          </el-col>
          <el-col :span="11">
            <el-input v-model="temp.plcAddress2" placeholder="PLC地址二" style="width: 220px; margin-left: 280px;" />
          </el-col>
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
import { getList, createEquip, updateEquip, deleteEquip, getLine, getSatation } from '@/api/equipmentmng'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

export default {
  directives: { waves },
  components: { Pagination },
  data() {
    var validateIP = (rule, value, callback) => {
      if (value && value === '...') {
        callback(new Error('请输入IP地址'))
      } if (value && !(/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/).test(value)) {
        callback(new Error('IP地址不规范'))
      } else {
        callback()
      }
    }
    return {
      total: 0,
      list: [],
      listLoading: false,
      stationIdList: [],
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined
      },
      lineList: [],
      temp: {
        statusvalue: '',
        type: '',
        plineName: '',
        controlArea: '',
        stationId: '',
        ip: '',
        port: '',
        plcAddress1: '',
        plcAddress2: '',
        remark: '',
        code: '',
        name: ''
      },
      status: [{
        label: '正常运行',
        value: '01'
      },
      {
        label: '正常关机',
        value: '00'
      },
      {
        label: '故障',
        value: '10'
      }],
      rules: {
        ip: [{ required: true, validator: validateIP, trigger: 'blur' }],
        code: [{ required: true, message: '设备编号不为空', trigger: 'blur' }],
        type: [{ required: true, message: '设备类型不为空', trigger: 'blur' }],
        statusvalue: [{ required: true, message: '设备状态不为空', trigger: 'blur' }],
        stationId: [{ required: true, message: '控制区域不为空', trigger: 'blur' }],
        plineName: [{ required: true, message: '产线不能为空', trigger: 'blur' }]
      },
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '创建'
      },
      mapstyle: {
        '00': '正常关机',
        '01': '正常运行',
        '10': '故障'
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
            code: this.temp.code, port: this.temp.port, name: this.temp.name,
            ip: this.temp.ip, plineId: this.temp.plineName, controlArea: this.temp.controlArea,
            plcAddress1: this.temp.plcAddress1, plcAddress2: this.temp.plcAddress2, remark: this.temp.remark,
            stationId: this.temp.stationId, status: this.temp.statusvalue, type: this.temp.type
          }
          createEquip(tempData).then(response => {
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
              this.$notify({
                title: 'warning',
                message: 'Created failed',
                type: 'info',
                duration: 2000
              })
            }
          })
        }
      })
    },
    setSelect() {
      var that = this
      this.stationIdList.forEach(function(item) {
        if (item.name === that.temp.stationId) {
          that.temp.stationId = item.id
        }
      })
    },
    updateData() {
      this.setSelect()
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const flagdata = {
            code: this.temp.code, port: this.temp.port, name: this.temp.name,
            ip: this.temp.ip, plineId: this.temp.plineName, controlArea: this.temp.controlArea,
            plcAddress1: this.temp.plcAddress1, plcAddress2: this.temp.plcAddress2, remark: this.temp.remark,
            stationId: this.temp.stationId, status: this.temp.statusvalue, type: this.temp.type
          }
          updateEquip(flagdata).then(response => {
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
      this.temp.code = row.code
      this.temp.type = row.type
      this.temp.name = row.name
      this.temp.plineName = row.plineName
      this.temp.controlArea = row.controlArea
      this.temp.ip = row.ip
      this.temp.port = row.port
      this.temp.remark = row.remark
      this.temp.plcAddress1 = row.plcAddress1
      this.temp.plcAddress2 = row.plcAddress2
      this.temp.statusvalue = row.status
      this.temp.stationId = row.stationName
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(item) {
      this.listQuery.page = 1
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteEquip(item.code).then(response => {
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
        statusvalue: '',
        type: '',
        controlArea: '',
        stationId: '',
        ip: '',
        port: '',
        plcAddress1: '',
        plcAddress2: '',
        remark: '',
        code: '',
        name: ''
      }
    },
    getSelect() {
      getLine().then(res => {
        this.lineList = res.data
      })
      getSatation().then(res => {
        this.stationIdList = res.data
      })
    },
    chanege(e) {
      this.$forceUpdate()
    }
  }
}
</script>

<style>

</style>
