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
        <span class="spanName">产线</span>
        <el-select
          v-model="selectValue.lineId"
          style="margin-left: 20px; width: 269px"
          clearable
          placeholder="请选择"
          @change="changeLine"
        >
          <el-option v-for="item in selectValue.productLine" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col :span="6">
        <span class="spanName">原料</span>
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
        <span class="spanName">产品</span>
        <el-select
          v-model="selectValue.good"
          style="margin-left: 20px; width: 220px"
          clearable
          placeholder="请选择"
          @change="changeGoods"
        >
          <el-option v-for="item in selectValue.goodList" :key="item.id" :label="item.name" :value="item.id" />
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
        <el-button v-waves class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-search" @click="fetchdata">
          搜索
        </el-button>
        <el-button v-waves class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-download" @click="exportExcel">
          导出
        </el-button>
      </el-col>
    </el-row>
    <div class="filter-container" style="margin-top: 20px">
      <div v-if="alive" ref="chartFeed" style="width:100%;height:500px" />
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
        <el-table-column align="center" label="日期">
          <template slot-scope="scope">
            {{ scope.row.date }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="产线">
          <template slot-scope="scope">
            {{ scope.row.plineId }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="投料原料">
          <template slot-scope="scope">
            {{ scope.row.materialName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="生产产品">
          <template slot-scope="scope">
            {{ scope.row.goodName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="投料重量(KG)">
          <template slot-scope="scope">
            {{ scope.row.feedWeights }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="投料数量(箱)">
          <template slot-scope="scope">
            {{ scope.row.feedCount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="产品重量(KG)">
          <template slot-scope="scope">
            {{ scope.row.packWeights }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="产品数量(箱)">
          <template slot-scope="scope">
            {{ scope.row.packCount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="产出比">
          <template slot-scope="scope">
            {{ scope.row.ccb }}
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
import { getMaterialList, getLine, getTableList, getChartList, getProductList } from '@/api/inoutRatio'
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
      alive: true,
      list: [],
      chartdata: [],
      legendBox: [],
      dataserise: [],
      monthselected: new Date().getMonth() + 1,
      yearselected: [],
      listLoading: false,
      months: [],
      years: [],
      xAxis: [],
      days: [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      datatest: [],
      selectValue: {
        materaList: [],
        material: '',
        productLine: [],
        lineId: '',
        goodList: [],
        good: ''
      },
      chartValue: 'bar',
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
      const baseName = [['日期', '产线', '原料', '生产产品', '投料重料(KG)', '投料数量(箱)', '产品重量(KG)', '产品数量(箱)',
        '产出比']]
      const baseKey = ['date', 'plineId', 'materialName', 'goodName', 'feedWeights', 'feedCount', 'packWeights',
        'packCount', 'ccb']
      await getTableList({ years: this.yearselected, month: this.monthselected,
        pageNumber: 0, pageSize: 0, plineId: this.selectValue.lineId,
        materialId: this.selectValue.material, goodId: this.selectValue.good }).then(res => {
        this.downloadlist = res.data.rows
      })
      if (this.downloadlist.length !== 0) {
        [... this.downloadlist].splice(0).forEach(o => {
          const oneData = []
          baseKey.forEach((item, index, arr) => {
            oneData.push(o[item])
          })
          baseName.push(oneData)
        })
      }
      Excel.exportExcel(baseName, this.$moment(new Date()).format('YYYY-MM-DD') + '-投入产出比')
    },
    changeGoods() {
      this.fetchdata()
    },
    fetchdata() {
      this.alive = false
      getTableList({ years: this.yearselected, month: this.monthselected,
        pageNumber: this.listQuery.page, pageSize: this.listQuery.pageSize, plineId: this.selectValue.lineId,
        materialId: this.selectValue.material, goodId: this.selectValue.good }).then(res => {
        this.list = res.data.rows
        this.total = res.data.count
        this.listLoading = false
      })
      this.$nextTick(() => {
        this.alive = true
        getChartList({ years: this.yearselected, month: this.monthselected,
          goodId: this.selectValue.good, plineId: this.selectValue.lineId,
          materialId: this.selectValue.material }).then(res => {
          this.chartdata = res.data
          this.initLengend()
        })
      })
    },
    changeLine() {
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
      const chart = this.$refs.chartFeed
      if (chart) {
        const myChart = this.$echarts.init(chart)
        const option = {
          title: {
            text: '投料量(单位：KG)',
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
      this.datatest = []
      for (let i = 1; i <= daysCount; i++) {
        this.datatest.push(i)
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
        // console.log(that.datatest)
        var temp = item + '年产出比'
        var seristemp = {
          name: item + '年产出比',
          type: that.chartValue,
          data: that.chartdata[item],
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
      getLine().then(res => {
        this.selectValue.productLine = res.data
      })
      getProductList().then(res => {
        this.selectValue.goodList = res.data
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

