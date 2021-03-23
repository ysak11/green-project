<template>
  <div class="register">
    <div class="register-header">注册界面
      <!-- 关闭按钮 -->
      <svg class="icon btn-close" aria-hidden="true" @click="closeMenu">
        <use xlink:href="#icon-guanbi"></use>
      </svg>
    </div>
    <form action="">
      <!-- 主要表单内容 -->
      <div class="register-center">
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
        <div>
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-mima"></use>
          </svg>
          <input type="password" class="password" v-model="rePassword" value="" placeholder="请再次输入密码">
        </div>
        <p class="register-bottom" @click="toLogin">
          <span> 
            <svg class="icon arrow-right" aria-hidden="true">
              <use xlink:href="#icon-zuojiantou_huaban"></use>
            </svg>
            回到登录
          </span>
        </p>
      </div>
    </form>
    <button class="register-btn" @click="registerClick">注册</button>
  </div>
</template>

<script>
import {reqRegister} from '@/api';

export default {
  name: "Register",
  data() {
    return {
      username: '',
      password: '',
      rePassword: ''
    }
  },
  methods: {
    //跳转到登录界面
    toLogin() {
      this.$emit('toLogin');
    },

    //关闭界面
    closeMenu() {
      this.$emit('closeMenu');
    },

    //点击注册
    async registerClick() {
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
          const result = await reqRegister(username, password, 1);
          //如果返回状态码为0则注册成功
          if(result.status === 0) {
            this.$message.show('注册成功');
            //跳转到登录界面
            this.toLogin();
          } else {
            this.$message.show(result.msg);
          }
        }
      } else {
        this.$message.show('用户名或密码不能为空！');
      }
    }
  }
}
</script>

<style scoped>
  .register {
    position: absolute;
    width: 300px;
    height: 320px;
    top: 0;
    left: 350px;
    background-color: #fff;
    border-radius: 4px;
  }

  .register-header {
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

  .register-center {
    width: 100%;;
    height: 220px;
    overflow: hidden;
  }

  .register-center div {
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

  .register-bottom {
    width: 270px;
    margin: 0 auto;
    height: 50px;
    line-height: 50px;
  }

  .register-bottom span {
    float: left;
    font-size: 12px;
    color: #55efc4;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .arrow-right {
    width: 25px;
    height: 25px;
    margin-right: 5px;
    /* color: #55efc4; */
  }

  .register-btn {
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

  .register-btn:active {
    background-color: #74b9ff;
  }

  ::-webkit-input-placeholder {
    color: #ccc;
    font-size: 13px;
  }
</style>