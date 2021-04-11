
module.exports = {
  title: "张胤笔记",
  description: '积累，就是坚持的过程',
  base : '/',
  themeConfig: {
    // 添加导航栏
    nav: [
      { text: 'Vue', link: '/vue/' },
      { text: 'React', link: '/react/' },
      { text: 'TypeScript', link: '/typescript/' },
      {
        text: `更多`,
        items: [
          {
            text: 'CSS',
            link: '/css/'
          },
          {
            text: 'Node',
            link: '/node/'
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
          title: 'Vue2',
          collapsable: false,
          children: [
            'vue1',
            'vue2'
          ]
        },
        {
          title: 'Vue3',
          collapsable: false,
          children: [
            '3reactive'
          ]
        }
      ],
      '/node/': [
        {
          title: 'Node',
          collapsable: false,
          children: [
            'http',
            'promise',
            'event'
          ]
        },
        // {
        //   title: 'Promise, async, await',
        //   collapsable: false,
        //   children: [
        //     'promise'
        //   ]
        // }
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
      '/typescript/': [
        {
          title: 'typescript',
          collapsable: false,
          children: [
            'type1',
            'type2',
            'type3',
          ]
        }
      ],
      '/webpack/': [
        {
          title: 'Webpack',
          collapsable: false,
          children: [
            'init',
            'server',
            'loader',
            'source-map',
            'third'
          ]
        }
      ]
    }
  }
}