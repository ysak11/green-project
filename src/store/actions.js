import {
  UPDATE_AREA_LIST,
  UPDATE_WEATHER_INFO,
  GET_RATIO_LIST,
  UPDATE_MESSAGE_LIST,
  UPDATE_DEVICE_LIST
} from './mutation-type';

import {
  reqAreaList,
  reqRatioList,
  reqMessageList,
  reqDeviceList
} from '@/api';

import {nowWeather} from '@/api/weather';

export default {
  //异步获取区域列表
  async getAreaList({commit}) {
    const result = await reqAreaList();
    //提交mutation更新数据
    if(result.status === 0) {
      const list = result.data;
      commit(UPDATE_AREA_LIST, list);
    }
  },

  //异步获取实况天气
  async getNowWeather({commit}) {
    const result = await nowWeather();
    // console.log(result);
    if(result.code === '200') {
      const info = {};
      //这个小时天气的数据
      const hour = result.hourly[0];

      //当前温度
      info.temp = hour.temp;
      //天气状况和图标代码
      info.icon = hour.icon;
      //降水量
      info.precip = hour.precip;
      //状况描述
      info.text = hour.text;

      //之后24小时的天气
      info.future = result.hourly;

      commit(UPDATE_WEATHER_INFO, info);
    }
  },

  //异步获取比率列表
  async getRatioList({commit}) {
    const result = await reqRatioList();
    
    if(result.status === 0) {
      const list = result.data;
      commit(GET_RATIO_LIST, list);
    }
  },


  //异步获取信息列表
  async getMessageList({commit}) {
    const result = await reqMessageList();
    if(result.status === 0) {
      const list = result.data;
      commit(UPDATE_MESSAGE_LIST, list);
    }
  },

  //异步获取设备列表
  async reqDeviceList({commit}) {
    const result = await reqDeviceList();
    //提交mutation更新数据
    if(result.status === 0) {
      const list = result.data;
      commit(UPDATE_DEVICE_LIST, list);
    }
  },
}