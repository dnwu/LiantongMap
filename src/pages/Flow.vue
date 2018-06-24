<template>
<div class="flow-box">
  <div class="flow">
  flow
  </div>
  <div class="time-checked">
    <div class="hour-block">
      <span class="demonstration">小时</span>
      <el-slider :format-tooltip='hourFormat' @change="hourChange" :max='23' v-model="hour"></el-slider>
    </div>
    <div class="minute-block">
      <span class="demonstration">分时</span>
      <el-slider :format-tooltip='minuteFormat' @change="minuteChange" :max="50" :step='10' v-model="minute"></el-slider>
    </div>
  </div>
</div>
</template>
<script>
import { host } from '../config/base.js'
export default {
  data() {
    return {
      url: "/ivenus/data/api/stream/monitoring/ocean/ocean_info",
      hour: 0,
      minute: 0
    };
  },
  props: {
    slider: {
      type: Array,
      default: [0, 1],
      required: true
    },
    time: {
      type: String
    }
  },
  created() {
    this.$nextTick(() => {
      this.initDom();
      this.getGeoJson();
    });
  },
  methods: {
    hourFormat(v) {
      return v < 10 ? `0${v}` : v;
    },
    minuteFormat(v) {
      return v < 10 ? `0${v}` : v;
    },
    hourChange() {
      this.getMapData(this.url, this.slider);
    },
    minuteChange() {
      this.getMapData(this.url, this.slider);
    },
    initDom() {
      this.myChart = this.echarts.init(document.querySelector(".flow"));
      this.myChart.showLoading();
      window.onresize = () => {
        this.myChart.resize();
      };
    },
    getGeoJson() {
      this.axios.get("/static/geojson/sz_jiedao_6.json").then(geojson => {
        this.echarts.registerMap("shenzhen", geojson.data);
        this.getMapData(this.url, this.slider);
      });
    },
    getMapData(url, slider) {
      let hour = this.hour < 10 ? `0${this.hour}` : this.hour;
      let minute = this.minute < 10 ? `0${this.minute}` : this.minute;
      this.myChart.showLoading();
      this.axios
        .get(
          `${host}${url}`,
          {
            params: {
              token: "w",
              date: this.time,
              hour: hour,
              minute: minute
            }
          }
        )
        .then(data => {
          // console.log('213213',data.data); // [[[],[]],[[],[]]]
          if (data.data.status == 200) {
            this.drawmap(data.data.data);
          }
          // console.log('data',data);
          // this.drawmap(data.data);
        }).catch(e => {
          this.drawmap([])
        })
    },
    drawmap(data) {
      var option = {
        backgroundColor: "#fff",
        geo: {
          map: "shenzhen",
          center: [114.167287, 22.651127],
          zoom: 1.5,
          roam: true,
          aspectScale: 1,
          // roam: true,
          itemStyle: {
            areaColor: "#1A427D",
            color: "#1A427D",
            borderWidth: "1", // 描边
            borderColor: "#fff"
          }
        },
        title: {
          text: "潮汐运动分析",
          subtext:
            "本图通过洋流图反映了深圳市十分钟内的人口流动趋势。",
          textStyle: {
            color: "#cc9966"
          },
          subtextStyle: {
            color: "#cc9966"
          },
          left: "center"
        },
        series: [
          {
            type: "flowGL",
            coordinateSystem: "geo",
            data: data,
            supersampling: 4,
            particleType: "point",
            particleDensity: 128,
            particleSpeed: 2,
            // gridWidth: windData.nx,
            // gridHeight: windData.ny,
            itemStyle: {
              opacity: 1,
              color: "#fff"
            }
          }
        ]
      };
      this.myChart.setOption(option);
      this.myChart.hideLoading();
    }
  },
  watch: {
    slider(b, a) {
      clearInterval(this.timer);
      this.timer = setTimeout(() => {
        if (JSON.stringify(b) === JSON.stringify(a)) {
          return;
        }
        // this.url = '/static/test2.json'
        this.getMapData(this.url, b);
      }, 2000);
    }
  }
};
</script>
<style lang="scss" scoped>
.flow-box {
  width: 100%;
  height: 100%;
  position: relative;
  .flow {
    width: 100%;
    height: 100%;
    background-color: #111c38;
    background-clip: content-box;
    box-sizing: border-box;
    // padding: 26px;
  }
  .time-checked {
    position: absolute;
    width: 500px;
    // height: 90px;
    background-color: rgba(16, 48, 97, 0.4);
    padding: 0 20px;
    bottom: 20px;
    left: 20px;
    border-radius: 20px;
    > div {
      height: 30px;
      line-height: 30px;
      display: flex;
      color: #fff;
      span {
        margin-right: 20px;
        width: 40px;
      }
      .el-slider {
        flex: 1;
      }
    }
  }
}
</style>
