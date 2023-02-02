/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,title 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'smile',
    component: './Welcome',
  },
  // {
  //   name: "测试",
  //   // layout: false,
  //   icon: 'table',
  //   path: '/Test',
  //   component: './Test',
  // },
  // {
  //   path: '/admin',
  //   name: "管理页",
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   routes: [
  //     {
  //       path: '/admin',
  //       redirect: '/admin/sub-page',
  //     },
  //     {
  //       title: "二级管理页",
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       component: './Admin',
  //     },
  //   ],
  // },
  // {
  //   name: "查询表格",
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    name: '文章管理',
    icon: 'table',
    path: '/articles',
    routes: [
      {
        path: '/articles',
        component: './Articles',
      },
      {
        name: '文章编辑',
        hideInMenu: true,
        icon: 'table',
        path: 'edit/:articleId',
        component: './Articles/Edit',
      },
      {
        name: '评论管理',
        hideInMenu: true,
        icon: 'table',
        path: 'comments/:articleId',
        component: './Articles/Comment',
      },
    ],
  },
  {
    name: '标签管理',
    icon: 'table',
    path: '/tags',
    component: './Tags',
  },
  {
    name: '旅行地图页面',
    icon: 'table',
    path: '/travelMap',
    component: './TravelMap',
  },
  {
    name: '关于页面',
    icon: 'table',
    path: '/about',
    component: './About',
  },
  {
    name: '系统页面',
    icon: 'table',
    path: '/system',
    component: './System',
  },
  {
    name: '用户管理',
    icon: 'table',
    path: '/managingUser',
    routes: [
      {
        path: '/managingUser',
        component: './ManagingUser',
      },
      {
        name: '管理员编辑',
        hideInMenu: true,
        icon: 'table',
        path: 'edit/:userid',
        component: './ManagingUser/Edit',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
