<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="14">
          <div />
        </el-col>
        <el-col :span="10">
          <el-button v-if="roles.includes('ADMIN')" v-waves class="filter-item" style="margin-left: 300px;" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
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
        fit
        highlight-current-row
        style="width: 100%; margin-top: 15px;"
      >
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="原料编号">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="原料名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column v-if="roles.includes('ADMIN')" fixed="right" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="success" icon="el-icon-edit" @click="handleUpdate(scope.row)" />
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelate(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchdata" />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="130px" style="width: 800px; margin-left:50px;">
        <el-form-item prop="id" label="原料编号" style="width: 220px">
          <el-input v-model="temp.id" :disabled="editVisible" style="width: 240px" />
        </el-form-item>
        <el-form-item prop="name" label="原料名称" style="width: 220px">
          <el-input v-model="temp.name" style="width: 240px" />
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
import { getList, deleteR, createR, updateR } from '@/api/resourcemng'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      data: null,
      list: [],
      total: 0,
      listLoading: false,
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined
      },
      temp: {
        id: '',
        name: ''
      },
      editVisible: false,
      rules: {
        id: [{ required: true, message: '原料编号不为空', trigger: 'blur' }],
        name: [{ required: true, message: '原料名称不为空', trigger: 'blur' }]
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
      getList({ name: this.listQuery.name }).then(res => {
        this.list = res.data
        // this.total = res.data.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchdata()
    },
    handleCreate() {
      this.resetTemp()
      this.editVisible = false
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
            id: this.temp.id,
            name: this.temp.name
          }
          createR(tempData).then(response => {
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const flagdata = {
            id: this.temp.id,
            name: this.temp.name
          }
          updateR(flagdata).then(response => {
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
      this.dialogStatus = 'update'
      this.temp.id = row.id
      this.temp.name = row.name
      this.editVisible = true
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelate(row) {
      this.listQuery.page = 1
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteR(row.id).then(response => {
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
        id: '',
        name: ''
      }
    }
  }
}
</script>

<style>

</style>
