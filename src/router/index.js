import Vue from 'vue'
import Router from 'vue-router'
// import Box from '@/components/Box'


const Login = () => import ('@/pages/Login')
const Box = () => import ('@/pages/Box')
const Density = () => import ('@/pages/Density')
const Density_jd = () => import ('@/pages/Density_jd')
const OD = () => import ('@/pages/OD')
const Migrate = () => import ('@/pages/Migrate')
const Commute = () => import ('@/pages/Commute')
const OD_ZW = () => import ('@/pages/OD_ZW')
const O_Density2d = () => import ('@/pages/O_Density2d')
const D_Density2d = () => import ('@/pages/D_Density2d')
const TranfficLine = () => import ('@/pages/TrafficLine')
const Density2d = () => import ('@/pages/Density2d')
const Function = () => import ('@/pages/Function')
const Flow = () => import ('@/pages/Flow')
const F_Density2d = () => import ('@/pages/F_Density2d')
const F_Density = () => import ('@/pages/F_Density')
const F_Function = () => import ('@/pages/F_Function')
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/box',
    name: 'Box',
    component: Box,
    redirect: '/density',
    children: [{
      path: '/density',
      name: 'Density',
      component: Density
    }, {
      path: '/density_jd',
      name: 'Density_jd',
      component: Density_jd
    }, {
      path: '/od',
      name: 'od',
      component: OD
    }, {
      path: '/migrate',
      name: 'Migrate',
      component: Migrate
    }, {
      path: '/commute',
      name: 'Commute',
      component: Commute
    }, {
      path: '/od_ZW',
      component: OD_ZW
    }, {
      path: '/O_Density2d',
      name: 'O_Density2d',
      component: O_Density2d
    }, {
      path: '/D_Density2d',
      name: 'D_Density2d',
      component: D_Density2d
    }, {
      path: '/trafficLine',
      component: TranfficLine
    }, {
      path: '/density2d',
      name: 'Density2d',
      component: Density2d
    }, {
      path: '/function',
      component: Function
    }, {
      path: '/flow',
      component: Flow
    }, {
      path: '/F_Density2d',
      component: F_Density2d
    }, {
      path: '/F_Density',
      component: F_Density
    }, {
      path: '/F_Function',
      component: F_Function
    }]
  }, {
    path: '/login',
    name: "login",
    component: Login,
  }]
})
