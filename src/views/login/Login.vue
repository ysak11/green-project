<template>
  <div class="login">
    <div class="login-header">登录界面
      <!-- 关闭按钮 -->
      <svg class="icon btn-close" aria-hidden="true" @click="closeMenu">
        <use xlink:href="#icon-guanbi"></use>
      </svg>
    </div>
    <form action="">
      <!-- 主要表单内容 -->
      <div class="login-center">
        <div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-yonghuming"></use>
          </svg>
          <input type="text" class="username" v-model="username" value="" placeholder="请输入用户名">
        </div>
        <div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-mima"></use>
          </svg>
          <input type="password" class="password" v-model="password" value="" placeholder="请输入密码">
        </div>
        <p class="login-bottom">
          <label>
            <input type="checkbox" name="cookie" id="cookie" v-model="cookie">自动登录
          </label>
          <span @click="toRegister">
            去注册
            <svg class="icon arrow-right" aria-hidden="true">
              <use xlink:href="#icon-youjiantou_huaban"></use>
            </svg>
          </span>
        </p>
      </div>
    </form>
    <button class="login-btn" @click="loginClick">登录</button>
  </div>
</template>

<script>
import {reqLogin} from '../../api'
import {
  RECEIVE_USER_INFO,
} from 'store/mutation-type';

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      cookie: false
    }
  },
  methods: {
    //跳转到注册页面
    toRegister() {
      this.$emit('toRegister');
    },

    //关闭界面
    closeMenu() {
      this.$emit('closeMenu');
    },
    
    //点击登录
    async loginClick() {
      let username = this.username.trim();
      let password = this.password.trim();
      // console.log(this.$message);
      
      // this.$message.show('登录错误', true);
      //输入框不能为空
      if(username && password) {
        const result = await reqLogin(username, password, this.cookie);
        
        //如果登录成功
        if(result.status === 0) {
          // console.log(result);
          //发送用户信息给store
          this.$store.commit(RECEIVE_USER_INFO, result);
          this.closeMenu();
        } else {
          //登录失败
          this.$message.show('登录失败，用户名或密码错误！');
        }
      } else {
        //输入框未输入完全
        this.$message.show('用户名或密码不能为空');
      }
    }
  }
}
</script>

<style scoped>
  .login {
    position: relative;
    height: 265px;
    background-color: #fff;
    border-radius: 4px;
  }

  .login-header {
    position: relative;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    text-align: center;
    color: #0984e3;
    font-weight: bold;
  }

  .btn-close {
    position: absolute;
    color: red;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .login-center {
    width: 100%;;
    height: 160px;
    overflow: hidden;
  }

  .login-center div {
    box-sizing: border-box;
    width: 270px;
    height: 40px;
    border: 1px solid #ccc;
    margin: 0 auto;
    margin-top: 15px;
    padding-left: 5px;
    display: flex;
    align-items: center;
  }

  .username {
    box-sizing: border-box;
    height: 35px;
    width: 250px;
    padding-left: 10px;
  }

  .password {
    box-sizing: border-box;
    height: 35px;
    width: 250px;
    padding-left: 10px;
  }

  .login-bottom {
    width: 270px;
    margin: 0 auto;
    height: 50px;
    line-height: 50px;
  }

  .login-bottom label {
    font-size: 12px;
    color: #777;
    cursor: pointer;
  }

  .login-bottom input{
    position: relative;
    bottom: 1px;
    margin-right: 4px;
    vertical-align: middle;
    cursor: pointer;
  }

  .login-bottom span {
    float: right;
    font-size: 12px;
    color: #55efc4;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .arrow-right {
    width: 25px;
    height: 25px;
    margin-left: 5px;
    /* color: #55efc4; */
  }

  .login-btn {
    display: block;
    width: 270px;
    height: 40px;
    margin: 0 auto;
    background-color: #0984e3;
    color: #fff;
    outline: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .login-btn:active {
    background-color: #74b9ff;
  }

  ::-webkit-input-placeholder {
    color: #ccc;
    font-size: 13px;
  }
</style>