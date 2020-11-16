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
            link: '/CSS/'
          },
          {
            text: 'Vue',
            link: '/Vue/'
          },
          {
            text: 'Node',
            link: '/Node/'
          },
          {
            text: 'React',
            link: '/React/'
          }
        ]
      }
    ],
    // 为以下路由添加侧边栏
    sidebar: {
      '/CSS/': [
        {
          title: 'CSS',
          collapsable: false,
          children: [
            'css-1',
            'flex',
          ]
        }
      ],
      '/Vue/': [
        {
          title: 'Vue',
          collapsable: false,
          children: [
            'vue-1',
            'vue-2'
          ]
        }
      ],
      '/Node/': [
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
      '/React/': [
        {
          title: 'React',
          collapsable: false,
          children: [
            'react-1'
          ]
        }
      ]
    }
  }
}