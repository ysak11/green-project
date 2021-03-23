<template>
  <div class="slide">
    <div class="top">
      <svg class="icon go-back" aria-hidden="true" @click="goBack">
        <use xlink:href="#icon-xiangzuo"></use>
      </svg>
      <div>回到主页</div>
    </div>

    <div class="list">
      <div class="user" @click="skip('/manager/user')" :class="{on: '/manager/user'===$route.path}">
        <svg class="icon" aria-hidden="true" @click="goBack">
          <use xlink:href="#icon-yonghuguanli"></use>
        </svg>
        用户管理
      </div>
      <div class="worker" @click="skip('/manager/worker')" :class="{on: '/manager/worker'===$route.path}">
        <svg class="icon" aria-hidden="true" @click="goBack">
          <use xlink:href="#icon-user"></use>
        </svg>
        职工管理
      </div>
      <div class="setting" @click="skip('/manager/setting')" :class="{on: '/manager/setting'===$route.path}">
        <svg class="icon" aria-hidden="true" @click="goBack">
          <use xlink:href="#icon-shezhi"></use>
        </svg>
        区域设置
      </div>
      <div class="temperature" @click="skip('/manager/temperature')" :class="{on: '/manager/temperature'===$route.path}">
        <svg class="icon" aria-hidden="true" @click="goBack">
          <use xlink:href="#icon-wendu"></use>
        </svg>
        温度比率调整
      </div>
      <div class="time" @click="skip('/manager/time')" :class="{on: '/manager/time'===$route.path}">
        <svg class="icon" aria-hidden="true" @click="goBack">
          <use xlink:href="#icon-shijian"></use>
        </svg>
        时间比率调整
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Slide",
  data() {
    return {
      path: '',
    }
  },
  created() {
    // console.log(this.$route.path);
    this.path = this.$route.path;
  },
  methods: {
    goBack() {
      this.$router.push('/home');
    },

    //跳转至指定路由
    skip(path) {
      //判断是否是当前路径
      if(path !== this.path) {
        this.path = path;
        this.$router.push(path);
      }
    }
  }
}
</script>

<style scoped>
  .slide {
    height: 100vh;
    width: 300px;
    background-color: #2c3e50;
    color: #fff;
  }

  .top {
    width: 100%;
    height: 50px;
    background-color: #34495e;
    display: flex;
  }

  .go-back {
    width: 30px;
    height: 100%;
    padding: 0 10px;

    cursor: pointer;
  }

  .top div {
    flex: 1;
    color: #fff;
    text-align: center;
    line-height: 50px;
  }

  .list div {
    height: 55px;
    padding-left: 50px;
    display: flex;
    /* justify-content: center; */
    align-items: center;
    cursor: pointer;
  }

  .list div:hover {
    background-color: #2d3436;
  }

  .on {
    background-color: #2d3436;
  }

  .list svg {
    width: 40px;
    height: 35px;
    /* margin-left: 50px; */
    margin-right: 20px;
  }
</style>