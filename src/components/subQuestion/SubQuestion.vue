<template>
  <div class="sub-question">
    <div class="content">
      <div class="header">
        <span>问题描述：</span>
        <textarea v-model="describe" class="text"></textarea>
      </div>
      <div class="center">
        <div class="look-for">
          <div>上传图片</div>
          <input name="img" type="file" accept="image/*" class="upload" ref="img" @change="getPath"/>
        </div>
        <div class="preview">
          <img src="" alt="" ref="img1">
          <img src="" alt="" ref="img2">
          <img src="" alt="" ref="img3">
        </div>
      </div>
      
      <div class="bottom">
        <button class="confirm" @click="submit">上报</button>
       <button class="cancel" @click="closeWindow">取消</button>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import { reqArea, reqAddMessage } from '@/api';
import { reqMulUpload } from '@/api/upload';
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
      describe: '',             //问题描述
      count: 0,                 //图片数量计数
      imgArr: [],               //图片存储数组
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
        //图片请求路径数组
        let imgArr = await this.upLoad();

        const date = getDate();
        const msg = {
          message: this.describe,
          status: 'waitting',
          date,
          areaName: obj.name,
          workerName: this.userInfo.username,
          imgs: imgArr
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
    },

    //选择图片
    getPath(e) {
      if(this.count > 2) {
        this.$message.show('图片数量已达到上限');
        return;
      }
      this.count++;
      //将要上传的文件传递给data
      let file = e.target.files[0];
      //放入数组存储
      this.imgArr.push(file);
      //图片预览功能
      const reader = new FileReader();
      //将文件转化为base64格式
      reader.readAsDataURL(file);
      //闭包保存组件实例
      const that = this;
      reader.onload = function(e) {
        //预览图片展示
        switch(that.count) {
          case 1: that.$refs.img1.src = this.result; break;
          case 2: that.$refs.img2.src = this.result; break;
          case 3: that.$refs.img3.src = this.result; break;
        }
      }
    },

    //图片上传
    async upLoad() {
      //使用formData来构造上传数据
      const formData = new FormData();
      let len = this.imgArr.length; 
      //没有上传图片时直接返回空数组
      if(len === 0) {
        return [];
      }
      //添加数据并设置该上传数据的名称（name）
      for(let i = 0; i < len; i++) {
        formData.append('imgs', this.imgArr[i]);
      }
      // formData.append('imgs', this.imgArr);
      // console.log(formData.get("imgs"));
      //上传图片到服务器
      const result = await reqMulUpload(formData);
      //如果图片上传成功
      if(result.status === 0 ) {
        // console.log(result.urlArr);
        let arr = result.urlArr;
        for(let i = 0, len = arr.length; i < len; i++) {
          arr[i] = 'http://121.41.45.147:5000' + arr[i];
        }
        return arr;
      } else {
        this.$message.show('图片上传失败');
      }
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

    width: 400px;
    height: 260px;
    box-sizing: border-box;
    padding: 15px;
    border-radius: 8px;

    display: flex;
    flex-direction: column;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .header span {
    width: 100px;
  }

  .text {
    flex: 1;
    height: 80px;
    box-sizing: border-box;
    padding: 10px;
    border: none;
    outline: none;
    resize: none;

    border-radius: 4px;
  }
  
  .center {
    margin-top: 10px;
    flex: 4;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .look-for {
    margin-top: 20px;
    width: 90px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: relative;
    color: #fff;
    background-color: #27ae60;
    border-radius: 4px;
  }

  .look-for:hover {
    background-color: #2ecc71;
  }

  .upload {
    opacity: 0;
    filter:alpha(opacity=0);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .preview {
    flex: 1;
    display: flex;
    height: 100%;
    margin-left: 10px;
  }

  .preview img {
    flex: 1;
    height: 90px;
    width: 85px;
    margin-right: 5px;
    box-sizing: border-box;
    border: 1px solid #000;
  }

  .bottom {
    flex: 1;
  }

  .content button {
    position: absolute;
    display: inline-block;
    width: 75px;
    height: 25px;
    bottom: 10px;
    border: none;
    outline: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .confirm {
    right: 100px;
    background-color: #1890ff;
  }

  .confirm:hover {
    background-color: #40a9ff;
  }

  .cancel {
    right: 15px;
    background-color: #ff4d4f;
  }

  .cancel:hover {
    background-color: #ff7875;
  }
</style>