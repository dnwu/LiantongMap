<template>
<div class="flow">
flow
</div>
</template>
<script>
export default {
  data() {
    return {
      // url: "http://10.123.60.101:6889/ivenus/data/api/stream/monitoring/ocean/ocean_info?token=w&date=2017-12-19&hour=",
      url: '/static/flow.json'
    };
  },
  props: {
    slider: {
      type: Array,
      default: [0, 1],
      required: true
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
      this.myChart = this.echarts.init(document.querySelector(".flow"));
      this.myChart.showLoading();
      window.onresize = () => {
        this.myChart.resize();
      };
    },
    getGeoJson() {
      this.axios.get("/static/geojson/sz_jiedao_6.json").then(geojson => {
        this.echarts.registerMap("shenzhen", geojson.data);
        this.getMapData(this.url, this.slider);
      });
    },
    getMapData(url, slider) {
      this.myChart.showLoading();
      this.axios
        .get(
          //url + slider[0]
         url
        )
        .then(data => {
          // console.log('213213',data.data); // [[[],[]],[[],[]]]
          if (data.data.status == 200) {
            this.drawmap(data.data.data);
          }
          // console.log('data',data);
          this.drawmap(data.data);
        });
    },
    drawmap(data) {
      var option = {
        // backgroundColor: "#cdcfd5",
        
        geo: {
          map: "shenzhen",
          center: [114.167287, 22.651127],
          zoom: 1.5,
          roam: true,
          itemStyle: {
            areaColor: "#1A427D",
            color: "#1A427D",
            borderWidth: "1", // 描边
            borderColor: "#fff"
          },
        },
        series: [
          {
            type: "flowGL",
            coordinateSystem: "geo",
            data: data,
            supersampling: 4,
            particleType: "point",
            particleDensity: 128,
            particleSpeed: 1,
            // gridWidth: windData.nx,
            // gridHeight: windData.ny,
            itemStyle: {
              opacity: 1,
              color: '#ffffbf'
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
        this.getMapData(this.url, b);
      }, 2000);
    }
  }
};
</script>
<style lang="scss" scoped>
.flow {
  width: 100%;
  height: 100%;
  background-color: #111C38;
  background-clip: content-box;
  box-sizing: border-box;
  // padding: 26px;
}
</style>
