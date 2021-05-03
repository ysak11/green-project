<template>
<div >
  <div class="slide-bar">

    <!-- 箭头图标 -->
    <div class="arrow" @click="arrowClick">
      <svg class="icon arrow-right" aria-hidden="true" v-show="!isOut">
        <use xlink:href="#icon-youjiantou_huaban"></use>
      </svg>
      <svg class="icon arrow-right" aria-hidden="true" v-show="isOut">
        <use xlink:href="#icon-zuojiantou_huaban"></use>
      </svg>
    </div>

    <div ref="scroll" class="warpper">
      <div class="content">

        <!-- 区域列表 -->
        <div>
          <div class="areas" @click="slideDown">区域列表</div>
          <div v-for="item in polygonList" class="area">
            <div class="area-name">{{item._opts.name}}</div>
            <div class="area-type">{{item._opts.type}}</div>
            <button @click="toArea(item._opts.centerPoint)">定位</button>
          </div>
        </div>

        <!-- 缺水警告 -->
        <div v-if="userInfo.permission >= '2'">
          <div class="waterPro" @click="slideDown">缺水警告</div>
          <div v-for="item in areaList" v-show="item.lowWarn" :key="item.id" class="card">
            <div class="text">
              <div>{{item.name}}</div>
              <div>警告值:{{item.warnValue}}</div>
              <div>现在水量:{{item.waterQuantity}}</div>
            </div>
            <button class="btn-water" @click="showInput(item)">浇水</button>
          </div>
        </div>

        <!-- 其它问题 -->
        <div v-if="userInfo.permission >= '2'">
          <div class="others" @click="slideDown">其他问题</div>

          <!-- <div v-for="item in areaList" v-if="item.question.length !== 0" :key="item.id">
            <div v-for="question in item.question" class="warp-question">
              <div class="question">
                <div>{{item.name}}</div>
                <div class="describe">{{question}}</div>
              </div>
              <button class="btn-solve" @click="confirmQuestion(item, question)">解决</button>
            </div>
          </div> -->
          
          <div v-for="item in waittingList" :key="item._id" class="warp-question">
            <div class="question">
              <div>{{item.areaName}}</div>
              <div class="describe">{{item.message}}</div>
            </div>
            <button class="btn-solve"  @click="confirmQuestion(item)">解决</button>
          </div>

        </div>

      </div>
        
    </div>

  </div>

    <!-- 浇水窗口 -->
  <div class="shape" v-if="waterShow">
    <div class="input">
      <div>增加水量：</div>
      <input type="text" v-model="waterValue">
      <button class="confirm" @click="water">确定</button>
      <button class="cancel" @click="closeInput">取消</button>
    </div>
  </div>

  <!-- 提示框 -->
  <message-c v-if="showTip" :msg="msg" @confirmClick="confirmClick" @cancelClick="cancelClick"/>
</div>

</template>

<script>
import MessageC from 'components/message/MessageC';

import BScroll from 'better-scroll';

import { mapState } from 'vuex';
import { reqWaterVal, reqArea, reqAddMessage, reqUpdateMessage } from '@/api';
import { getDate } from '@/utils';

