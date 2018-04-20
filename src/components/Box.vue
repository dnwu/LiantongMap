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
              <div class="title" @click="toggle('slider1')"><span class="info">人口时空分布</span><span v-show="!slider1" class="tip"></span></div>
              <transition name="slider">
                <ul v-show="slider1">
                  <li class="level2"><router-link to="/density">区域人口密度</router-link></li>
                  <li class="level2"><router-link to="/od">人口迁徙分布</router-link></li>
                  <li class="level2"><router-link to="/commute">人口密度地理功能区演化</router-link></li>
                  <li class="level2"><router-link to="/density">街道人口分布</router-link></li>
                </ul>
              </transition>
            </li>
            <li class="level1">
              <div class="title" @click="toggle('slider2')"><span class="info">OD状况</span><span v-show="!slider2" class="tip"></span></div>
              <transition name="slider">
                <ul v-show="slider2">
                  <li class="level2"><router-link to="/od">OD出行图</router-link></li>
                  <li class="level2"><router-link to="/od">OD出行链</router-link></li>
                  <li class="level2"><router-link to="/trafficLine">OD聚类分布</router-link></li>
                </ul>
              </transition>
            </li>
            <li class="level1">
              <div class="title" @click="toggle('slider3')"><span class="info">职网分布</span><span v-show="!slider3" class="tip"></span></div>
              <transition name="slider">
                <ul v-show="slider3">
                  <li class="level2"><router-link to="/commute">职网分布</router-link></li>
                  <li class="level2"><router-link to="/od">职住出行分布</router-link></li>
                </ul>
              </transition>
            </li>
            <li class="level1">
              <div class="title" @click="toggle('slider4')"><span class="info">通勤特征</span><span v-show="!slider4" class="tip"></span></div>
              <transition name="slider">
                <ul v-show="slider4">
                  <li class="level2"><router-link to="/od">OD出行链</router-link></li>
                  <li class="level2"><router-link to="/trafficLine">交通走廊</router-link></li>
                  <li class="level2"><router-link to="/flow">迁徙分布</router-link></li>
                </ul>
              </transition>
            </li>
            <li class="level1">
              <div class="title" @click="toggle('slider5')"><span class="info">城市特征</span><span v-show="!slider5" class="tip"></span></div>
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


            <!-- <keep-alive> -->
              <router-view :slider='chacheSlider' :time='time'></router-view>
            <!-- </keep-alive> -->


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
      sliderNum: 12,
      time: new Date(),
      slider1: true,
      slider2: false,
      slider3: false,
      slider4: false,
      slider5: false,
      tips: ["折叠", "展开", "展开", "展开", "展开"],
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
      sliderControl: true
    };
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
            animation: twinkle 1s ease infinite;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #004b9d;
            margin-top: 15px;
            margin-right: 30px;
            border: 2px solid #0376f7;
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
        .time-slider {
          z-index: 999;
          position: absolute;
          bottom: 40px;
          width: 90%;
          height: 100px;
          margin-left: 5%;
          background-image: url("../assets/time-slider.png");
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


