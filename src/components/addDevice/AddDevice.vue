<template>
  <div class="shape">
    <div class="add-info">
      <h3>设置设备</h3>
      <form action="" >
        <div class="message">
          <div>设备名:</div>
          <input type="text" v-model="name">
        </div>
        <div class="message">
          <div>设备型号:</div>
          <input type="text" v-model="type">
        </div>
        <div class="message">
          <div>单次灌溉值:</div>
          <input type="text" v-model="setting">
        </div>
        <div class="message">
          <div>所在区域:</div>
          <select v-model="toArea">
            <option value="" selected></option>
            <option v-for="item in areaList" :key="item._id" :value="item.name">{{item.name}}</option>
          </select>
        </div>
      </form>
      <div class="bottom">
        <button class="btn-confirm" @click="confirmClick">确定</button>
        <button class="btn-cancel" @click="cancelClick">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import { reqAddDevice, reqUpdateDevice } from '@/api';

import {mapState} from 'vuex';

export default {
  name: "AddDevice",
  props: {
    //新增模式还是修改模式
    mode: {
      type: String,
      default: 'add'
    },
    //修改模式时传入的设备对象
    device: {
      type: Object,
    },
  },
  data() {
    return {
      name: null,             //设备名
      type: null,             //设备型号
      setting: null,          //单次灌溉值
      toArea: null,           //所在区域
      deviceObj: null,        //设备对象(修改模式)
    }
  },
  created() {
    //获取区域列表
    this.$store.dispatch('getAreaList');
    //如果是修改模式，则将数据传递给组件的data
    if(this.mode === 'modify') {
      this.name = this.device.name;
      this.type = this.device.type;
      this.setting = this.device.setting;
      this.toArea = this.device.toArea;

      //props的值不能直接修改，所以得转存成data里的数据
      this.deviceObj = this.device;
    }
  },
  computed: {
    ...mapState(['areaList'])
  },
  methods: {
    //点击确定事件
    async confirmClick() {
      //所有信息都填写完成了
      if(this.name && this.type && this.setting) {
        //新增模式发送请求
        if(this.mode === 'add') {
          const result = await reqAddDevice(this.name, this.type, this.setting, this.toArea);

          if(result.status === 0) {
            this.$message.show('添加设备完成');
            this.$emit('closeWindow');
          } else {
            this.$message.show(result.msg);
          }
        } else {
          //将修改的数据重新赋予area对象
          this.deviceObj.name = this.name;
          this.deviceObj.type = this.type;
          this.deviceObj.setting = this.setting;
          this.deviceObj.toArea = this.toArea;
          //修改模式
          const result = await reqUpdateDevice(this.deviceObj);
          if(result.status === 0) {
            this.$message.show('设备数据修改完成');
            this.$emit('closeWindow');
          } else {
            this.$message.show(result.msg);
          }
        }

      } else {
        this.$message.show('还有信息尚未填写');
      }
    },

    //点击取消事件
    async cancelClick() {
      //关闭该窗口
      this.$emit('closeWindow');
    }
  }
}
</script>

<style scoped>
  .shape {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .6);
    z-index: 3;
  }

  .add-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 270px;
    height: 370px;
    background-color: #2c3e50;
    border-radius: 8px;
    color: #bdc3c7;
    overflow: hidden;
  }

  h3 {
    padding-left: 15px;
  }

  .message {
    /* display: flex;
    flex-direction: column; */
    margin-bottom: 15px;
    font-size: 12px;
    padding-left: 15px;
  }

  .message div {
    padding-bottom: 5px;
  }

  .message input {
    display: inline-block;
    width: 200px;
    height: 20px;
    border-radius: 4px;
    padding: 4px 10px;
  }

  .message select {
    display: inline-block;
    width: 220px;
    height: 28px;
    border-radius: 4px;
    outline: none;
  }

  .bottom {
    /* display: flex;
    justify-content: space-around; */
    padding-top: 5px;
    padding-left: 15px;
  }

  .bottom button{
    display: inline-block;
    width: 80px;
    height: 30px;
    cursor: pointer;
    border: none;
    outline: none;
    border-radius: 4px;
    color: #fff;
    /* margin-right: 15px; */
  }

  .btn-confirm {
    background-color: #1890ff;
  }

  .btn-confirm:hover {
    background-color: #40a9ff;
  }

  .btn-cancel {
    margin-left: 60px;
    background-color: #ff4d4f;
  }

  .btn-cancel:hover {
    background-color: #ff7875;
  }
</style>