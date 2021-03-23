<template>
  <div class="worker">

    <div class="header">
      <div class="left">职工管理</div>
      <div class="search">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-chazhao"></use>
        </svg>
        <input type="text" placeholder="请输入要查找的用户名" v-model.lazy="search" @change="fuzzySearch">
      </div>
      <button class="create" @click="createWorker">创建新职工</button>
    </div>

    <div class="data">
      <div class="data-header">
        <div>职工名称</div>
        <div>用户类型</div>
        <div>操作</div>
      </div>
      <div class="data-content">
        <div class="data-list" v-for="item in userList" :key="item._id">
          <div>{{item.username}}</div>
          <div>职工</div>
          <div><button class="delete" @click="deleteUser(item._id)">删除</button></div>
        </div>
      </div>
    </div>

    <div class="shape" v-if="showAdd">
    <div class="add-info">
      <h3>创建新职工</h3>
      <form action="" >
        <div class="message">
          <div>用户名:</div>
          <input type="text" v-model="username">
        </div>
        <div class="message">
          <div>密码:</div>
          <input type="password" v-model="password">
        </div>
        <div class="message">
          <div>请再次输入密码:</div>
          <input type="password" v-model="rePassword">
        </div>
      </form>
      <div class="bottom">
        <button class="btn-confirm" @click="confirmClick">确定</button>
        <button class="btn-cancel" @click="cancelClick">取消</button>
      </div>
    </div>
    </div>

      <!-- 确认信息框 -->
    <message-c :msg="msg" v-show="showTip" @confirmClick="confirmEvent" @cancelClick="cancelEvent"/>
  </div>
</template>

<script>
import MessageC from 'components/message/MessageC'

import { reqUserList, reqDeleteUser, reqRegister, reqFuzzySearch } from '@/api'

export default {
  name: "Worker",
  components: {
    MessageC
  },
  data() {
    return {
      userList: null,     //职工列表
      showAdd: false,     //展示创建新职工窗口
      username: '',       //用户名
      password: '',       //密码
      rePassword: '',     //再次输入的密码
      msg: '是否确定删除该职工',            //提示框的信息
      showTip: false,     //显示提示框
      userId: null,       //要删除的职工id
      search: ''                  //搜索框的信息
    }
  },
  created() {
    this.getList();
  },
  methods: {
    //获取职工列表
    async getList() {
      const result = await reqUserList('2');
      if(result.status === 0) {
        this.userList = result.data;
      }
    },

    //模糊查询职工列表
    async fuzzySearch() {
      const result = await reqFuzzySearch('2', this.search);
      this.userList = result.data;
    },

    //删除指定职工
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

    //添加新职工
    createWorker() {
      this.showAdd = true;
    },

    //确定按钮
    async confirmClick() {
      let username = this.username.trim();
      let password = this.password.trim();
      let rePassword = this.rePassword.trim();
      
      //输入框不能为空
      if(username && password && rePassword) {
        //如果两次密码不一样
        if(password !== rePassword) {
          this.$message.show('两次输入密码不一致！');
        } else {
          //用户注册的账户只有权限1
          const result = await reqRegister(username, password, 2);
          //如果返回状态码为0则注册成功
          if(result.status === 0) {
            this.$message.show('创建成功');
            //重新获取职工列表并关闭窗口
            this.showAdd = false;
            this.getList()
          } else {
            this.$message.show(result.msg);
          }
        }
      } else {
        this.$message.show('用户名或密码不能为空！');
      }
    },

    //取消按钮
    cancelClick() {
      this.showAdd = false;
    }
  }
}
</script>

<style scoped>
  .worker {
    height: calc(100vh - 200px);
    position: relative;
  }

  .left {
    border-left: 2px solid #fff;
    padding-left: 10px;
    font-size: 18px;
  }

  .search {
    position: absolute;
    top: 2px;
    right: 110px;
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


  .shape {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .4);
    z-index: 3;
  }

  .add-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 270px;
    height: 300px;
    background-color: #2c3e50;
    border-radius: 8px;
    color: #bdc3c7;
    overflow: hidden;
  }

  h3 {
    padding-left: 15px;
  }

  .message {
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