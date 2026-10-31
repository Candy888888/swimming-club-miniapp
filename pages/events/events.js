// events.js
Page({
  data: {
    activeTab: 'upcoming', // 默认选中即将开始
    banners: [
      { id: 1, imageUrl: '/images/banner/banner1.jpg' },
      { id: 2, imageUrl: '/images/banner/banner2.jpg' },
      { id: 3, imageUrl: '/images/banner/banner3.jpg' }
    ],
    events: [
      {
        id: 1,
        title: '2023年青少年游泳锦标赛',
        coverUrl: '/images/events/event1.jpg',
        time: '2023-12-15 09:00',
        location: '新升潮游泳馆主馆',
        status: 'upcoming',
        description: '面向7-18岁青少年的游泳比赛，设自由泳、蛙泳、仰泳、蝶泳等多个项目',
        registrationDeadline: '2023-12-10',
        participantsCount: 86,
        maxParticipants: 150,
        categories: ['自由泳', '蛙泳', '仰泳', '蝶泳']
      },
      {
        id: 2,
        title: '亲子游泳嘉年华',
        coverUrl: '/images/events/event2.jpg',
        time: '2023-12-10 14:00',
        location: '新升潮游泳馆亲子池',
        status: 'upcoming',
        description: '适合3-6岁儿童及家长参与的亲子游泳活动，寓教于乐',
        registrationDeadline: '2023-12-05',
        participantsCount: 32,
        maxParticipants: 50,
        categories: ['亲子游戏', '趣味接力', '水中拓展']
      },
      {
        id: 3,
        title: '成人游泳技能挑战赛',
        coverUrl: '/images/events/event3.jpg',
        time: '2023-12-05 19:00',
        location: '新升潮游泳馆竞技池',
        status: 'ongoing',
        description: '面向成人游泳爱好者的技能挑战赛，设多个难度级别',
        registrationDeadline: '2023-11-30',
        participantsCount: 45,
        maxParticipants: 80,
        categories: ['自由泳', '蛙泳', '混合泳']
      },
      {
        id: 4,
        title: '游泳教练技术交流会',
        coverUrl: '/images/events/event4.jpg',
        time: '2023-11-28 10:00',
        location: '新升潮游泳馆会议室',
        status: 'past',
        description: '游泳教练技术交流与分享，提升教学水平',
        registrationDeadline: '2023-11-25',
        participantsCount: 24,
        maxParticipants: 30,
        categories: ['技术交流', '教学研讨']
      },
      {
        id: 5,
        title: '冬季游泳健康知识讲座',
        coverUrl: '/images/events/event5.jpg',
        time: '2023-11-20 15:00',
        location: '新升潮游泳馆多功能厅',
        status: 'past',
        description: '冬季游泳健康知识普及，科学健身指导',
        registrationDeadline: '2023-11-15',
        participantsCount: 35,
        maxParticipants: 50,
        categories: ['健康知识', '科学健身']
      },
      {
        id: 6,
        title: '2023夏季游泳公开赛',
        coverUrl: '/images/events/event1.jpg',
        time: '2023-08-15 09:00',
        location: '奥体中心游泳馆',
        status: 'past',
        description: '本次比赛面向所有年龄段的游泳爱好者，设有多个组别和项目，欢迎踊跃报名参加！',
        registrationDeadline: '2023-08-10',
        participantsCount: 128,
        maxParticipants: 200,
        categories: ['自由泳', '蛙泳', '仰泳', '蝶泳', '混合泳']
      },
      {
        id: 7,
        title: '游泳马拉松挑战赛',
        coverUrl: '/images/events/event4.jpg',
        time: '2023-10-10 08:00',
        location: '市游泳中心',
        status: 'past',
        description: '挑战自我极限的长距离游泳比赛，考验耐力与毅力，适合有一定游泳基础的爱好者。',
        registrationDeadline: '2023-09-30',
        participantsCount: 45,
        maxParticipants: 80,
        categories: ['1500米', '3000米', '5000米']
      }
    ],
    filteredEvents: []
  },
  onLoad() {
    this.filterEvents();
  },
  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ 
      activeTab: tab 
    }, () => {
      this.filterEvents();
    });
  },
  // 筛选赛事
  filterEvents() {
    const { activeTab, events } = this.data;
    let filteredEvents = [];
    
    if (activeTab === 'upcoming') {
      filteredEvents = events.filter(event => event.status === 'upcoming');
    } else if (activeTab === 'ongoing') {
      filteredEvents = events.filter(event => event.status === 'ongoing');
    } else if (activeTab === 'past') {
      filteredEvents = events.filter(event => event.status === 'past');
    }
    
    this.setData({ filteredEvents });
  },
  

  
  // 查看赛事详情
  navigateToEventDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/events/event-detail?id=${id}`
    });
  },

})