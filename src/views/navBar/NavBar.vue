<template>
  <div class="nav-bar">
    <div class="left">
      <span>河工大绿化管理系统</span>
    </div>
    <div class="center">
        <span @click="backToCenter">回到原点</span>
        <span @click="showWater" v-if="userInfo.permission >= '2'">水量监控</span>
        <span @click="submitQuestion" v-if="userInfo.permission >= '2'" :class="{submitting: isSubmitting}" >问题上报</span>
        <span @click="showTask" v-if="userInfo.permission >= '2'">我的任务</span>
        <span @click="addArea" v-if="userInfo.permission >= '3'" :class="{drawing: isDrawing}">添加绿化区域</span>
        <span @click="showInfo" v-if="userInfo.permission >= '3'">信息汇总</span>
        <span @click="showTime" v-if="userInfo.permission >= '3'">时间模拟</span>
        <span @click="toManager" v-if="userInfo.permission >= '3'">后台管理</span>

    </div>
    <div class="right">
      <div v-if="!userInfo._id" @click="loginClick" class="btn-login">登录</div>
      <div v-else class="right-text" @mouseenter="showExit" @mouseleave="hiddenExit">
        <div></div> 欢迎回来，{{userInfo.username}}
        <div v-show="isShowExit" class="menu">
          <div class="modify" @click="modify">修改密码</div>
          <div class="exit" @click="exit">退出</div>
        </div>

      </div>
    </div>

    <!-- 添加区域的信息窗口 -->
    <add-info :path="path" v-if="isDrawed" @closeWindow="closeWindow"/>
    <!-- 管理区域水量的窗口 -->
    <water-control v-if="showControl" @closeWindow="closeWindow"/>
    <!-- 问题提交的窗口 -->
    <sub-question :item="item" v-if="showSubmit" @closeWindow="closeWindow"/>
    <!-- 我的任务窗口 -->
    <my-task v-if="isShowTask" @closeWindow="closeWindow"/>
    <!-- 信息汇总窗口 -->
    <info-collect v-if="showInfoWindow" @closeWindow="closeWindow"/>
    <!-- 时间模拟窗口 -->
    <time-imitate v-if="isShowTime" @closeWindow="closeWindow"/>
    <!-- 修改密码 -->
    <modify-password v-if="showModify" @closeWindow="closeWindow"/>
  </div>
</template>

<script>
import AddInfo from 'components/addInfo/AddInfo';
import WaterControl from 'components/waterControl/WaterControl';
import SubQuestion from 'components/subQuestion/SubQuestion';
import MyTask from 'components/myTask/MyTask';
import InfoCollect from 'components/infoCollect/InfoCollect';
import TimeImitate from 'components/timeImitate/TimeImitate';
import ModifyPassword from 'components/modifyPassword/ModifyPassword';

import { mapState } from 'vuex';
import {CLEAR_USER_INFO, CONTROL_AREA_INFO} from 'store/mutation-type'

