<template>
  <div class="time-control" @click="closeWindow" ref="warpper">
    <div class="content">

      <div class="header">
        <button @click="imitateHour">模拟一个小时</button>
        <button @click="imitateDay">模拟一天</button>
        <span class="text">(面积 * 降水量) - (每日耗水量 * 1/24 * 时间比率 * 温度比率)</span>
      </div>

      <div class="message" v-for="item in areaList" :key="item._id">
        <span class="name">{{item.name}}</span>
        <div>种类: {{item.type}}</div>
        <div>面积：{{item.area}} ㎡</div>
        <div :class="{'warn': item.lowWarn}">当前水量: {{waterQuantity(item.waterQuantity, item.waterTop)}}</div>
        <div>每日耗水量: {{item.hourConsume}}</div>
        <div>水量报警值: {{item.warnValue}}</div>
        <div>水量上限: {{item.waterTop}}</div>
      </div>

    </div>
  </div>
</template>

<script>
import { reqArea } from '@/api';
import { mapState } from 'vuex';

export default {
  name: "TimeImitate",
  data() {
    return {
      timeRatios: null,     //时间比率
      temRatios: null,       //温度比率
    }
  },
  computed: {
    ...mapState(['areaList', 'weatherInfo', 'ratioList']),
    //控制水量上限和小数个数
    waterQuantity() {
      return (Quantity, top) => {
        let water = Number(Quantity).toFixed(2);
        return water <= Number(top) ? water : top;
      }
    }
  },
  created() {
    //获得时间和温度的比率数组
    this.timeRatios = this.ratioList.find((item) => item.name === 'time');
    this.temRatios = this.ratioList.find((item) => item.name === 'temperature');
  },
  methods: {
    //关闭窗口
    closeWindow(e) {
      //只有触发元素为外层元素时才会触发事件，点击子元素（界面）时不会触发这个事件
      if(e.target === this.$refs.warpper) {
        // console.log(this.$refs.warpper);
        this.$emit('closeWindow');
      }
    },

    //模拟一个小时
    async imitateHour() {
      //获得当前小时、温度、降水量
      const hour = new Date().getHours();
      const tem = Number(this.weatherInfo.temp);
      const precip = this.weatherInfo.precip;

      //获取对应的时间和温度比率
      const timeRatio = this.timeRatios.ratio[hour];
      const temRatio = this.temRatios.ratio[tem + 20];
      // console.log(this.timeRatio + "   " + this.temRatio);
      
      this.areaList.forEach(item => {
        //耗水量      （面积 * 降水量） - （每日耗水量 * 1/24 * 时间比率 * 温度比率)
        const consume = (item.area * precip) - (item.hourConsume * (1 / 24) * timeRatio * temRatio);
        // const consume = (item.area * 1) - (item.hourConsume * (1 / 24) * timeRatio * temRatio);
        
        const nowWater = Number(item.waterQuantity) + consume;
        //最低水量需大于等于0,最高水量小于等于top
        item.waterQuantity = nowWater >= 0 ? nowWater : 0;
        item.waterQuantity = item.waterQuantity <= item.waterTop ? Number(item.waterQuantity) : Number(item.waterTop);

        item.waterQuantity = String(item.waterQuantity.toFixed(2));
        //更新区域
        reqArea(item);
      })
    },

    //模拟一天
    imitateDay() {
      //获得当前小时数和未来24小时天气情况
      let hour = new Date().getHours();
      const future = this.weatherInfo.future;

      //进行24次一小时模拟
      for(let i = 0; i < 24; i++) {
        //获得温度、降水量
        const tem = Number(future[i].temp);
        const precip = future[i].precip;

        //获取对应的时间和温度比率
        const timeRatio = this.timeRatios.ratio[hour];
        const temRatio = this.temRatios.ratio[tem + 20];

        this.areaList.forEach(item => {
          //耗水量      （面积 * 降水量） - （每日耗水量 * 1/24 * 时间比率 * 温度比率)
          const consume = (item.area * precip) - (item.hourConsume * (1 / 24) * timeRatio * temRatio);
          // const consume = (item.area * 1) - (item.hourConsume * (1 / 24) * timeRatio * temRatio);
          
          const nowWater = Number(item.waterQuantity) + consume;
          //最低水量需大于等于0,最高水量小于等于top
          item.waterQuantity = nowWater >= 0 ? nowWater : 0;
          item.waterQuantity = item.waterQuantity <= item.waterTop ? Number(item.waterQuantity) : Number(item.waterTop);
        })

        //小时数加一，大于23点时来到第二天
        hour++;
        if(hour > 23) {
          hour = 0;
        }
      }

      //24小时循环完后再发送更新请求
      this.areaList.forEach(item => {
        item.waterQuantity = String(item.waterQuantity.toFixed(2));
        //更新区域
        reqArea(item);
      })
    },


  }
}
</script>

<style scoped>
  .time-control {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .1);
    z-index: 3;
  }

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 980px;
    height: 550px;
    overflow: hidden;

    padding: 0 40px 40px 40px;
    box-sizing: border-box;
    background-color: #34495e;
    border-radius: 8px;
  }

  .header {
    position: relative;
    padding-bottom: 10px;
    margin: 20px 0;
    border-bottom: 1px solid #fff;
  }

  .header button {
    display: inline-block;
    width: 120px;
    height: 30px;
    border-radius: 6px;
    margin-right: 15px;
    cursor: pointer;
    color: #fff;
    background-color: #16a085;
  }

  .header button:hover {
    background-color: #1abc9c;
  }

  .text {
    position: absolute;
    bottom: 1px;
    right: 0;
    font-size: 14px;
  }

  .message {
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 5px;
  }

  .warn {
    font-weight: bold;
    color: red;
  }

  .name {
    height: 100%;
    width: 40px;
    display: flex;
    background-color: #bdc3c7;
    justify-content: center;
    align-items: center;
  }

  .message div {
    flex: 1;
    font-size: 14px;
    padding-left: 15px;
  }

</style>