// settings.js
Page({
  data: {
    notificationEnabled: true,
    cacheSize: '2.5MB',
    version: '1.0.0'
  },
  
  onLoad: function() {
    // 页面加载时执行
    this.calculateCacheSize();
  },
  
  toggleNotification: function(e) {
    const enabled = e.detail ? e.detail.value : !this.data.notificationEnabled;
    
    this.setData({
      notificationEnabled: enabled
    });
    
    wx.showToast({
      title: enabled ? '已开启通知' : '已关闭通知',
      icon: 'none'
    });
  },
  
  navigateToPrivacy: function() {
    wx.navigateTo({
      url: '/pages/profile/privacy-settings'
    });
  },
  
  calculateCacheSize: function() {
    // 实际应用中，这里应该是获取真实缓存大小的逻辑
    // 这里只是模拟
    const sizes = ['1.2MB', '2.5MB', '3.8MB', '4.1MB'];
    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
    
    this.setData({
      cacheSize: randomSize
    });
  },
  
  clearCache: function() {
    wx.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '清除中...'
          });
          
          setTimeout(() => {
            wx.hideLoading();
            
            this.setData({
              cacheSize: '0KB'
            });
            
            wx.showToast({
              title: '缓存已清除',
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },
  
  checkUpdate: function() {
    wx.showLoading({
      title: '检查更新中...'
    });
    
    setTimeout(() => {
      wx.hideLoading();
      
      wx.showModal({
        title: '检查更新',
        content: '当前已是最新版本',
        showCancel: false
      });
    }, 1500);
  },
  
  navigateToAbout: function() {
    wx.navigateTo({
      url: '/pages/profile/about'
    });
  },
  
  navigateToTerms: function() {
    wx.navigateTo({
      url: '/pages/profile/terms'
    });
  },
  
  navigateToPrivacyPolicy: function() {
    wx.navigateTo({
      url: '/pages/profile/privacy-policy'
    });
  },
  
  logout: function() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: (res) => {
        if (res.confirm) {
          // 实际应用中，这里应该是清除用户登录状态的逻辑
          wx.showLoading({
            title: '退出中...'
          });
          
          setTimeout(() => {
            wx.hideLoading();
            
            // 返回到登录页
            wx.reLaunch({
              url: '/pages/login/login'
            });
          }, 1500);
        }
      }
    });
  }
})