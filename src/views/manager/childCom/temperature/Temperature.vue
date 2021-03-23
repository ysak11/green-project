<template>
  <div class="temperature">
    <div class="header">
      <span class="left">温度比率调整</span>
      <span class="right">调整范围为-20℃~40℃</span>
    </div>

    <div class="content">
      <form action="" class="form">
        <div v-for="(item, index) in arr" class="data">
          <span>{{index - 20}}℃</span>
          <input type="text" v-model="arr[index]">
        </div>
      </form>
      
    </div>

    <div class="bottom">
      <button class="save" @click="modifyRatio">保存</button>
      <button class="reset" @click="getRatio">重置</button>
    </div>
  </div>
</template>

<script>
import { reqGetRatio, reqUpdateRatio } from '@/api';

export default {
  name: "temperature",
  data() {
    return {
      // arr: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3,
      //       0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4, 
      //       0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 0.7, 
      //       0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 1.0, 
      //       1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 
      //       1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 1.8, 
      //       2.0]
      arr: [],
      id: null
    }
  },
  methods: {
    //发丝东请求获取比率
    async getRatio() {
      const result = await reqGetRatio('temperature');
      this.arr = result.data.ratio;
      this.id = result.data._id;
    },

    //发送请求修改比率
    async modifyRatio() {
      const result = await reqUpdateRatio(this.id, this.arr);
      if(result.status === 0) {
        this.$message.show('保存成功');
      } else {
        this.$message.show('保存失败');
      }
      
    }
  },
  created() {
    this.getRatio();
  }
}
</script>

<style scoped>
  .temperature {
    height: calc(100vh - 200px);
  }

  .header {
    position: relative;
  }

  .left{
    border-left: 2px solid #fff;
    padding-left: 10px;
    font-size: 18px;
  }

  .right {
    position: absolute;
    right: 10px;
    bottom: 0;
    padding-right: 10px;
    color: #ccc;
    font-size: 14px;
    border-right: 2px solid #ccc;
  }

  .content {
    height: 100%;
    margin-top: 20px;
    background-color: rgba(71, 80, 90, .3);
  }

  .form {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
  }

  .data {
    display: flex;
    align-items: center;
    width: 110px;
    height: 30px;
    overflow: hidden;
    margin-left: 20px;
    margin-bottom: 20px;
  }

  .data span {
    width: 40px;
    margin-right: 5px;
  }

  .data input {
    width: 50px;
    height: 25px;
    padding-left: 5px;
    border-radius: 4px;
  }

  .bottom {
    display: flex;
    justify-content: center;
  }

  .bottom button {
    width: 75px;
    height: 35px;
    margin-top: 10px;
    border-radius: 8px;
    cursor: pointer;
  }

  .save {
    margin-right: 50px;
    color: #fff;
    background-color: #1890ff;
  }

  .save:hover {
    background-color: #40a9ff;
  }

  .reset {
    color: #fff;
    background-color: #27ae60;
  }

  .reset:hover {
    background-color: #2ecc71;
  }
</style>