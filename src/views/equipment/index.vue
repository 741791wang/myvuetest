<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="8">
          <el-input v-model="listQuery.name" placeholder="设备名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-button v-waves class="filter-item" style="margin-left: 90px;" type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
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
        <el-table-column align="center" label="图标" width="130">
          <template slot-scope="scope">
            <el-tag
              class="tagstyle"
              effect="dark"
              :type="mapstyle[scope.row.state]"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="160">
          <template slot-scope="scope">
            {{ scope.row.stateName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="设备编号">
          <template slot-scope="scope">
            {{ scope.row.code }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="设备名称">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchdata" />
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getList } from '@/api/equipment'
import Pagination from '@/components/Pagination'

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
      list: [],
      listLoading: true,
      mapstyle: {
        '00': 'warning',
        '01': 'primary',
        '10': 'danger'
      }
    }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.tagstyle {
  border-radius: 90px;
}
</style>
