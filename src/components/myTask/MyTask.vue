<template>
  <div class="warpper" ref="warpper">
    <div class="content">
      <!-- 关闭按钮 -->
      <svg class="icon close" aria-hidden="true" @click="closeWindow">
        <use xlink:href="#icon-guanbi2"></use>
      </svg>

      <div class="task">
        <div v-if="userInfo.solveId" class="area">
          <div class="area-header">
            <span class="areaName">区域名：{{tasking.areaName}}</span>
            <span class="date">日期：{{tasking.date}}</span>
          </div>
          <div class="area-center">
            <div class="text">{{tasking.message}}</div>
            <img v-for="(img, index) in tasking.imgs" :key="tasking._id + index" :src="img" alt="" class="photo">
          </div>
          <div class="area-bottom">
            <button class="finish" @click="finishTask(tasking)">已完成</button>
            <button class="giveup" @click="giveUpTask(tasking)">放弃任务</button>
          </div>
        </div>
        <div v-else class="nothing" style="width:200px">目前没有正在执行的任务</div>
      </div>

      <div class="line"></div>

      <div class="question" ref="scroll">
        <div v-if="waitSolve.length !== 0" >
          <div class="card" v-for="item in waitSolve" :key="item._id">
            <div class="header">
              <span class="name">{{item.areaName}}</span>
              <span class="time">{{item.date}}</span>
            </div>
            <div class="center">
              <div class="text">{{item.message}}</div>
              <img v-for="(img, index) in item.imgs" :key="item._id + index" :src="img" alt="" class="photo">
            </div>
            <div class="bottom">
              <button class="accept" @click="acceptTask(item)">接受</button>
            </div>
          </div>
        </div>

        <div v-else  class="nothing">目前没有问题需要解决</div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import BScroll from 'better-scroll';

import {RECEIVE_USER_INFO} from '@/store/mutation-type';
import { reqUpdateUser, reqUpdateMessage, reqAddMessage } from '@/api';
import { getDate } from '@/utils';

export default {
  name: "MyTask",
  data() {
    return {
      bscroll: null,        //滚动条插件
    }
  },
  mounted() {
    //绑定BScroll组件
    this.bscroll = new BScroll(this.$refs.scroll, {
      probeType: 0
    })
    //重新计算高度
    this.refresh();
  },
  computed: {
    ...mapState(['userInfo', 'messageList']),
    //反转数组才能让数组第一条是最新的信息
    reverseList() {
      return this.messageList.slice().reverse();
    },
    //当前在执行的任务
    tasking() {
      return this.messageList.find(item => item._id === this.userInfo.solveId);
    },
    //需要解决的问题
    waitSolve() {
      return this.reverseList.filter(item => item.status === 'waitting');
    }
  },
  created() {
    //更新信息列表
    this.$store.dispatch('reqDeviceList');
  },
  methods: {
    //关闭窗口
    closeWindow(e) {
      this.$emit('closeWindow');
    },

    //重新计算高度
    refresh() {
      this.bscroll.refresh();
    },

    //接受任务
    async acceptTask(item) {
      if(this.userInfo.status !== 'free') {
        this.$message.show('当前任务尚未完成');
      } else {
        //转换为工作状态并记录该任务的id
        this.userInfo.status = 'working';
        this.userInfo.solveId = item._id;

        //将问题的状态改为正在解决
        item.status = 'solving';

        //状态更新
        await this.update(item);
        this.$message.show('任务已接受');
      }
    },

    //完成任务
    async finishTask(item) {
      //用户状态变为空闲
      this.userInfo.status = 'free';
      this.userInfo.solveId = '';
      
      //将问题状态改为无效
      item.status = 'invalid';

      //创建一个新的已解决问题的信息
      const date = getDate();
      const msg = {
        message: item.message,
        status: 'solved',
        date,
        areaName: item.areaName,
        workerName: this.userInfo.username,
        imgs: item.imgs
      }
      //添加一条新的信息
      await reqAddMessage(msg);

      //状态更新
      await this.update(item);
      this.$message.show('任务已完成');
    },

    //放弃任务
    async giveUpTask(item) {
      //用户状态变为空闲
      this.userInfo.status = 'free';
      this.userInfo.solveId = '';

      //将问题状态重新改为待解决
      item.status = 'waitting';

      //状态更新
      await this.update(item);
      this.$message.show('任务已放弃');
    },

    //状态更新
    async update(message) {
      //修改数据库中的相关信息
      await reqUpdateUser(this.userInfo);
      await reqUpdateMessage(message);

      //刷新信息
      this.$store.dispatch('getMessageList');
      this.$store.commit({
        type: RECEIVE_USER_INFO,
        data: this.userInfo
      });
    }
  }
}
</script>

<style scoped>
  .warpper {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .6);
    z-index: 3;
  }

  .content {
    background-color: #3c6382;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    width: 800px;
    height: 500px;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    color: #c23616;
    cursor: pointer;
  }

  .close:hover {
    color: #e84118;
  }

  .task {
    background-color: #eccc68;
    height: 420px;
    flex: 1;
    box-sizing: border-box;
    border-radius: 8px;
    margin: 0 35px;
    display: flex;
    /* justify-content: center;
    align-items: center; */
    color: black;
    position: relative;
  }

  .area {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .area-header {
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #34495e;
    position: relative;
  }

  .areaName {
    position: absolute;
    bottom: 8px;
    left: 8px;
    font-size: 18px;
    font-weight: bold;
  }

  .date {
    position: absolute;
    bottom: 5px;
    right: 5px;
    font-size: 12px;
    
  }

  .area-center {
    flex: 1;
    padding: 16px;
    border-bottom: 1px solid #34495e;
  }

  .area-bottom {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .area-bottom button {
    border-radius: 16px;
    width: 90px;
    height: 35px;
    color: #fff;
    cursor: pointer;
    margin: 0 16px;
  }

  .finish {
    background-color: #2980b9;
  }

  .finish:hover {
    background-color: #3498db;
  }

  .giveup {
    background-color: #c0392b;
  }

  .giveup:hover {
    background-color: #e74c3c;
  }

  .nothing {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: black;
    font-weight: bold;
  }

  .line {
    height: 100%;
    width: 50px;
    border-right: 2px solid black;
    border-left: 2px solid black;
    position: absolute;
  }

  .question {
    flex: 1;
    border-radius: 8px;
    box-sizing: border-box;
    height: 420px;
    background-color: #f0f0f0;
    margin: 0 35px;
    overflow: hidden;
    position: relative;
  }

  .card {
    margin: 12px 8px;
    border: 1px solid #c8c7cc;
    border-radius: 4px;
    color: black;
    background-color: #fff;
  }

  .header {
    padding: 12px 8px;
    border-bottom: 1px solid;
    font-size: 14px;
    border-bottom: 1px solid #c8c7cc;
  }

  .time {
    float: right;
  }
  
  .center {
    padding: 10px;
    border-bottom: 1px solid #c8c7cc;
  }

  .text {
    padding-bottom: 8px;
  }

  .bottom {
    padding: 6px;
    overflow: hidden;
  }

  .accept {
    cursor: pointer;
    width: 80px;
    height: 28px;
    border-radius: 4px;
    float: right;
    color: #fff;
    background-color: #2ed573;
  }

  .accept:hover {
    background-color: #7bed9f;
  }

  .photo {
    width: 80px;
    height: 80px;
    margin-right: 15px;
  }
</style>