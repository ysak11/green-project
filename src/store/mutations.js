import {
  RECEIVE_USER_INFO,
  CLEAR_USER_INFO,
  INIT_MAP,
  INIT_MOUSE_TOOL,
  UPDATE_AREA_LIST,
  UPDATE_OVERLAY_GROUP,
  UPDATE_WEATHER_INFO,
  GET_RATIO_LIST,
  CONTROL_AREA_INFO,
  UPDATE_MESSAGE_LIST
} from './mutation-type'

//对象中的属性名使用的是变量，所以要用[]括起来
export default {
  //接收用户信息，传过来的对象中的data是用户数据
  [RECEIVE_USER_INFO] (state, {data}) {
    state.userInfo = data;
  },

  //清除用户信息
  [CLEAR_USER_INFO] (state) {
    state.userInfo = {};
  },

  //初始化地图实例
  [INIT_MAP] (state, map) {
    state.map = map;
  },

  //初始化鼠标绘制工具
  [INIT_MOUSE_TOOL] (state, mouseTool) {
    state.mouseTool = mouseTool;
  },

  //更新区域列表
  [UPDATE_AREA_LIST] (state, list) {
    state.areaList = list;
  },

  //更新覆盖物群组
  [UPDATE_OVERLAY_GROUP] (state, group) {
    state.overlayGroup = group;
  },

  //更新天气信息
  [UPDATE_WEATHER_INFO] (state, info) {
    state.weatherInfo = info;
  },

  //更新比率列表
  [GET_RATIO_LIST] (state, list) {
    state.ratioList = list;
  },


  //点击显示区域信息功能的控制
  [CONTROL_AREA_INFO] (state, bool) {
    state.showAreaInfo = bool;
  },


  //更新信息列表
  [UPDATE_MESSAGE_LIST] (state, list) {
    state.messageList = list;
  }
}