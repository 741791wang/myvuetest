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
        <el-table-column align="center" label="包装类型">
          <template slot-scope="scope">
            {{ scope.row.type }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="产线名称">
          <template slot-scope="scope">
            {{ scope.row.plineName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="产品名称">
          <template slot-scope="scope">
            {{ scope.row.goodName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="称重重量(KG)">
          <template slot-scope="scope">
            {{ scope.row.weight }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否合格">
          <template slot-scope="scope">
            {{ scope.row.isQualified }}
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
import { getList } from '@/api/scale'
import Pagination from '@/components/Pagination'

export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      data: null,
      list: [],
      total: 0,
      datetime: this.$moment(new Date()).format('YYYY-MM-DD'),
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined
      },
      listLoading: true
    }
  },
  created() {
    this.fetchdata()
  },
  methods: {
    fetchdata() {
      getList({ pageNumber: this.listQuery.page, pageSize: this.listQuery.pageSize,
        goodName: this.listQuery.name, startdate: this.datetime }).then(res => {
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
