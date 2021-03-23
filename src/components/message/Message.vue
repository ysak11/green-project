<template>
  <div class="warpper" :class="{'shade': isShade}" v-show="isShow">
    <div class="message">
      <div class="header">提示框</div>
      <div class="center">
        {{message}}
      </div>
      <div class="bottom">
        <button @click="btnReject" v-show="showNo" :style="{color: 'red'}">取消</button>
        <button @click="btnConfirm">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Message',
  data() {
    return {
      isShow: false,
      isShade: true,
      showNo: true,
      message: '错误',
    }
  },
  methods: {
    //点击确认按钮
    btnConfirm() {
      this.isShow = false;
      //执行回调函数
      this.confirmEvent();
    },

    //点击拒绝按钮
    btnReject() {
      this.isShow = false;
      //执行回调函数
      this.rejectEvent();
    },

    //显示消息提示框
    show(message='错误', showNo=false, shade=true) {
      this.isShow = true;
      this.showNo = showNo;
      this.isShade = shade;
      this.message = message;
    },

    //注册确定事件的回调函数
    onConfirm(func = () => {}) {
      this.confirmEvent = func;
    },

    //点击确定的回调函数
    confirmEvent() {
      // console.log('没有注册确定事件回调');
    },

    //注册拒绝事件的回调函数
    onReject(func = () => {}) {
      this.rejectEvent = func;
    },
    
    //点击确定的回调函数
    rejectEvent() {
      // console.log('没有注册拒绝事件回调');
    }
  }
}
</script>

<style scoped>
  .warpper {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: 99;
  }

  .shade {
    background: rgba(0, 0, 0, .7);
  }

  .message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    background-color: #fff;
    border-radius: 6px;
  }

  .header {
    height: 35px;
    border-bottom: 1px solid #ccc;
    padding-left: 15px;
    line-height: 35px;
    font-weight: bold;
  }
  
  .center {
    min-height: 30px;
    max-width: 300px;
    font-size: 14px;
    text-indent: 20px;
    margin: 10px 10px 0 10px;
  }

  .bottom button{
    float: right;
    width: 70px;
    height: 30px;
    line-height: 30px;
    margin: 10px 10px 10px 0;

    outline: none;
    border: none;

    font-size: 14px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;

    cursor: pointer;
  }

  .bottom:hover {
    background-color: #f5f6fa;
  }
</style>