/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemSetRouter = {
  path: '/system-set',
  component: Layout,
  redirect: '/system-set/system-value-set',
  name: 'system-value-set',
  meta: {
    title: '系统设定',
    icon: 'international'
  },
  children: [
    {
      path: 'sensor-warning-list',
      component: () => import('@/views/system-operation/sensor-warning-list'),
      name: 'sensor-warning-list',
      meta: { title: '---报警初始值' }

    },
    {
      path: 'sensor-list',
      component: () => import('@/views/table/complex-table'),
      name: 'sensor-list',
      meta: { title: '---扫描频率' }
    },
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/table/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'Inline Edit' }
    // }

  ]
}
export default systemSetRouter
