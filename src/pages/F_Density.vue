<template>
<div class="f-density">
  Density
</div>
</template>
<script>
// import flightData from "../json/test3.json";
import { host } from '../config/base.js'
export default {
  name: "Density",
  data() {
    return {
      url: "/ivenus/data/api/stream/monitoring/predict/density_info"
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
    console.log(this.time, "prop");
    this.$nextTick(() => {
      this.initDom();
      this.getGeoJson();
    });
  },
  methods: {
    initDom() {
      this.myChart = this.echarts.init(document.querySelector(".f-density"));
      this.myChart.showLoading();
      window.onresize = () => {
        this.myChart.resize();
      };
    },
    getGeoJson() {
      this.axios.get("/static/geojson/sz_jiedao_6.json").then(geojson => {
        this.echarts.registerMap("shenzhen", geojson.data);
        this.getMapData(this.url, this.time, this.slider);
      });
    },
    getMapData(url, time, slider) {
      this.myChart.showLoading();
      this.axios
        .get(
          `${host}${url}`,
          {
            params: {
              token: 'w',
              hour: slider[0]
            }
          }
        )
        .then(data => {
          // console.log(data.data.data); // [[[],[]],[[],[]]]
          if (data.data.status == 200) {
            this.drawmap(data.data.data);
          }
        })
        .catch(e => {
          this.drawmap([]);
        });
    },
    drawmap(data) {
      //var data = flightData.slice(0, 20000);
      // console.log(data);
      // this.echarts.registerMap("shenzhen", geojson);
      var option = {
        backgroundColor: "#cdcfd5",
        geo3D: {
          map: "shenzhen",
          shading: "color", //没有阴影
          // shading: "lambert",
          environment: "#00142D",
          light: {
            main: {
              intensity: 5,
              shadow: true,
              shadowQuality: "high",
              alpha: 30
            },
            ambient: {
              intensity: 0
            },
            ambientCubemap: {
              // texture: "../json/canyon.hdr",
              exposure: 1,
              diffuseIntensity: 0.5
            }
          },
          viewControl: {
            distance: 50,
            minDistance: 10,
            maxDistance: 80,
            panMouseButton: "left",
            rotateMouseButton: "right"
          },

          groundPlane: {
            show: true,
            color: "#00142D"
          },
          postEffect: {
            enable: true,
            bloom: {
              enable: false
            },
            SSAO: {
              radius: 1,
              intensity: 1,
              enable: true
            },
            depthOfField: {
              enable: false,
              focalRange: 10,
              blurRadius: 10,
              fstop: 1
            }
          },
          temporalSuperSampling: {
            enable: true
          },
          itemStyle: {
            areaColor: "#000",
            color: "#1A427D",
            borderWidth: "1", // 描边
            borderColor: "#fff"
          },

          regionHeight: 2
        },
        title: {
          text: "人口密度",
          subtext: "柱状图高度代表人口密度，柱状图密集度表示基站分布情况",
          textStyle: {
            color: "#cc9966"
          },
          subtextStyle: {
            color: "#cc9966"
          },
          left: "center"
        },
        visualMap: {
          max: 120,
          calculable: true,
          realtime: false,
          right: "20",
          top: "10",
          inRange: {
            color: ["green", "#fee090", "#a50026"]
          },
          outOfRange: {
            colorAlpha: 0
          },
          textStyle: {
            color: "#fff"
          }
        },
        series: [
          {
            type: "bar3D",
            coordinateSystem: "geo3D",
            shading: "lambert",
            data: data,
            barSize: 0.15,
            bevelSize: 0.3,
            minHeight: 2,
            silent: true,
            itemStyle: {
              color: "orange"
              // opacity: 0.8
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

        this.getMapData(this.url, this.time, b);
      }, 2000);
    },
    time(a, b) {
      this.getMapData(this.url, a, this.slider);
    }
  }
};
</script>
<style lang="scss" scoped>
.f-density {
  width: 100%;
  height: 100%;
  background-color: yellowgreen;
  background-clip: content-box;
  box-sizing: border-box;
  // padding: 26px;
}
</style>
