<template>
<div class="flow">
  <img ref='img' src="/static/Streamline/sites_20171020_time1.jpg" alt="">
</div>
</template>
<script>
export default {
  data() {
    return {
      // url: "http://10.123.60.101:6889/ivenus/data/api/stream/monitoring/ocean/ocean_info?token=w&date=2017-12-19&hour=",
      // url: "/static/flow.json",
      // url: '/static/Streamline/sites_20171020_time1.jpg',
      index: 1
    };
  },
  mounted() {
    // clearInterval(this.timer);
    this.imgDOM = this.$refs.img;
    this.imgDOM.onload = () => {
      this.index++;
      if (this.index > 143) {
        this.index = 1;
      }
      setTimeout(() => {
        this.resetImg(this.index)
      }, 500);
    };
  },
  methods: {
    resetImg(index) {
      this.imgDOM.setAttribute(
        "src",
        `/static/Streamline/sites_20171020_time${index}.jpg`
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.flow {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #111c38;
  background-clip: content-box;
  box-sizing: border-box;
  padding: 26px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    transform: scale(1);
  }
}
</style>
