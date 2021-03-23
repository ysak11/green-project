import axios from 'axios';
// 能发送异步ajax请求的函数模块

//将封装的请求函数导出
export default function ajax(url, data={}, type='GET', credential=true) {
  // 函数的返回值是promise对象
  axios.defaults.withCredentials = credential;
  return new Promise((resolve, reject) => {
    //存储axios请求返回的promise
    let promise;
    //发送get请求的情况
    if(type === 'GET') {
      promise = axios.get(url, {
        params: data
      })
    } else {
      //发送post请求的情况(其他类型请求不处理)
      promise = axios.post(url, data);
    }

    //等待请求的结果返回
    promise.then(response => {
      resolve(response.data);
    }).catch(error => {
      reject(error.message);
    })
  })
}

