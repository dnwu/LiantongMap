import Vue from 'vue'
import Router from 'vue-router'
// import Box from '@/components/Box'

const Box = () =>
  import ('@/components/Box')
const Density = () =>
  import ('@/components/Density')
const OD = () =>
  import ('@/components/OD')
const Function = () =>
  import ('@/components/Function')
const Flow = () =>
  import ('@/components/Flow')
const TranfficLine = () =>
  import ('@/components/TrafficLine')
const Commute = () =>
  import ('@/components/Commute')
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Box',
    component: Box,
    redirect: '/od',
    children: [{
      path: '/density',
      name: 'Density',
      component: Density
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
  }]
})
