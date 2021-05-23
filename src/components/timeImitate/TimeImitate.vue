<template>
  <div class="time-control" @click="closeWindow" ref="warpper">
    <div class="content">

      <div class="header">
        <button @click="imitateHour">模拟一个小时</button>
        <button @click="imitateDay">模拟一天</button>
        <button @click="autoWater" style="margin-left: 50px">自动灌溉： {{autoControl ? '开' : '关'}}</button>
        <span class="text">(面积 * 降水量) - (每日耗水量 * 1/24 * 时间比率 * 温度比率)</span>
      </div>

      <div class="message" v-for="item in showList" :key="item._id">
        <span class="name">{{item.name}}</span>
        <div>种类: {{item.type}}</div>
        <div>
          <div>面积：</div>{{item.area}} ㎡</div>
        <div :class="{'warn': item.lowWarn}">当前水量: {{waterQuantity(item.waterQuantity, item.waterTop)}}</div>
        <div>每日耗水量: {{item.hourConsume}}</div>
        <div>水量报警值: {{item.warnValue}}</div>
        <div>水量上限: {{item.waterTop}}</div>
        <div>
          <div>灌溉设备：</div>
          <div :class="{'warn':item.equip === '暂无'}">{{item.equip ? item.equip : ''}}</div>
        </div>
        <button class="btn-water" @click="openInput(item)">灌溉</button>
      </div>

    </div>

        <!-- 输入窗口 -->
    <div class="shape" v-if="showInput">
      <div class="input">
        <div class="input-header">灌溉水量：</div>
        <div class="watcher">
          <div>水表读数 ：</div>
          <input type="text" v-model="watcher">(m³)
        </div>
        <div class="fact">
          <div class="fact-text">实际水量：</div>
          <div class="fact-val">{{waterValue || 0}}  升</div>
        </div>
        
        <button class="confirm" @click="water(obj)">确定</button>
        <button class="cancel" @click="closeInput()">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { reqArea, reqAddMessage, reqUpdateMessage, reqWaterVal } from '@/api';
import { getDate } from '@/utils';


