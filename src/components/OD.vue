<template>
<div class="od">
</div>
</template>
<script>
// require("../map/js/world.js");
import flightData from "../json/test.json";
export default {
  name: "OD",
  data() {
    return {};
  },
  mounted() {
    // this.axios({
    //   method:'get',
    //   url:'@/map/sz_jiedao_6.geojson'
    // }).then(geojson => {
    //   // console.log(data);
    //   this.drawmap(geojson);
    // })
  },
  created() {
    this.$nextTick(()=>{
      this.initDom()
      this.getGeoJson();
    })
  },
  methods: {
    initDom(){
      this.myChart = this.echarts.init(document.querySelector(".od"));
      this.myChart.showLoading();
      window.onresize = ()=>{
        console.log('11');
        this.myChart.resize()
      }
    },
    getGeoJson() {
      this.axios
        .get("/static/geojson/sz_jiedao_6.json")
        .then(geojson => {
          this.drawmap(geojson.data);
        });
    },
    drawmap(geojson) {

      var data = flightData;

      // console.log(flightData);
      // data.forEach(element => {
      //   element.forEach(e => {
      //     e.push(400000)
      //   })
      // });
      // console.log(data);
      this.echarts.registerMap("shenzhen", geojson);

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
            minDistance:10,
            maxDistance:100,
            panMouseButton: "left",
            rotateMouseButton: "right"
          },
          // polyline:true,
          itemStyle: {
            areaColor: "#000",
            color:'#1A427D',
            borderWidth: "1" ,// 描边
            borderColor:'#fff'
          },
          blendMode:'lighter',
          emphasis:{
            label:{
              show:true,
              formatter: '{b}: {c}'
            }
          },
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
            data:data,
            // data: [
            //   {
            //       coords:[ [113.884583, 22.584793], [114.264602, 22.626966] ,[114.082353, 22.818978], [114.085803, 22.542074]],
            //       // 数据值
            //       value: 10000,
            //       // 数据名
            //       name: 'foo',
            //       // 线条样式
            //       lineStyle: {
            //         // color:'yellow',
            //         // width:'10'
            //       }
            //   }
            // ]
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
.od {
  width: 100%;
  height: 100%;
  // background-color: yellowgreen;
  background-clip: content-box;
  box-sizing: border-box;
  padding: 26px;
}
</style>
