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
        <span class="spanName">产品</span>
        <el-select
          v-model="selectValue.product"
          style="margin-left: 20px; width: 220px"
          clearable
          placeholder="请选择"
          @change="changeKinds"
        >
          <el-option v-for="item in selectValue.productList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <span class="spanName">包装</span>
        <el-select
          v-model="packtype"
          clearable
          style="margin-left: 20px; width: 220px"
          placeholder="请选择"
          @change="changetype"
        >
          <el-option v-for="item in packchart" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-table-column align="center" label="生产日期">
          <template slot-scope="scope">
            {{ scope.row.packDate }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="产线">
          <template slot-scope="scope">
            {{ scope.row.plineName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品">
          <template slot-scope="scope">
            {{ scope.row.goodName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="包装类型">
          <template slot-scope="scope">
            {{ typeMap[scope.row.packType] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="合格产量(KG)">
          <template slot-scope="scope">
            {{ scope.row.qualifiedWeights }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="不合格产量">
          <template slot-scope="scope">
            {{ scope.row.unqualifiedWeights }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总产量">
          <template slot-scope="scope">
            {{ scope.row.totalWeights }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="合格件数">
          <template slot-scope="scope">
            {{ scope.row.qualifiedCount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="不合格件数">
          <template slot-scope="scope">
            {{ scope.row.unqualifiedCount }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总件数">
          <template slot-scope="scope">
            {{ scope.row.totalCount }}
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
import { getLine, getProductList, getOutputList, getOutputChrat } from '@/api/outputReport'
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
      packtype: '',
      packchart: [{
        label: '盒装',
        value: '2'
      },
      {
        label: '整箱',
        value: '3'
      }],
      typeMap: {
        2: '盒装',
        3: '整箱'
      },
      list: [],
      chartdata: [],
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
        productList: [],
        product: '',
        productLine: [],
        lineId: ''
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
      const baseName = [['生产日期', '产线', '商品', '包装类型', '合格产量(KG)', '不合格产量(KG)', '总产量(KG)', '合格件数',
        '不合格件数', '总件数']]
      const baseKey = ['packDate', 'plineName', 'goodName', 'packType', 'qualifiedWeights', 'unqualifiedWeights', 'totalWeights',
        'qualifiedCount', 'unqualifiedCount', 'totalCount']
      await getOutputList({ years: this.yearselected, month: this.monthselected,
        pageNumber: 0, pageSize: 0,
        plineId: this.selectValue.lineId, goodId: this.selectValue.product, packType: this.packtype }).then(res => {
        this.downloadlist = res.data.rows
      })
      var taht = this
      if (this.downloadlist.length !== 0) {
        [... this.downloadlist].splice(0).forEach(o => {
          const oneData = []
          baseKey.forEach((item, index, arr) => {
            if (index === 3) {
              oneData.push(taht.typeMap[o[item]])
            } else {
              oneData.push(o[item])
            }
          })
          baseName.push(oneData)
        })
      }
      Excel.exportExcel(baseName, this.$moment(new Date()).format('YYYY-MM-DD') + '-产量统计')
    },
    changetype() {
      this.fetchdata()
    },
    fetchdata() {
      this.alive = false
      getOutputList({ years: this.yearselected, month: this.monthselected,
        pageNumber: this.listQuery.page, pageSize: this.listQuery.pageSize,
        plineId: this.selectValue.lineId, goodId: this.selectValue.product, packType: this.packtype }).then(res => {
        this.list = res.data.rows
        this.total = res.data.count
        this.listLoading = false
      })
      this.$nextTick(() => {
        this.alive = true
        getOutputChrat({ years: this.yearselected, month: this.monthselected,
          pageNumber: this.listQuery.page, pageSize: this.listQuery.pageSize,
          plineId: this.selectValue.lineId, goodId: this.selectValue.product, packType: this.packtype }).then(res => {
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
            text: '产量统计(单位：KG)',
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
        // this.datatest.push(i)
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
      // console.log(that.datatest)
      this.yearselected.forEach(function(item) {
        var temp = item + '年总产量'
        var seristemp = {
          name: item + '年总产量',
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
      getLine().then(res => {
        this.selectValue.productLine = res.data
      })
      getProductList().then(res => {
        this.selectValue.productList = res.data
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

