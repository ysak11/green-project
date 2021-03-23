<template>
  <!-- 区域信息框 -->
    <div class="warpper">
      <div class="container">

        <!-- 图片上传按钮 -->
        <button class="btn-upload" @click="openUpload"  v-if="userInfo.permission >= '3'">图片上传</button>
        <!-- 关闭按钮 -->
        <svg class="icon close" aria-hidden="true" @click="close">
          <use xlink:href="#icon-guanbi2"></use>
        </svg>

        <!-- 头部信息栏 -->
        <div class="header">     
          <!-- 区域图片 -->
          <img :src="showItem.imgPath ? showItem.imgPath : require('../../assets/test.jpg')" alt="" class="photo">

          <!-- 区域信息 -->
          <div class="describe">
            <div>区域名称：{{showItem.name}}</div>
            <div>种类：{{showItem.type}}</div>
            <div>具体植株：{{showItem.plant}}</div>
            <div>面积：{{showItem.area}}㎡</div>
            <div>每日耗水量：{{showItem.hourConsume}}</div>
            <div>评论数：{{commentLength}}</div>
          </div>
        </div>

        <!-- 用户评论 -->
        <div class="comment">
          <div class="comment-head">用户评论</div>
          <div v-if="commentLength === 0" class="noBody">暂时还没有人写下评论...</div>
          <div v-else class="content">
            <div v-for="(item, index) in comment" :key="index">
              {{item.comment}}
              <div>
                <span class="good">
                  <svg class="icon" aria-hidden="true" @click="iLikeIt(item)">
                    <use xlink:href="#icon-dianzan1"></use>
                  </svg>
                  {{item.likes}}
                </span>
              </div>
            </div>

            <!-- <div>“其实很久前，爹就身体抱恙，本该静养。奈何朝廷内忧外患，忧思成疾，才把身体拖累到现在的情况。”
              <div>
                <span class="good">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dianzan1"></use>
                  </svg>
                  999
                </span>
              </div>
            </div>

            <div>“司天监的术士说，这是心病，心病就得心药来医，父亲病倒前，忧虑三件事：青州战事、流民、西域佛门。
              <div>
                <span class="good">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dianzan1"></use>
                  </svg>
                  999
                </span>
              </div>
            </div>

            <div> 廷推，是一种由皇帝召来，群臣商议的推举制度。当有重要职位出缺时，就会进行廷推。
              <div>
                <span class="good">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dianzan1"></use>
                  </svg>
                  999
                </span>
              </div>
            </div> -->

          </div>

          <div class="bottom" @click="openWindow">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiezuo"></use>
            </svg>
            我也要写评论
          </div>
        </div>

      </div>

    <!-- 添加评论框 -->
    <div class="sub-comment" v-if="showSub">
      <div>
        <div>请写下您的评论：</div>
        <textarea v-model="describe" class="text"></textarea>
        <button class="confirm" @click="submit">确定</button>
        <button class="cancel" @click="closeWindow">取消</button>
      </div>
    </div>

    <!-- 图片上传框 -->
    <upload-img :item="showItem" v-if="showUpload" @closeWindow="closeWindow"/>

  </div>
</template>

<script>
import UploadImg from 'components/uploadImg/UploadImg';

import { reqArea } from '@/api';
import { mapState } from 'vuex';

