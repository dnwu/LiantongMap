<template>
<div class="f-od">
</div>
</template>
<script>
// import flightData from "../json/test.json";
import { host } from '../config/base.js'
export default {
  name: "OD",
  data() {
    return {
      url:"/ivenus/data/api/stream/monitoring/predict/num_info"
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
      this.myChart = this.echarts.init(document.querySelector(".f-od"));
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
        }).catch(err => {
          this.drawmap([])
        })
    },
    drawmap(data) {
      var option = {
        backgroundColor: "#00142D",
        geo: {
          map: "shenzhen",
          zoom: 2,
          roam: true,
          itemStyle: {
            areaColor: "#2a3a5c",
            color: "#1A427D",
            borderWidth: "1", // 描边
            borderColor: "#fff"
          }
        },
        visualMap: {
          max: 1000,
          calculable: true,
          realtime: false,
          right: "20",
          top: "10",
          inRange: {
            color: ["green", "#fee090", "#a50026"]
          },
          textStyle: {
            color: "#fff"
          }
        },
        title: {
          text: "人口数量预测",
          subtext:
            "本图通过热力图反映了深圳市人口分布变化情况。",
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
            name: "AQI",
            type: "heatmap",
            coordinateSystem: "geo",
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
      this.getMapData(this.url, a, this.slider);
    }
  }
};
</script>
<style lang="scss" scoped>
.f-od {
  width: 100%;
  height: 100%;
  // background-color: yellowgreen;
  background-clip: content-box;
  box-sizing: border-box;
  // padding: 26px;
}
</style>
