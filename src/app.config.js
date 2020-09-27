export default {
  pages: [
    "pages/index/index",
    "pages/stencil/index/index",
    "pages/stencil/des/index",
    "pages/mine/index",
    "pages/auth/index",
    "pages/qalist/index",
    "pages/city/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  },
  "tabBar": {
    "color": "#C8CCD7",
    "backgroundColor": "#FFFFFF",
    "selectedColor": "#222222",
    "borderStyle": "white",
    "list": [{
        "text": "搜索",
        "pagePath": "pages/index/index",
        "iconPath": "./assets/images/tabbar/bar01.png",
        "selectedIconPath": "./assets/images/tabbar/bar1.png"
      },
      {
        "text": "问答",
        "pagePath": "pages/qalist/index",
        "iconPath": "./assets/images/tabbar/bar02.png",
        "selectedIconPath": "./assets/images/tabbar/bar2.png"
      },
      {
        "text": "模版",
        "pagePath": "pages/stencil/index/index",
        "iconPath": "./assets/images/tabbar/bar03.png",
        "selectedIconPath": "./assets/images/tabbar/bar3.png"
      },
      {
        "text": "我的",
        "pagePath": "pages/mine/index",
        "iconPath": "./assets/images/tabbar/bar04.png",
        "selectedIconPath": "./assets/images/tabbar/bar4.png"
      }
    ],
  },
  subPackages: [{
      "root": "pages/time/",
      "name": "time",
      "pages": [
        "index/index",
        "thanks/index",
        'easter/index',
        'easter-result/index'
      ]
    },
    {
      "root": "pages/article/",
      "name": "article",
      "pages": [
        "search/index",
        "list/index",
        "des/index"
      ]
    },
    {
      "root": "pages/question/",
      "name": "question",
      "pages": [
        "ask/index",
        "details/index",
        "tag/index",
        "search/index",
      ]
    },
    {
      "root": "pages/master/",
      "name": "master",
      "pages": [
        "detail/index",
        "verify/index/index",
        "verify/result/index",
      ]
    },
    {
      "root": "pages/user/",
      "name": "user",
      "pages": [
        "questions/index",
        "follow/index",
        "answer/index",
        "collect/index",
        "attention/index",
        "time/index"
      ]
    },
    {
      "root": "pages/answer/",
      "name": "answer",
      "pages": [
        "comment/index",
        "detail/index",
        "reply/index"
      ]
    },
    {
      "root": "pages/activity/",
      "name": "activity",
      "pages": [
        "detail/index", //活动详情
        "step/index", //活动步骤
        "violations/index"//刷单黑名单
      ]
    }
  ]
}
