<template>
<div class="form-after">
  <div class="header">全市</div>
  <div class="nav" @click="searchRegion">
    <span v-for="(item,index) in navList" :key="index">{{item}}</span>
  </div>
  <div class="h3">全市城市人口演化</div>
  <div class="title">
    <ul>
      <li><span>排名</span><span>区域ID</span><span>人口数量(人)</span><span>人口密度</span></li>
    </ul>
  </div>
  <div class="content">
    <ul @click.stop="searchRegionId">
      <li v-for='(item,index) in new Array(60)' :key="index"><span>{{index+1}}</span><span>福田区66</span><span>1654654</span><span>63.64</span></li>
    </ul>
  </div>
  <div class="page">
    <el-pagination
      small
      layout="prev, pager, next"
      @current-change="pageChange"
      :page-size = "60"
      :total="6000">
    </el-pagination>
  </div>
  <div class="tit">福田区166人口预测趋势图</div>
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
      forecastList:[],
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
    this.trendForm();
  },
  methods: {
    getForecastList(page, row, name) {
      this.axios
        .get(`${host}${url}`, {
          params: {
            token: "w",
            page: page,
            rows: 60,
            area_name: name
          }
        })
        .then(data => {
          
        });
    },
    searchRegion(e) {
      console.log(e.target.innerText);
    },
    searchRegionId(e) {
      console.log(e.target.parentNode);
    },
    pageChange(e) {
      console.log(e);
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
          data: ["邮件营销", "联盟广告"],
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
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
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
            name: "邮件营销",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [],
            itemStyle: {
              color: "#D06E6B"
            }
          },
          {
            name: "联盟广告",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: [],
            itemStyle: {
              color: "#18A1BE"
            }
          }
        ]
      };
      this.myChart.setOption(option);
    },
    trendForm() {
      this.myChart.setOption({
        series: [
          {
            name: "邮件营销",
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: "联盟广告",
            data: [220, 182, 191, 234, 290, 330, 310]
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
