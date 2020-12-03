<template>
  <div class="app-container">
    <el-row style="margin-top: 20px">
      <el-col :span="7">
        <span class="spanName">日期</span>
        <el-date-picker
          v-model="datetime"
          style="margin-left: 20px; width: 230px"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        />
      </el-col>
      <el-col :span="7">
        <span class="spanName">行号</span>
        <el-select
          v-model="selectValue.lineId"
          style="margin-left: 20px; width: 269px"
          placeholder="请选择"
        >
          <el-option v-for="item in selectValue.productLine" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col :span="7">
        <span class="spanName">品种</span>
        <el-select
          v-model="selectValue.material"
          multiple
          style="margin-left: 20px; width: 230px"
          placeholder="请选择"
          @change="changeKinds"
        >
          <el-option v-for="item in selectValue.materaList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-col>
      <el-col :span="7">
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
        <el-button v-waves class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-search">
          搜索
        </el-button>
        <el-button v-waves class="filter-item" style="margin-left: 20px;" type="primary" icon="el-icon-download">
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
        <el-table-column align="center" label="原料">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="行号">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="入库重量(KG)">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="出库重量(KG)">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="损耗率%">
          <template slot-scope="scope">
            {{ scope.$index+1 }}
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
      charttest: [],
      legendBox: [],
      dataserise: [],
      datetime: this.$moment(new Date()).format('YYYY-MM-DD'),
      monthselected: new Date().getMonth() + 1,
      listLoading: false,
      xAxis: [],
      days: [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      datatest: [],
      selectValue: {
        materaList: [],
        material: [],
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
    this.initxAxis()
    // this.getSelectBox()
  },
  mounted() {
    this.initchart()
  },
  beforeDestroy() {
  },
  methods: {
    fetchdata() {
      this.alive = false
      this.$nextTick(() => {
        this.alive = true
        getMaterialList().then(res => {
          this.selectValue.materaList = res.data
          var that = this
          this.selectValue.materaList.forEach(function(item) {
            that.selectValue.material.push(item.id)
          })
          this.initLengend()
          this.initxAxis()
        })
      })
    },
    changeKinds() {
      this.initxAxis()
    },
    initchart() {
      const chart = this.$refs.chartFeed
      if (chart) {
        const myChart = this.$echarts.init(chart)
        const option = {
          title: {
            text: '缓存出入对比(单位：KG)',
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
              margin: 8,
              fontSize: '14'
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
      this.datatest = []
      this.xAxis = []
      for (let i = 0; i < this.selectValue.material.length; i++) {
        for (let j = 0; j < this.selectValue.materaList.length; j++) {
          if (this.selectValue.materaList[j].id === this.selectValue.material[i]) {
            var item = this.selectValue.materaList[j].name
            this.xAxis.push(item)
          }
        }
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
        name: '入库量',
        type: this.chartValue,
        data: [456, 252, 252],
        barWidth: '20%'
      }, {
        name: '出库量',
        type: this.chartValue,
        data: [123, 456, 789],
        barWidth: '20%'
      }
      ]
      this.legendBox = ['入库量', '出库量']
      this.initchart()
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

