// specialty.js - 专项体能页面
Page({
  data: {
    specialtyPrograms: [
      {
        id: 1,
        title: '游泳专项力量训练',
        description: '针对游泳运动员的专项力量训练，提高上肢和核心力量',
        duration: '45分钟',
        suitable: '适合10岁以上学员',
        image: '/images/teams/specialty1.png'
      },
      {
        id: 2,
        title: '游泳柔韧性训练',
        description: '提高身体柔韧性，改善游泳姿势和技术',
        duration: '30分钟',
        suitable: '适合所有年龄段',
        image: '/images/teams/specialty2.png'
      },
      {
        id: 3,
        title: '游泳耐力训练',
        description: '提高心肺功能和耐力，适合长距离游泳训练',
        duration: '60分钟',
        suitable: '适合12岁以上学员',
        image: '/images/teams/specialty3.png'
      },
      {
        id: 4,
        title: '游泳爆发力训练',
        description: '提高短距离冲刺能力和爆发力',
        duration: '40分钟',
        suitable: '适合14岁以上学员',
        image: '/images/teams/specialty4.png'
      }
    ]
  },
  onLoad: function() {
    // 页面加载时执行
  },
  onProgramTap: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/team/program-detail?id=${id}`
    });
  }
})