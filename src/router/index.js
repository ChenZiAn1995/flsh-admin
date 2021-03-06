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
    icon: 'svg-name'             the icon show in the sidebar
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
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index'),
                meta: { title: '首页', icon: 'dashboard' }
            }
        ]
    }
    // {
    //   path: '/example',
    //   component: Layout,
    //   redirect: '/example/Table',
    //   name: 'Example',
    //   meta: { title: 'Example', icon: 'example' },
    //   children: [
    //     {
    //       path: 'table',
    //       name: 'Table',
    //       component: () => import('@/views/table/index'),
    //       meta: { title: 'Table', icon: 'table' }
    //     },
    //     {
    //       path: 'tree',
    //       name: 'Tree',
    //       component: () => import('@/views/tree/index'),
    //       meta: { title: 'Tree', icon: 'tree' }
    //     }
    //   ]
    // },
    //
    // {
    //   path: '/form',
    //   component: Layout,
    //   children: [
    //     {
    //       path: 'index',
    //       name: 'Form',
    //       component: () => import('@/views/form/index'),
    //       meta: { title: 'Form', icon: 'form' }
    //     }
    //   ]
    // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
    {
        path: '/article',
        component: Layout,
        redirect: '/article/list',
        name: 'Article',
        meta: {
            title: '文章管理',
            icon: 'nested',
            roles: ['1001']
        },
        children: [
            {
                path: 'list',
                name: 'ArticleList',
                component: () => import('@/views/article/index'),
                meta: { title: '文章列表', icon: 'example', roles: ['10011001'] }
            },
            {
                path: 'add',
                name: 'ArticleAdd',
                hidden: true,
                component: () => import('@/views/article/form'),
                meta: { title: '文章新增', icon: 'example', roles: ['10011001'], type: 1 }
            },
            {
                path: 'edit/:id',
                name: 'ArticleEdit',
                hidden: true,
                component: () => import('@/views/article/form'),
                meta: { title: '文章编辑', icon: 'example', roles: ['10011002'], type: 2 }
            },
            {
                path: 'detail/:id',
                name: 'ArticleDetail',
                hidden: true,
                component: () => import('@/views/article/form'),
                meta: { title: '文章详情', icon: 'example', roles: ['10011001'], type: 3 }
            },
            {
                path: 'recycle',
                name: 'ArticleRecycle',
                component: () => import('@/views/article/recycle'),
                meta: { title: '回收站', icon: 'example', roles: ['10011005'] }
            }
        ]
    },
    {
        path: '/classify',
        component: Layout,
        meta: { roles: ['1002'] },
        children: [
            {
                path: 'index',
                name: 'Classify',
                component: () => import('@/views/classify/index'),
                meta: { title: '分类标签管理', icon: 'example', roles: ['10021000'] }
            }
        ]
    },
    {
        path: '/settings',
        component: Layout,
        meta: { roles: ['1003'] },
        children: [
            {
                path: 'index',
                name: 'Settings',
                component: () => import('@/views/settings/index'),
                meta: { title: '设置', icon: 'example', roles: ['10031000'] }
            }
        ]
    },
    // {
    //   path: '/nested',
    //   component: Layout,
    //   redirect: '/nested/menu1',
    //   name: 'Nested',
    //   meta: {
    //     title: 'Nested',
    //     icon: 'nested'
    //   },
    //   children: [
    //     {
    //       path: 'menu1',
    //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
    //       name: 'Menu1',
    //       meta: { title: 'Menu1' },
    //       children: [
    //         {
    //           path: 'menu1-1',
    //           component: () => import('@/views/nested/menu1/menu1-1'),
    //           name: 'Menu1-1',
    //           meta: { title: 'Menu1-1' }
    //         },
    //         {
    //           path: 'menu1-2',
    //           component: () => import('@/views/nested/menu1/menu1-2'),
    //           name: 'Menu1-2',
    //           meta: { title: 'Menu1-2' },
    //           children: [
    //             {
    //               path: 'menu1-2-1',
    //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
    //               name: 'Menu1-2-1',
    //               meta: { title: 'Menu1-2-1' }
    //             },
    //             {
    //               path: 'menu1-2-2',
    //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
    //               name: 'Menu1-2-2',
    //               meta: { title: 'Menu1-2-2' }
    //             }
    //           ]
    //         },
    //         {
    //           path: 'menu1-3',
    //           component: () => import('@/views/nested/menu1/menu1-3'),
    //           name: 'Menu1-3',
    //           meta: { title: 'Menu1-3' }
    //         }
    //       ]
    //     },
    //     {
    //       path: 'menu2',
    //       component: () => import('@/views/nested/menu2/index'),
    //       meta: { title: 'menu2' }
    //     }
    //   ]
    // },
    //
    // {
    //   path: 'external-link',
    //   component: Layout,
    //   children: [
    //     {
    //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
    //       meta: { title: 'External Link', icon: 'link' }
    //     }
    //   ]
    // },

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    mode: 'history', // require service support
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
