<template>
<div class="od">
</div>
</template>
<script>
// require("../map/js/world.js");
// import flightData from "../json/test.json";
export default {
  name: "OD",
  data() {
    return {
      // url:"http://132.102.126.71:6889/ivenus/data/api/stream/monitoring/line/line_info?token=w&"
      url: "http://10.123.60.101:6889/ivenus/data/api/stream/monitoring/line/line_info?token=w&"
      // url:"/static/test.json"
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
      this.myChart = this.echarts.init(document.querySelector(".od"));
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
          // url + slider[0] * 2
          url + `date=${time}&hour=${slider[0] * 2}`
        )
        .then(data => {
          // console.log(data.data.data); // [[[],[]],[[],[]]]
          if (data.data.status == 200) {
            this.drawmap(data.data.data);
          }
          // console.log('data',data);
          // this.drawmap(data.data)
        });
    },
    drawmap(data) {
      var option = {
        geo3D: {
          map: "shenzhen",
          shading: "realistic",
          silent: true,
          environment: "#111C38",
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
            //minDistance: 10,
            //maxDistance: 100,
            panMouseButton: "left",
            rotateMouseButton: "right"
          },
          // polyline:true,
          itemStyle: {
            areaColor: "#000",
            color: "#1A427D",
            borderWidth: "1", // 描边
            borderColor: "#fff"
          },
          // blendMode: "lighter",
          // emphasis: {
          //  label: {
          //    show: true,
          //    formatter: "{b}: {c}"
          //  }
          //},
          // effect:{
          //   show:true,
          // },
          regionHeight: 3
        },

        series: [
          {
            name: "深圳",
            type: "lines3D",
            coordinateSystem: "geo3D",

            effect: {
              show: true,
              trailWidth: 1,
              trailOpacity: 0.5,
              trailLength: 0.2,
              constantSpeed: 5
            },
            // polyline: true,
            blendMode: "lighter",

            lineStyle: {
              width: 0.2,
              opacity: 0.05
              // color:'red'  //线条颜色
            },

            // 113.884583,22.584793
            // 114.264602,22.626966
            // 114.082353,22.818978
            // 114.085803,22.542074
            // data: [
            //   [[113.884583, 22.584793], [114.264602, 22.626966]],
            //   [[114.082353, 22.818978], [114.085803, 22.542074]]
            // ],
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
.od {
  width: 100%;
  height: 100%;
  // background-color: yellowgreen;
  background-clip: content-box;
  box-sizing: border-box;
  // padding: 26px;
}
</style>
