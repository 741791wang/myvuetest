import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '生产看板', icon: 'dashboard', affix: true }
    }]
  },
  {
    path: '/current',
    component: Layout,
    redirect: '/current',
    meta: { title: '实时数据', icon: 'el-icon-time' },
    children: [
      {
        path: 'equipment',
        name: 'equipment',
        component: () => import('@/views/equipment/index'),
        meta: { title: '设备实时状态', icon: 'dashboard' }
      },
      {
        path: 'workmng',
        name: 'workmng',
        component: () => import('@/views/workmng/index'),
        meta: { title: '上下工管理', icon: 'el-icon-s-check' }
      }
    ]
  },
  {
    path: '/pick',
    component: Layout,
    alwaysShow: true,
    redirect: '/pick',
    meta: { title: '采摘数据', icon: 'el-icon-box' },
    children: [
      {
        path: 'picklog',
        name: 'picklog',
        component: () => import('@/views/pickrecord/index'),
        meta: { title: '采摘记录', icon: 'el-icon-tickets' }
      }
    ]
  },
  {
    path: '/produce',
    component: Layout,
    alwaysShow: true,
    redirect: '/produce',
    meta: { title: '生产数据', icon: 'el-icon-files' },
    children: [
      {
        path: 'release',
        name: 'release',
        component: () => import('@/views/inoutrecord/index'),
        meta: { title: '投料记录', icon: 'el-icon-wallet' }
      },
      {
        path: 'scale',
        name: 'scale',
        component: () => import('@/views/scale/index'),
        meta: { title: '动态称记录', icon: 'el-icon-odometer' }
      }
    ]
  },
  {
    path: '/check',
    component: Layout,
    alwaysShow: true,
    redirect: '/check',
    meta: { title: '抽检管理', icon: 'el-icon-s-claim' },
    children: [
      {
        path: 'checklog',
        name: 'checklog',
        component: () => import('@/views/checkrecord/index'),
        meta: { title: '抽检记录', icon: 'el-icon-document-checked' }
      }
      /* {
        path: 'checkcontent',
        name: 'checkcontent',
        component: () => import('@/views/checkdetail/index'),
        meta: { title: '抽检内容管理', icon: 'el-icon-document' }
      }*/
    ]
  },
  {
    path: '/report',
    component: Layout,
    alwaysShow: true,
    redirect: '/report',
    meta: { title: '数据报表', icon: 'el-icon-data-analysis' },
    children: [
      {
        path: 'pickcount',
        name: 'pickcount',
        component: () => import('@/views/pickCountReport/index'),
        meta: { title: '采摘量统计', icon: 'chart' }
      },
      {
        path: 'workcount',
        name: 'workcount',
        component: () => import('@/views/pickMonthReport/index'),
        meta: { title: '采摘人统计', icon: 'chart' }
      },
      {
        path: 'releasecount',
        name: 'releasecount',
        component: () => import('@/views/feedCountReport/index'),
        meta: { title: '投料量统计', icon: 'chart' }
      },
      /* {
        path: 'stock',
        name: 'stock',
        component: () => import('@/views/inBufferReport/index'),
        meta: { title: '在库损耗统计', icon: 'chart' }
      },*/
      {
        path: 'stockwaste',
        name: 'stockwaste',
        component: () => import('@/views/bufferLineReport/index'),
        meta: { title: '缓存线实时', icon: 'chart' }
      },
      /* {
        path: 'efficiency',
        name: 'efficiency',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '效率统计', icon: 'chart' }
      },*/
      {
        path: 'yieldcount',
        name: 'yieldcount',
        component: () => import('@/views/outputReport/index'),
        meta: { title: '产量统计', icon: 'chart' }
      },
      {
        path: 'qualified',
        name: 'qualified',
        component: () => import('@/views/qualificationRate/index'),
        meta: { title: '产量合格率', icon: 'chart' }
      },
      /* {
        path: 'qualifieddetail',
        name: 'qualifieddetail',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '产量合格率明细', icon: 'chart' }
      },*/
      {
        path: 'inout',
        name: 'inout',
        component: () => import('@/views/inoutRatio/index'),
        meta: { title: '投入产出比统计', icon: 'chart' }
      }
    ]
  },
  {
    path: '/base',
    component: Layout,
    alwaysShow: true,
    redirect: '/base',
    meta: { title: '基础数据', icon: 'el-icon-coin' },
    children: [
      {
        path: 'equipmentmng',
        name: 'equipmentmng',
        component: () => import('@/views/equipmentmng/index'),
        meta: { title: '设备管理', icon: 'component' }
      },
      {
        path: 'station',
        name: 'station',
        component: () => import('@/views/workspace/index'),
        meta: { title: '工位管理', icon: 'el-icon-user-solid' }
      },
      {
        path: 'product',
        name: 'product',
        component: () => import('@/views/product/index'),
        meta: { title: '产品管理', icon: 'el-icon-s-goods' }
      },
      {
        path: 'materials',
        name: 'materials',
        component: () => import('@/views/resourcemng/index'),
        meta: { title: '原料管理', icon: 'el-icon-files' }
      },
      {
        path: 'area',
        name: 'area',
        component: () => import('@/views/area/index'),
        meta: { title: '区块管理', icon: 'el-icon-s-grid' }
      },
      {
        path: 'line',
        name: 'line',
        component: () => import('@/views/line/index'),
        meta: { title: '生产线管理', icon: 'el-icon-paperclip' }
      },
      {
        path: 'workers',
        name: 'workers',
        component: () => import('@/views/workers/index'),
        meta: { title: '员工管理', icon: 'el-icon-user' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    alwaysShow: true,
    redirect: '/system',
    meta: { title: '系统管理', icon: 'el-icon-s-tools' },
    children: [
      {
        path: 'log',
        name: 'log',
        component: () => import('@/views/systemlog/index'),
        meta: { title: '系统日志', icon: 'el-icon-notebook-1' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
