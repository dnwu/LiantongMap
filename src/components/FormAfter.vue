<template>
<div class="form-after">
  <div class="header" @click="getForecastListByName(1,'全部')">全市</div>
  <div class="nav" @click="searchRegion">
    <span :class="areaName==item?'active':''" v-for="(item,index) in navList" :key="index">{{item}}</span>
  </div>
  <div class="h3">全市城市人口演化</div>
  <div class="title">
    <ul>
      <li><span>排名</span><span>区域ID</span><span>人口密度</span><span>人口数量(人)</span></li>
    </ul>
  </div>
  <div class="content">
    <ul @click.stop="searchRegionId">
      <li v-for='(item,index) in forecastList' :data-name="item[1]" :key="index"><span>{{item[0]}}</span><span>{{item[1]}}</span><span>{{item[2]}}</span><span>{{item[3]}}</span></li>
    </ul>
  </div>
  <div class="page">
    <el-pagination
      small
      layout="prev, pager, next"
      @current-change="pageChange"
      :current-page.sync = 'currentPage'
      :page-size = "60"
      :total="totalNum">
    </el-pagination>
  </div>
  <div class="tit">{{regionId}}人口预测趋势图</div>
  <div class="charts" ref="charts">
  </div>
</div>
</template>
<script>
import { host } from "../config/base.js";
export default {
  name: "form_after",
  data() {
    return {
      url: "/ivenus/data/api/stream/monitoring/predict/density_sort",
      detialUrl: '/ivenus/data/api/stream/monitoring/predict/flow_trend',
      forecastList:[],
      totalNum:60,
      currentPage:1,
      areaName: '全部',
      regionId: '基站',
      navList: [
        "福田",
        "罗湖",
        "宝安",
        "南山",
        "盐田",
        "龙岗",
        "龙华",
        "坪山",
        "大鹏",
        "光明"
      ],
      myChart: null
    };
  },
  mounted() {
    this.initTrendForm();
    this.getForecastList(1,this.areaName)
  },
  methods: {
    getForecastList(page, name) {
      this.areaName = name
      this.axios
        .get(`${host}${this.url}`, {
          params: {
            token: "w",
            page: page,
            rows: 60,
            area_name: name
          }
        })
        .then(data => {
          this.forecastList = data.data.data.list
          this.totalNum =  data.data.data.totalNum
        });
    },
    getForecastListByName(page, name) {
      this.areaName = name
      this.axios
        .get(`${host}${this.url}`, {
          params: {
            token: "w",
            page: page,
            rows: 60,
            area_name: name
          }
        })
        .then(data => {
          this.forecastList = data.data.data.list
          this.totalNum =  data.data.data.totalNum
          this.currentPage = 1
        });
    },
    getDetial(cellId) {
      this.axios.get(`${host}${this.detialUrl}`,{
        params: {
          token: "w",
          cell_id: cellId
        }
      }).then(data => {
        this.trendForm(data.data.data)
      })
    },
    searchRegion(e) {
      console.log(e.target.innerText);
      this.areaName = e.target.innerText
      this.getForecastListByName(1,this.areaName)
    },
    searchRegionId(e) {
      console.log(e.target.parentNode);
      this.regionId = e.target.parentNode.getAttribute('data-name')
      this.getDetial(this.regionId)
    },
    pageChange(page) {
      this.getForecastList(page,this.areaName)
    },

    initTrendForm() {
      let dom = this.$refs.charts;
      dom.style.width = "432px";
      this.myChart = this.echarts.init(dom);
      let option = {
        title: {
          // text: '堆叠区域图'
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: ["预测人口数量"],
          textStyle: {
            color: "#fff"
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"],
            axisLabel: {
              color: "#929CA5",
              fontSize: "8"
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            axisLabel: {
              color: "#929CA5",
              fontSize: "8"
            }
          }
        ],
        series: [
          {
            name: "预测人口数量",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [],
            itemStyle: {
              color: "#D06E6B"
            }
          }
        ]
      };
      this.myChart.setOption(option);
    },
    trendForm(data) {
      this.myChart.setOption({
        series: [
          {
            name: "预测人口数量",
            data: data
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.form-after {
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  .header {
    height: 30px;
    cursor: pointer;
    text-align: center;
    line-height: 30px;
    color: #fff;
    background: linear-gradient(to right, #17a2bf, #233e8b);
  }
  .nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    span {
      width: 80px;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #6ec2cd;
      background-color: #013567;
      margin: 4px 0;
      border: 1px solid #278cc0;
      cursor: pointer;
      text-align: center;
      &.active{
        background: linear-gradient(to right, #17a1be, #24418f);
      }
    }
  }
  .h3 {
    height: 28px;
    text-align: center;
    line-height: 28px;
    font-size: 14px;
    color: #6ec2cd;
    background: #254a77;
  }
  .title,
  .content {
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      text-align: center;
      color: #6ec2cd;
      font-size: 14px;
      li {
        // padding: 8px 0;
        height: 30px;
        line-height: 30px;
        display: flex;
        justify-content: space-between;
        span {
          flex: 1;
        }
      }
    }
  }
  .content {
    ul {
      height: 260px;
      overflow: auto;
      font-size: 12px;
      padding: 6px 0;
      li:hover {
        background-color: #0d3b5f;
        cursor: pointer;
      }
    }
  }
  .tit {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #6ec2cd;
  }
  .charts {
    width: 100%;
    height: 200px;
  }
}
</style>
<style lang="scss">
$color: #6ebdcc;
.form-after {
  .page {
    height: 30px;
    text-align: center;
    margin: 10px 0 0px 0;
    button.btn-prev,
    button.btn-next {
      background-color: transparent;
      color: $color;
    }
    ul.el-pager {
      li {
        background-color: transparent;
        color: $color;
        &.active {
          color: #fff;
        }
      }
    }
  }
}
</style>
