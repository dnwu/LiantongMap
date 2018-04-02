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
          map: "gongneng",
          roam: true,
          aspectScale: 2,
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
              name: "test",
              itemStyle: {
                areaColor: "red",
                color: "red"
              }
            }
          ]
        },
        series: [
          {
            name: "shenzhen gongneng",
            type: "map",
            roam: true,
            // map: "gongneng",
            itemStyle: {
              emphasis: { label: { show: true } }
            },
            // 文本位置修正
            textFixed: {
              Alaska: [20, -20]
            },
            data: data
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
