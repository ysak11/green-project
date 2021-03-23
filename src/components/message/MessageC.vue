<template>
  <div class="warpper"  :class="{'shade': shade}">
    <div class="message">
      <div class="header">提示框</div>
      <div class="center">
        {{msg}}
      </div>
      <div class="bottom">
        <button @click="btnCancel" v-show="cancel" :style="{color: 'red'}">取消</button>
        <button @click="btnConfirm">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Message',
  props: {
    //显示的信息
    msg: {
      type: String,
    },
    //是否显示遮罩
    shade: {
      type: true,
      default: true
    },
    //显示取消按钮
    cancel: {
      type: true,
      default: true
    }
  },
  methods: {
    //点击确认按钮
    btnConfirm() {
      //向父组件发送确认事件，在父组件中对事件进行处理
      this.$emit('confirmClick');
    },

    //点击拒绝按钮
    btnCancel() {
      //向父组件发送取消事件，在父组件中对事件进行处理
      this.$emit('cancelClick');
    },
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
    color: black;
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