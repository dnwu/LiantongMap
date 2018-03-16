<template>
<div class="od">
  od
</div>
</template>
<script>
require("../map/js/world.js");
import flightData from "../json/flight.json";
export default {
  name: "OD",
  data() {
    return {};
  },
  mounted() {
    this.drawmap();
  },
  methods: {
    drawmap() {
      var myChart = this.echarts.init(document.querySelector(".od"));
      var data = flightData;

      function getAirportCoord(idx) {
        return [data.airports[idx][3], data.airports[idx][4]];
      }
      var routes = data.routes.map(function(airline) {
        return [getAirportCoord(airline[1]), getAirportCoord(airline[2])];
      });

      myChart.setOption({
        geo3D: {
          map: "world",
          shading: "realistic",
          silent: true,
          environment: "#121E38",
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

            panMouseButton: "left",
            rotateMouseButton: "right"
          },

          itemStyle: {
            areaColor: "#000"
          },

          regionHeight: 0.5
        },
        series: [
          {
            type: "lines3D",

            coordinateSystem: "geo3D",

            effect: {
              show: true,
              trailWidth: 1,
              trailOpacity: 0.5,
              trailLength: 0.2,
              constantSpeed: 5
            },

            blendMode: "lighter",

            lineStyle: {
              width: 1,
              opacity: 0.05
            },
            data: routes
            // data: [
            //   [[145.391881, -6.081689], [-18.916667, 66.133333]],
            //   [[-139.040556, 61.371111], [-57.391388, 49.210833]]
            // ]
          }
        ]
      });

      window.addEventListener("keydown", function() {
        myChart.dispatchAction({
          type: "lines3DToggleEffect",
          seriesIndex: 0
        });
      });
      window.onresize = function() {
        myChart.resize();
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.od {
  width: 100%;
  height: 100%;
  background-color: yellowgreen;
  background-clip: content-box;
  box-sizing: border-box;
  padding: 26px;
}
</style>
