<template>
  <div class="shape">
    <div class="add-info">
      <h3>修改密码</h3>
      <form action="" >
        <div class="message">
          <div>请输入旧密码:</div>
          <input type="text" v-model="oldPassword">
        </div>
        <div class="message">
          <div>请输入新密码:</div>
          <input type="password" v-model="newPassword">
        </div>
        <div class="message">
          <div>请再次输入密码:</div>
          <input type="password" v-model="rePassword">
        </div>
      </form>
      <div class="bottom">
        <button class="btn-confirm" @click="confirmClick">确定</button>
        <button class="btn-cancel" @click="cancelClick">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { reqConfirm, reqModifyPassword} from '@/api';

export default {
  name: "ModifyPassword",
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      rePassword: '',
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  methods: {
    //点击确定事件
    async confirmClick() {
      const oldP = this.oldPassword.trim();
      const newP = this.newPassword.trim();
      const reP = this.rePassword.trim();
      //不能为空
      if(!oldP || !newP || !reP) {
        this.$message.show('密码不能为空');
      } else if(newP !== reP){
        //两次密码要一致
        this.$message.show('新密码不一致');
      } else {
        //确认密码是否正确
        const result = await reqConfirm(this.userInfo._id, oldP);
        console.log(result);
        
        if(result.status === 0) {
          await reqModifyPassword(this.userInfo._id, newP);
          this.$message.show('密码修改成功');
          this.$emit('closeWindow');
        } else {
          this.$message.show('原密码错误')
        }
      }
    },

    //点击取消事件
    cancelClick() {
      this.$emit('closeWindow');
    }
  }
}
</script>

<style scoped>
  .shape {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, .4);
    z-index: 3;
  }

  .add-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 270px;
    height: 300px;
    background-color: #2c3e50;
    border-radius: 8px;
    color: #bdc3c7;
    overflow: hidden;
  }

  h3 {
    padding-left: 15px;
  }

  .message {
    margin-bottom: 15px;
    font-size: 12px;
    padding-left: 15px;
  }

  .message div {
    padding-bottom: 5px;
  }

  .message input {
    display: inline-block;
    width: 200px;
    height: 20px;
    border-radius: 4px;
    padding: 4px 10px;
  }

  .message select {
    display: inline-block;
    width: 220px;
    height: 28px;
    border-radius: 4px;
    outline: none;
  }

  .bottom {
    padding-top: 5px;
    padding-left: 15px;
  }

  .bottom button{
    display: inline-block;
    width: 80px;
    height: 30px;
    cursor: pointer;
    border: none;
    outline: none;
    border-radius: 4px;
    color: #fff;
  }

  .btn-confirm {
    background-color: #1890ff;
  }

  .btn-confirm:hover {
    background-color: #40a9ff;
  }

  .btn-cancel {
    margin-left: 60px;
    background-color: #ff4d4f;
  }

  .btn-cancel:hover {
    background-color: #ff7875;
  }
</style>