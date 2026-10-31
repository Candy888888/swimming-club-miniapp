// feedback.js
Page({
  data: {
    selectedType: '',
    content: '',
    contentLength: 0,
    images: [],
    contact: '',
    canSubmit: false
  },
  
  onLoad: function() {
    // 页面加载时执行
  },
  
  selectType: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      selectedType: type
    });
    this.checkCanSubmit();
  },
  
  inputContent: function(e) {
    const content = e.detail.value;
    const contentLength = content.length;
    
    this.setData({
      content,
      contentLength
    });
    this.checkCanSubmit();
  },
  
  inputContact: function(e) {
    this.setData({
      contact: e.detail.value
    });
  },
  
  chooseImage: function() {
    const that = this;
    wx.chooseImage({
      count: 3 - that.data.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        // 返回选定照片的本地文件路径列表
        that.setData({
          images: [...that.data.images, ...res.tempFilePaths]
        });
      }
    });
  },
  
  previewImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images;
    
    wx.previewImage({
      current: images[index],
      urls: images
    });
  },
  
  deleteImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images;
    images.splice(index, 1);
    
    this.setData({
      images
    });
  },
  
  checkCanSubmit: function() {
    const { selectedType, content } = this.data;
    const canSubmit = selectedType !== '' && content.trim() !== '';
    
    this.setData({
      canSubmit
    });
  },
  
  submitFeedback: function() {
    if (!this.data.canSubmit) {
      return;
    }
    
    const { selectedType, content, images, contact } = this.data;
    
    // 这里应该是提交到服务器的逻辑
    // 模拟提交
    wx.showLoading({
      title: '提交中...'
    });
    
    setTimeout(() => {
      wx.hideLoading();
      
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          // 延迟返回上一页
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      });
    }, 1500);
  },
  
  viewHistory: function() {
    wx.navigateTo({
      url: '/pages/profile/feedback-history'
    });
  }
})