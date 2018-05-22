import Vue from 'vue'
import Router from 'vue-router'
// import Box from '@/components/Box'


const Login = () =>
  import ('@/pages/Login')
const Box = () =>
  import ('@/pages/Box')
const Density = () =>
  import ('@/pages/Density')
const Density2d = () =>
  import ('@/pages/Density2d')
const OD = () =>
  import ('@/pages/OD')
const Function = () =>
  import ('@/pages/Function')
const Flow = () =>
  import ('@/pages/Flow')
const TranfficLine = () =>
  import ('@/pages/TrafficLine')
const Commute = () =>
  import ('@/pages/Commute')
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
      path: '/density2d',
      name: 'Density2d',
      component: Density2d
    }, {
      path: '/od',
      name: 'od',
      component: OD
    }, {
      path: '/function',
      component: Function
    }, {
      path: '/flow',
      component: Flow
    }, {
      path: '/trafficLine',
      component: TranfficLine
    }, {
      path: '/commute',
      component: Commute
    }]
  }, {
    path: '/login',
    name: "login",
    component: Login,
  }]
})
