/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemManagerRouter = {
  path: '/system-manager',
  component: Layout,
  redirect: '/system-manager/user-manager',
  name: 'system-manager',
  meta: {
    title: '系统信息管理',
    icon: 'peoples'
  },
  children: [
    {
      path: 'user-manager',
      component: () => import('@/views/system-manager/user-manager'),
      name: 'userManagement',
      meta: { title: '用户管理' }

    },
    {
      path: 'dynamic-table',
      component: () => import('@/views/system-manager/equipment-manager'),
      name: 'DynamicTable',
      meta: { title: '设备(风塔)管理' }
    },
    {
      path: 'drag-table',
      component: () => import('@/views/system-manager/drag-table'),
      name: 'DragTable',
      meta: { title: '螺栓监控传感器管理' }
    },
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/table/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'Inline Edit' }
    // }

  ]
}
export default systemManagerRouter
