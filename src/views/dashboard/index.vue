<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div style="text-align:center; margin-top: 70px;">
            <span>总计</span><br>
            <span>{{ temp.pickWeight }}KG</span><br>
          </div><br>
          <br>
          <div style="text-align:center;">
            <span :style="{ 'background':colormap[data] }" class="text-container">今日采摘</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div style="text-align:center; margin-top: 70px;">
            <span>总计</span><br>
            <span>{{ temp.feedWeight }}KG</span><br>
            <span>{{ temp.feedCount }}箱</span>
          </div><br>
          <div style="text-align:center;">
            <span :style="{ 'background':colormap[data] }" class="text-container">{{ linemap[data] }}号线投料</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div style="text-align:center; margin-top: 70px;">
            <div>
              <span class="leftspan">合格<br>{{ temp.smallBoxQualifiedWeight }}KG<br>{{ temp.smallBoxQualifiedCount }}盒</span>
              <span class="rightspan">不合格<br>{{ temp.smallBoxUnQualifiedWeight }}KG<br>{{ temp.smallBoxUnQualifiedCount }}盒</span>
            </div>
            <br>
          </div>
          <div style="text-align:center;">
            <span :style="{ 'background':colormap[data] }" class="text-container">{{ linemap[data] }}号线小盒</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px;">
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div style="text-align:center; margin-top: 70px;">
            <div>
              <span class="leftspan">合格<br>{{ temp.fullBoxQualifiedWeight }}KG<br>{{ temp.fullBoxQualifiedCount }}箱</span>
              <span class="rightspan">不合格<br>{{ temp.fullBoxUnQualifiedWeight }}KG<br>{{ temp.fullBoxUnQualifiedCount }}箱</span>
            </div>
            <br>
          </div>
          <div style="text-align:center;">
            <span :style="{ 'background':colormap[data] }" class="text-container">{{ linemap[data] }}号线整箱</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div style="text-align:center; margin-top: 70px;">
            <span>总计</span><br>
            <span>{{ temp.stackCount }}垛</span><br>
          </div><br><br>
          <div style="text-align:center;">
            <span :style="{ 'background':colormap[data] }" class="text-container">{{ linemap[data] }}号线垛量</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div style="text-align:center; margin-top: 70px;">
            <span>总计</span><br>
            <span>{{ temp.totalProductWeight }}KG</span><br>
          </div><br>
          <br>
          <div style="text-align:center;">
            <span :style="{ 'background':colormap[data] }" class="text-container">{{ linemap[data] }}号线总产量</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getList } from '@/api/dashboard'

export default {
  name: 'Dashboard',
  data() {
    return {
      data: 1,
      item: null,
      list: [],
      linemap: {
        '1': '一',
        '2': '二',
        '3': '三'
      },
      temp: {
        pickWeight: '',
        feedWeight: '',
        feedCount: '',
        smallBoxQualifiedWeight: '',
        smallBoxUnQualifiedWeight: '',
        smallBoxQualifiedCount: '',
        smallBoxUnQualifiedCount: '',
        fullBoxQualifiedWeight: '',
        fullBoxUnQualifiedWeight: '',
        fullBoxUnQualifiedCount: '',
        fullBoxQualifiedCount: '',
        totalProductWeight: '',
        stackCount: ''
      },
      dt1: [],
      colormap: {
        '1': '#cadd75',
        '2': '#13bae4',
        '3': '#4fbe39'
      }
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  beforeCreate() {
  },
  created() {
    this.fetchdata()
  },
  mounted() {
    this.timer = setInterval(this.setdata, 15000)
    this.timer2 = setInterval(this.fetchdata, 452000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    clearInterval(this.timer2)
  },
  methods: {
    setdata() {
      if (this.data === 3) {
        this.data = 1
      } else {
        this.data = this.data + 1
      }
      this.temp = this.dt1[this.data - 1]
    },
    fetchdata() {
      getList().then(res => {
        this.list = res.data
        for (let i = 0; i < 3; i++) {
          this.dt1.push(res.data[i].dt1[0])
        }
        this.temp = this.dt1[0]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.leftspan {
  display: -moz-inline-box;
  display: inline-block;
  width: 90px;
  text-align: center;
  border-style:  solid;
  border-color: #c2ebf5;
  border-right-color: #edeee7
}
.rightspan {
  display: -moz-inline-box;
  display: inline-block;
  width: 90px;
  text-align: center;
  border-style: 1px solid;
  border-color: #c2ebf5;
  border-left-color: #edeee7;
  color: #ec6666;
}

.box-card {
    width: 95%;
    height: 265px;
    background-color: #c2ebf5;
  }
.text-container {
  display: -moz-inline-box;
  display: inline-block;
  width: 140px;
  background-color: #f7f5f5;
  border-radius:1em;
}
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
 .time {
    font-size: 13px;
    color: #999;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  .clearfix:after {
      clear: both
  }
</style>
