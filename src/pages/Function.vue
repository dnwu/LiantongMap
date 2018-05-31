<template>
<div class="function">
  <div class="mark"></div>
</div>
</template>
<script>
export default {
  data() {
    return {
      // url:"http://132.102.126.71:6889/ivenus/data/api/stream/monitoring/function/function_info?token=w&"
      url: "http://10.123.60.101:6889/ivenus/data/api/stream/monitoring/function/function_info?token=w&"
    };
  },
  props: {
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
      this.myChart = this.echarts.init(document.querySelector(".function"));
      this.myChart.showLoading();
      window.onresize = () => {
        this.myChart.resize();
      };
    },
    getGeoJson() {
      this.axios.get("/static/geojson/voronoi_Project2-2.json").then(geojson => {
        this.echarts.registerMap("gongneng", geojson.data);
        this.getMapData(this.url, this.time);
      });
    },
    getMapData(url, time) {
      this.myChart.showLoading();
      this.axios
        .get(
          url + `date=${time}`
          // url
        )
        .then(data => {
          // console.log(data.data.data); // [[[],[]],[[],[]]]
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
        visualMap: {
          // show:false,
          type: "piecewise",
          // splitNumber: 4,
          pieces: [
            {value: 10, label: '商业区', color: 'red'},
            {value: 20, label: '工作区', color: 'green'},
            {value: 30, label: '住宅区', color: 'blue'},
            {value: 40, label: '混合区', color: 'yellow'},
          ],
          textStyle: {
            color: "#fff"
          },
          // categories:['商业区','工作区','住宅区','混合区'],
          right: 24,
          bottom: 'bottom',
          // min: 10,
          // max: 40,
          // inRange: {
          //   // 商业区10, 工作区20, 住宅区30 ,混合区40
          //   color: ["red", "green", "blue", "yellow"]
          // },
          // text: ["High", "Low"], // 文本，默认为数值文本
          calculable: true,
          zlevel: 99
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
    time(a, b) {
      this.getMapData(this.url, a);
    }
  }
};
</script>
<style lang="scss" scoped>
.function {
  width: 100%;
  height: 100%;
  // background-color: yellowgreen;
  background-clip: content-box;
  box-sizing: border-box;
  // padding: 26px;
  position: relative;
  .mark{
    position: absolute;
    width: 200px;
    height: 200px;
    background-color: yellowgreen;
    right: 0;
    bottom: 0;
    z-index: 99999;
  }
}
</style>
