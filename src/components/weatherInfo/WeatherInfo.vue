<template>
  <div class="weather">
    <img :src="icon" alt="" class="weather-icon">
    <div>{{text || '-'}}</div>
    <div>降水量: {{precipFix || '-'}}mm</div>
    <div>当前温度是{{temp || '-'}}℃</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: "WeatherInfo",
  data() {
    return {
      icon: require('../../assets/pic/100.png'),
      text: '',
      precip: '',
      temp: ''
    }
  },
  computed: {
    ...mapState(['weatherInfo']),
    precipFix() {
      return Number(this.precip).toFixed(1);
    }
  },
  watch: {
    weatherInfo: {
      handler(newArr, oldArr) {
        //更新数据,将数据都放到组件内防止组件加载太快时vuex中数据还没得到请求的结果。
        //读取时因为是对象中属性的读取，对undefined读属性就会报错
        this.icon = require(`assets/pic/${newArr.icon}.png`);
        this.text = newArr.text;
        this.precip = newArr.precip;
        this.temp = newArr.temp;

      },
      deep: true
    }
  }
}
</script>

<style scoped>
  .weather {
    position: absolute;
    right: 15px;
    top: 62px;
    z-index: 2;
    text-align: center;
    color: black;
  }

  .weather-icon {
    width: 85px;
    height: 85px;
  }

  .weather div {
    box-sizing: border-box;
    font-size: 14px;
    width: 120px;
    padding: 5px;
    background-color: rgba(0, 0, 0, .3);
    border-radius: 6px;
  }
</style>