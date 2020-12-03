<template>
  <div class="app-container">
    <div class="filter-container" style="margin-top: 20px">
      <el-row style="margin-top: 20px">
        <el-col :span="7">
          <span class="spanName">起始日期</span>
          <el-date-picker
            v-model="datetime"
            style="margin-left: 20px; width: 60% "
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            @change="fetchdata"
          />
        </el-col>
        <el-col :span="7">
          <span class="spanName">截止日期</span>
          <el-date-picker
            v-model="endtime"
            style="margin-left: 20px; width: 60%"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            @change="fetchdata"
          />
        </el-col>
        <el-col :span="7">
          <span class="spanName">区块号</span>
          <el-select
            v-model="selectValue.area"
            style="margin-left: 20px; width: 220px"
            clearable
            placeholder="请选择"
            @change="fetchdata"
          >
            <el-option v-for="item in selectValue.areaList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="7">
          <span class="spanName">采摘品种</span>
          <el-select
            v-model="selectValue.materialId"
            style="margin-left: 20px; width: 220px"
            clearable
            placeholder="请选择"
            @change="fetchdata"
          >
            <el-option v-for="item in selectValue.materialList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-col>
        <el-col :span="7">
          <span class="spanName">员工名称</span>
          <el-input v-model="employName" placeholder="员工姓名" style="margin-left: 20px; width: 60%" @keyup.enter.native="fetchdata" />
        </el-col>
        <el-col :span="7">
          <div />
        </el-col>
        <el-col :span="7">
          <el-button v-waves class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-search" @click="fetchdata">
            搜索
          </el-button>
          <el-button v-waves class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-download" @click="exportExcel">
            导出
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="filter-container" style="margin-top: 20px">
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
        <el-table-column align="center" label="员工姓名">
          <template slot-scope="scope">
            {{ scope.row.employeeName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="采摘种类">
          <template slot-scope="scope">
            {{ scope.row.materialName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="采摘重量">
          <template slot-scope="scope">
            {{ scope.row.pickWeight }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="采摘日期">
          <template slot-scope="scope">
            {{ scope.row.pickDate }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="采摘车数">
          <template slot-scope="scope">
            {{ scope.row.pickCount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="采摘区块">
          <template slot-scope="scope">
            {{ scope.row.plotName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属排号">
          <template slot-scope="scope">
            {{ scope.row.plotNo }}
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
import { getAreaList, getTableList, getMaterialList } from '@/api/pickMonthReport'
import Excel from '@/utils/export-excel'

export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      total: 0,
      listQuery: {
        page: 1,
        pageSize: 10
      },
      downloadlist: [],
      plotNo: '',
      list: [],
      employName: '',
      listLoading: false,
      datetime: this.$moment(new Date()).format('YYYY-MM-DD'),
      endtime: this.$moment(new Date(new Date().setDate(new Date().getDate() + 1))).format('YYYY-MM-DD'),
      selectValue: {
        areaList: [],
        area: '',
        materialId: '',
        materialList: []
      }
    }
  },
  created() {
    this.getSelect()
  },
  mounted() {
  },
  methods: {
    async exportExcel() {
      const baseName = [['员工姓名', '采摘种类', '采摘重量(KG)', '采摘日期', '采摘车数', '采摘区块', '排号']]
      const baseKey = ['employeeName', 'materialName', 'pickWeight', 'pickDate', 'pickCount', 'plotName', 'plotNo']
      await getTableList({ startTime: this.datetime, endTime: this.endtime, plotCode: this.selectValue.area,
        pageNumber: 0, pageSize: 0, plotNo: this.plotNo,
        materialId: this.selectValue.materialId, employeeNum: this.employName }).then(res => {
        this.downloadlist = res.data.rows
      })
      // var taht = this
      if (this.downloadlist.length !== 0) {
        [... this.downloadlist].splice(0).forEach(o => {
          const oneData = []
          baseKey.forEach((item, index, arr) => {
            oneData.push(o[item])
          })
          baseName.push(oneData)
        })
      }
      Excel.exportExcel(baseName, this.$moment(new Date()).format('YYYY-MM-DD') + '-采摘人统计')
    },
    fetchdata() {
      getTableList({ startTime: this.datetime, endTime: this.endtime, plotCode: this.selectValue.area,
        pageNumber: this.listQuery.page, pageSize: this.listQuery.pageSize, plotNo: this.plotNo,
        materialId: this.selectValue.materialId, employeeNum: this.employName }).then(res => {
        this.list = res.data.rows
        this.total = res.data.count
        this.listLoading = false
      })
    },
    getSelect() {
      getAreaList().then(res => {
        this.selectValue.areaList = res.data
      })
      getMaterialList().then(res => {
        this.selectValue.materialList = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.spanName{
  margin-left: 20px;
  font-family: 宋体;
  font-size: 20px;
}

</style>
