<template>
<div class="commute">
  function
</div>
</template>
<script>
export default {
  data() {
    return {
      // url: "http://192.168.1.102:6889/ivenus/data/api/stream/monitoring/commuter/commuter_info?token=w&date=2018-04-14&hour=",
      url:
        "http://10.123.60.101:6889/ivenus/data/api/stream/monitoring/commuter/commuter_info?token=w&date=2018-04-04"
    };
  },
  props: {
    slider: {
      type: Array,
      default: [0, 1],
      required: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initDom();
      this.getGeoJson();
    });
  },
  methods: {
    initDom() {
      this.myChart = this.echarts.init(document.querySelector(".commute"));
      this.myChart.showLoading();
      window.onresize = () => {
        this.myChart.resize();
      };
    },
    getGeoJson() {
      this.axios.get("/static/geojson/geojson_gongneng.json").then(geojson => {
        this.echarts.registerMap("gongneng", geojson.data);
        this.getMapData(this.url, this.slider);
      });
    },
    getMapData(url, slider) {
      this.myChart.showLoading();
      this.axios.get(
          // url + slider[0]
          url
        ).then(data => {
        // console.log(data.data.data); // [[[],[]],[[],[]]]
        if (data.data.status == 200) {
          this.drawmap(data.data.data);
        }
        // console.log('data',data);
        // this.drawmap(data.data);
      });
    },
    drawmap(data) {
      var option = {
        geo: {
          show: true,
          // map: "gongneng",
          roam: true,

          itemStyle: {
            areaColor: "skyblue"
          },
          emphasis: {
            itemStyle: {
              areaColor: "#fff"
            }
          },
          regions: [
            {
              name: "6169",
              itemStyle: {
                areaColor: "red",
                color: "red"
              }
            }
          ]
        },
        visualMap: {
          // show:false,
          type: "piecewise",
          splitNumber: 4,
          textStyle: {
            color: "#fff"
          },
          left: "right",
          bottom: 150,
          splitNumber: 7,
          min: -1,
          max: 1,
          inRange: {
            color: ["yellow", "blue", "green", "red"]
          },
          calculable: true,
          zlevel: 9999
        },
        series: [
          {
            name: "shenzhen gongneng",
            type: "map",
            roam: true,
            map: "gongneng",
            aspectScale: 2,
            itemStyle: {
              emphasis: { label: { show: true } }
            },
            // 文本位置修正
            textFixed: {
              Alaska: [20, -20]
            },
            data: data
            // data: [
            //  {
            //    name: 6169,
            //    value: 10
            //  },
            //  {
            //    name: 7916,
            //    value: 20
            //  },
            //  {
            //    name: 6265,
            //    value: 30
            //  },
            //  {
            //    name: 7907,
            //    value: 40
            //  }
            // ]
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

        this.getMapData(this.url, b);
      }, 2000);
    }
  }
};
</script>
<style lang="scss" scoped>
.commute {
  width: 100%;
  height: 100%;
  // background-color: yellowgreen;
  background-clip: content-box;
  box-sizing: border-box;
  padding: 26px;
}
</style>