export default {
  name:"AreaInfo",
  components: {
    UploadImg
  },
  props: {
    showItem: {
      type: Object
    }
  },
  data() {
    return {
      showSub: false,         //展示添加评论框
      describe: '',           //评论内容
      showUpload: false,       //显示图片上传窗口
    }
  },
  methods:{
    //关闭窗口
    close() {
      this.$emit('closeWindow');
    },

    //打开图片上传窗口
    openUpload() {
      this.showUpload = true;
    },

    //点赞功能
    async iLikeIt(comment) {
      //找到对应的评论
      const data = this.showItem.comment.find(item => item === comment);
      //如果该用户已经点过赞
      if(data.likeUsers.find(name => name === this.userInfo.username)) {
        this.$message.show('您已经点赞过该评论了！');
      } else {
        //还没点赞过，将用户名加入数组，点赞数加一
        data.likeUsers.push(this.userInfo.username);
        data.likes = Number(data.likes) + 1;
        //更新区域数据
        await reqArea(this.showItem);
      }
    },

    //打开评论框
    openWindow() {
      this.showSub = true;
    },

    //添加评论
    async submit() {
      const data = this.describe.trim();
      if(data) {
        //创建评论的结构
        const obj = {};
        //评论数据
        obj.comment = data;
        //点赞人数
        obj.likes = 0;
        //点赞此评论的用户名
        obj.likeUsers = [];
        //将该评论加入评论数组
        this.showItem.comment.push(obj);

        const result = await reqArea(this.showItem);
        if(result.status === 0) {
          this.$message.show('添加评论成功');
          this.closeWindow();
        } else {
          this.$message.show('添加评论异常, 请重新尝试');
        }
      } else {
        this.$message.show('评论不能为空')
      }
    },

    //关闭评论框和图片上传框
    closeWindow() {
      this.describe = '';
      this.showSub = false;
      this.showUpload = false;
    }
  },
  computed: {
    ...mapState(['userInfo']),
    //评论数
    commentLength() {
      return this.showItem.comment ? this.showItem.comment.length : 0;
    },

    //随机显示评论
    comment() {
      //评论数小于等于3时直接返回
      if(this.commentLength <= 3) {
        return this.showItem.comment;
      } else {
        const result = [];
        //进行3次随机抽取
        for(let i = 0; i < 3; i++) {
          //获取0到length - 1之间的整数
          const index = Math.floor(Math.random() * this.commentLength);
          //获取指定索引的评论数据
          const data = this.showItem.comment[index];
          //如果该评论已经加入过结果数据，则重新寻找
          if(result.find(item => item.comment === data.comment)) {
            i--;
          } else {
            result.push(data);
          }
        }
        return result;
      }
    }
  }
}
</script>

<style scoped>
  .warpper {
    position: fixed;
    z-index: 6;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0, 0, 0, .2);
    color: #f5f6fa;
  }

  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    box-sizing: border-box;
    background-color: #3c6382;
    border-radius: 8px;
    padding: 30px;
    display: flex;
    flex-direction: column;
  }

  .btn-upload {
    position: absolute;
    top: 30px;
    left: -40px;
    width: 40px;
    height: 100px;
    color: #fff;
    background-color: #27ae60;
    border-radius: 8px 0 0 8px;
    cursor: pointer;
  }

  .btn-upload:hover {
    background-color: #2ecc71;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    color: #c23616;
    cursor: pointer;
  }

  .close:hover {
    color: #e84118;
  }

  .header {
    height: 250px;
    overflow: hidden;
    display: flex;
    
  }

  .photo {
    height: 250px;
    width: 300px;
  }

  .describe {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .describe > div {
    flex: 1;
    display: flex;
    align-items: center;
    margin-left: 40px;
  }

  .comment {
    flex: 1;
    margin-top: 10px;
  }

  .comment-head {
    font-size: 20px;
    font-weight: bold;
  }

  .noBody {
    margin-top: 10px;
    color: #ccc;
    font-size: 14px;
  }

  .content > div {
    margin: 10px 0;
    height: 65px;
    box-sizing: border-box;
    padding: 5px;
    border-radius: 8px;
    background-color: #ffda79;
    color: #2d3436;
    overflow: hidden;
    position: relative;
  }

  .good {
    position: absolute;
    bottom: 5px;
    right: 16px;
  }

  .good svg {
    cursor: pointer;
  }

  .bottom {
    position: absolute;
    right: 30px;
    bottom: 10px;
    height: 36px;
    line-height: 36px;
    padding: 4px;
    border-radius: 6px;
    /* color: black; */
    cursor: pointer;
    background-color: #27ae60;
  }

  .bottom:hover {
    background-color: #2ecc71;
  }

  .sub-comment {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .6);
    z-index: 3;
  }

  .sub-comment > div {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #2c3e50;

    width: 300px;
    height: 200px;
    box-sizing: border-box;
    padding: 15px;
    
    border-radius: 8px;
  }

  .text {
    width: 250px;
    height: 90px;
    box-sizing: border-box;
    margin: 15px 0;
    padding: 10px;
    border: none;
    outline: none;
    resize: none;

    border-radius: 4px;
  }
  
  .confirm, .cancel {
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