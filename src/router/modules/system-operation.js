/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemOperationRouter = {
  path: '/system-opeartion',
  component: Layout,
  redirect: '/system-opeartion/sensor-warning-list',
  name: 'sensor-warning-list',
  meta: {
    title: '运营管理',
    icon: 'peoples'
  },
  children: [
    {
      path: 'sensor-warning-list',
      component: () => import('@/views/system-operation/sensor-warning-list'),
      name: 'sensor-warning-list',
      meta: { title: '---报警列表' }

    },
    {
      path: 'sensor-list',
      component: () => import('@/views/system-operation/sensor-list'),
      name: 'sensor-list',
      meta: { title: '---点位详情' }
    }
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/table/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'Inline Edit' }
    // }

  ]
}
export default systemOperationRouter
