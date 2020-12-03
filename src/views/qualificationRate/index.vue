<template>
  <div class="app-container">
    <el-row style="margin-top: 20px">
      <el-col :span="7">
        <span class="spanName">起始日期</span>
        <el-date-picker
          v-model="datetime"
          style="margin-left: 20px; width: 60% "
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
          @change="changeSelect"
        />
      </el-col>
      <el-col :span="7">
        <span class="spanName">截止日期</span>
        <el-date-picker
          v-model="enddatetime"
          style="margin-left: 20px; width: 60%"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
          @change="changeSelect"
        />
      </el-col>
      <el-col :span="7">
        <span class="spanName">产线</span>
        <el-select
          v-model="selectValue.lineId"
          style="margin-left: 20px; width: 269px"
          clearable
          placeholder="请选择"
          @change="changeSelect"
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
          clearable
          style="margin-left: 20px; width: 60%"
          placeholder="请选择"
          @change="changeSelect"
        >
          <el-option v-for="item in selectValue.productList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <span class="spanName">类型</span>
        <el-select
          v-model="packtype"
          clearable
          style="margin-left: 20px; width: 60%"
          placeholder="请选择"
          @change="changeSelect"
        >
          <el-option v-for="item in packchart" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
      <el-col :span="6">
        <span class="spanName">图表</span>
        <el-select
          v-model="chartValue"
          style="margin-left: 20px; width: 60%"
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
        <el-table-column align="center" label="抽检产线">
          <template slot-scope="scope">
            {{ scope.row.plineId }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="抽检类型">
          <template slot-scope="scope">
            {{ maptext[scope.row.packType] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="抽检商品">
          <template slot-scope="scope">
            {{ scope.row.goodName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="合格重量(KG)">
          <template slot-scope="scope">
            {{ scope.row.qualifiedWeights }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="不合格量">
          <template slot-scope="scope">
            {{ scope.row.unqualifiedWeights }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="总量">
          <template slot-scope="scope">
            {{ scope.row.totalWeights }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="合格率">
          <template slot-scope="scope">
            {{ scope.row.hgl }}
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
import { getMaterialList } from '@/api/inBufferReport'
import { getTableList, getProductList, getLine, getChartList } from '@/api/qualificationRatio'
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
      chartdata: [],
      legendBox: [],
      dataserise: [],
      datetime: this.$moment(new Date()).format('YYYY-MM-DD'),
      enddatetime: this.$moment(new Date(new Date().setDate(new Date().getDate() + 1))).format('YYYY-MM-DD'),
      monthselected: new Date().getMonth() + 1,
      listLoading: false,
      xAxis: [],
      datatest: [],
      selectValue: {
        materaList: [],
        material: [],
        productLine: [],
        lineId: '',
        productList: [],
        product: ''
      },
      chartValue: 'bar',
      chartText: [{
        label: '折线图',
        value: 'line'
      },
      {
        label: '柱状图',
        value: 'bar'
      }],
      packtype: '',
      packchart: [{
        label: '小盒装',
        value: '2'
      },
      {
        label: '整箱装',
        value: '3'
      }],
      maptext: {
        2: '小盒装',
        3: '整箱装'
      }
    }
  },
  created() {
    this.fetchdata()
    this.initxAxis()
    // this.getSelectBox()
  },
  mounted() {
    this.initchart()
  },
  beforeDestroy() {
  },
  methods: {
    async exportExcel() {
      const baseName = [['日期', '抽检产线', '包装类型', '抽检商品', '合格重量(KG)', '不合格重量(KG)', '总量(KG)', '合格率']]
      const baseKey = ['date', 'plineId', 'packType', 'goodName', 'qualifiedWeights', 'unqualifiedWeights', 'totalWeights', 'hgl']
      await getTableList({ startTime: this.datetime, endTime: this.enddatetime, plineId: this.selectValue.lineId,
        goodId: this.selectValue.product, checkType: this.packtype, pageNumber: 0, pageSize: 0 }).then(res => {
        this.downloadlist = res.data.rows
      })
      var taht = this
      if (this.list.length !== 0) {
        [... this.downloadlist].splice(0).forEach(o => {
          const oneData = []
          baseKey.forEach((item, index, arr) => {
            if (index === 2) {
              oneData.push(taht.maptext[o[item]])
            } else {
              oneData.push(o[item])
            }
          })
          baseName.push(oneData)
        })
      }
      Excel.exportExcel(baseName, this.$moment(new Date()).format('YYYY-MM-DD') + '-合格率统计')
    },
    changeSelect() {
      this.fetchdata()
    },
    fetchdata() {
      this.alive = false
      this.getSelect()
      getTableList({ startTime: this.datetime, endTime: this.enddatetime, plineId: this.selectValue.lineId,
        goodId: this.selectValue.product, checkType: this.packtype, pageNumber: this.listQuery.page, pageSize: this.listQuery.pageSize }).then(res => {
        this.list = res.data.rows
        this.total = res.data.count
        this.listLoading = false
      })
      this.$nextTick(() => {
        this.alive = true
        getChartList({ startTime: this.datetime, endTime: this.enddatetime, plineId: this.selectValue.lineId,
          goodId: this.selectValue.product, checkType: this.packtype }).then(res => {
          this.chartdata = res.data
          this.initLengend()
          this.initxAxis()
        })
      })
    },
    initchart() {
      const chart = this.$refs.chartFeed
      if (chart) {
        const myChart = this.$echarts.init(chart)
        const option = {
          title: {
            text: '合格与不合格数量',
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
              rotate: 0,
              margin: 10,
              fontSize: '10'
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
      // console.log(this.selectValue.material.length)
      this.initLengend()
    },
    initxAxis() {
      this.xAxis = []
      const days = this.dateDiffer(this.datetime, this.enddatetime)
      for (let i = 0; i <= days; i++) {
        const tempdate = this.$moment(new Date(new Date(this.datetime).setDate(new Date(this.datetime).getDate() + i))).format('YYYY-MM-DD')
        this.xAxis.push(tempdate.substr(5, 5))
      }
      this.initchart()
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
      this.dataserise = [{
        name: '合格数量',
        type: this.chartValue,
        data: this.chartdata.qualifiedWeights,
        barWidth: '20%'
      }, {
        name: '不合格数量',
        type: this.chartValue,
        data: this.chartdata.unqualifiedWeights,
        barWidth: '20%'
      }
      ]
      this.legendBox = ['合格数量', '不合格数量']
      this.initchart()
    },
    getSelect() {
      getProductList().then(res => {
        this.selectValue.productList = res.data
      })
      getLine().then(res => {
        this.selectValue.productLine = res.data
      })
      getMaterialList().then(res => {
        this.selectValue.materaList = res.data
      })
    },
    dateDiffer(Date_start, Date_end) {
      let date1 = new Date(Date_end)
      let date2 = new Date(Date_start)
      date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate())
      date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate())
      const diff = date1.getTime() - date2.getTime()
      const diffDate = diff / (24 * 60 * 60 * 1000)
      return diffDate
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

