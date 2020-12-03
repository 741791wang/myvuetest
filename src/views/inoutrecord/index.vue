<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row type="flex" class="row-bg" justify="end">
        <el-col :span="16">
          <span class="demonstration">截止日期</span>
          <el-date-picker
            v-model="datetime"
            style="margin-left: 20px;"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            @change="fetchdata"
          />
        </el-col>
        <el-col :span="8">
          <el-input v-model="listQuery.name" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
        fit
        highlight-current-row
        style="width: 100%; margin-top: 15px;"
      >
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="投料原料">
          <template slot-scope="scope">
            {{ scope.row.materialName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="投料重量(KG)">
          <template slot-scope="scope">
            {{ scope.row.weight }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="区块">
          <template slot-scope="scope">
            {{ scope.row.plotId }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="投料时间">
          <template slot-scope="scope">
            {{ scope.row.feedTime }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="RFID">
          <template slot-scope="scope">
            {{ scope.row.rfidId }}
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="fetchdata" />
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { getList } from '@/api/inoutrecord'

export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      data: null,
      list: [],
      total: 0,
      listLoading: false,
      datetime: this.$moment(new Date()).format('YYYY-MM-DD'),
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined
      }
    }
  },
  created() {
    this.fetchdata()
  },
  methods: {
    fetchdata() {
      getList({ PageNumber: (this.listQuery.page - 1), PageSize: this.listQuery.pageSize,
        name: this.listQuery.name, feedDate: this.datetime }).then(res => {
        this.list = res.data.rows
        this.total = res.data.count
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

<style>

</style>
