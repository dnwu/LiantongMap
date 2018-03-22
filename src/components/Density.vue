<template>
<div class="density">
  Density
</div>
</template>
<script>
import flightData from "../json/test3.json";
// 113.884583,22.584793
// 114.264602,22.626966
// 114.082353,22.818978
// 114.085803,22.542074
// var flightData =[[114.085803,22.542074,1600]]
export default {
  name: "Density",
  data() {
    return {};
  },
  created() {
    this.$nextTick(()=>{
      this.initDom()
      this.getGeoJson();

    })
  },
  methods: {
    initDom(){
      this.myChart = this.echarts.init(document.querySelector(".density"));
      this.myChart.showLoading();
      window.onresize = ()=>{
        this.myChart.resize()
      }
    },
    getGeoJson() {
      this.axios
        .get("/mapStatic/geojson/sz_jiedao_6.json")
        .then(geojson => {
          this.drawmap(geojson.data);
        });
    },
    drawmap(geojson) {

      var data = flightData.slice(0,20000);
      // console.log(data);
      this.echarts.registerMap("shenzhen", geojson);
      var option = {
        backgroundColor: "#cdcfd5",
        geo3D: {
          map: "shenzhen",
          shading: "color",  //没有阴影
          // shading: "lambert",
          environment:'#00142D',
          light: {
            main: {
              intensity: 5,
              shadow: true,
              shadowQuality: "high",
              alpha: 30
            },
            ambient: {
              intensity: 0
            },
            ambientCubemap: {
              // texture: "../json/canyon.hdr",
              exposure: 1,
              diffuseIntensity: 0.5
            }
          },
          viewControl: {
            distance: 50,
            minDistance:10,
            maxDistance:80,
            panMouseButton: "left",
            rotateMouseButton: "right"
          },

          groundPlane: {
            show: true,
            color:'#00142D'
          },
          postEffect: {
            enable: true,
            bloom: {
              enable: false
            },
            SSAO: {
              radius: 1,
              intensity: 1,
              enable: true
            },
            depthOfField: {
              enable: false,
              focalRange: 10,
              blurRadius: 10,
              fstop: 1
            }
          },
          temporalSuperSampling: {
            enable: true
          },
          itemStyle: {
            areaColor: "#000",
            color:'#1A427D',
            borderWidth: "1" ,// 描边
            borderColor:'#fff'
          },

          regionHeight: 2
        },
        visualMap: {
          max: 1600,
          calculable: true,
          realtime: false,
          left:'10',
          top:'10',
          inRange: {
            color: [
              // "#313695",
              // "#4575b4",
              // "#74add1",
              // "#abd9e9",
              // "#e0f3f8",
              // "#ffffbf",
              // "#fee090",
              // "#fdae61",
              // "#f46d43",
              // "#d73027",
              // "#a50026"
              '#fff',
              'yellow',
              'red',
            ]
          },
          outOfRange: {
            colorAlpha: 0
          }
        },
        series: [
          {
            type: "bar3D",
            coordinateSystem: "geo3D",
            shading: "lambert",
            data: data,
            barSize: 0.05,
            minHeight: 0,
            silent: true,
            itemStyle: {
              color: "orange"
              // opacity: 0.8
            }
          }
        ]
      }
      this.myChart.setOption(option);
      this.myChart.hideLoading();
    }
  }
};
</script>
<style lang="scss" scoped>
.density {
  width: 100%;
  height: 100%;
  background-color: yellowgreen;
  background-clip: content-box;
  box-sizing: border-box;
  padding: 26px;
}
</style>
