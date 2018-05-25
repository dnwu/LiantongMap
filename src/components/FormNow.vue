<template>
  <div class="form-now">
    <div class="title">
      <div class="population-tab" @click="changeTab('population')" :class="tabControl == 'population'?'active':''">人口</div>
      <div class="od-tab" @click="changeTab('od')"  :class="tabControl == 'od'?'active':''">OD</div>
      <div class="commute-tab" @click="changeTab('commute')"  :class="tabControl == 'commute'?'active':''">职住</div>
      <div class="function-tab" @click="changeTab('function')"  :class="tabControl == 'function'?'active':''">功能区</div>
    </div>
    <div class="contain">
      <div class="population-tab" v-show="tabControl == 'population'?true:false">
        <div class="tabs">
          <div class="tab1" @click="changeChildTab" :class="childtabControl?'active':''">区域人口统计表</div>
          <div class="tab2" @click="changeChildTab" :class="!childtabControl?'active':''">基站详情</div>
        </div>
        <div class="main">
          <div class="main-tab1" v-show="childtabControl">
            <ul class="title">
              <li>排名</li>
              <li>区域ID</li>
              <li>人口密度</li>
              <li>交通语义</li>
            </ul>
            <div class="list-contain">
              <ul class="list" v-for="(item,index) in PopulationList.list" :key="index">
                <li>{{item[0]}}</li>
                <li>{{item[1]}}</li>
                <li>{{item[2]}}</li>
                <li>{{item[3]}}</li>
              </ul>
            </div>
            <div class="page">
              <el-pagination
                small
                layout="prev, pager, next"
                :page-size = "60"
                @current-change="handleCurrentChange"
                :total="PopulationList.totalNum">
              </el-pagination>
            </div>
          </div>
          <div class="main-tab2" v-show="!childtabControl">
            <div class="search">
              <el-input placeholder="输入基站ID搜索" v-model="input5" size="mini" prefix-icon="el-icon-search" class="input-with-select">
                <el-button slot="append" icon="el-icon-search">搜索</el-button>
              </el-input>
            </div>
            <div class="title">
              <span class="el-icon-loading"></span>
              <span>基站</span>
              <span>{{input5}}</span>
            </div>
            <div class="form1">
              <div class="tit"><span>OD起始</span></div>
              <div class="main">
                <div class="midu">
                  <span>人口密度</span>
                  <span>{{odInfo.density}}</span>
                </div>
                <div class="yuyi">
                  <span>交通语义</span>
                  <span>{{odInfo.semantics}}</span>
                </div>
                <div class="zhishu">
                  <span>通勤指数</span>
                  <span>{{odInfo.commuter}}</span>
                </div>
                <div class="od-start">
                  <span>OD出发量</span>
                  <span>{{odInfo.original}}</span>
                </div>
                <div class="od-end">
                  <span>OD进入量</span>
                  <span>{{odInfo.destination}}</span>
                </div>
              </div>
            </div>
            <div class="form2">
              <div class="tit">人口数量当日趋势图</div>
              <div class="trend-form" ref="trendForm"></div>
            </div>
            <div class="form3">
              <div class="tit">人口密度同时段对比图</div>
              <div class="density-form" ref="densityForm"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="od-tab" v-show="tabControl == 'od'?true:false">
        <div class="tabs">
          <div class="tab1" @click="changeChildTab" :class="childtabControl?'active':''">OD出发人口数量</div>
          <div class="tab2" @click="changeChildTab" :class="!childtabControl?'active':''">OD进入人口数量</div>
        </div>
        <div class="main">
          <div class="main-tab1" v-show="childtabControl">
            <ul class="title">
              <li>排序</li>
              <li>区域ID</li>
              <li>人口数量</li>
              <li>交通语义</li>
            </ul>
            <div class="list-contain">
              <ul class="list" v-for="(item,index) in odOutNumList.list" :key="index">
                <li>{{item[0]}}</li>
                <li>{{item[1]}}</li>
                <li>{{item[2]}}</li>
                <li>{{item[3]}}</li>
              </ul>
            </div>
            <div class="page">
              <el-pagination
                small
                layout="prev, pager, next"
                @current-change="odOutCurrentChange"
                :page-size = "60"
                :total="odOutNumList.totalNum">
              </el-pagination>
            </div>
          </div>
          <div class="main-tab1" v-show="!childtabControl">
            <ul class="title">
              <li>排序</li>
              <li>区域ID</li>
              <li>人口数量</li>
              <li>交通语义</li>
            </ul>
            <div class="list-contain">
              <ul class="list" v-for="(item,index) in odInNumList.list" :key="index">
                <li>{{item[0]}}</li>
                <li>{{item[1]}}</li>
                <li>{{item[2]}}</li>
                <li>{{item[3]}}</li>
              </ul>
            </div>
            <div class="page">
              <el-pagination
                small
                layout="prev, pager, next"
                @current-change="odInCurrentChange"
                :page-size = "60"
                :total="odInNumList.totalNum">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
      <div class="commute-tab" v-if="'detail' in commuteInfo" v-show="tabControl == 'commute'?true:false">
        <div class="box1">
          <div class="h1">全市职住比例统计</div>
          <div class="tit">
            <div>通勤指数</div>
            <div>工作区数量</div>
            <div>住宅区数量</div>
          </div>
          <div class="content">
            <div class="section"><span class="left">1</span><span class="mid">-</span><span class="right">0.71426</span></div>
            <div>{{commuteInfo.detail.fat.workplace}}</div>
            <div>{{commuteInfo.detail.fat.residence}}</div>
          </div>
          <div class="content">
            <div class="section"><span class="left">0.71426</span><span class="mid">-</span><span class="right">0.42855</span></div>
            <div>{{commuteInfo.detail.obese.workplace}}</div>
            <div>{{commuteInfo.detail.obese.residence}}</div>
          </div>
          <div class="content">
            <div class="section"><span class="left">0.42855</span><span class="mid">-</span><span class="right">0.14284</span></div>
            <div>{{commuteInfo.detail.jimp.workplace}}</div>
            <div>{{commuteInfo.detail.jimp.residence}}</div>
          </div>
          <div class="content">
            <div class="section"><span class="left">0.14284</span><span class="mid">-</span><span class="right">-0.14287</span></div>
            <div>{{commuteInfo.detail.slinky.workplace}}</div>
            <div>{{commuteInfo.detail.slinky.residence}}</div>
          </div>
          <div class="content">
            <div class="section"><span class="left">-0.14287</span><span class="mid">-</span><span class="right">-0.42858</span></div>
            <div>{{commuteInfo.detail.slender.workplace}}</div>
            <div>{{commuteInfo.detail.slender.residence}}</div>
          </div>
          <div class="content">
            <div class="section"><span class="left">-0.42858</span><span class="mid">-</span><span class="right">-0.71429</span></div>
            <div>{{commuteInfo.detail.slight.workplace}}</div>
            <div>{{commuteInfo.detail.slight.residence}}</div>
          </div>
          <div class="content">
            <div class="section"><span class="left">-0.71429</span><span class="mid">-</span><span class="right">-1</span></div>
            <div>{{commuteInfo.detail.slim.workplace}}</div>
            <div>{{commuteInfo.detail.slim.residence}}</div>
          </div>
        </div>
        <div class="box2">
          <div class="h1">职住比例统计</div>
          <div class="block">
            <div class="left">
              <div class="title">工作区全市百分比比例</div>
              <div class="content">
                <el-progress type="circle" color="#8e71c7" :width='100' :percentage="commuteInfo.total.workplace.percentage"></el-progress>
              </div>
            </div>
            <div class="right">
              <div class="title">工作区比例前五区域</div>
              <div class="content">
                <div>
                  <div class="key">福田区</div>
                  <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="70"></el-progress></div>
                </div>
                <div>
                  <div class="key">宝安区</div>
                  <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="80"></el-progress></div>
                </div>
                <div>
                  <div class="key">南山区</div>
                  <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="40"></el-progress></div>
                </div>
                <div>
                  <div class="key">罗湖区</div>
                  <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="60"></el-progress></div>
                </div>
                <div>
                  <div class="key">龙岗区</div>
                  <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="50"></el-progress></div>
                </div>
              </div>
            </div>
          </div>
          <div class="block">
            <div class="left">
              <div class="title">住宅区全市百分比比例</div>
              <div class="content">
                <el-progress type="circle" :width='100' color="#8e71c7" :percentage="commuteInfo.total.residence.percentage"></el-progress>
              </div>
            </div>
            <div class="right">
              <div class="title">住宅区比例前五区域</div>
              <div class="content">
                <div>
                  <div class="key">福田区</div>
                  <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="70"></el-progress></div>
                </div>
                <div>
                  <div class="key">宝安区</div>
                  <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="80"></el-progress></div>
                </div>
                <div>
                  <div class="key">南山区</div>
                  <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="40"></el-progress></div>
                </div>
                <div>
                  <div class="key">罗湖区</div>
                  <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="60"></el-progress></div>
                </div>
                <div>
                  <div class="key">龙岗区</div>
                  <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="50"></el-progress></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="function-tab" v-show="tabControl == 'function'?true:false">
        <div class="block">
          <div class="left">
            <div class="title">住宅区全市百分比比例</div>
            <div class="content">
              <el-progress type="circle" :width='100' color="#8e71c7" :percentage="25"></el-progress>
            </div>
          </div>
          <div class="right">
            <div class="title">住宅区比例前五区域</div>
            <div class="content">
              <div>
                <div class="key">福田区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="70"></el-progress></div>
              </div>
              <div>
                <div class="key">宝安区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="80"></el-progress></div>
              </div>
              <div>
                <div class="key">南山区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="40"></el-progress></div>
              </div>
              <div>
                <div class="key">罗湖区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="60"></el-progress></div>
              </div>
              <div>
                <div class="key">龙岗区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="50"></el-progress></div>
              </div>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="left">
            <div class="title">住宅区全市百分比比例</div>
            <div class="content">
              <el-progress type="circle" :width='100' color="#8e71c7" :percentage="25"></el-progress>
            </div>
          </div>
          <div class="right">
            <div class="title">住宅区比例前五区域</div>
            <div class="content">
              <div>
                <div class="key">福田区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="70"></el-progress></div>
              </div>
              <div>
                <div class="key">宝安区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="80"></el-progress></div>
              </div>
              <div>
                <div class="key">南山区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="40"></el-progress></div>
              </div>
              <div>
                <div class="key">罗湖区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="60"></el-progress></div>
              </div>
              <div>
                <div class="key">龙岗区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="50"></el-progress></div>
              </div>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="left">
            <div class="title">住宅区全市百分比比例</div>
            <div class="content">
              <el-progress type="circle" :width='100' color="#8e71c7" :percentage="25"></el-progress>
            </div>
          </div>
          <div class="right">
            <div class="title">住宅区比例前五区域</div>
            <div class="content">
              <div>
                <div class="key">福田区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="70"></el-progress></div>
              </div>
              <div>
                <div class="key">宝安区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="80"></el-progress></div>
              </div>
              <div>
                <div class="key">南山区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="40"></el-progress></div>
              </div>
              <div>
                <div class="key">罗湖区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="60"></el-progress></div>
              </div>
              <div>
                <div class="key">龙岗区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="50"></el-progress></div>
              </div>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="left">
            <div class="title">住宅区全市百分比比例</div>
            <div class="content">
              <el-progress type="circle" :width='100' color="#8e71c7" :percentage="25"></el-progress>
            </div>
          </div>
          <div class="right">
            <div class="title">住宅区比例前五区域</div>
            <div class="content">
              <div>
                <div class="key">福田区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="70"></el-progress></div>
              </div>
              <div>
                <div class="key">宝安区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="80"></el-progress></div>
              </div>
              <div>
                <div class="key">南山区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="40"></el-progress></div>
              </div>
              <div>
                <div class="key">罗湖区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="60"></el-progress></div>
              </div>
              <div>
                <div class="key">龙岗区</div>
                <div class="value"><el-progress :show-text="false" :stroke-width="8" :percentage="50"></el-progress></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "form_now",
  data() {
    return {
      input5: "3922",
      odInfo: {},
      tabControl: "population",
      // baseUrl: "http://132.102.126.71:6889",
      baseUrl: "http://10.123.60.101:6889",
      childtabControl: true,
      PopulationList: [],
      odOutNumList: [],
      odInNumList: [],
      commuteInfo: {}
    };
  },
  props: {
    time: {
      type: String
    }
  },
  mounted() {
    this.densityForm();
  },
  created() {
    this.totalRequest();
  },
  methods: {
    totalRequest() {
      this.getOdInfo(3922);
      this.getCommuteInfo();
      this.getPopulationList(1);
      this.getOdInNumList(1);
      this.getOdOutNumList(1);
      this.getTrendFormData(3922);
    },
    trendForm(inData, outData) {
      let dom = this.$refs.trendForm;
      this.$refs.trendForm.style.width = "432px";
      this.$refs.trendForm.style.height = "140px";
      var myChart1 = this.echarts.init(dom);
      var option = {
        xAxis: {
          type: "category",
          data: [
            "00:00",
            "2:00",
            "4:00",
            "6:00",
            "8:00",
            "10:00",
            "12:00",
            "14:00",
            "16:00",
            "18:00",
            "20:00",
            "22:00"
          ],
          axisLabel: {
            color: "#929CA5",
            fontSize: "8"
          }
        },
        legend: {
          data: ["流入", "流出"],
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#929CA5",
            fontSize: "8"
          }
        },
        grid: {
          left: 0,
          right: 0,
          top: 30,
          bottom: 0,
          containLabel: true
        },
        series: [
          {
            name: "流入",
            type: "line",
            stack: "总量",
            itemStyle: {
              color: "red"
            },
            // lineStyle: {
            //   color: '#fff'
            // },
            data: inData
          },
          {
            name: "流出",
            type: "line",
            stack: "总量",
            itemStyle: {
              color: "#18A1BE"
            },
            data: outData
          }
        ]
      };
      myChart1.setOption(option);
    },
    densityForm() {
      this.$refs.densityForm.style.width = "432px";
      this.$refs.densityForm.style.height = "140px";
      let dom = this.$refs.densityForm;
      var myChart2 = this.echarts.init(dom);
      var option = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "0",
          right: "0",
          top: 10,
          bottom: "0",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            axisTick: {
              alignWithLabel: true
            },
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
            name: "直接访问",
            type: "bar",
            barWidth: "60%",
            data: [10, 52, 200, 334, 390, 330, 420]
          }
        ]
      };
      myChart2.setOption(option);
    },
    getOdInfo(id) {
      this.axios
        .get(
          `${
            this.baseUrl
          }/ivenus/data/api/stream/monitoring/station/station_info`,
          {
            params: {
              token: "w",
              date: this.time,
              cell_id: id
            }
          }
        )
        .then(data => {
          console.log("odInfo", data.data.data);
          this.odInfo = data.data.data;
        });
    },
    getTrendFormData(id) {
      this.axios
        .get(
          `${this.baseUrl}/ivenus/data/api/stream/monitoring/line/flow_trend`,
          {
            params: {
              token: "w",
              date: this.time,
              cell_id: id
            }
          }
        )
        .then(data => {
          console.log("TrendFormData", data.data);
          var _data = data.data.data;
          this.trendForm(_data.in, _data.out);
        });
    },
    getCommuteInfo() {
      this.axios
        .get(
          `${
            this.baseUrl
          }/ivenus/data/api/stream/monitoring/commuter/region_all`,
          {
            // 商业区： businessArea
            // 工作区： workplace
            // 住宅区： residence
            // 混合区: mixedArea
            params: {
              token: "w",
              date: this.time
            }
          }
        )
        .then(data => {
          console.log("commuteInfo", data);
          this.commuteInfo = data.data.data;
        });
    },
    getPopulationList(page) {
      this.axios
        .get(
          `${
            this.baseUrl
          }/ivenus/data/api/stream/monitoring/density/density_sort`,
          {
            params: {
              token: "w",
              date: this.time,
              page: page,
              rows: 60
            }
          }
        )
        .then(data => {
          console.log("PopulationList", data);
          this.PopulationList = data.data.data;
        });
    },
    getOdInNumList(page) {
      this.axios
        .get(
          `${this.baseUrl}/ivenus/data/api/stream/monitoring/line/volume_sort`,
          {
            params: {
              token: "w",
              date: this.time,
              type: "in",
              page: page,
              rows: 60
            }
          }
        )
        .then(data => {
          console.log("odInNumList", data);
          this.odInNumList = data.data.data;
        });
    },
    getOdOutNumList(page) {
      this.axios
        .get(
          `${this.baseUrl}/ivenus/data/api/stream/monitoring/line/volume_sort`,
          {
            params: {
              token: "w",
              date: this.time,
              type: "out",
              page: page,
              rows: 60
            }
          }
        )
        .then(data => {
          console.log("odOutNumList", data);
          this.odOutNumList = data.data.data;
        });
    },
    changeTab(e) {
      console.log(e);
      this.tabControl = e;
    },
    changeChildTab(e) {
      if (e.target.classList.contains("active")) {
        return;
      }
      this.childtabControl = !this.childtabControl;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.getPopulationList(val);
    },
    odOutCurrentChange(val) {
      this.getOdOutNumList(val);
    },
    odInCurrentChange(val) {
      this.getOdInNumList(val);
    }
  },
  watch: {
    time(a, b) {
      this.totalRequest();
    }
  }
};
</script>
<style lang="scss" scoped>
$color: #6ebdcc;
$background: #0a427f;
$backgroundHover: #111d38;
.form-now {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .title {
    height: 32px;
    margin: 10px;
    color: $color;
    display: flex;
    > div {
      flex: 1;
      margin: 0 6px;
      background-color: #012f60;
      border: 1px solid #30a3d6;
      text-align: center;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      &.active {
        background: linear-gradient(to right, #17a1be, #24418f);
      }
    }
  }
  .contain {
    flex: 1;
    > div {
      width: 100%;
      height: 100%;
    }
    .population-tab,
    .od-tab {
      display: flex;
      flex-direction: column;
      overflow: auto;
      .tabs {
        color: #4f728e;
        // width: 100%;
        height: 30px;
        display: flex;
        padding: 0 10px;
        .tab1,
        .tab2 {
          // display: inline-block;
          // width: 48%;
          height: 28px;
          flex: 1;
          text-align: center;
          line-height: 26px;
          font-size: 14px;
          cursor: pointer;
          border: 1px solid #244976;
          &.active {
            background-color: #244976;
            color: $color;
          }
        }
      }
      .main {
        flex: 1;
        min-height: 100px;
        .main-tab1 {
          height: 100%;
          display: flex;
          flex-direction: column;
          .title {
            height: 30px;
            text-align: center;
          }
          .title,
          .list {
            display: flex;
            list-style: none;
            padding: 0;
            li {
              flex: 1;
              font-size: 12px;
            }
          }
          .list-contain {
            flex: 1;
            overflow: auto;
            .list {
              margin: 10px;
              li {
                text-align: center;
                color: $color;
              }
            }
          }
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
        .main-tab2 {
          height: 100%;
          .search {
            padding: 10px 10px;
            input {
              background: transparent;
              border-color: #539593;
              color: #539593;
            }
            .el-input-group__append {
              background: #78c2ef;
              color: #336985;
            }
          }
          .title {
            height: 26px;
            line-height: 26px;
            margin: 0 10px;
            border-bottom: 1px solid #498698;
            span:first-child {
              font-size: 16px;
              width: 16px;
              height: 16px;
              margin-top: 4px;
            }
            span:nth-of-type(2) {
              margin-left: 10px;
            }
            span:nth-of-type(3) {
              margin-left: 20px;
            }
          }
          .form1 {
            .tit {
              color: #dcfffe;
              font-size: 14px;
              padding: 10px 20px 0;
              span:first-child {
                margin-right: 20px;
              }
            }
            .main {
              display: flex;
              flex-wrap: wrap;
              border: 1px solid #fff;
              margin: 10px;
              padding-top: 10px;
              box-sizing: border-box;
              padding-right: 10px;
              > div {
                width: 122px;
                height: 30px;
                margin: 0 0 0 10px;
                // background: red;
                font-size: 12px;
                line-height: 30px;
                display: flex;
                color: #dcfeff;
                > span {
                  flex: 1;
                  text-align: center;
                }
                span:first-child {
                  background-color: #064474;
                }
                span:last-child {
                  background-color: #2d978b;
                }
              }
            }
          }
          .form2,
          .form3 {
            .tit {
              color: #dcfffe;
              font-size: 14px;
              padding: 10px 20px 0;
            }
            .trend-form,
            .density-form {
              height: 140px;
              width: 432px;
              > div {
                margin: 0;
              }
            }
          }
        }
      }
    }
    .od-tab {
    }
    .commute-tab {
      color: $color;
      box-sizing: border-box;
      padding: 0 15px 0 15px;
      overflow: auto;
      .box1 {
        .h1 {
          height: 30px;
          background-color: #244976;
          line-height: 30px;
          font-size: 14px;
          text-align: center;
        }
        .tit {
          border-bottom: 1px solid $color;
          padding: 6px 0;
        }
        .tit,
        .content {
          display: flex;
          > div:not(.section) {
            flex: 1;
            text-align: center;
            font-size: 14px;
          }
          .section {
            width: 140px;
            font-size: 14px;
            text-align: center;
            display: flex;
            .left,
            .right {
              flex: 1;
            }
            .mid {
              width: 20px;
            }
          }
        }
        .content {
          padding: 4px 0;
        }
      }
      .box2 {
        .h1 {
          height: 30px;
          background-color: #244976;
          line-height: 30px;
          font-size: 14px;
          text-align: center;
        }
        .block {
          display: flex;
          .left {
            width: 140px;
            margin-right: 20px;
            .title {
              font-size: 14px;
              height: 26px;
              line-height: 26px;
              margin: 0;
            }
            .content {
              width: 140px;
              height: 140px;
              padding: 20px;
              box-sizing: border-box;
              background: url("../assets/circle.png") center center no-repeat;
            }
          }
          .right {
            flex: 1;
            .title {
              font-size: 14px;
              height: 26px;
              line-height: 26px;
              margin: 0;
            }
            .content {
              padding-top: 8px;
              > div {
                display: flex;
                align-items: center;
                margin: 5px 0;
                .key {
                  width: 50px;
                  color: #dbfffd;
                  font-size: 14px;
                }
                .value {
                  flex: 1;
                }
              }
            }
          }
        }
      }
    }
    .function-tab {
      overflow: auto;
      padding: 0 14px;
      box-sizing: border-box;
      .block {
        display: flex;
        .left {
          width: 140px;
          margin-right: 20px;
          .title {
            font-size: 14px;
            height: 26px;
            line-height: 26px;
            margin: 0;
          }
          .content {
            width: 140px;
            height: 140px;
            padding: 20px;
            box-sizing: border-box;
            background: url("../assets/circle.png") center center no-repeat;
          }
        }
        .right {
          flex: 1;
          .title {
            font-size: 14px;
            height: 26px;
            line-height: 26px;
            margin: 0;
          }
          .content {
            padding-top: 8px;
            > div {
              display: flex;
              align-items: center;
              margin: 5px 0;
              .key {
                width: 50px;
                color: #dbfffd;
                font-size: 14px;
              }
              .value {
                flex: 1;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
$color: #6ebdcc;
.el-progress {
  .el-progress__text {
    color: #fff !important;
    font-size: 26px !important;
  }
}
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
</style>

