export default [
  {
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BlankLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/index',
              },
              {
                path: '/index',
                name: '首页',
                icon: 'CloudOutlined',
                component: './index',
              },
              {
                path: '/list',
                name: '数据报表',
                icon: 'ProfileOutlined',
                component: './List',
              },
              {
                path: '/account',
                name: '投放账户',
                icon: 'ProfileOutlined',
                component: './Account/List/index',
              },
              {
                path: '/account',
                routes: [
                  {
                    path: '/account',
                    redirect: '/account/basic',
                  },
                  {
                    name: '基本概况',
                    path: '/account/basic',
                    component: './Account/Basic',
                  },
                  {
                    name: '广告计划',
                    path: '/account/adplan',
                    component: './Account/Adplan',
                  },
                  {
                    name: '数据报表',
                    path: '/account/datalist',
                    component: './Account/Datalist',
                  },
                  {
                    name: '素材库',
                    path: '/account/trend',
                    component: './Account/Trend',
                  },
                  {
                    name: '人群包',
                    path: '/account/peoplebag',
                    component: './Account/Peoplebag',
                  },
                  {
                    component: './404',
                  },
                ],
              },
              {
                path: '/project',
                name: '项目',
                icon: 'ReconciliationOutlined',
                component: './Project',
              },
              {
                path: '/adowner',
                name: '广告主',
                icon: 'IdcardOutlined',
                component: './Adowner',
              },
              {
                path: '/subuser',
                name: '子用户',
                icon: 'PartitionOutlined',
                component: './Subuser',
              },
              {
                name: '人群包',
                path: '/report',
                component: './Report',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
