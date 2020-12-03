<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="14" />
        <el-col :span="10">
          <el-input v-model="listQuery.name" placeholder="工位名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
        <el-table-column align="center" label="工位编号">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="工位名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
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
        <el-form-item prop="id" label="工位编号" style="width: 220px">
          <el-input v-model="temp.id" style="width: 220px" />
        </el-form-item>
        <el-form-item prop="name" label="工位名称" style="width: 220px">
          <el-input v-model="temp.name" style="width: 220px" />
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
import { getList, create, update, deleteW } from '@/api/workspace'
import Pagination from '@/components/Pagination'
import { mapGetters } from 'vuex'

export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      data: null,
      list: [],
      listLoading: false,
      total: 0,
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined
      },
      temp: {
        remarks: '',
        id: '',
        name: ''
      },
      rules: {
        id: [{ required: true, message: '工位编号不为空', trigger: 'blur' }],
        name: [{ required: true, message: '工位名称不为空', trigger: 'blur' }]
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
            id: this.temp.id,
            name: this.temp.name,
            remark: this.temp.remarks
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const flagdata = {
            id: this.temp.id,
            name: this.temp.name,
            remark: this.temp.remarks
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
      this.temp.id = row.id
      this.temp.name = row.name
      this.temp.remarks = row.remark
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
        deleteW(row.id).then(response => {
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
        remarks: '',
        id: '',
        name: ''
      }
    }
  }
}
</script>

<style>

</style>
