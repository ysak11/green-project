<template>
  <div>
    <div id="map"></div>
    <!-- 鼠标悬浮框 -->
    <div class="tip" ref="tip" v-show="showTip">{{name}}</div>
    <!-- 区域信息框 -->
    <area-info v-if="showMessage" :showItem="showItem" @closeWindow="closeWindow"/>
  </div>
</template>

<script>
import AreaInfo from 'components/areaInfo/AreaInfo';

import {mapState} from 'vuex';

import {INIT_MAP, INIT_MOUSE_TOOL, UPDATE_OVERLAY_GROUP} from 'store/mutation-type';
import { reqAddMessage, reqUpdateMessage } from '@/api';
import { getDate } from '@/utils';

export default {
  name: 'AMap',
  components: {
    AreaInfo
  },
  computed: {
    ...mapState(['map','areaList', 'showAreaInfo', 'messageList'])
  },
  data() {
    return {
      showTip: false,         //展示悬浮框
      name: "",               //悬浮框展示的区域名
      showMessage: false,     //展示信息框
      showItem: {},           //展示的区域信息
    }
  },
  watch: {
    areaList: {
      handler(newArr, oldArr) {
        //先移除所有区域再重新绘制区域
        this.map.clearMap();

        //存储生成的区域覆盖物，以便后面生成覆盖物群组
        const overlay = [];
        newArr.forEach(item => {
          let color = '';
          //定义不同种类区域的填充颜色
          switch (item.type) {
            case '行道树': color = '#27ae60'; break;
            case '草坪': color = '#55efc4'; break;
            case '观赏植株': color = '#fd79a8'; break;
          }

          let polygon = new AMap.Polygon({
            id: item._id,
            name: item.name,
            type: item.type,
            path: item.path,
            fillColor: color,   // 多边形填充颜色
            borderWeight: 2,    // 线条宽度，默认为 1
            fillOpacity: 0.8,   //填充透明度
            cursor: 'pointer',  //鼠标样式
          });

          //点击事件，展示区域信息
          polygon.on('click', (e) => {
            if(this.showAreaInfo) {
              //传入区域信息并打开信息框
              this.showItem = item;
              this.showMessage = true;
            }
          })
          
          //鼠标的移入移出事件
          polygon.on('mouseover', (e) => {
            //显示悬浮框
            this.showTip = true;
            //改变悬浮框显示的名称
            this.name = item.name;

            //记录起始坐标
            let firstX = e.originEvent.pageX;
            let firstY = e.originEvent.pageY;

            //开启硬件加速，设置起始位置，10和20是鼠标指针大小的偏移量
            this.$refs.tip.style.transform = `translateZ(0)`;
            this.$refs.tip.style.left = firstX + 10 + 'px';
            this.$refs.tip.style.top = firstY + 20 + 'px';
            polygon.on('mousemove', (e) => {
                let x = e.originEvent.pageX - firstX;
                let y = e.originEvent.pageY - firstY;
                this.$refs.tip.style.transform = `translate(${x}px, ${y}px)`;
            });

            //恢复透明度到1
            polygon.setOptions({
              fillOpacity: 1
            })
          })
          polygon.on('mouseout', () => {
            this.showTip = false;
            //设置透明度
            polygon.setOptions({
              fillOpacity: 0.7
            })
          })


          //获取区域中心点
          const center = this.map.getFitZoomAndCenterByBounds(polygon.getBounds())[1];
          const centerPoint = [center.lng, center.lat];
          polygon.setOptions({centerPoint});

          // 现水量低于警告水量的标志变量，如果当前水量低于水量报警值则设为true
          item.lowWarn = false;
          if(Number(item.warnValue) >= Number(item.waterQuantity)) {
            //设置警告属性为true，并把区域染红
            item.lowWarn = true,

            polygon.setOptions({
              fillColor: 'red'
            })
          }


          // //查询有关该区域的预警消息
          // const result = this.messageList.find(msg => msg.areaName === item.name && msg.status === "warn");
          // console.log(result);
          // //在低于预警水量时判断需不需要发送预警信息
          // if(item.lowWarn) {
          //   //现在没有生效预警信息，所以需要重新发送
          //   if(!result) {
          //     //发送预警消息
          //     console.log(item);
              
          //     this.sendWarn(item);
          //   }
          // } else {
          //   //在不低于预警水量时还要检查之前是否存在预警消息，如果有则把该消息的状态改为warned，代表已过期
          //   if(result) {
          //     this.modifyWarn(result);
          //   }
          // }

          //覆盖物的面积（平方米）
          const area = polygon.getArea();
          //将面积属性添加到区域上
          item.area = area;
          
          // polygon)
          //将覆盖物加入数组
          overlay.push(polygon);
          //将区域图层添加到地图上
          this.map.add(polygon);
        })

        //最终生成覆盖物群组，并更新vuex中的数据
        const overlayGroup = new AMap.OverlayGroup(overlay);
        this.$store.commit(UPDATE_OVERLAY_GROUP, overlayGroup);

        // this.$store.dispatch('getAreaList');
      },
      deep: true
    }
  },
  methods: {
    // 初始化地图
    initMap() {
      //创建地图实例
      let map = new AMap.Map('map', {
        zoom: 17,//级别
        center: [113.549843, 34.831152],//中心点坐标
        viewMode:'3D',//使用3D视图
        mapStyle: 'amap://styles/fresh', //设置地图的显示样式
      });;
      
      //使用的插件需要到Index.html中添加插件的名字
      //添加比例尺和工具条插件
      map.addControl(new AMap.ToolBar({
        position: {
          bottom: '30px',
          right: '10px',
      }}));
      map.addControl(new AMap.Scale());

      //添加鼠标绘制工具
      let mouseTool = new AMap.MouseTool(map); 

      //获取区域列表
      this.$store.dispatch('getAreaList');
      //获取比率列表
      this.$store.dispatch('getRatioList');
      //更新设备列表
      // this.$store.dispatch('reqDeviceList');

      //将地图实例和鼠标绘制工具发送给vuex
      this.$store.commit(INIT_MAP, map);
      this.$store.commit(INIT_MOUSE_TOOL, mouseTool);
    },

    //关闭信息框
    closeWindow() {
      this.showMessage = false;
    },

    //发送预警消息
    // async sendWarn(item) {
    //   const date = getDate();
    //   const message = `区域 ${item.name} 水量低于预警水量，请尽早派遣员工进行处理！`
    //   const msg = {
    //     message,
    //     status: 'warn',
    //     date,
    //     type: 'water',
    //     areaName: item.name,
    //     workerName: null
    //   }
    //   //将消息发送给服务器
    //   console.log(msg);
      
    //   await reqAddMessage(msg);
    // },

    // //修改预警消息（让其过期）
    // async modifyWarn(msg) {
    //   msg.status = 'warned';
    //   // console.log(msg);
      
    //   let result = await reqUpdateMessage(msg);
    // }
  },
  mounted() {
    this.initMap();
  }
}
</script>

<style scoped>
  #map {
    /* width: 100%; */
    width: 100vw;
    height: calc(100vh - 62px);
  }

  .tip {
    position: fixed;
    font-size: 14px;
    width: auto;
    min-width: 5rem;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: .25rem;
    color: #111213;
    background-color: white;
    box-shadow: 0 2px 6px 0 rgb(114 124 245 / 50%);
    z-index: 5;
  }
  
</style>