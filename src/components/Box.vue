<template>
  <div class="index">
    <el-container>
      <el-header height='150px'>
        <div>
          <img src="../assets/title_pic.png" alt="">
        </div>
        <div>

        </div>
      </el-header>
      <el-container>
        <el-aside width="280px">
          <!-- <img class="adorn" src="../assets/adorn.png" alt=""> -->
          <ul class="listbox">
            <li class="level1">
              <div class="title" @click="toggle('slider1')"><span class="info">人口时空分布</span><span :class="slider1?'active':''" class="tip el-icon-d-arrow-right"></span></div>
              <transition name="slider">
                <ul v-show="slider1">
                  <li class="level2"><router-link to="/density">区域人口密度</router-link></li>
                  <li class="level2"><router-link to="/od">人口迁徙分布</router-link></li>
                  <li class="level2"><router-link to="/commute">地理功能区演化</router-link></li>
                  <li class="level2"><router-link to="/density">街道人口分布</router-link></li>
                </ul>
              </transition>
            </li>
            <li class="level1">
              <div class="title" @click="toggle('slider2')"><span class="info">OD状况</span><span :class="slider2?'active':''" class="tip el-icon-d-arrow-right"></span></div>
              <transition name="slider">
                <ul v-show="slider2">
                  <li class="level2"><router-link to="/od">OD出行图</router-link></li>
                  <li class="level2"><router-link to="/od">OD出行链</router-link></li>
                  <li class="level2"><router-link to="/trafficLine">OD聚类分布</router-link></li>
                </ul>
              </transition>
            </li>
            <li class="level1">
              <div class="title" @click="toggle('slider3')"><span class="info">职网分布</span><span :class="slider3?'active':''" class="tip el-icon-d-arrow-right"></span></div>
              <transition name="slider">
                <ul v-show="slider3">
                  <li class="level2"><router-link to="/commute">职网分布</router-link></li>
                  <li class="level2"><router-link to="/od">职住出行分布</router-link></li>
                </ul>
              </transition>
            </li>
            <li class="level1">
              <div class="title" @click="toggle('slider4')"><span class="info">通勤特征</span><span :class="slider4?'active':''" class="tip el-icon-d-arrow-right"></span></div>
              <transition name="slider">
                <ul v-show="slider4">
                  <li class="level2"><router-link to="/od">OD出行链</router-link></li>
                  <li class="level2"><router-link to="/trafficLine">交通走廊</router-link></li>
                  <li class="level2"><router-link to="/flow">迁徙分布</router-link></li>
                </ul>
              </transition>
            </li>
            <li class="level1">
              <div class="title" @click="toggle('slider5')"><span class="info">城市特征</span><span :class="slider5?'active':''" class="tip el-icon-d-arrow-right"></span></div>
              <transition name="slider">
                <ul v-show="slider5">
                  <li class="level2"><router-link to="/function">职住区域分析</router-link></li>
                  <li class="level2"><router-link to="/commute">街道人口分布</router-link></li>
                  <li class="level2"><router-link to="/function">地理功能区域</router-link></li>
                  <li class="level2"><router-link to="/flow">潮汐运动</router-link></li>
                </ul>
              </transition>
            </li>
          </ul>
        </el-aside>
        <el-main>
          <div class="top-bar">
            <div class="time-select">
              <div class="time">
                <el-date-picker
                  v-model="time"
                  type="date"
                  value-format ='yyyy-MM-dd'
                  format='yyyy-MM-dd'
                  @change = 'dateChange'
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
            <div class="type-select" v-show="false">
              <div class="type">
                <el-select v-model="type" placeholder="请选择">
                  <el-option
                    v-for="item in types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="position" v-show="false">
              <img src="../assets/time-level.png" alt="">
              <img src="../assets/postion.png" alt="">
            </div>
          </div>
          <div class="router-contain">
            <div class="contain">
              <div class="time-slider" v-if="sliderControl">
                <div class="top">
                  <div class="time">{{initTime}}</div>
                  <div class="type" v-show="false">{{type}}</div>
                </div>
                <div class="slider">
                  <div class="calibration">
                    <span v-for="(item,index) in sliderNum" :key='index' :style="'width: (1/'+sliderNum+')*100%'" class="block" ref="block">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                  </div>
                  <div class="slider-bar">
                    <el-slider
                      v-model="slider"
                      range
                      @change = 'timeChange'
                      :format-tooltip = 'sliderDataFormat'
                      :max="sliderNum">
                    </el-slider>
                  </div>
                </div>
              </div>
              <div class="form-slider" :class="sliderStatus?'':'show'">
                <div class="btn" :class="sliderStatus?'el-icon-d-arrow-left':'el-icon-d-arrow-right'" @click="sliderStatusControl"></div>
                <div class="line"></div>
                <div class="slider-contain">
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
                            <li>人口数量(人)</li>
                            <li>人口密度</li>
                          </ul>
                          <div class="list-contain">
                            <ul class="list" v-for="(item,index) in arr" :key="index">
                              <li>{{index+1}}</li>
                              <li>福田区324</li>
                              <li>23123123</li>
                              <li>312442</li>
                            </ul>
                          </div>
                          <div class="page">
                            <el-pagination
                              small
                              layout="prev, pager, next"
                              @current-change="handleCurrentChange"
                              :total="50000">
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
                            <span>福田区195</span>
                          </div>
                          <div class="form1">
                            <div class="tit"><span>OD起始</span><span>上梅林*** - 下梅林***</span></div>
                            <div class="main">
                              <div class="midu">
                                <span>人口密度</span>
                                <span>5.29</span>
                              </div>
                              <div class="yuyi">
                                <span>交通语义</span>
                                <span>商业区</span>
                              </div>
                              <div class="zhishu">
                                <span>通勤指数</span>
                                <span>1.254</span>
                              </div>
                              <div class="od-start">
                                <span>OD出发量</span>
                                <span>203564</span>
                              </div>
                              <div class="od-end">
                                <span>OD进入量</span>
                                <span>101864</span>
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
                        <div class="tab1" @click="changeChildTab" :class="childtabControl?'active':''">OD出发人口密度</div>
                        <div class="tab2" @click="changeChildTab" :class="!childtabControl?'active':''">OD进入人口密度</div>
                      </div>
                      <div class="main">
                        <div class="main-tab1" v-show="childtabControl">
                          <ul class="title">
                            <li>排序</li>
                            <li>区域ID</li>
                            <li>人口密度</li>
                            <li>交通语义</li>
                          </ul>
                          <div class="list-contain">
                            <ul class="list" v-for="(item,index) in arr" :key="index">
                              <li>{{index+1}}</li>
                              <li>福田区324</li>
                              <li>5.21</li>
                              <li>幸福区</li>
                            </ul>
                          </div>
                          <div class="page">
                            <el-pagination
                              small
                              layout="prev, pager, next"
                              @current-change="handleCurrentChange"
                              :total="50000">
                            </el-pagination>
                          </div>
                        </div>
                        <div class="main-tab1" v-show="!childtabControl">
                          <ul class="title">
                            <li>排序</li>
                            <li>区域ID</li>
                            <li>人口密度</li>
                            <li>交通语义</li>
                          </ul>
                          <div class="list-contain">
                            <ul class="list" v-for="(item,index) in arr" :key="index">
                              <li>{{index+1}}</li>
                              <li>福田区324</li>
                              <li>5.20</li>
                              <li>幸福区</li>
                            </ul>
                          </div>
                          <div class="page">
                            <el-pagination
                              small
                              layout="prev, pager, next"
                              @current-change="handleCurrentChange"
                              :total="50000">
                            </el-pagination>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="commute-tab" v-show="tabControl == 'commute'?true:false">
                      <div class="box1">
                        <div class="h1">全市职住比例统计</div>
                        <div class="tit">
                          <div>通勤指数</div>
                          <div>工作区数量</div>
                          <div>住宅区数量</div>
                        </div>
                        <div class="content">
                          <div>0-0.05</div>
                          <div>5</div>
                          <div>10</div>
                        </div>
                        <div class="content">
                          <div>0-0.05</div>
                          <div>5</div>
                          <div>10</div>
                        </div>
                        <div class="content">
                          <div>0-0.05</div>
                          <div>5</div>
                          <div>10</div>
                        </div>
                        <div class="content">
                          <div>0-0.05</div>
                          <div>5</div>
                          <div>10</div>
                        </div>
                        <div class="content">
                          <div>0-0.05</div>
                          <div>5</div>
                          <div>10</div>
                        </div>
                        <div class="content">
                          <div>0-0.05</div>
                          <div>5</div>
                          <div>10</div>
                        </div>
                      </div>
                      <div class="box2">
                        <div class="h1">职住比例统计</div>
                        <div class="block">
                          <div class="left">
                            <div class="title">工作区全市百分比比例</div>
                            <div class="content">
                              <el-progress type="circle" color="#8e71c7" :width='100' :percentage="25"></el-progress>
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
              </div>

              <!-- <keep-alive> -->
                <router-view :slider='chacheSlider' :time='time'></router-view>
              <!-- </keep-alive> -->

            </div>

          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data() {
    return {
      currentPage3: 1,
      tabControl: "population",
      childtabControl: true,
      input5: "",
      arr: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        ,
        1,
        11,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        11,
        1,
        1,
        11,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        11,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        11,
        1,
        1,
        1,
        1,
        ,
        1
      ],
      sliderNum: 12,
      time: new Date(),
      slider1: true,
      slider2: false,
      slider3: false,
      slider4: false,
      slider5: false,
      types: [
        {
          value: "出发地点人口密度人力图",
          label: "出发地点人口密度人力图"
        }
      ],
      type: "出发地点人口密度人力图",
      slider: [0, 1],
      chacheSlider: [0, 1],
      fullPath: "",
      sliderControl: true,
      sliderStatus: true
    };
  },
  mounted() {
    this.trendForm();
    this.densityForm();
  },
  created() {
    this.fullPath = this.$route.fullPath;
    if (
      this.fullPath == "/function" ||
      this.fullPath == "/commute" ||
      this.fullPath == "/flow"
    ) {
      this.sliderControl = false;
    } else {
      this.sliderControl = true;
    }
    if (this.fullPath == "/density" || this.fullPath == "/flow") {
      this.sliderNum = 24;
      // console.log(this.sliderNum)
    } else {
      this.sliderNum = 12;
    }
    this.initDate();
  },
  methods: {
    trendForm() {
      this.$refs.trendForm.style.width = "432px";
      this.$refs.trendForm.style.height = "140px";
      let dom = this.$refs.trendForm
      var myChart1 = this.echarts.init(dom);
      var option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          axisLabel: {
            color: "#929CA5",
            fontSize: "8"
          }
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
          top: 10,
          bottom: 0,
          containLabel: true
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      };
      myChart1.setOption(option);
    },
    densityForm() {
      this.$refs.densityForm.style.width = "432px";
      this.$refs.densityForm.style.height = "140px";
      let dom = this.$refs.densityForm
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
            data: [10, 52, 200, 334, 390, 330, 220]
          }
        ]
      };
      myChart2.setOption(option);
    },
    toggle(item) {
      this[item] = !this[item];
    },
    initDate() {
      let date = this.time;
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : date.getMonth() + 1;
      let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      this.time = `${year}-${month}-${day}`;
    },
    sliderDataFormat(e) {
      if (this.fullPath == "/density" || this.fullPath == "/flow") {
        return `${e}:00`;
      } else {
        return `${e * 2}:00`;
      }
    },
    dateChange(e) {
      // console.log(e);
    },
    timeChange() {
      var fir = this.slider[0];
      var sec = this.slider[1];
      if (fir !== this.chacheSlider[0] && sec !== this.chacheSlider[1]) {
        this.slider = [sec - 1, sec];
      }
      if (fir !== this.chacheSlider[0]) {
        this.slider = [fir, fir + 1];
      }
      if (sec !== this.chacheSlider[1]) {
        this.slider = [sec - 1, sec];
      }
      if (fir === 0 && sec === 0) {
        this.slider = [fir, fir + 1];
      }
      if ((fir === 12 && sec === 12) || (fir === 24 && sec === 24)) {
        this.slider = [sec - 1, sec];
      }
      this.chacheSlider = [...this.slider];
    },
    sliderStatusControl() {
      this.sliderStatus = !this.sliderStatus;
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
    }
  },
  computed: {
    initTime() {
      // console.log(this.fullPath)
      if (this.fullPath == "/density" || this.fullPath == "/flow") {
        return `${this.slider[0]}:00-${this.slider[1]}:00`;
      } else {
        return `${this.slider[0] * 2}:00-${this.slider[1] * 2}:00`;
      }
    }
  },
  watch: {
    $route(a, b) {
      this.fullPath = a.fullPath;
      if (
        a.fullPath == "/function" ||
        a.fullPath == "/commute" ||
        a.fullPath == "/flow"
      ) {
        this.sliderControl = false;
      } else {
        this.sliderControl = true;
      }
      if (a.fullPath == "/density" || this.fullPath == "/flow") {
        this.sliderNum = 24;
      } else {
        this.sliderNum = 12;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='scss'>
.index {
  width: 100%;
  height: 100%;
  background-image: url("../assets/bg.jpg");
  // background-size: 100% 100%;
}
</style>
<style lang='scss'>
$color: #6ebdcc;
$background: #0a427f;
$backgroundHover: #111d38;

@keyframes twinkle {
  to {
    color: transparent;
    background-color: transparent;
    border: 2px solid transparent;
  }
}

.is-vertical {
  height: 100%;
  display: flex;
  .el-header {
    // border-bottom: 1px solid red;
    display: flex;
    div:first-child {
      img {
        transform: translateY(90px);
      }
    }
  }
  .el-container {
    flex: 1;
    .el-aside {
      // border-right: 1px solid red;
      position: relative;
      ::-webkit-scrollbar {
        display: none;
      }
      .adorn {
        position: absolute;
        height: 100%;
        width: 72px;
        right: 262px;
        left: -6px;
      }
      .listbox {
        padding-left: 56px;
        margin: 16px 0;
      }
      li {
        color: #fff;
        list-style: none;
      }
      .level1 {
        margin-bottom: 20px;
        cursor: pointer;
        .title {
          background: url("../assets/level1.png") no-repeat;
          height: 55px;
          line-height: 36px;
          padding-left: 30px;
          padding-right: 20px;
          display: flex;
          user-select: none;
          .info {
            flex: 1;
          }
          .tip {
            // color: rgba(255,255,255,0.5);
            // animation: twinkle 5s ease infinite;
            // width: 6px;
            // height: 6px;
            // border-radius: 50%;
            // background-color: #004b9d;
            margin-top: 10px;
            margin-right: 30px;
            // border: 2px solid #0376f7;
            width: 15px;
            height: 15px;
            &.active {
              transform: rotate(90deg);
            }
          }
        }
        ul {
          margin-top: -10px;
          margin-left: -8px;
          padding-left: 14px;
          .level2 {
            a {
              padding-left: 30px;
              display: inline-block;
              width: 100%;
              height: 100%;
              text-decoration: none;
              box-sizing: border-box;
              color: $color;
            }
          }
          .level2 {
            position: relative;
            background: url("../assets/level2.png") no-repeat;
            margin-top: 10px;
            height: 47px;
            line-height: 58px;
            font-size: 14px;
            color: #ecefe8;
            cursor: pointer;
          }
        }
      }
    }
    .el-main {
      display: flex;
      flex-direction: column;
      .top-bar {
        height: 50px;
        display: flex;
        .time-select {
          width: 500px;
          background-image: url("../assets/time-select.png");
          background-repeat: no-repeat;
          padding-left: 162px;
          box-sizing: border-box;
          .time {
            .el-input {
              input {
                background: transparent;
                height: 20px;
                border: none;
                margin-top: 14px;
                color: $color;
              }
              .el-input__prefix,
              .el-input__suffix {
                display: none;
              }
            }
          }
        }
        .type-select {
          width: 500px;
          background-image: url("../assets/type-select.png");
          background-repeat: no-repeat;
          .type {
            height: 20px;
            width: 190px;
            margin: 12px 0 0 160px;
            font-size: 12px;
            // background-color: red;
            color: #fff;
            .el-select {
              .el-input {
                input {
                  background: transparent;
                  border: none;
                  width: 190px;
                  height: 20px;
                  padding: 0;
                  color: $color;
                }
              }
            }
          }
        }
        .position {
          flex: 1;
        }
      }
      .router-contain {
        flex: 1;
        position: relative;

        background-image: url("../assets/map_bgc.png");
        // background-size:contain;
        background-size: 100% 100%;
        background-repeat: no-repeat;
        padding: 26px;
        .contain {
          height: 100%;
          position: relative;

          overflow: hidden;
        }

        .time-slider {
          z-index: 999;
          position: absolute;
          bottom: 10px;
          width: 90%;
          height: 100px;
          margin-left: 5%;
          background-image: url("../assets/time-slider.png");
          background-size: cover;
          background-repeat: no-repeat;
          .top {
            display: flex;
            .time {
              width: 100px;
              height: 20px;
              box-sizing: border-box;
              margin: 13px 0 0 180px;
              padding-left: 20px;
              color: $color;
              font-size: 12px;
              line-height: 20px;
            }
            .type {
              font-size: 12px;
              line-height: 20px;
              color: $color;
              width: 160px;
              height: 20px;
              padding-left: 10px;
              margin: 13px 0 0 180px;
            }
          }
          .slider {
            width: 98%;
            height: 40px;
            margin-top: 20px;
            margin-left: 1%;
            // background-color: skyblue;
            .calibration {
              display: flex;
              width: 100%;
              .block {
                display: flex;
                width: (1/12)*100%;
                height: 10px;
                position: relative;
                &::before {
                  content: "";
                  display: inline-block;
                  position: absolute;
                  width: 1px;
                  height: 12px;
                  background-color: $color;
                  left: 0;
                  top: 16px;
                }
                &::after {
                  content: "";
                  display: inline-block;
                  position: absolute;
                  width: 1px;
                  height: 12px;
                  background-color: $color;
                  right: 0;
                  top: 16px;
                }

                @for $i from 1 through 9 {
                  //.item-#{$i} { width: 2em * $i; }
                  span:nth-of-type(#{$i}) {
                    width: 1px;
                    height: 6px;
                    background-color: $color;
                    //margin-left: (1/11)*100%;
                    position: absolute;
                    left: ($i/10)*100%;
                    margin-top: 20px;
                  }
                }
              }
            }
            .el-slider__runway {
              background: $backgroundHover;
              .el-slider__bar {
                background: $background;
              }
              .el-slider__button-wrapper {
                .el-slider__button {
                  width: 10px;
                  height: 10px;
                  border-color: #fff;
                  border-width: 1px;
                  background: $backgroundHover;
                }
              }
            }
          }
        }
        .form-slider {
          z-index: 99999;
          position: absolute;
          right: -432px;
          width: 450px;
          height: 100%;
          // padding: 26px;
          background-clip: content-box;
          box-sizing: border-box;
          transition: right 1s;
          display: flex;
          // flex-direction:column ;
          align-items: center;
          &.show {
            right: 0px;
          }
          .btn {
            width: 16px;
            height: 200px;
            background-color: #64acd2;
            line-height: 200px;
            cursor: pointer;
          }
          .line {
            width: 2px;
            height: 100%;
            background-color: rgba(106, 174, 211, 0.8);
          }
          .slider-contain {
            flex: 1;
            height: 100%;
            background-color: rgba(3, 38, 66, 0.8);
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
                      .trend-form,.density-form{
                        height: 140px;
                        width: 432px;
                        >div{
                          margin:0;
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
                    > div {
                      flex: 1;
                      text-align: center;
                      font-size: 14px;
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
                        background: url("../assets/circle.png") center center
                          no-repeat;
                        .el-progress__text {
                          color: $color;
                          font-size: 26px !important;
                        }
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
                      background: url("../assets/circle.png") center center
                        no-repeat;
                      .el-progress__text {
                        color: $color;
                        font-size: 26px !important;
                      }
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
        }
      }
    }
  }
}
</style>
// 定制选择框样式
<style lang="scss">
$background: #0a427f;
$backgroundHover: #111d38;
$color: #6ebdcc;
.el-select-dropdown {
  border: #111d38;
  background: #0a427f;
  .el-scrollbar {
    .el-select-dropdown__wrap {
      .el-scrollbar__view {
        border-radius: 60px;
        background: $background;
        li {
          color: $color;
          &:hover {
            background: $backgroundHover;
          }
          &.hover {
            background: $backgroundHover;
          }
        }
      }
    }
  }
}
.el-picker-panel {
  color: $color;
  background: $background;
  border: none;
  .el-picker-panel__body-wrapper {
    .el-picker-panel__body {
      .el-date-picker__header {
        span,
        button {
          color: $color;
        }
      }
    }
  }
}
</style>


