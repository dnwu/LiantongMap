<template>
<div class="od-zw-box">
  <div class="od_zw">
  </div>
  <div class="tab">
    <div class="morning" @click="changeType('early')">早高峰</div>
    <div class="night" @click="changeType('late')">晚高峰</div>
  </div>
</div>
</template>
<script>
import { host } from '../config/base.js'
export default {
  name: "OD",
  data() {
    return {
      type: 'early',
      url: "/ivenus/data/api/stream/monitoring/line/line_peak"
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
    changeType(type) {
      this.type = type
      this.getMapData(this.url, this.time, this.type)
    },
    initDom() {
      this.myChart = this.echarts.init(document.querySelector(".od_zw"));
      this.myChart.showLoading();
      window.onresize = () => {
        this.myChart.resize();
      };
    },
    getGeoJson() {
      this.axios.get("/static/geojson/sz_jiedao_6.json").then(geojson => {
        this.echarts.registerMap("shenzhen", geojson.data);
        this.getMapData(this.url, this.time, this.type);
      });
    },
    getMapData(url, time, type) {
      this.myChart.showLoading();
      this.axios
        .get(
          `${host}${url}`,
          {
            params: {
              token: "w",
              date: time,
              timeSlot: type
            }
          }
        )
        .then(data => {
          // console.log(data.data.data); // [[[],[]],[[],[]]]
          if (data.data.status == 200) {
            this.drawmap(data.data.data);
          }
          // console.log('data',data);
          // this.drawmap(data.data)
        }).catch(e => {
          this.drawmap([])
        })
    },
    drawmap(data) {
      var option = {
        geo3D: {
          map: "shenzhen",
          shading: "realistic",
          silent: true,
          environment: "#111C38",
          realisticMaterial: {
            roughness: 0.8,
            metalness: 0
          },
          postEffect: {
            enable: true
          },
          groundPlane: {
            show: false
          },
          light: {
            main: {
              intensity: 1,
              alpha: 30
            },
            ambient: {
              intensity: 0
            }
          },
          viewControl: {
            distance: 70,
            alpha: 89,
            //minDistance: 10,
            //maxDistance: 100,
            panMouseButton: "left",
            rotateMouseButton: "right"
          },
          // polyline:true,
          itemStyle: {
            areaColor: "#000",
            color: "#1A427D",
            borderWidth: "1", // 描边
            borderColor: "#fff"
          },
          // blendMode: "lighter",
          // emphasis: {
          //  label: {
          //    show: true,
          //    formatter: "{b}: {c}"
          //  }
          //},
          // effect:{
          //   show:true,
          // },
          regionHeight: 3
        },
        title: {
          text: "职住出行分布",
          subtext:
            "本图反映了深圳市早晚高峰时期职住出行情况。其中早高峰为居住地到工作地的连线，晚高峰为工作地到居住地的连线。图中的红线不代表实际路径。",
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
            name: "深圳",
            type: "lines3D",
            coordinateSystem: "geo3D",

            effect: {
              show: true,
              trailWidth: 1,
              trailOpacity: 0.5,
              trailLength: 0.2,
              constantSpeed: 5
            },
            // polyline: true,
            blendMode: "lighter",

            lineStyle: {
              width: 0.2,
              opacity: 0.05
              // color:'red'  //线条颜色
            },
            data: data
          }
        ]
      };

      this.myChart.setOption(option);
      this.myChart.hideLoading();
    }
  },
  watch: {
    slider(b, a) {
      // console.log(JSON.stringify(b) === JSON.stringify(a));
      clearInterval(this.timer);
      this.timer = setTimeout(() => {
        if (JSON.stringify(b) === JSON.stringify(a)) {
          return;
        }
        // this.url = '/static/test2.json'

        this.getMapData(this.url, this.time, b);
      }, 2000);
    },
    time(a, b) {
      this.getMapData(this.url, a, this.type);
    }
  }
};
</script>
<style lang="scss" scoped>
.od-zw-box {
  width: 100%;
  height: 100%;
  position: relative;
  .od_zw {
    width: 100%;
    height: 100%;
    // background-color: yellowgreen;
    background-clip: content-box;
    box-sizing: border-box;
    // padding: 26px;
  }
  .tab{
    position: absolute;
    width: 120px;
    height: 60px;
    top: 20px;
    left:40px;
    display: flex;
    justify-content: space-around;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    color:#fff;
    .morning,.night{
      width: 50px;
      height: 20px;
      background-color: red;
      border-radius: 10px;
      cursor: pointer; 
    }
    .morning{
      background-color: yellowgreen;
    }
    .night{
      background-color: skyblue;
    } 
  }
}
</style>
