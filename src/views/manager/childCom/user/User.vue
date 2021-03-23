<template>
  <div class="user">

    <div class="header">
      <span>用户管理</span>
      <div class="search">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chazhao"></use>
        </svg>
        <input type="text" placeholder="请输入要查找的用户名" v-model.lazy="search" @change="fuzzySearch">
      </div>
    </div>

    <div class="data">
      <div class="data-header">
        <div>用户名称</div>
        <div>用户类型</div>
        <div>操作</div>
      </div>

      <div class="data-content">
        <div class="data-list" v-for="item in userList" :key="item._id">
          <div>{{item.username}}</div>
          <div>普通用户</div>
          <div><button class="delete" @click="deleteUser(item._id)">删除</button></div>
        </div>
      </div>
    </div>

    <!-- 确认信息框 -->
    <message-c :msg="msg" v-show="showTip" @confirmClick="confirmEvent" @cancelClick="cancelEvent"/>
  </div>
</template>

<script>
import MessageC from 'components/message/MessageC'
import { reqUserList, reqDeleteUser, reqFuzzySearch } from '@/api'

export default {
  name: "User",
  components: {
    MessageC
  },
  data() {
    return {
      userList: null,             //用户列表
      userId: null,               //需要删除用户的id
      showTip: false,             //显示提示框
      msg: '是否确定删除该用户',   //提示框的信息
      search: ''                  //搜索框的信息
    }
  },
  created() {
    //在组件创建之时就获取用户列表
    this.getList();
  },

  methods: {
    //获取用户列表
    async getList() {
      const result = await reqUserList('1');
      if(result.status === 0) {
        this.userList = result.data;
      }
    },

    //模糊查询用户列表
    async fuzzySearch() {
      const result = await reqFuzzySearch('1', this.search);
      this.userList = result.data;
    },

    //删除指定用户
    deleteUser(id) {
      this.showTip = true;
      this.userId = id;
    },

    //提示框点击确定事件
    async confirmEvent() {
      const result = await reqDeleteUser(this.userId);
      //关闭提示框
      this.showTip = false;

      this.$message.show(result.msg);
      //只有成功删除用户后才更新列表
      if(result.status === 0) {
        this.getList();
      }

    },

    //提示框点击取消事件
    cancelEvent() {
      this.showTip = false;
    },
  }
}
</script>

<style scoped>
  .user {
    height: calc(100vh - 200px);
  }

  .header span{
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

  .delete {
    width: 70px;
    height: 35px;
    background-color: #c0392b;
    border-radius: 4px;
    cursor: pointer;
  }

  .delete:hover {
    background-color: #e74c3c;
  }
</style>