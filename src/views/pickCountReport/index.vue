<template>
  <div class="app-container">
    <el-row style="margin-top: 20px">
      <el-col :span="7">
        <span class="spanName">年份</span>
        <el-select
          v-model="yearselected"
          multiple
          style="margin-left: 20px; width: 269px"
          placeholder="请选择"
          @change="yearchange"
        >
          <el-option v-for="item in years" :key="item.key" :label="item.year" :value="item.key" />
        </el-select>
      </el-col>
      <el-col :span="7">
        <span class="spanName">月份</span>
        <el-select
          v-model="monthselected"
          style="margin-left: 20px; width: 269px"
          placeholder="请选择"
          @change="changemonth"
        >
          <el-option v-for="item in months" :key="item.key" :label="item.month" :value="item.key" />
        </el-select>
      </el-col>
      <el-col :span="7">
        <span class="spanName">区块</span>
        <el-select
          v-model="selectValue.area"
          style="margin-left: 20px; width: 269px"
          clearable
          placeholder="请选择"
          @change="changArea"
        >
          <el-option v-for="item in selectValue.areaList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col :span="6">
        <span class="spanName">品种</span>
        <el-select
          v-model="selectValue.material"
          style="margin-left: 20px; width: 220px"
          clearable
          placeholder="请选择"
          @change="changeKinds"
        >
          <el-option v-for="item in selectValue.materaList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <span class="spanName">图表</span>
        <el-select
          v-model="chartValue"
          style="margin-left: 20px; width: 220px"
          placeholder="请选择"
          @change="changechart"
        >
          <el-option v-for="item in chartText" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <span class="spanName">排号</span>
        <el-input v-model="selectValue.lineid" placeholder="请输入排号" style="margin-left: 20px; width: 220px" @keyup.enter.native="fetchdata" />
      </el-col>
      <el-col :span="6">
        <el-button v-waves class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-search" @click="fetchdata">
          搜索
        </el-button>
        <el-button v-waves class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-download" @click="exportExcel">
          导出
        </el-button>
      </el-col>
    </el-row>
    <div class="filter-container" style="margin-top: 20px">
      <div v-if="alive" ref="chart" style="width:100%;height:500px" />
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
        <el-table-column align="center" label="采摘日期">
          <template slot-scope="scope">
            {{ scope.row.pickDate }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="区块">
          <template slot-scope="scope">
            {{ scope.row.plotName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="排号">
          <template slot-scope="scope">
            {{ scope.row.plotNo }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="采摘人">
          <template slot-scope="scope">
            {{ scope.row.employeeName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="种植原料">
          <template slot-scope="scope">
            {{ scope.row.materialName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="采摘车数">
          <template slot-scope="scope">
            {{ scope.row.pickCount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="采摘重量">
          <template slot-scope="scope">
            {{ scope.row.pickWeight }}
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
import { getMaterialList, getEchartDataTest, getAreaList, getList } from '@/api/pickCountReport'
import Excel from '@/utils/export-excel'

export default {
  directives: { waves },
  components: { Pagination },
  data() {
    return {
      total: 0,
      downloadlist: [],
      listQuery: {
        page: 1,
        pageSize: 10
      },
      alive: true,
      list: [],
      charttest: [],
      legendBox: [],
      dataserise: [],
      monthselected: new Date().getMonth() + 1,
      yearselected: [],
      listLoading: true,
      months: [],
      years: [],
      xAxis: [],
      days: [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      datatest: [],
      selectValue: {
        materaList: [],
        material: '',
        areaList: [],
        area: '',
        lineid: ''
      },
      chartValue: 'line',
      chartText: [{
        label: '折线图',
        value: 'line'
      },
      {
        label: '柱状图',
        value: 'bar'
      }]
    }
  },
  created() {
    this.fetchdata()
    this.inityears()
    this.initmonth()
    this.initxAxis()
    this.getSelectBox()
  },
  mounted() {
    this.initchart()
  },
  beforeDestroy() {
  },
  methods: {
    async exportExcel() {
      const baseName = [['采摘日期', '区块', '排号', '采摘人', '采摘品种', '采摘车数', '采摘重量(KG)']]
      const baseKey = ['pickDate', 'plotName', 'plotNo', 'employeeName', 'materialName', 'pickCount', 'pickWeight']
      await getList({ years: this.yearselected, month: this.monthselected,
        materialId: this.selectValue.material, plotCode: this.selectValue.area, plotNo: this.selectValue.lineid,
        pageNumber: 0, pageSize: 0 }).then(res => {
        this.downloadlist = res.data.rows
      })
      // var taht = this
      if (this.list.length !== 0) {
        [... this.downloadlist].splice(0).forEach(o => {
          const oneData = []
          baseKey.forEach((item, index, arr) => {
            oneData.push(o[item])
          })
          baseName.push(oneData)
        })
      }
      Excel.exportExcel(baseName, this.$moment(new Date()).format('YYYY-MM-DD') + '-采摘统计')
    },
    fetchdata() {
      this.alive = false
      getList({ years: this.yearselected, month: this.monthselected,
        materialId: this.selectValue.material, plotCode: this.selectValue.area, plotNo: this.selectValue.lineid,
        pageNumber: this.listQuery.page, pageSize: this.listQuery.pageSize }).then(res => {
        this.list = res.data.rows
        this.total = res.data.count
        this.listLoading = false
      })
      this.$nextTick(() => {
        this.alive = true
        getEchartDataTest({ Years: this.yearselected, month: this.monthselected, plotNo: this.selectValue.lineid,
          materialId: this.selectValue.material, plotCode: this.selectValue.area }).then(res => {
          this.charttest = res.data
          this.initLengend()
        })
      })
    },
    changArea() {
      this.fetchdata()
    },
    changeKinds() {
      this.fetchdata()
    },
    initmonth() {
      for (let i = 1; i < 13; i++) {
        var item = {
          month: i + '月',
          key: i
        }
        this.months.push(item)
      }
    },
    inityears() {
      const temp = new Date().getFullYear()
      for (let j = temp; j >= temp - 10; j--) {
        var yearitem = {
          year: j + '年',
          key: j
        }
        this.years.push(yearitem)
      }
      this.yearselected.push(temp)
    },
    initchart() {
      const chart = this.$refs.chart
      if (chart) {
        const myChart = this.$echarts.init(chart)
        const option = {
          title: {
            text: '采摘量统计(单位：KG)',
            x: 'center',
            y: 'bottom',
            padding: 0
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.legendBox
          },
          xAxis: {
            data: this.xAxis,
            axisLabel: {
              interval: 0,
              rotate: 40,
              margin: 8
            }
          },
          yAxis: {},
          series: this.dataserise
        }
        myChart.setOption(option, true)
        window.addEventListener('resize', function() {
          myChart.resize()
        })
      }
    },
    changechart() {
      this.initLengend()
    },
    initxAxis() {
      const daysCount = this.days[this.monthselected]
      for (let i = 1; i <= daysCount; i++) {
        var item = this.monthselected + '.' + i
        this.xAxis.push(item)
      }
    },
    changemonth() {
      this.xAxis = []
      this.datatest = []
      this.fetchdata()
      this.initxAxis()
      this.initchart()
    },
    initLengend() {
      this.dataserise = []
      var that = this
      this.yearselected.forEach(function(item) {
        // console.log(that.charttest[item])
        var temp = item + '年采摘量'
        var seristemp = {
          name: item + '年采摘量',
          type: that.chartValue,
          data: that.charttest[item],
          barWidth: '30%'
        }
        that.dataserise.push(seristemp)
        that.legendBox.push(temp)
      })
      this.initchart()
    },
    yearchange() {
      this.dataserise = []
      this.legendBox = []
      this.fetchdata()
      this.initLengend()
    },
    getSelectBox() {
      getMaterialList().then(res => {
        this.selectValue.materaList = res.data
      })
      getAreaList().then(res => {
        this.selectValue.areaList = res.data
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
