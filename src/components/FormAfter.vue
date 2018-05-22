<template>
<div class="form-after">
  <div class="header">全市</div>
  <div class="nav">
    <span v-for="(item,index) in navList" :key="index">{{item}}</span>
  </div>
  <div class="h3">全市城市人口演化</div>
  <div class="title">
    <ul>
      <li><span>排名</span><span>区域ID</span><span>人口数量(人)</span><span>人口密度</span></li>
    </ul>
  </div>
  <div class="content">
    <ul>
      <li v-for='item in new Array(60)'><span>1</span><span>福田区66</span><span>1654654</span><span>63.64</span></li>
    </ul>
  </div>
  <div class="page">
    <el-pagination
      small
      layout="prev, pager, next"
      @current-change="pageChange"
      :page-size = "60"
      :total="6000">
    </el-pagination>
  </div>
  <div class="tit">福田区166人口预测趋势图</div>
  <div class="charts" ref="charts">
  </div>
</div>
</template>
<script>
export default {
  name: "form_after",
  data () {
    return {
      navList: ['福田区','罗湖区','宝安区','南山区','盐田区','龙岗区','龙华区','坪山区','大鹏区','光明区']
    }
  },
  mounted () {
    this.trendForm()
  },
  methods: {
    pageChange(e) {
      console.log(e);
    },
    trendForm() {
      let dom = this.$refs.charts
      dom.style.width = "432px"
      var myChart = this.echarts.init(dom);
      let option = {
          title: {
            // text: '堆叠区域图'
          },
          tooltip : {
              trigger: 'axis',
              axisPointer: {
                  type: 'cross',
                  label: {
                      backgroundColor: '#6a7985'
                  }
              }
          },
          legend: {
              data:['邮件营销','联盟广告'],
              textStyle: {
                color: "#fff"
              }
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['周一','周二','周三','周四','周五','周六','周日'],
                axisLabel: {
                  color: "#929CA5",
                  fontSize: "8"
                }
            }
          ],
          yAxis : [
            {
                type : 'value',
                axisLabel: {
                  color: "#929CA5",
                  fontSize: "8"
                }
            }
          ],
          series : [
              {
                  name:'邮件营销',
                  type:'line',
                  stack: '总量',
                  areaStyle: {normal: {}},
                  data:[120, 132, 101, 134, 90, 230, 210],
                  itemStyle: {
                    color: "#D06E6B"
                  },
              },
              {
                  name:'联盟广告',
                  type:'line',
                  stack: '总量',
                  areaStyle: {normal: {}},
                  data:[220, 182, 191, 234, 290, 330, 310],
                  itemStyle: {
                    color: "#18A1BE"
                  },
              }
          ]
      };
      myChart.setOption(option);
    }
  }
}
</script>
<style lang="scss" scoped>
.form-after{
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  .header{
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: #fff;
    background: linear-gradient(to right,#17A2BF,#233E8B);
  }
  .nav{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    span{
      width: 80px;
      height: 20px;
      line-height:20px;
      font-size:14px;
      color: #6EC2CD;
      background-color: #013567;
      margin: 4px 0;
      border: 1px solid #278CC0;
      cursor: pointer;
      text-align:center;
    }
  }
  .h3{
    height: 28px;
    text-align: center;
    line-height: 28px;
    font-size: 14px;
    color: #6EC2CD;
    background: #254A77;
  }
  .title,.content{
    ul{
      list-style: none;
      padding: 0;
      margin: 0;
      text-align: center;
      color: #6EC2CD;
      font-size: 14px;
      li{
        padding:8px 0;
        display: flex;
        justify-content: space-between;
        span{
          flex: 1;
        }
      }
    }
  }
  .content{
    ul {
      height: 260px;
      overflow:auto;
      font-size: 12px;
      padding:6px 0;
      li:hover{
        background-color:#0D3B5F;
        cursor:pointer;
      }
    }
  }
  .tit{
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    color: #6EC2CD;
  }
  .charts{
    width: 100%;
    height: 200px;
  }
}
</style>
<style lang="scss">
  $color: #6ebdcc;
  .form-after {
    .page {
      height: 30px;
      text-align: center;
      margin: 10px 0 0px 0;
      button.btn-prev,
      button.btn-next {
        background-color: transparent;
        color: $color;
      }
      ul.el-pager {
        li {
          background-color: transparent;
          color: $color;
          &.active {
            color: #fff;
          }
        }
      }
    }
  }
</style>
