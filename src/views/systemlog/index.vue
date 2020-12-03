<template>
  <div class="app-container">
    <div class="filter-container" />
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
        <el-table-column align="center" label="名称">
          <template slot-scope="scope">
            {{ scope.row.Name }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-download" @click="download(scope.row)" />
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
import { getList, downfile } from '@/api/systemlog'
// import axios from 'axios'

export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      data: null,
      total: 0,
      datetime: this.$moment(new Date()).format('YYYY-MM-DD'),
      listQuery: {
        page: 1,
        pageSize: 10,
        name: undefined
      },
      list: [],
      listLoading: false,
      datafliter: true
    }
  },
  created() {
    this.fetchdata()
  },
  methods: {
    fetchdata() {
      getList({ pageNumber: this.listQuery.page, pageSize: this.listQuery.pageSize }).then(res => {
        this.list = res.data.rows
        this.total = res.data.count
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchdata()
    },
    download(temp) {
      const form = { filename: temp.Name }
      // console.log(temp)
      downfile(form).then(res => {
        const content = res.data
        const blob = new Blob([content])
        const fileName = temp.Name
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    }
  }
}
</script>

<style>

</style>
