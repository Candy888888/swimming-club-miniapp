// feedback-detail.js
Page({
  data: {
    feedback: null
  },
  
  onLoad: function(options) {
    const id = parseInt(options.id);
    this.loadFeedbackDetail(id);
  },
  
  loadFeedbackDetail: function(id) {
    // 模拟从服务器获取反馈详情
    // 实际应用中，这里应该是从服务器获取数据的逻辑
    const feedbackList = [
      {
        id: 1,
        type: 'suggestion',
        typeText: '建议',
        status: 'replied',
        statusText: '已回复',
        content: '建议增加更多的游泳课程种类，比如亲子游泳课程，让家长和孩子一起参与。',
        images: [
          '/images/feedback/feedback1.jpg'
        ],
        createTime: '2023-12-01 14:30',
        contact: '13800138000',
        reply: {
          content: '感谢您的宝贵建议！我们正在计划推出亲子游泳课程，预计将在下个月开始试运营。届时会通过小程序推送通知，请您关注。',
          time: '2023-12-02 10:15'
        }
      },
      {
        id: 2,
        type: 'complaint',
        typeText: '投诉',
        status: 'processing',
        statusText: '处理中',
        content: '更衣室的储物柜有些锁坏了，希望能尽快修理。',
        images: [
          '/images/feedback/feedback2.jpg',
          '/images/feedback/feedback3.jpg'
        ],
        createTime: '2023-11-25 09:15',
        contact: '13900139000'
      },
      {
        id: 3,
        type: 'praise',
        typeText: '表扬',
        status: 'replied',
        statusText: '已回复',
        content: '教练很专业，教学方法很好，孩子进步很快！',
        images: [],
        createTime: '2023-11-10 16:45',
        reply: {
          content: '感谢您的肯定和支持！我们会继续努力提供专业的教学服务，期待您和孩子的下次光临。',
          time: '2023-11-11 09:30'
        }
      }
    ];
    
    const feedback = feedbackList.find(item => item.id === id);
    
    if (feedback) {
      this.setData({
        feedback
      });
    } else {
      wx.showToast({
        title: '未找到反馈信息',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },
  
  previewImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.feedback.images;
    
    wx.previewImage({
      current: images[index],
      urls: images
    });
  },
  
  addMoreFeedback: function() {
    wx.navigateTo({
      url: '/pages/profile/feedback'
    });
  }
})