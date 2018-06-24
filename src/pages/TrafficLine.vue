<template>
<div class="tranffic-line">
tranffic
</div>
</template>
<script>
import { host } from '../config/base.js'
export default {
  data() {
    return {
      url: "/ivenus/data/api/stream/monitoring/corridor/corridor_info"
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
    initDom() {
      this.myChart = this.echarts.init(
        document.querySelector(".tranffic-line")
      );
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
              token: "w",
              date: time,
              hour: slider[0] * 2
            }
          }
        )
        .then(data => {
          // console.log(data.data.data); // [[[],[]],[[],[]]]
          if (data.data.status == 200) {
            this.drawmap(data.data.data);
          }
          // console.log('data',data.data);
          // this.drawmap(data.data);
        });
    },
    drawmap(data) {
      var option = {
        geo3D: {
          map: "shenzhen",
          roam: true,
          shading: "realistic",
          silent: true,
          environment: "#333",
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

            panMouseButton: "left",
            rotateMouseButton: "right"
          },

          itemStyle: {
            areaColor: "#111C38",
            color: "#1A427D",
            borderWidth: "1", // 描边
            borderColor: "#fff"
          },

          regionHeight: 0.5
        },
        title: {
          text: "交通走廊分析",
          subtext: "本图反映了深圳市交通走廊情况，是对深圳市某一时段内出行规律的总结。图中线条并不代表实际路径。",
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
            type: "lines3D",

            coordinateSystem: "geo3D",

            effect: {
              show: true,
              trailWidth: 4,
              trailOpacity: 0.5,
              trailLength: 1,
              constantSpeed: 5
            },

            blendMode: "lighter",

            lineStyle: {
              width: 4,
              color: "red",
              opacity: 0.05
            },

            data: data
          }
        ]
      };

      this.myChart.setOption(option);
      this.myChart.hideLoading();
      var _this = this;
      window.addEventListener("keydown", function() {
        _this.myChart.dispatchAction({
          type: "lines3DToggleEffect",
          seriesIndex: 0
        });
      });
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
      this.getMapData(this.url, a, this.slider);
    }
  }
};
</script>
<style lang="scss" scoped>
.tranffic-line {
  width: 100%;
  height: 100%;
  background-color: #111c38;
  background-clip: content-box;
  box-sizing: border-box;
  // padding: 26px;
}
</style>
