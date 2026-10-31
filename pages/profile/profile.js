// profile.js
Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '',
      memberLevel: '普通会员',
      points: 120,
      coupons: 3,
      balance: 200,
      cardNumber: '888888',
      cardExpireDate: '2024-12-31',
      remainingTimes: 15
    },
    hasUserInfo: false,
    canIUseGetUserProfile: false
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      });
    }
    
    // 模拟获取用户信息
    this.getUserData();
  },
  // 获取用户数据
  getUserData() {
    // 实际应用中应该从服务器获取用户数据
    // 这里使用模拟数据
    const userInfo = {
      avatarUrl: '/images/icons/default-avatar.png',
      nickName: '游泳爱好者',
      memberLevel: '黄金会员',
      points: 320,
      coupons: 5,
      balance: 500,
      cardNumber: '202312001',
      cardExpireDate: '2024-12-31',
      remainingTimes: 25
    };
    
    this.setData({
      userInfo,
      hasUserInfo: true
    });
  },
  // 获取用户信息
  getUserProfile() {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    wx.getUserProfile({
      desc: '用于完善会员资料', 
      success: (res) => {
        const userInfo = {
          ...this.data.userInfo,
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        };
        
        this.setData({
          userInfo,
          hasUserInfo: true
        });
      }
    });
  },
  // 页面跳转
  navigateTo(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    });
  }
})