export default {
  name: "TimeImitate",
  data() {
    return {
      timeRatios: null,       //时间比率
      temRatios: null,        //温度比率
      autoControl: true,     //自动灌溉开关
      showInput: false,       //展示增加水量窗口
      obj: null,              //要增加水量的区域
      watcher: '',            //水表读数
      waterValue: '',         //灌溉量
    }
  },
  watch: {
    watcher: {
      handler(newVal) {
        this.waterValue = Number(newVal) * 1000;
      }
    }
  },
  computed: {
    ...mapState(['areaList', 'weatherInfo', 'ratioList', 'deviceList', 'messageList']),
    //控制水量上限和小数个数
    waterQuantity() {
      return (Quantity, top) => {
        let water = Number(Quantity).toFixed(2);
        return water <= Number(top) ? water : top;
      }
    },


    equipAreaList() {
      let len = this.areaList.length;
      
      for(let i = 0; i < len; i++) {
        let temp = this.deviceList.filter(item => item.toArea === this.areaList[i].name);
        if(temp.length !== 0) {
          this.areaList[i].equip = temp;
        } else {
          this.areaList[i].equip = null;
        }
      }
      return this.areaList;
    },

    showList() {
      let len = this.areaList.length;
      
      for(let i = 0; i < len; i++) {
        let temp = this.deviceList.filter(item => item.toArea === this.areaList[i].name);
        // console.log(temp);
        if(temp.length !== 0) {
          this.areaList[i].equip = temp[0].name;
        } else {
          this.areaList[i].equip = '暂无';
        }
      }
      return this.areaList;
    }
  },
  created() {
    //获得时间和温度的比率数组
    this.timeRatios = this.ratioList.find((item) => item.name === 'time');
    this.temRatios = this.ratioList.find((item) => item.name === 'temperature');
    //获取设备列表
    this.$store.dispatch('reqDeviceList');
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

    //控制输入框的显示
    openInput(item) {
      this.showInput = true;
      this.obj = item;
    },

    //控制输入框的隐藏
    closeInput() {
      this.showInput = false;
      //清空浇水量
      this.watcher = '';
    },

    //灌溉功能
    async water(item) {
      //浇水量加上现有水量
      let val = Number(this.waterValue) + Number(item.waterQuantity);
      // console.log(this.waterValue+ "  " +item.waterQuantity +"  " + val);
      
      //如果大于上限则水量值等于上限
      val = val > item.waterTop ? item.waterTop : val;
      //控制小数位数后再重新转为字符串
      val = String(val.toFixed(2));
      //直接发送请求更新水量，等待结果返回后重新更新区域信息
      await reqWaterVal(item._id, val);
      //如果是灌溉设备灌溉的则不会发送消息
      if(item.equip === '暂无') {
        //发送消息到数据库存储
        this.sendWaterMsg(item, this.waterValue);
      }

      //更新区域信息
      this.$store.dispatch('getAreaList');
      
      //关闭窗口
      this.closeInput();
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
      
      this.equipAreaList.forEach(item => {
        //耗水量      （面积 * 降水量） - （每日耗水量 * 1/24 * 时间比率 * 温度比率)
        const consume = (item.area * precip) - (item.hourConsume * (1 / 24) * timeRatio * temRatio);
        // const consume = (item.area * 1) - (item.hourConsume * (1 / 24) * timeRatio * temRatio);
        // console.log(consume);
        
        let nowWater = Number(item.waterQuantity) + consume;
        
        //如果低于预警水量且配备有自动灌溉设备则调用设备自动灌溉，还需要开启自动灌溉开关
        if(this.autoControl && nowWater <= parseInt(item.warnValue) && item.equip) {
          // console.log(item.equip);
          
          item.equip.forEach(item => {
            nowWater += parseInt(item.setting);
          })
        }

        //报警信息
        this.sendMsg(item);


        //最低水量需大于等于0,最高水量小于等于top
        item.waterQuantity = nowWater >= 0 ? nowWater : 0;
        item.waterQuantity = item.waterQuantity <= item.waterTop ? Number(item.waterQuantity) : Number(item.waterTop);

        item.waterQuantity = String(item.waterQuantity.toFixed(2));
        //更新区域
        reqArea(item);
        //更新区域信息
        this.$store.dispatch('getAreaList');
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
          console.log(consume);
          
          let nowWater = Number(item.waterQuantity) + consume;

          //如果低于预警水量且配备有自动灌溉设备则调用设备自动灌溉，还需要开启自动灌溉开关
          if(this.autoControl && nowWater <= parseInt(item.warnValue) && item.equip) {
            console.log(item.equip);
            
            item.equip.forEach(item => {
              nowWater += parseInt(item.setting);
            })
          }

          //报警信息
          this.sendMsg(item);
          

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
      //更新区域信息
      this.$store.dispatch('getAreaList');
    },


    //自动灌溉开关
    autoWater() {
      this.autoControl = !this.autoControl;
    },

    //预警消息的发送
    sendMsg(item) {
      //查询有关该区域的预警消息
      const result = this.messageList.find(msg => msg.areaName === item.name && msg.status === "warn");
      
      console.log(result);
      //在低于预警水量时判断需不需要发送预警信息
      if(item.lowWarn) {
        
        //现在没有生效预警信息，所以需要重新发送
        if(!result) {
          //发送预警消息
          console.log(item);
          this.sendWarn(item);
        }
      } else {
        //在不低于预警水量时还要检查之前是否存在预警消息，如果有则把该消息的状态改为warned，代表已过期
        if(result) {
          this.modifyWarn(result);
        }
      }

      this.$store.dispatch('getMessageList');
    },

    //发送预警消息
    async sendWarn(item) {
      const date = getDate();
      const message = `区域 ${item.name} 水量低于预警水量，请尽早派遣员工进行处理！`
      const msg = {
        message,
        status: 'warn',
        date,
        type: 'water',
        areaName: item.name,
        workerName: null
      }
      //将消息发送给服务器
      console.log(msg);
      
      await reqAddMessage(msg);
    },

    //发送浇水消息到数据库
    async sendWaterMsg(item, val) {
      const date = getDate();
      const message = `职工 ${this.userInfo.username} 为区域 ${item.name} 浇水${val}升`
      const msg = {
        message,
        status: 'water',
        date,
        areaName: item.name,
        workerName: this.userInfo.username
      }
      //将消息发送给服务器
      await reqAddMessage(msg);
    },

    //修改预警消息（让其过期）
    async modifyWarn(msg) {
      msg.status = 'warned';
      console.log(msg);
      
      let result = await reqUpdateMessage(msg);
    }
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

    .btn-water {
    display: block;
    width: 70px;
    height: 32px;
    margin: 0 15px;
    background-color: #27ae60;
    color: #2c3e50;

    border: none;
    outline: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .btn-water:hover {
    /* background-color: rgba(39, 174, 96, .8); */
    background-color: rgba(46, 204, 113,1.0);
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

    .shape {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .2);
    z-index: 4;
  }

  .input {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 280px;
    height: 170px;
    box-sizing: border-box;
    padding: 10px;

    border-radius: 6px;
    background-color: rgba(52, 73, 94,1.0);

  }
  
  .input-header {
    font-weight: bold;
    margin-bottom: 8px;
  }
  .watcher {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .watcher div{
    flex: 1;
    width: 100px;
  }

  .watcher input {
    width: 90px;
    height: 22px;
    margin-top: 5px;
    margin-right: 5px;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .input button {
    display: inline-block;
    width: 75px;
    height: 25px;
    margin-top: 15px;
    border: none;
    outline: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .fact {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-right: 4px;
  }

  .fact-text {

  }

  .fact-val {

  }

  .confirm {
    margin-left: 80px;
    background-color: #1890ff;
  }

  .confirm:hover {
    background-color: #40a9ff;
  }

  .cancel {
    margin-left: 15px;
    background-color: #ff4d4f;
  }

  .cancel:hover {
    background-color: #ff7875;
  }

</style>