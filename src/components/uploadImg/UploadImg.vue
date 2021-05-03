<template>
  <div class="shape">
    <div class="content">
      <!-- 图片预览 -->
      <div class="pre">
        <img v-show="preImg" alt="" ref="pre">
      </div>

      <div class="bottom">
        <input name="path" readonly="true" class="show-path" :value="path">
        <a href="javascript:;" class="look-for">浏览...
				  <input name="img" type="file" accept="image/*" class="upload" ref="img" @change="getPath"/>
				</a>

        <div class="bottom-btn">
          <button class="confirm" @click="upLoad">上传</button>
          <button class="cancel" @click="closeWindow">取消</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { reqArea } from '@/api';
import { reqUpload } from '@/api/upload';

export default {
  name: "UploadImg",
  props: {
    // 区域信息
    item: {
      type: Object
    }
  },
  data() {
    return {
      preImg: false,      //是否展示图片预览
      path: '',           //上传文件的路径
      file: null,         //要上传的文件
    }
  },
  methods: {
    getPath(e) {
      //将要上传的文件传递给data
      this.file = e.target.files[0];

      //由于安全策略，文件路径会被替换成C:\fakepath\+文件名
      let path = this.$refs.img.value.split('\\');
      path = '.../' + path[path.length - 1]; 
      
      //图片预览功能
      const reader = new FileReader();
      //将文件转化为base64格式
      reader.readAsDataURL(this.file);
      //闭包保存组件实例
      const that = this;
      reader.onload = function(e) {
        console.log(that.$refs.pre);
        
        //预览图片展示
        that.$refs.pre.src = this.result;
        that.preImg = true;
      }
      
      //上传路径展示
      this.path = path;
    },

    //图片上传
    async upLoad() {
      //使用formData来构造上传数据
      const formData = new FormData();
      //添加数据并设置该上传数据的名称（name）
      formData.append('img', this.file);
      // console.log(formData.get("img"));
      //上传图片到服务器
      const result = await reqUpload(formData);
      //如果图片上传成功
      if(result.status === 0 ) {
        //设置图片的请求路径
        const imgPath = 'http://localhost:5000' + result.url;
        this.item.imgPath = imgPath;
        //更新区域信息
        await reqArea(this.item);
        this.$message.show('图片上传成功');
        this.closeWindow();
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
  .shape {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .3);
  }

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 330px;
    background-color: #fff;
    border-radius: 8px;
  }

  .pre {
    width: 220px;
    height: 200px;
    overflow: hidden;
    box-sizing: border-box;
    border: 1px solid #2d3436;
    left: 0;
    right: 0;
    margin: 20px auto;
  }

  .pre img{
    display: block;
    width: 100%;
    height: 100%;
  }

  .bottom {
    position: relative;
    display: flex;
    flex-wrap: wrap;
  }

  .show-path {
    margin-left: 20px;
    border: 1px solid #45aaf2;
  }

  .look-for {
    margin-left: 10px;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    position: relative;
    color: #fff;
    background-color: #45aaf2;
    border-radius: 4px;
    overflow: hidden;
  }

  .upload {
    opacity: 0;
    filter:alpha(opacity=0);/*设置此控件透明度为零，即完全透明针对IE*/
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .bottom-btn {
    width: 100%;
    height: 30px;
    line-height: 30px;
    margin-top: 16px;
    text-align: center;
  }

  .bottom-btn button {
    width: 70px;
    height: 30px;
    margin: 0 10px;
    border-radius: 4px;
    cursor: pointer;
  }

  .confirm {
    color: #fff;
    background-color: #45aaf2;
  }

  .confirm:hover {
    background-color: #2d98da;
  }

  .cancel {
    color: #fff;
    background-color: #ff4d4f;
  }

  .cancel:hover {
    background-color: #ff7875;
  }
</style>