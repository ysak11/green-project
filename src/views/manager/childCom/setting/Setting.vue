<template>
  <div class="setting">
    <div class="header">
      <span>区域设置</span>

      <!-- 种类选择框 -->
      <div class="select">
        <span>种类：</span>
        <select name="type" v-model="type" @change="fuzzySearch">
          <option value="" selected>所有</option>
          <option value="行道树">行道树</option>
          <option value="草坪">草坪</option>
          <option value="观赏植株">观赏植株</option>
        </select>
      </div>

      <!-- 名称搜索框 -->
      <div class="search">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chazhao"></use>
        </svg>
        <input type="text" placeholder="请输入要查找的区域名" v-model.lazy="search" @change="fuzzySearch">
      </div>
    </div>

    <div class="data">
      <!-- 表头信息 -->
      <div class="data-header">
        <div>区域别名</div>
        <div>种类</div>
        <div>具体植株</div>
        <div>水量报警值</div>
        <div>水量上限</div>
        <div>现在水量</div>
        <div>每日耗水量</div>
        <div>操作</div>
      </div>
      <!-- 表格内容 -->
      <div class="data-content">
        <div class="data-list" v-for="item in areaList" :key="item._id">
          <div>{{item.name}}</div>
          <div>{{item.type}}</div>
          <div>{{item.plant}}</div>
          <div>{{item.warnValue}}</div>
          <div>{{item.waterTop}}</div>
          <div>{{item.waterQuantity}}</div>
          <div>{{item.hourConsume}}</div>
          <div class="action">
            <button class="modify" @click="modify(item)">修改</button>
            <button class="delete" @click="deleteArea(item)">删除</button>
          </div>
        </div>
      </div>

    </div>

    <!-- 使用添加区域窗口的修改模式 -->
    <add-info :mode="mode" :area="area" v-if="showInfo" @closeWindow="closeWindow"/>
    <!-- 删除区域确定窗口 -->
    <message-c v-show="showDelete" :msg="msg" @confirmClick="confirmClick" @cancelClick="cancelClick"/>
  </div>
</template>

<script>
import AddInfo from 'components/addInfo/AddInfo';
import MessageC from 'components/message/MessageC';

import { reqMulFuzzy, reqDeleteArea } from '@/api'

export default {
  name: "Setting",
  data() {
    return {
      showInfo: false,      //控制信息框显示和隐藏
      mode: 'modify',       //使用信息框的修改模式
      area: null,           //要修改的区域
      showDelete: false,    //显示删除区域按钮
      msg: '',              //删除区域提示信息
      deleteId: '',         //要删除区域的id
      search: '',           //搜索框的信息
      type: '',             //要搜索的种类
      areaList: null        //区域列表
    }
  },
  components: {
    AddInfo,
    MessageC
  },
  created() {
    //发送请求获取区域列表
    this.fuzzySearch();
  },
  methods: {
    //修改区域信息
    modify(area) {
      this.showInfo = true;
      //把区域数据传送给addInfo组件
      this.area = area;
    },

    //显示删除区域确认窗口
    deleteArea(area) {
      this.showDelete = true;
      //提示信息
      this.msg = `是否确认要删除区域 "${area.name}" ？`;
      //记录要删除区域的Id   
      this.deleteId = area._id;
    },
    
    //确定删除区域
    async confirmClick() {
      //发送请求
      const result = await reqDeleteArea(this.deleteId);
      //更新区域列表
      if(result.status === 0) {
        this.fuzzySearch();
      }
      //关闭提示框
      this.showDelete = false;
    },

    //取消删除区域
    cancelClick() {
      this.showDelete = false;
    },

    //多条件模糊查询区域列表
    async fuzzySearch() {
      const result = await reqMulFuzzy(this.search, this.type);
      this.areaList = result.data;
    },

    //关闭窗口
    closeWindow() {
      this.showInfo = false;
    }
  }

}
</script>

<style scoped>
  .setting {
    height: calc(100vh - 200px);
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