<template>
  <div class="sub-question">
    <div class="content">
      <div>问题描述：</div>
      <textarea v-model="describe" class="text"></textarea>
      <button class="confirm" @click="submit">确定</button>
      <button class="cancel" @click="closeWindow">取消</button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { reqArea, reqAddMessage } from '@/api';
import { getDate } from '@/utils';

export default {
  name: "SubQuestion",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      describe: '',
    }
  },
  computed: {
    ...mapState(['areaList', 'userInfo'])
  },
  methods: {
    async submit() {
      //问题不能为空
      if(this.describe.trim()) {
        //找到与覆盖物对应的那个区域
        const obj = this.areaList.find(item => item._id == this.item._opts.id);
        
        //将这个问题放到区域问题数组的最后面
        obj.question.push(this.describe);

        const date = getDate();
        const msg = {
          message: this.describe,
          status: 'waitting',
          date,
          areaName: obj.name,
          workerName: this.userInfo.username
        }

        // console.log(msg);
        //发送请求添加信息
        await reqAddMessage(msg);
        //更新信息列表
        this.$store.dispatch('getMessageList');
        
        this.$emit('closeWindow', 'sub');
      } else {
        this.$message.show('问题描述不能为空');
      }
      
    },

    //关闭窗口
    closeWindow() {
      this.$emit('closeWindow');
    }
  }
}
</script>

<style scoped>
  .sub-question {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .6);
    z-index: 3;
  }

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #2c3e50;

    width: 300px;
    height: 260px;
    box-sizing: border-box;
    padding: 15px;
    
    border-radius: 8px;
  }

  .text {
    width: 250px;
    height: 150px;
    box-sizing: border-box;
    margin: 15px 0;
    padding: 10px;
    border: none;
    outline: none;
    resize: none;

    border-radius: 4px;
  }
  
  .content button {
    display: inline-block;
    width: 75px;
    height: 25px;
    border: none;
    outline: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .confirm {
    margin-left: 80px;
    background-color: #1890ff;
  }

  .confirm:hover {
    background-color: #40a9ff;
  }

  .cancel {
    margin-left: 15px;
    background-color: #ff4d4f;
  }

  .cancel:hover {
    background-color: #ff7875;
  }
</style>