export default {
  name: "SlideBar",
  components: {
    MessageC
  },
  data() {
    return {
      isOut: false,               //控制箭头的方向
      waterShow: false,           //控制浇水窗口的显示
      waterItem: null,            //要浇水的区域
      waterValue: null,           //浇水值
      showTip: false,             //控制提示框的显示
      msg: '该问题是否已经解决',   //提示框信息
      solveQuestion: null,        //解决的问题
      bscroll: null,              //滚动插件
    }
  },
  computed: {
    ...mapState(['areaList', 'overlayGroup', 'map', 'userInfo', 'messageList']),
    polygonList() {
      //因为覆盖物群组的图层返回没那么快，所以会报错，用try-catch让其不报错
      try {
        return this.overlayGroup._overlays;
      }
      catch {}
    },
    
    //待解决的问题列表
    waittingList() {
      return this.messageList.filter(item => item.status === 'waitting');
    }
  },
  mounted() {
    //绑定BScroll组件
    this.bscroll = new BScroll(this.$refs.scroll, {
      probeType: 0
    })
  },
  updated() {
    //刷新重新计算高度
    this.bscroll.refresh();
  },
  watch: {
    areaList: {
      handler(newArr, oldArr) {
        //存储生成的区域覆盖物，以便后面生成覆盖物群组
        newArr.forEach(item => {
          // 现水量低于警告水量的标志变量，如果当前水量低于水量报警值则设为true
          item.lowWarn = false;
          if(Number(item.warnValue) >= Number(item.waterQuantity)) {
            //设置警告属性为true，并把区域染红
            item.lowWarn = true;
          }
        })
      },
      deep: true
    },
  },
  methods: {
    //重新计算高度
    refresh() {
      this.bscroll.refresh();
    },

    //箭头的点击
    arrowClick() {
      if(!this.isOut) {
        this.isOut = true;
        //给组件实例第一个子节点（侧边栏)开启过渡动画效果
        this.$el.childNodes[0].style.transition = "transform 500ms";
        
        //开启硬件加速
        this.$el.childNodes[0].style.transform = "translateZ(0)";

        this.$el.childNodes[0].style.transform = "translateX(290px)";
      } else {
        this.isOut = false;
        this.$el.childNodes[0].style.transform = ''; 
      }
    },

    //展开列表
    slideDown() {
      const height = event.target.parentNode.style.height === 'auto' || '' ? '40px' : 'auto';
      event.target.parentNode.style.height = height;
      //重新计算高度
      this.refresh();
    },

    //跳转到指定区域
    toArea(center) {
      this.map.panTo(center, 500);
    },

    //打开浇水窗口
    showInput(item) {
      this.waterShow = true;
      this.waterItem = item;
    },

    //浇水功能
    async water() {
      //浇水量加上现有水量
      let val = Number(this.waterValue) + Number(this.waterItem.waterQuantity);
      // console.log(this.waterValue+ "  " +item.waterQuantity +"  " + val);
      
      //如果大于上限则水量值等于上限
      val = val > this.waterItem.waterTop ? this.waterItem.waterTop : val;
      //控制小数位数后再重新转为字符串
      val = String(val.toFixed(2));
      console.log(val);
      
      //直接发送请求更新水量，等待结果返回后重新更新区域信息
      await reqWaterVal(this.waterItem._id, val);
      //发送消息到数据库存储
      this.sendMsg(this.waterItem, val);

      //更新区域信息
      this.$store.dispatch('getAreaList');
      
      //关闭窗口
      this.closeInput();
      this.waterValue = null;
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
    },

    //关闭浇水窗口
    closeInput() {
      this.waterShow = false;
    },

    //显示提示框
    confirmQuestion(item) {
      this.solveQuestion = item;
      this.showTip = true;
    },

    //问题解决
    async confirmClick() {
      //将原有问题状态改为无效
      this.solveQuestion.status = 'invalid';

      //创建一个新的已解决问题的信息
      const date = getDate();
      const msg = {
        message: this.solveQuestion.message,
        status: 'solved',
        date,
        areaName: this.solveQuestion.areaName,
        workerName: this.userInfo.username,
        imgs: this.solveQuestion.imgs
      }
      
      //发送请求更新信息状态
      await reqUpdateMessage(this.solveQuestion);
      //添加一条新的信息
      await reqAddMessage(msg);
      //更新区域信息
      this.$store.dispatch('getMessageList');
      this.showTip = false;
    },

    //隐藏提示框
    cancelClick() {
      this.showTip = false;
    }
  }
}
</script>

<style scoped>
  .slide-bar {
    position: absolute;
    top: 61px;
    left: -291px;
    height: calc(100vh - 62px);
    width: 300px;
    color: #fff;
    background-color: #2c3e50;
    border-radius: 4px;
    z-index: 2;
  }

  /* .slide-bar::-webkit-scrollbar {
   overflow-x:hidden;
} */


  .arrow {
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    z-index: 1;
  }

  .arrow-right {
    width: 40px;
    height: 40px;
    color: black;
    font-weight: bold;
    background-color: #fff;
  }

  .warpper {
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  .content {
    width: 100%;
  }

  .content > div {
    display: flex;
    flex-direction: column;
    height: 40px;
    overflow: hidden;
    margin-bottom: 4px;
    width: 100%;
  }

  .areas, .waterPro, .others {
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color:#34495e;
    cursor: pointer;
    /* margin-bottom: 2px; */
  }

  .areas:hover, .waterPro:hover, .others:hover {
    background-color: #2d3436;
  }

  .area {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    margin: 0 30px;
    background-color: #273c75;
    padding: 4px 8px;
    margin-top: 8px;
    border-radius: 8px;
  }
  
  .area-name {
    flex: 1;
  }

  .area-type {
    flex: 2;
  }

  .area button {
    height: 30px;
    width: 60px;
    cursor: pointer;
    border-radius: 4px;
    color: #fff;
    background-color: #16a085;
  }

  .area button:hover {
    background-color: #1abc9c;
  }

  .card {
    padding: 0 70px 0 30px;
    margin: 10px 0;
    position: relative;
  }

  .text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #2c3e50;
    background-color: #bdc3c7;
    border-radius: 8px;
  }

  .btn-water {
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 50px;
    border-radius: 2px;
    cursor: pointer;
    color: #2c3e50;
    background-color: #27ae60;
  }

  .btn-water:hover {
    background-color: #2ecc71;
  }

  .warp-question {
    display: flex;
    padding: 10px 30px;
  }

  .question {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #f1c40f;
    color: #2c3e50;
    border-radius: 8px 0 0 8px;
    width: 210px;
    padding-top: 5px;
    position: relative;
  }

  .btn-solve {
    /* position: absolute;
    right: -30px; */
    width: 30px;
    cursor: pointer;
    border-radius: 0 8px 8px 0;
    color: #fff;
    background-color: #c0392b;
  }

  .btn-solve:hover {
    background-color: #e74c3c;
  }

  .describe {
    margin-top: 5px;
    padding: 2px 4px;
    text-indent: 16px;
  }

  .shape {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    color: #fff;
    background-color: rgba(0, 0, 0, .2);
    z-index: 5;
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