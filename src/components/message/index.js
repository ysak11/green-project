import Message from './Message';

const obj = {};

obj.install = function (Vue) {
  //1、创建组件构造器
  const messageContructor = Vue.extend(Message);
  //2、创建组件对象实例
  const message = new messageContructor();
  //3、将组件对象手动挂载到某一个元素中
  message.$mount(document.createElement('div'));
  //4、toast.$el对应的就是div
  document.body.appendChild(message.$el);
  
  //5、挂载到Vue原型上
  Vue.prototype.$message = message;
}

export default obj;