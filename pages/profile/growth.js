// growth.js - 会员成长记录页面
Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '',
      memberLevel: '普通会员'
    },
    achievements: [
      {
        id: 1,
        name: 'XX比赛',
        value: '第三名'
      },
      {
        id: 2,
        name: 'XX比赛',
        value: '第二名'
      },
      {
        id: 3,
        name: 'XX比赛',
        value: '第一名'
      }
    ],
    moments: [
      {
        id: 1,
        image: '/images/moments/moment1.jpg',
        date: '2023-06-15'
      },
      {
        id: 2,
        image: '/images/moments/moment2.jpg',
        date: '2023-07-22'
      },
      {
        id: 3,
        image: '/images/moments/moment3.jpg',
        date: '2023-08-30'
      },
      {
        id: 4,
        image: '/images/moments/moment4.jpg',
        date: '2023-09-18'
      }
    ],
    feedbacks: [
      {
        id: 1,
        date: '2023-10-15',
        title: '第一阶段评估',
        coach: '王教练',
        content: '基本姿势掌握良好，呼吸节奏需要调整，手臂动作需要加强练习。',
        tags: ['自由泳', '基础训练'],
        color: '#FF9500'
      },
      {
        id: 2,
        date: '2023-11-20',
        title: '第二阶段评估',
        coach: '李教练',
        content: '自由泳技术有明显提升，转身动作需要继续练习，整体配合更加协调。',
        tags: ['自由泳', '转身技巧'],
        color: '#34C759'
      },
      {
        id: 3,
        date: '2023-12-25',
        title: '第三阶段评估',
        coach: '张教练',
        content: '四种泳姿基本掌握，耐力有所提升，建议增加专项训练，为比赛做准备。',
        tags: ['综合评估', '比赛准备'],
        color: '#007AFF'
      }
    ]
  },
  
  onLoad: function() {
    // 获取用户信息
    this.getUserData();
  },
  
  getUserData: function() {
    // 实际应用中应该从服务器获取用户数据
    // 这里使用模拟数据
    const userInfo = {
      avatarUrl: '/images/icons/default-avatar.png',
      nickName: '小鲨鱼',
      memberLevel: '黄金会员'
    };
    
    this.setData({
      userInfo
    });
  },
  
  previewImage: function(e) {
    const url = e.currentTarget.dataset.url;
    const urls = this.data.moments.map(item => item.image);
    
    wx.previewImage({
      current: url,
      urls: urls
    });
  },
  
  navigateToBooking: function() {
    wx.navigateTo({
      url: '/pages/booking/booking'
    });
  },
  
  navigateToSchedule: function() {
    wx.navigateTo({
      url: '/pages/profile/schedule'
    });
  }
})