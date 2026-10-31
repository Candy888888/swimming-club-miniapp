// index.js
Page({
  data: {
    topBanners: [
      { id: 1, imageUrl: '/images/banner/banner1.jpg' },
      { id: 2, imageUrl: '/images/banner/banner2.jpg' },
      { id: 3, imageUrl: '/images/banner/banner3.jpg' },
      { id: 4, imageUrl: '/images/banner/banner4.jpg' }
    ],
    navItems: [
      { id: 1, name: '专项体能', icon: '/image copy 7.png', url: '/pages/team/specialty' },
      { id: 2, name: '场馆预约', icon: '/image copy 8.png', url: '/pages/booking/booking' },
      { id: 3, name: '俱乐部赛事', icon: '/image copy 9.png', url: '/pages/events/events' },
      { id: 4, name: '我的课表', icon: '/image copy 10.png', url: '/pages/profile/schedule' },
      { id: 5, name: '邀请有礼', icon: '/image copy 11.png', url: '/pages/profile/invite' },
      { id: 6, name: '知识库', icon: '/image copy 12.png', url: '/pages/team/knowledge' },
      { id: 7, name: '游泳周边', icon: '/image copy 13.png', url: '/pages/team/merchandise' },
      { id: 8, name: '会员招募', icon: '/image copy 14.png', url: '/pages/profile/membership' }
    ],
    promoBanners: [
      { id: 1, imageUrl: '/image.png' },
      { id: 2, imageUrl: '/image copy.png' },
      { id: 3, imageUrl: '/image copy 5.png' },
      { id: 4, imageUrl: '/image copy 2.png' }
    ],
    teams: [
      { id: 1, name: '启蒙组', logo: '/images/teams/team1.png', description: '适合4-6岁儿童的启蒙游泳训练' },
      { id: 2, name: '小鲨鱼组A', logo: '/images/teams/team2.png', description: '适合7-9岁儿童的基础游泳训练' },
      { id: 3, name: '小鲨鱼组B', logo: '/images/teams/team3.png', description: '适合7-9岁有基础的儿童游泳训练' },
      { id: 4, name: '进阶组', logo: '/images/teams/team4.png', description: '适合10-12岁儿童的进阶游泳训练' },
      { id: 5, name: '泳队组', logo: '/images/teams/team5.png', description: '适合12-16岁青少年的专业游泳训练' },
      { id: 6, name: '冠军组', logo: '/images/teams/team6.png', description: '适合有竞技目标的青少年游泳训练' }
    ],
    recommendedEvents: [
      { id: 1, title: '2023年青少年游泳锦标赛', coverUrl: '/images/events/event1.jpg', date: '2023-12-15', participants: 86, maxParticipants: 150 },
      { id: 2, title: '亲子游泳嘉年华', coverUrl: '/images/events/event2.jpg', date: '2023-12-10', participants: 32, maxParticipants: 50 },
      { id: 3, title: '成人游泳技能挑战赛', coverUrl: '/images/events/event3.jpg', date: '2023-12-05', participants: 45, maxParticipants: 80 },
      { id: 4, title: '2023夏季游泳公开赛', coverUrl: '/images/events/event1.jpg', date: '2023-08-15', participants: 128, maxParticipants: 200 }
    ],
    recommendedVideos: [
      { id: 1, title: '自由泳技巧教学', coverUrl: '/images/videos/v1.jpg', views: 1245 },
      { id: 2, title: '蛙泳呼吸技巧', coverUrl: '/images/videos/v1.jpg', views: 986 },
      { id: 3, title: '仰泳入门教学', coverUrl: '/images/videos/v1.jpg', views: 756 },
      { id: 4, title: '蝶泳技术分析', coverUrl: '/images/videos/v1.jpg', views: 532 }
    ]
  },
  onLoad() {
    // 页面加载时执行
  },
  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    // 检查是否是tabBar页面
    const tabBarPages = [
      '/pages/index/index',
      '/pages/booking/booking',
      '/pages/events/events',
      '/pages/team/team',
      '/pages/profile/profile'
    ];
    
    if (tabBarPages.includes(url)) {
      wx.switchTab({
        url: url
      });
    } else {
      wx.navigateTo({
        url: url
      });
    }
  },
  navigateToTeam(e) {
    const id = e.currentTarget.dataset.id;
    // 由于team/detail页面不存在，先跳转到team页面
    wx.navigateTo({
      url: `/pages/team/team?id=${id}`
    });
  },
  playVideo(e) {
    const id = e.currentTarget.dataset.id;
    // 由于video/play页面不存在，显示提示信息
    wx.showToast({
      title: '视频功能开发中',
      icon: 'none',
      duration: 2000
    });
    // 后续可以跳转到知识库页面，因为知识库可能包含视频教程
    // wx.navigateTo({
    //   url: `/pages/team/knowledge?videoId=${id}`
    // });
  },
  navigateToEvent(e) {
    const id = e.currentTarget.dataset.id;
    wx.switchTab({
      url: '/pages/events/events'
    });
  }
})