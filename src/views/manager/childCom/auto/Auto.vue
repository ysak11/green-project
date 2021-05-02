<template>
  <div class="setting">
    <div class="header">
      <span>自动灌溉设备</span>

      <!-- 名称搜索框 -->
      <div class="search">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chazhao"></use>
        </svg>
        <input type="text" placeholder="请输入要查找的设备名" v-model.lazy="search" @change="searchDevice">
      </div>
    </div>
    <button class="create" @click="createDevice">添加新设备</button>

    <div class="data">
      <!-- 表头信息 -->
      <div class="data-header">
        <div>设备名称</div>
        <div>设备型号</div>
        <div>单次灌溉值</div>
        <div>所在区域</div>
        <div>操作</div>
      </div>
      <!-- 表格内容 -->
      <div class="data-content">
        <div class="data-list" v-for="item in deviceList" :key="item._id">
          <div>{{item.name}}</div>
          <div>{{item.type}}</div>
          <div>{{item.setting}}</div>
          <div>{{item.toArea ? item.toArea : '暂无'}}</div>
          <div class="action">
            <button class="modify" @click="modify(item)">修改</button>
            <button class="delete" @click="deleteDevice(item)">删除</button>
          </div>
        </div>
      </div>

    </div>

    <!-- 设置设备窗口 -->
    <add-device :mode="mode" :device="deviceObj" v-if="showWindow" @closeWindow="closeWindow"/>
    <!-- 删除设备确定窗口 -->
    <message-c v-show="showDelete" :msg="msg" @confirmClick="confirmClick" @cancelClick="closeWindow"/>
  </div>
</template>

<script>
import MessageC from 'components/message/MessageC';
import AddDevice from 'components/addDevice/AddDevice';

import { reqAddDevice, reqUpdateDevice, reqDeleteDevice, reqDeviceList, reqFuzzyDevice } from '@/api';
import {mapState} from 'vuex';

export default {
  name: "Auto",
  components: {
    MessageC,
    AddDevice
  },
  data() {
    return {
      search: '',                             //搜索框的信息
      showDelete: false,                      //显示删除窗口
      msg: '是否要删除该设备',                 //删除设备信息 
      showWindow: false,                      //显示设置设备窗口
      mode: 'modify',                         //设置设备窗口的模式
      deviceObj: null,                        //要设置的设备对象
      deleteObj: null,                        //要删除的设备对象
      deviceList: [],                         //设备列表
    }
  },
  created() {
    //更新设备列表
    this.searchDevice();
  },
  methods: {
    //添加新设备
    createDevice() {
      this.deviceObj = null;
      this.mode = 'add';
      this.showWindow = true;
    },

    //修改设备参数
    modify(item) {
      this.deviceObj = item;
      this.mode = 'modify';
      this.showWindow = true;
    },

    //删除设备
    deleteDevice(item) {
      this.deleteObj = item;
      this.showDelete = true;
    },

    //确认删除设备
    async confirmClick() {
      const result = await reqDeleteDevice(this.deleteObj._id);
      if(result.status === 0) {
        this.$message.show('设备已删除');
        //更新设备列表
        this.searchDevice();
      } else {
        this.$message.show('删除设备失败');
      }
      this.closeWindow();
    },

    //按搜索框内容进行搜索
    async searchDevice() {
      const result = await reqFuzzyDevice(this.search);
      this.deviceList = result.data;
    },

    //关闭窗口
    closeWindow() {
      //更新设备列表
      this.searchDevice();
      this.showDelete = false;
      this.showWindow = false;
    }
  },
}
</script>

<style scoped>
  .setting {
    height: calc(100vh - 200px);
    position: relative;
  }

  .header {
    position: relative;
  }

  .header > span{
    border-left: 2px solid #fff;
    padding-left: 10px;
    font-size: 18px;
  }

  .search {
    float: right;
    /* margin-right: 30px; */
    padding-left: 10px;
    height: 30px;
    margin-right: 120px;
    display: flex;
    align-items: center;
    color: #fff;
    background-color: rgba(71, 80, 93, .6);
    overflow: hidden;
    border-radius: 32px;
  }

  .search svg {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    background-color: rgba(71, 80, 93, .6);
    color: #fff;
  }

  .search input{
    display: block;
    height: 30px;
    font-size: 14px;
    color: #fff;
    background-color: rgba(71, 80, 93, .6);
  }

  input::-webkit-input-placeholder {
    color: #ccc;
    font-size: 12px;
  }

  .select {
    position: absolute;
    top: 1px;
    right: 250px;

  }

  .select select {
    border: none;
    outline: none;
    width: 100px;
    height: 25px;
    border-radius: 4px;
  }

  .create {
    position: absolute;
    display: block;
    top: 0;
    right: 0;
    height: 35px;
    border-radius: 4px;
    cursor: pointer;
    color: #f0f0f0;
    background-color: #27ae60;
  }

  .create:hover {
    background-color: #2ecc71;
  }

  .data {
    height: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .data-header {
    display: flex;
    height: 40px;
    margin-bottom: 10px;
    align-items: center;
    background-color: #34495e;
  }

  .data-header div {
    flex: 1;
    padding-left: 10px;
  }

  .data-content {
    flex: 1;
    background-color: rgba(71, 80, 90, .3);
  }

  .data-list {
    display: flex;
    height: 35px;
    line-height: 35px;
    margin-bottom: 5px;
  }

  .data-list div{
    padding-left: 10px;
    flex: 1;
  }

  .action {
    display: flex;
    justify-content: center;
  }

  .action button{
    width: 60px;
    height: 35px;
    margin-right: 5px;
    border-radius: 4px;
    cursor: pointer;
  }

  .modify {
    background-color: #1890ff;
  }

  .modify:hover {
    background-color: #40a9ff;
  }

  .delete {
    background-color: #c0392b;
  }

  .delete:hover {
    background-color: #e74c3c;
  }
</style>