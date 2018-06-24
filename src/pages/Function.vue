<template>
<div class="function-box">
  <div class="function"></div>
  <div class="explain">
    <div><img src="../assets/business.png" alt=""></div>
    <div><img src="../assets/work.png" alt=""></div>
    <div><img src="../assets/live.png" alt=""></div>
    <div><img src="../assets/mix.png" alt=""></div>
  </div> 
</div>
</template>
<script>
import { host } from '../config/base.js'
export default {
  data() {
    return {
      url:"/ivenus/data/api/stream/monitoring/function/function_info"
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
      this.axios
        .get("/static/geojson/voronoi_Project2-2.json")
        .then(geojson => {
          this.echarts.registerMap("gongneng", geojson.data);
          this.getMapData(this.url, this.time);
        });
    },
    getMapData(url, time) {
      this.myChart.showLoading();
      this.axios
        .get(
          `${host}${url}`,
          {
            params: {
              token: 'w',
              date: time,
            }
          }
        )
        .then(data => {
          // console.log(data.data.data); // [[[],[]],[[],[]]]
          if (data.data.status == 200) {
            this.drawmap(data.data.data);
          }
          // console.log('data',data);
          // this.drawmap(data.data);
        })
        .catch(e => {
          this.drawmap([]);
        });
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
          text: "地理功能属性分析",
          subtext: "本图反映了深圳市各地理区域功能属性情况。根据区域当天的人口变化趋势，判别当天区域功能区属性。",
          // padding:[0, 0,0,200],
          textStyle: {
            color: "#cc9966",
            //align: "center"
          },
          subtextStyle: {
            color: "#cc9966",
            //align:"center"
          },
          left: 600
        },
        visualMap: {
          // show:false,
          type: "piecewise",
          // splitNumber: 4,
          //    
          pieces: [
            { value: 40, label: "混合属性", color: "#FC8F00" },
            { value: 30, label: "居住属性", color: "#00AA65" },
            { value: 20, label: "工作属性", color: "#008AD4" },
            { value: 10, label: "商业属性", color: "#FF5571" }
          ],
          textStyle: {
            color: "#fff"
          },
          // categories:['商业区','工作区','住宅区','混合区'],
          right: 24,
          bottom: "bottom",
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
.function-box{
  width: 100%;
  height: 100%;
  position: relative;
  .function {
    width: 100%;
    height: 100%;
    // background-color: yellowgreen;
    background-clip: content-box;
    box-sizing: border-box;
    // padding: 26px;
  }
  .explain{
    position: absolute;
    width: 100%;
    height: 150px;
    top: 0;
    left: 0;
    display: flex;
    div{
      margin: 0 10px;
      img{
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
