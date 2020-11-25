const path = require('path');
module.exports = {
  title: "张胤笔记",
  base : '/',
  themeConfig: {
    // 添加导航栏
    nav: [
      {
        text: `let's go`,
        items: [
          {
            text: 'CSS',
            link: '/css/'
          },
          {
            text: 'Vue',
            link: '/vue/'
          },
          {
            text: 'Node',
            link: '/node/'
          },
          {
            text: 'React',
            link: '/react/'
          },
          {
            text: 'webpack',
            link: '/webpack/'
          }
        ]
      }
    ],
    // 为以下路由添加侧边栏
    sidebar: {
      '/css/': [
        {
          title: 'CSS',
          collapsable: false,
          children: [
            'css-1',
            'flex',
          ]
        }
      ],
      '/vue/': [
        {
          title: 'Vue',
          collapsable: false,
          children: [
            'vue-1',
            'vue-2'
          ]
        }
      ],
      '/node/': [
        {
          title: 'Node',
          collapsable: false,
          children: [
            'http'
          ]
        },
        {
          title: 'Promise, async, await',
          collapsable: false,
          children: [
            'promise'
          ]
        }
      ],
      '/react/': [
        {
          title: 'React',
          collapsable: false,
          children: [
            'init',
            'component',
            'state'
          ]
        }
      ],
      '/webpack/': [
        {
          title: 'Webpack',
          collapsable: false,
          children: [
            'webpack-init',
            'dev-server',
            'loader',
            'source-map',
            'third'
          ]
        }
      ]
    }
  }
}