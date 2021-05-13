<template>
  <div id="home">
    <div class="warpper" v-if="isShowLogin">
      <!-- 注册和登录组件 -->
      <div class="container">
        <login @toRegister="toRegister" @closeMenu="closeLogin" ref="login"/>
        <register @toLogin="toLogin" @closeMenu="closeLogin" ref="register"/>
      </div>
    </div>
    <!-- 导航栏 -->
    <nav-bar @loginClick="showLogin"/>
    <!-- 侧边栏 -->
    <slide-bar/>
    <!-- 天气状况 -->
    <weather-info/>
    <!-- 地图容器 -->
    <a-map/>

    <!-- 图例 -->
    <div class="sign">
      <div class="head">图例</div>
      <div class="type">
        <div class="color" style="background-color: #fd79a8"></div>
        <div class="text">观赏植株</div>
      </div>
      <div class="type">
        <div class="color" style="background-color: #55efc4"></div>
        <div class="text">草坪</div>
      </div>
      <div class="type">
        <div class="color" style="background-color: #27ae60"></div>
        <div class="text">行道树</div>
      </div>
      <div class="type">
        <div class="color" style="background-color: red"></div>
        <div class="text">报警区域</div>
      </div>
    </div>
  </div>
</template>

<script>
import AMap from 'views/aMap/AMap';
import NavBar from 'views/navBar/NavBar';
import Login from 'views/login/Login';
import Register from 'views/register/Register';
import SlideBar from 'views/slideBar/SlideBar';
import WeatherInfo from 'components/weatherInfo/WeatherInfo';

import {getCookie} from '@/utils';
import {reqUser} from '@/api';
import {nowWeather} from '@/api/weather';

import {RECEIVE_USER_INFO} from 'store/mutation-type';

export default {
  name: 'Home',
  components: {
    AMap,
    NavBar,
    Login,
    Register,
    WeatherInfo,
    SlideBar
  },
  data() {
    return {
      isShowLogin: false,
      userid: ''
    }
  },
  methods: {
    //显示登录界面
    showLogin() {
      this.isShowLogin = true;
    },

    //关闭登陆界面
    closeLogin() {
      this.isShowLogin = false;
    },

    //跳转到登陆界面
    toLogin() {
      this.moveControl(this.$refs.register.$el, 0);
      this.moveControl(this.$refs.login.$el, 0);
    },

    //跳转到注册界面
    toRegister() {
      this.moveControl(this.$refs.register.$el, -350);
      this.moveControl(this.$refs.login.$el, -350);
    },

    //控制动画效果
    moveControl(obj, distance, time = 500) {
      //开启transform的过渡效果
      obj.style.transition = `transform ${time}ms`;
      //开启硬件加速
      obj.style.transform = 'translateZ(0)';
      obj.style.transform = `translateX(${distance}px)`
    }
  },

  //不涉及页面加载完成后的DOM操作的话，放在created中也可
  async created() {
    // console.log(document.cookie);
    this.userid = getCookie('userid');
    //获取天气信息
    this.$store.dispatch('getNowWeather');
    //获取信息列表
    this.$store.dispatch('getMessageList');
    //如果userid已经存在，代表自动登录还有效
    if(this.userid) {
      const result = await reqUser();
      
      if(result.status === 0) {
        this.$store.commit(RECEIVE_USER_INFO, result);
      } else {
        //如果请求失败，则这个cookie可能已经失效，需要清除掉
        document.cookie = "userid=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  }
}
</script>

<style scoped>
  .warpper {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .7);  
    z-index: 9;
  }

  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 330px;
    overflow: hidden;
  }

  .sign {
    position: fixed;
    right: 50px;
    bottom: 30px;
    width: 160px;
    height: 200px;
    background-color: #fff;
    z-index: 2;
    border: 2px solid black;
    border-radius: 6px;
    box-sizing: border-box;
    padding: 15px;
    
  }

  .head {
    text-align: center;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .type { 
    width: 100%;
    display: flex;
    justify-content: space-between;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    margin: 12px 0;
  }

  .color {
    height: 100%;
    width: 50px;
  }

  .text {
    /* display: flex;
    justify-content: space-between; */
    text-align:justify
  }
</style>
