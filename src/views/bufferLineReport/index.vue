<template>
  <div class="app-container">
    <el-row style="margin-top: 20px">
      <el-col :span="14">
        <span class="spanName">行号</span>
        <el-select
          v-model="selectValue.column"
          style="margin-left: 20px; width: 230px"
          placeholder="请选择"
          clearable
          @change="changeColumn"
        >
          <el-option v-for="item in selectValue.columnList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col :span="7">
        <span class="spanName">品种</span>
        <el-select
          v-model="selectValue.material"
          style="margin-left: 20px; width: 230px"
          placeholder="请选择"
          clearable
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
        <el-table-column align="center" label="入库原料">
          <template slot-scope="scope">
            {{ scope.row.materialName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="行号">
          <template slot-scope="scope">
            {{ scope.row.rowNo }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="入库重量">
          <template slot-scope="scope">
            {{ scope.row.weights }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import { getMaterialList, getTabeleList, getChartList } from '@/api/bufferLineReport'
import Excel from '@/utils/export-excel'

export default {
  directives: { waves },
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
      xAxisFlag: [],
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
        material: '',
        columnList: [],
        column: ''
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
    this.initcolumn()
    this.getSelectBox()
  },
  mounted() {
    this.initchart()
  },
  beforeDestroy() {
  },
  methods: {
    async exportExcel() {
      const baseName = [['入库原料', '缓存线行号', '重量(KG)']]
      const baseKey = ['materialName', 'rowNo', 'weights']
      await getTabeleList({ rowNo: this.selectValue.column, materialId: this.selectValue.material }).then(res => {
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
      Excel.exportExcel(baseName, this.$moment(new Date()).format('YYYY-MM-DD') + '-缓存线实时')
    },
    changeColumn() {
      this.fetchdata()
    },
    initcolumn() {
      for (let i = 1; i <= 29; i++) {
        const columntemp = {
          label: i + '号',
          value: i
        }
        this.selectValue.columnList.push(columntemp)
      }
    },
    getSelectBox() {
      getMaterialList().then(res => {
        this.selectValue.materaList = res.data
      })
    },
    fetchdata() {
      this.alive = false
      getTabeleList({ rowNo: this.selectValue.column, materialId: this.selectValue.material }).then(res => {
        this.list = res.data.rows
        this.total = res.data.count
        this.listLoading = false
      })
      this.$nextTick(() => {
        this.alive = true
        getChartList({ rowNo: this.selectValue.column, materialId: this.selectValue.material }).then(res => {
          this.charttest = res.data.y
          this.xAxisFlag = res.data.x
          this.initxAxis()
          this.initLengend()
        })
      })
    },
    changeKinds() {
      this.fetchdata()
    },
    initchart() {
      const chart = this.$refs.chartFeed
      if (chart) {
        const myChart = this.$echarts.init(chart)
        const option = {
          title: {
            text: '缓存线实时(单位：KG)',
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
      this.xAxis = []
      for (let i = 1; i < 30; i++) {
        if (this.xAxisFlag[i - 1] !== '') {
          // console.log(this.xAxisFlag[i - 1])
          this.xAxis.push(this.xAxisFlag[i - 1])
        } else {
          this.xAxis.push(i)
        }
      }
    },
    initLengend() {
      this.dataserise = []
      this.dataserise = [{
        name: '缓存量',
        type: this.chartValue,
        data: this.charttest,
        barWidth: '40%'
      }
      ]
      this.legendBox = ['缓存量']
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

