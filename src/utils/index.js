// 获取cookie
export function getCookie(name) {
  // document.cookie实例： userid=j%3A%22603304bd4e7e3c2180cca832%22; aaaa=sdddsds
  //能获取的cookie数大于0
  if(document.cookie.length > 0) {
    //获取该cookie在字符串中的起始位置
    let start = document.cookie.indexOf(name + '=');
    //如果该cookie存在
    if(start !== -1) {
      //因为要获取的数据不包括cookie的名字，所以开始位置还要跳过名字和=号
      start = start + name.length + 1;
      //检索结束位置，每个cookie以';'分隔，indexOf的第二个参数是开始检索的位置
      let end = document.cookie.indexOf(';', start);
      //有可能查找的cookie为最后一个，所以没有;了
      if(end === -1) {
        end = document.cookie.length;
      }
      return document.cookie.slice(start, end);
    }
  }
  //查找失败，返回空字符串
  return '';
}

//设置cookie
export function setCookie(c_name,value,expire) {
  var date=new Date();
  date.setSeconds(date.getSeconds()+expire);
  document.cookie=c_name+ "="+value+"; expires="+date.toGMTString();
  //console.log(document.cookie)
}


//将小于10的数字前面加个0
function twoFix(num) {
  let temp = num;
  if(parseInt(temp) < 10) {
    temp = '0' + temp;
  }
  return temp;
}

//获取日期
export function getDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  // console.log(`${year}/${month}/${day}  ${hour}:${minutes}:${seconds}`);
  //将不足两位数的数字前面补个0
  return `${year}/${twoFix(month)}/${twoFix(day)} ${twoFix(hour)}:${twoFix(minutes)}:${twoFix(seconds)}`;
}


//测定时间范围
export function dateRange(time, mode) {

  //对time的格式进行处理  2021/05/13 22:41:47
  let temp1 = time.split(' '); // 2021/05/13
  let temp2 = temp1[0].split('/');  // 2021   05   13

  //给出的目标的时间
  let year = temp2[0];
  let month = temp2[1];
  let day = temp2[2];
  let target = '' + year + month + day;
  // console.log(target);
  

  //获取当前的日期
  const date = new Date();
  const nowYear = date.getFullYear();
  const nowMonth = twoFix(date.getMonth() + 1);
  const nowDay = twoFix(date.getDate());
  let now = '' + nowYear + nowMonth + nowDay;
  // console.log(now);

  
  //最早的日期
  let old = '';
  let oldYear = nowYear;
  let oldMonth = parseInt(date.getMonth() + 1);

  //一个月内
  if(mode === 1) {
    oldMonth = oldMonth - 1;
    //此时应为上一年的12月
    if(oldMonth <= 0) {
      oldMonth = 12;
      oldYear--;
    }
  } else if(mode === 2) {
    //半年内
    oldMonth = oldMonth - 6;
    if(oldMonth <= 0) {
      oldMonth = 12 + oldMonth;
      oldYear--;
    }
  } else if(mode === 3) {
    //一年内
    oldYear--;
  }


  oldMonth = twoFix(oldMonth);
  old = '' + oldYear + oldMonth + nowDay;
  // console.log(old);
  
  
  //在指定的范围内，将字符串化为数字比较大小
  if(parseInt(old) <= parseInt(target) && parseInt(now) >= parseInt(target)) {
    return true;
  } 
  return false;
  
}



