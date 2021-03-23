import ajax from './ajax';

const BASEURL = 'http://localhost:5000';


//发送登录请求
export const reqLogin = (username, password, isCookie=false) => ajax(BASEURL + '/user/login', {username, password, isCookie}, 'POST');

//使用id获取用户信息
export const reqUser = () => ajax(BASEURL + '/user');

//获取指定类型用户列表
export const reqUserList = (permission) => ajax(BASEURL + '/user/list', {permission}, 'POST');

//模糊查询用户列表
export const reqFuzzySearch = (permission, keyword) => ajax(BASEURL + '/user/fuzzySearch', {permission, keyword}, 'POST');

//发送注册请求
export const reqRegister = (username, password, permission) => ajax(BASEURL + '/user/register', {username, password, permission}, 'POST');

//根据id删除指定用户
export const reqDeleteUser = (userId) => ajax(BASEURL + '/user/delete', {userId}, 'POST');

//确认密码是否正确
export const reqConfirm = (id, password) => ajax(BASEURL + '/user/password', {id, password}, 'POST');

//修改密码
export const reqModifyPassword = (id, password) => ajax(BASEURL + '/user/modify', {id, password}, 'POST');



//发送添加区域请求
export const reqAddArea = (path, name, type, plant, warnValue, waterTop, waterQuantity, hourConsume) => 
  ajax(BASEURL + '/area/add', {path, name, type, plant, warnValue, waterTop, waterQuantity, hourConsume}, 'POST');

//获取区域列表
export const reqAreaList = () => ajax(BASEURL + '/area/list');

//多条件模糊查询区域列表
export const reqMulFuzzy = (nameWord, typeWord) => ajax(BASEURL + '/area/fuzzySearch', {nameWord, typeWord}, 'POST');

//更新水量
export const reqWaterVal = (id, val) => ajax(BASEURL + '/area/updateWater', {id, val}, 'POST');

//更新区域信息
export const reqArea = (area) => ajax(BASEURL + '/area/update', area, 'POST');

//删除区域
export const reqDeleteArea = (id) => ajax(BASEURL + '/area/delete', {id}, 'POST');
//批量更新区域
// export const reqUpdateList = (areaList) => ajax(BASEURL + '/area/updateList', areaList, 'POST');



//添加比率
export const reqAddRatio = (name, ratio) => ajax(BASEURL + '/ratio/add', {name, ratio}, 'POST');

//获取比率
export const reqGetRatio = (name) => ajax(BASEURL + '/ratio/get', {name}, 'POST');

//获取比率列表
export const reqRatioList = () => ajax(BASEURL + '/ratio/list');

//更新比率
export const reqUpdateRatio = (id, ratio) => ajax(BASEURL + '/ratio/update', {id, ratio}, 'POST');



//获取信息列表
export const reqMessageList = () => ajax(BASEURL + '/message/list');

//添加信息
export const reqAddMessage = (obj) => ajax(BASEURL + '/message/add', obj, 'POST');

//更新信息
export const reqUpdateMessage = (obj) => ajax(BASEURL + '/message/update', obj, 'POST');

//查找信息
export const reqFindMessage = () => ajax(BASEURL + '/message/update', obj, 'POST');