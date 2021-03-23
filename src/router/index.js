import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('views/home/Home');
const Manager = () => import('views/manager/Manager');
const User = () => import('views/manager/childCom/user/User');
const Worker = () => import('views/manager/childCom/worker/Worker');
const Setting = () => import('views/manager/childCom/setting/Setting');
const Temperature = () => import('views/manager/childCom/temperature/Temperature');
const Time = () => import('views/manager/childCom/time/Time');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/manager',
    name: 'Manager',
    component: Manager,
    children: [
      {
        path: '/manager',
        redirect: '/manager/user'
      },
      {
        path: '/manager/user',
        name: 'User',
        component: User
      },
      {
        path: '/manager/worker',
        name: 'Worker',
        component: Worker
      },
      {
        path: '/manager/setting',
        name: 'Setting',
        component: Setting
      },
      {
        path: '/manager/temperature',
        name: 'Temperature',
        component: Temperature
      },
      {
        path: '/manager/time',
        name: 'Time',
        component: Time
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