export default {
  name: 'NavBar',
  components: {
    AddInfo,
    WaterControl,
    SubQuestion,
    MyTask,
    InfoCollect,
    TimeImitate,
    ModifyPassword
  },
  data() {
    return {
      isShowExit: false,        //展示修改密码和退出的菜单
      isDrawing: false,         //控制添加区域按钮的颜色
      isDrawed: false,          //展示添加区域的信息窗口
      showControl: false,       //展示区域水量的窗口
      showSubmit: false,        //展示问题提交窗口
      isShowTask: false,           //展示我的任务界面
      showInfoWindow: false,     //展示信息汇总窗口
      isShowTime: false,        //展示时间模拟窗口
      showModify: false,        //展示密码修改窗口
      isSubmitting: false,      //是否正处于问题提交状态
      path: [],                 //传递覆盖物的生成路径
      item: null,               //传递要提交问题的区域
    }
  },
  methods: {
    //通知父组件显示登录面板
    loginClick() {
      this.$emit('loginClick');
    },

    //显示退出登录按钮
    showExit() {
      this.isShowExit = true;
    },

    //修改密码
    modify() {
      this.showModify = true;
    },

    //隐藏退出登录按钮
    hiddenExit() {
      this.isShowExit = false;
    },

    //退出登录按钮
    exit() {
      //清除vuex的数据和cookie
      this.$store.commit(CLEAR_USER_INFO);
      document.cookie = "userid=; expires=Thu, 01 Jan 1970 00:00:00 GMT";

      this.isShowExit = false;
    },

    //回到中心点
    backToCenter() {
      this.map.panTo([113.549843, 34.831152], 500);
    },

    //添加绿化区域
    addArea() {
      //改变按钮颜色
      this.isDrawing = !this.isDrawing;
      //关闭其他点击功能
      if(this.isDrawing) {
        //关闭点击显示信息功能
        this.$store.commit(CONTROL_AREA_INFO, false);
        //关闭问题上报功能
        this.isSubmitting = false;
        this.overlayGroup.off('click', this.areaClick);
      }

      //监听draw事件可获取画好的覆盖物
      this.mouseTool.on('draw', e => {
        //关闭绘制事件
        this.mouseTool.close(false);
        //获取多边形的绘制路径
        this.path = e.obj.getOptions().path;

        //移除刚刚绘制完的区域
        this.map.remove(e.obj);
        //重新开启点击显示信息功能
        this.$store.commit(CONTROL_AREA_INFO, true);
        
        this.isDrawing = false;
        //显示详细设定窗口，放进异步里防止显示太快使得鼠标右键菜单会显示（只有在map容器中右键菜单才不会显示)
        setTimeout(() => {
          this.isDrawed = true;
        }, 0)
        
      }) 

      this.mouseTool.polygon({
        fillColor:'#00b0ff',
        strokeColor:'#80d8ff'
        //同Polygon的Option设置
      });

      if(!this.isDrawing) {
        this.mouseTool.close(false);//关闭绘制事件
        //重新开启点击显示信息功能
        this.$store.commit(CONTROL_AREA_INFO, true);
      }
    },

    //关闭详细设定或区域管理窗口
    closeWindow(message) {
      this.isDrawed = false;
      this.showControl = false;
      this.isShowTime = false;
      this.showModify = false;
      this.showInfoWindow = false;
      this.isShowTask = false;

      this.showSubmit = false;
      //在问题成功提交的情况下关闭问题上报功能
      if(message && message === 'sub') {
        this.submitQuestion();
      }
    },

    //开启区域水量管理界面
    showWater() {
      this.showControl = true;
    },

    //开启我的任务界面
    showTask() {
      this.isShowTask = true;
    },

    //问题提交的功能
    areaClick(e) {
        const item = e.target;
        //改变传输的数据
        this.item = item;
        //打开窗口
        this.showSubmit = true;
        
        //打开窗口后注销绑定事件
        // this.overlayGroup.off('click', areaClick);
    },

    //问题提交
    submitQuestion() {
      //如果添加区域功能处于开启状态则关闭它
      if(this.isDrawing) {
        this.mouseTool.close(true);//关闭绘制事件并清除绘制物
        this.isDrawing = false;
      }

      if(!this.isSubmitting) {
        this.isSubmitting = true;
        //关闭点击显示区域信息功能
        this.$store.commit(CONTROL_AREA_INFO, false);

        this.overlayGroup.on('click', this.areaClick);
      } else {
        this.isSubmitting = false;
        //开启点击显示区域信息功能
        this.$store.commit(CONTROL_AREA_INFO, true);
        
        this.overlayGroup.off('click', this.areaClick);

        // this.overlayGroup.eachOverlay(item => {
        //   // console.log(item.vI.click[0].fn);
        //   // console.log(item.hasEvents('click', item.vI.click[0].fn));
        //   //直接通过clickEvent变量不知为何判断老是不存在，只能从多边形属性中找到挂载的事件处理函数了
        //   item.off('click', item.vI.click[1].fn);
        //   // this.overlayGroup.setOptions({cursor: 'auto'});
        // }
        // );
      }
      
    },

    //展示信息汇总界面
    showInfo() {
      //可能其他功能正在开启，所以需要关闭
      this.mouseTool.close(true);//关闭绘制事件
      //重新开启点击显示信息功能
      this.$store.commit(CONTROL_AREA_INFO, true);
      this.isSubmitting = false;
      this.isDrawing = false;
      this.overlayGroup.off('click', this.areaClick);


      this.showInfoWindow = true;
    },

    //展示时间模拟界面
    showTime() {
      this.isShowTime = true;
    },

    //跳转到后台管理界面
    toManager() {
      //可能其他功能正在开启，所以需要关闭
      this.mouseTool.close(false);//关闭绘制事件
      //重新开启点击显示信息功能
      this.$store.commit(CONTROL_AREA_INFO, true);
      this.isSubmitting = false;
      this.isDrawing = false;
      this.overlayGroup.off('click', this.areaClick);

      this.$router.push('/manager');
    }
  },
  computed: {
    ...mapState(['userInfo', 'map', 'mouseTool', 'overlayGroup', 'showAreaInfo'])
  }
}
</script>

<style scoped>
  .nav-bar {
    position: relative;
    width: 100vw;
    height: 60px;
    background-color: #3498db;
    border-bottom: 2px solid #ccc;
    color: #fff;
  }

  .left {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .left span {
    padding-left: 25px;
    font-size: 28px;
    font-weight: bold;
    text-shadow: #130f40 ;
  }

  .center {
    position: absolute;
    top: 50%;
    left: 50%;
    display: flex;
    transform: translate(-50%, -50%);
    overflow: hidden;
    line-height: 28px;
    border: 1px solid #fff;
    border-radius: 25px;
  }

  .center span {
    /* padding: 0 50px; */
    box-sizing: border-box;
    width: 120px;
    display: inline-block;
    cursor: pointer;
    outline: 1px solid #fff;
    text-align: center;
  }

  .center span:hover{
    background-color: #2980b9;
  }

  .drawing {
    background-color: #2980b9;
  }

  .submitting {
    background-color: #2980b9;
  }

  .right {
    position: absolute;
    /* top: 50%;
    transform: translateY(-50%); */
    top: 14px;
    right: 50px;
    line-height: 28px;
    z-index: 3;
  }

  .btn-login {
    border: 1px solid #fff;
    padding: 0 20px;
    cursor: pointer;
    border-radius: 8px;
  }

  .btn-login:hover{
    background-color: #2980b9;
  }

  .right-text {
    position: relative;
  }

  .menu {
    display: flex;
    flex-direction: column;
  }

  .modify {
    width: 100%;
    height: 36px;
    line-height: 36px;
    text-align: center;
    color: black;
    background-color: #fff;
    border-radius: 4px;
    cursor: pointer;
  }

  .exit {
    width: 100%;
    height: 36px;
    line-height: 36px;
    background-color: #d63031;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
  }
</style>