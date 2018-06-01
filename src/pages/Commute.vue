<template>
<div class="commute" ref="commute">
  function
</div>
</template>
<script>
export default {
  data() {
    return {
      url:"http://132.102.126.71:6889/ivenus/data/api/stream/monitoring/commuter/commuter_info?token=w&"
      // url: "http://10.123.60.101:6889/ivenus/data/api/stream/monitoring/commuter/commuter_info?token=w&"
      // url: "/static/commute.json?"
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
  mounted() {
    this.$nextTick(() => {
      this.initDom();
      this.getGeoJson();
    });
  },
  methods: {
    initDom() {
      let dom = this.$refs.commute
      this.myChart = this.echarts.init(dom);
      this.myChart.showLoading();
      window.onresize = () => {
        this.myChart.resize();
      };
    },
    getGeoJson() {
      this.axios.get("/static/geojson/voronoi_Project2-2.json").then(geojson => {
        this.echarts.registerMap("gongneng", geojson.data);
        this.getMapData(this.url, this.time, this.slider);
      });
    },
    getMapData(url, time, slider) {
      this.myChart.showLoading();
      this.axios
        .get(
          url + `date=${time}`
        )
        .then(data => {
          // console.log(data.data.data); // [[[],[]],[[],[]]]
          if (data.data.status == 200) {
            this.drawmap(data.data.data);
          }
          // console.log('data',data);
          // this.drawmap(data.data);
        }).catch(e=> {
        this.drawmap([])
        })
    },
    drawmap(data) {
      var option = {
        geo: {
          // show: true,
          // map: "gongneng",
          // roam: true,

          // itemStyle: {
          //   areaColor: "skyblue"
          // },
          // emphasis: {
          //   itemStyle: {
          //     areaColor: "#fff"
          //   }
          // },
          // regions: [
          //   {
          //     name: "6169",
          //     itemStyle: {
          //       areaColor: "red",
          //       color: "red"
          //     }
          //   }
          // ]
        },
        title: {
          text:'通勤指数',
          subtext: "(0到1代表流出,值越大表示流出越大,0到-1表示流入,绝对值越大表示流入越大)",
          textStyle: {
            color: '#6ebdcc'
          },
          left:'center'
        },
        visualMap: {
          type: "piecewise",
          splitNumber: 4,
          textStyle: {
            color: "#fff"
          },
          right: 20,
          top: 150,
          splitNumber: 8,
          min: -1,
          max: 1,
          inRange: {
            color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#fdae61', '#f46d43', '#d73027', '#a50026']
          },
          // calculable: true,
          zlevel: 999
        },
        series: [
          {
            name: "shenzhen gongneng",
            type: "map",
            roam: true,
            // zoom:1,
            map: "gongneng",
            aspectScale: 2,
            // itemStyle: {
            //   emphasis: { label: { show: true } }
            // },
            // 文本位置修正
            // textFixed: {
            //   Alaska: [20, -20]
            // },
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
.commute {
  width: 100%;
  height: 100%;
  // background-color: yellowgreen;
  background-clip: content-box;
  box-sizing: border-box;
  // padding: 26px;
}
</style>
