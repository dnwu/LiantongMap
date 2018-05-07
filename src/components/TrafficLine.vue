<template>
<div class="tranffic-line">
tranffic
</div>
</template>
<script>
export default {
  data() {
    return {
      // url: "http://10.123.60.101:6889/ivenus/data/api/stream/monitoring/corridor/corridor_info?token=w&date=2017-12-19&hour=",
      url: "http://10.123.60.101:6889/ivenus/data/api/stream/monitoring/corridor/corridor_info?token=w&"
      // url: "/static/trafficline.json"
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
          //url + slider[0]*2
          url + `date=${time}&hour=${slider[0] * 2}`
          // url
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
        geo: {
          map: "shenzhen",
          roam: true,
          shading: "realistic",
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
          itemStyle: {
            areaColor: "#1A427D",
            color: "#1A427D",
            borderWidth: "1", // 描边
            borderColor: "#fff"
          },

          regionHeight: 3
        },

        series: [
          {
            type: "lines",
            coordinateSystem: "geo",
            polyline: true,
            data: data,
            lineStyle: {
              width:2,
              normal: {
                width: 0
              }
            },
            effect: {
              constantSpeed: 66,
              show: true,
              period:10,
              trailLength: 0.9,
              symbolSize: 4
            },
            zlevel: 1
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
.tranffic-line {
  width: 100%;
  height: 100%;
  background-color: #111c38;
  background-clip: content-box;
  box-sizing: border-box;
  // padding: 26px;
}
</style>
