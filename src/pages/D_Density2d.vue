<template>
<div class="d_density">
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
      url: "/ivenus/data/api/stream/monitoring/line/count_by_cell"
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
      this.myChart = this.echarts.init(document.querySelector(".d_density"));
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
              type: 'in',
              hour: slider[0]*2
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
      var option = {
        backgroundColor: "#00142D",
        geo: {
          map: "shenzhen",
          zoom: 2,
          roam: true,
          itemStyle: {
            areaColor: "#65A7CD",
            color: "#1A427D",
            borderWidth: "1", // 描边
            borderColor: "#fff"
          }
        },
        title: {
          text: "到达特征分布",
          subtext:
            "本图通过热力图反映深圳市整体到达分布情况。",
          textStyle: {
            color: "#cc9966"
          },
          subtextStyle: {
            color: "#cc9966"
          },
          left: "center"
        },
        visualMap: {
          max: 100,
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
      console.log(b);
      this.getMapData(this.url, a, this.slider);
    }
  }
};
</script>
<style lang="scss" scoped>
.d_density   {
  width: 100%;
  height: 100%;
  background-color: yellowgreen;
  background-clip: content-box;
  box-sizing: border-box;
  // padding: 26px;
}
</style>
