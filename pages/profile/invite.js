// invite.js - 邀请有礼页面
Page({
  data: {
    userInfo: {
      avatar: '/images/icons/avatar.png',
      nickname: '游泳爱好者',
      inviteCode: 'SWIM8888'
    },
    inviteRewards: [
      {
        id: 1,
        title: '邀请1人',
        description: '获得50元课程抵扣券',
        icon: '/images/icons/coupon.png'
      },
      {
        id: 2,
        title: '邀请3人',
        description: '获得1次免费体验课',
        icon: '/images/icons/course.png'
      },
      {
        id: 3,
        title: '邀请5人',
        description: '获得精美泳帽一个',
        icon: '/images/icons/gift.png'
      },
      {
        id: 4,
        title: '邀请10人',
        description: '获得200元课程抵扣券',
        icon: '/images/icons/coupon.png'
      }
    ],
    inviteRecords: [
      {
        id: 1,
        avatar: '/images/icons/avatar1.png',
        nickname: '小鱼儿',
        time: '2023-08-10 15:30',
        status: '已注册'
      },
      {
        id: 2,
        avatar: '/images/icons/avatar2.png',
        nickname: '游泳健将',
        time: '2023-08-09 10:15',
        status: '已购课'
      }
    ]
  },
  
  onLoad: function() {
    // 页面加载时执行
  },
  
  copyInviteCode: function() {
    wx.setClipboardData({
      data: this.data.userInfo.inviteCode,
      success: function() {
        wx.showToast({
          title: '邀请码已复制',
          icon: 'success'
        });
      }
    });
  },
  
  shareToFriend: function() {
    // 在实际小程序中，这里会调用wx.showShareMenu或wx.shareAppMessage
    wx.showToast({
      title: '请点击右上角分享',
      icon: 'none'
    });
  },
  
  generatePoster: function() {
    wx.showLoading({
      title: '海报生成中...'
    });
    
    // 模拟海报生成过程
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '海报已生成',
        icon: 'success'
      });
      // 实际应用中，这里应该展示生成的海报
    }, 1500);
  },
  
  viewInviteRules: function() {
    wx.navigateTo({
      url: '/pages/profile/invite-rules'
    });
  },
  
  onShareAppMessage: function() {
    return {
      title: '邀请你加入新升潮游泳馆，新人专享优惠！',
      path: `/pages/index/index?inviteCode=${this.data.userInfo.inviteCode}`,
      imageUrl: '/images/banner/share.jpg'
    };
  }
})