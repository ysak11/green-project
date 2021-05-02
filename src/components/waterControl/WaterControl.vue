<template>
  <div class="water-control" @click="closeWindow" ref="warpper">
    
    <div class="content">

      <div class="header">
        <span class="areaName">名称</span>
        <div>种类</div>
        <div>当前水量</div>
        <div>水量报警值</div>
        <div>水量上限</div>
        <div>灌溉设备</div>
        <span class="action">操作</span>
      </div>

      <div class="message" v-for="item in showList" :key="item._id">
        <span class="name">{{item.name}}</span>
        <div>{{item.type}}</div>
        <div :class="{'warn': item.lowWarn}">{{item.waterQuantity}}</div>
        <div>{{item.warnValue}}</div>
        <div>{{item.waterTop}}</div>
        <div :class="{'warn':item.equip === '暂无'}">{{item.equip}}</div>
        <button class="btn-water" @click="openInput(item)">灌溉</button>
      </div>

    </div>
  
    <!-- 输入窗口 -->
    <div class="shape" v-if="showInput">
      <div class="input">
        <div>增加水量：</div>
        <input type="text" v-model="waterValue">
        <button class="confirm" @click="water(obj)">确定</button>
        <button class="cancel" @click="closeInput()">取消</button>
      </div>
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';

import { getAreaList } from 'store/actions';
import { reqWaterVal, reqAddMessage } from '@/api';
import { getDate } from '@/utils';

export default {
  name: "WaterControl",
  data() {
    return {
      showInput: false,       //展示增加水量窗口
      obj: null,              //要增加水量的区域
      waterValue: '',         //浇水量
    }
  },
  computed: {
    ...mapState(['areaList', 'userInfo', 'deviceList']),
    showList() {
      let len = this.areaList.length;
      
      for(let i = 0; i < len; i++) {
        let temp = this.deviceList.filter(item => item.toArea === this.areaList[i].name);
        console.log(temp);
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
      this.waterValue = '';
    },

    //浇水功能
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
      //发送消息到数据库存储
      this.sendMsg(item, val);
      //更新区域信息
      this.$store.dispatch('getAreaList');
      
      //关闭窗口
      this.closeInput();
    },

    //发送浇水消息到数据库
    async sendMsg(item, val) {
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
    }
  }
}
</script>

<style scoped>
  .water-control {
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
    width: 750px;
    height: 500px;
    overflow: hidden;

    padding: 40px;
    box-sizing: border-box;
    background-color: #34495e;
    border-radius: 8px;
  }

  .header {
    display: flex;
    margin-bottom: 12px;
  }

  .areaName {
    width: 40px;
    display: flex;
    justify-content: center;
  }

  .action {
    width: 70px;
    display: flex;
    justify-content: center;
  }

  .header div {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .message {
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 5px;
  }

  .name {
    height: 100%;
    width: 40px;
    display: flex;
    background-color: #bdc3c7;
    justify-content: center;
    align-items: center;
  }
  
  .warn {
    font-weight: bold;
    color: red;
  }

  .message div {
    flex: 1;
    font-size: 12px;
    padding-left: 15px;
    display: flex;
    justify-content: center;
  }

  .btn-water {
    display: block;
    width: 70px;
    height: 32px;
    margin-left: 5px;
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
    height: 120px;
    box-sizing: border-box;
    padding: 10px;

    border-radius: 6px;
    background-color: rgba(52, 73, 94,1.0);

  }

  .input input {
    display: block;
    width: 230px;
    height: 25px;
    margin-top: 5px;
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