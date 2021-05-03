import axios from 'axios';

export const reqUpload = (data) => {
  return new Promise((resolve, reject) => {
    const promise = axios.post('http://localhost:5000/upload/img', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    //等待请求的结果返回
    promise.then(response => {
      resolve(response.data);
    }).catch(error => {
      reject(error.message);
    })
  })
}

export const reqMulUpload = (array) => {
  return new Promise((resolve, reject) => {
    const promise = axios.post('http://localhost:5000/upload/imgs', array, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    //等待请求的结果返回
    promise.then(response => {
      resolve(response.data);
    }).catch(error => {
      reject(error.message);
    })
  })
}