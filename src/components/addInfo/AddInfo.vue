<template>
  <div class="shape">
    <div class="add-info">
      <h3>详细设定</h3>
      <form action="" >
        <div class="message">
          <div>区域别名:</div>
          <input type="text" v-model="name">
        </div>
        <div class="message">
          <div>种类:</div>
          <select v-model="type">
            <option value="行道树">行道树</option>
            <option value="草坪">草坪</option>
            <option value="观赏植株">观赏植株</option>
          </select>
        </div>
        <div class="message">
          <div>具体植株:</div>
          <input type="text" v-model="plant">
        </div>
        <div class="message">
          <div>水量报警值:</div>
          <input type="text" v-model="warnValue">
        </div>
        <div class="message">
          <div>水量上限:</div>
          <input type="text" v-model="waterTop">
        </div>
        <div class="message">
          <div>现在水量:</div>
          <input type="text" v-model="waterQuantity">
        </div>
        <div class="message">
          <div>每日耗水量:(以温度20℃为参照)</div>
          <input type="text" v-model="hourConsume"> 
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
import {reqAddArea, reqArea} from '@/api';

export default {
  name: "AddInfo",
  props: {
    //新增模式还是修改模式
    mode: {
      type: String,
      default: 'add'
    },
    //修改模式时传入的区域对象
    area: {
      type: Object,
    },
    //新增模式传入的绘图路径
    path: {
      type: Array,
    }
  },
  data() {
    return {
      name: null,          //区域别名
      type: null,          //绿化种类
      plant: null,         //具体植株
      warnValue: null,     //水量报警值
      waterTop: null,      //水量存储上限
      waterQuantity: null, //现在水量
      hourConsume: null,   //每小时耗水量（以温度20℃为参考)
      areaObj: null        //修改模式下的区域对象
    }
  },
  created() {
    //如果是修改模式，则将数据传递给组件的data
    if(this.mode === 'modify') {
      this.name = this.area.name;
      this.type = this.area.type;
      this.plant = this.area.plant;
      this.warnValue = this.area.warnValue;
      this.waterTop = this.area.waterTop;
      this.waterQuantity = this.area.waterQuantity;
      this.hourConsume = this.area.hourConsume;

      //props的值不能直接修改，所以得转存成data里的数据
      this.areaObj = this.area;
    }
  },
  methods: {
    //点击确定事件
    async confirmClick() {
      //所有信息都填写完成了
      if(this.name && this.type && this.plant && this.warnValue && this.waterTop && this.waterQuantity && this.hourConsume) {
        //新增模式发送请求
        if(this.mode === 'add') {
          const result = await reqAddArea(this.path, this.name, this.type, this.plant, this.warnValue, this.waterTop,  this.waterQuantity, this.hourConsume);

          if(result.status === 0) {

            this.$message.show('添加区域完成');
            //更新区域列表
            await this.$store.dispatch('getAreaList');
            
            this.$emit('closeWindow');
          } else {
            this.$message.show(result.msg);
          }
        } else {
          //将修改的数据重新赋予area对象
          this.areaObj.name = this.name;
          this.areaObj.type = this.type;
          this.areaObj.plant = this.plant;
          this.areaObj.warnValue = this.warnValue;
          this.areaObj.waterTop = this.waterTop;
          this.areaObj.waterQuantity = this.waterQuantity;
          this.areaObj.hourConsume = this.hourConsume;
          //修改模式
          const result = await reqArea(this.area);
          if(result.status === 0) {
            this.$message.show('区域信息修改完成');
            //更新区域列表
            await this.$store.dispatch('getAreaList');
            this.$emit('closeWindow');
          } else {
            this.$message.show(result.msg);
          }
        }

      } else {
        this.$message.show('还有信息尚未填写');
      }
    },

    //点击取消事件
    async cancelClick() {
      //关闭该窗口
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
    background-color: rgba(0, 0, 0, .6);
    z-index: 3;
  }

  .add-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 270px;
    height: 540px;
    background-color: #2c3e50;
    border-radius: 8px;
    color: #bdc3c7;
    overflow: hidden;
  }

  h3 {
    padding-left: 15px;
  }

  .message {
    /* display: flex;
    flex-direction: column; */
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
    /* display: flex;
    justify-content: space-around; */
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
    /* margin-right: 15px; */
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