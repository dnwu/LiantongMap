<template>
<div class="function">
  function
</div>
</template>
<script>
export default {
  data() {
    return {
      url: ""
    };
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
      this.axios.get("/static/geojson/geojson_gongneng.json").then(geojson => {
        this.echarts.registerMap("gongneng", geojson.data);
        this.getMapData(this.url, this.slider);
      });
    },
    getMapData(url, slider) {
      this.myChart.showLoading();
      this.axios
        .get(
          // url + slider[0]*2
          url
        )
        .then(data => {
          // console.log(data.data.data); // [[[],[]],[[],[]]]
          if (data.data.status == 200) {
            this.drawmap(data.data.data);
          }
          // console.log('data',data);
          this.drawmap(data.data);
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
          // categories:['商业区','居民区','生活区','购物区'],
          left: "right",
          bottom: 150,
          min: 1,
          max: 4,
          inRange: {
            color: ["red", "green", "blue", "yellow"]
          },
          // text: ["High", "Low"], // 文本，默认为数值文本
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
            // data: data
            data: [
              {
                name: 6169,
                value: 1
              },
              {
                name: 7916,
                value: 2
              },
              {
                name: 6265,
                value: 3
              },
              {
                name: 7907,
                value: 4
              }
            ]
          }
        ]
      };

      this.myChart.setOption(option);
      this.myChart.hideLoading();
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
  padding: 26px;
}
</style>
