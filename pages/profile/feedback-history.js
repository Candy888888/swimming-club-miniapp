// feedback-history.js
Page({
  data: {
    feedbackList: [
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
        createTime: '2023-12-01 14:30'
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
        createTime: '2023-11-25 09:15'
      },
      {
        id: 3,
        type: 'praise',
        typeText: '表扬',
        status: 'replied',
        statusText: '已回复',
        content: '教练很专业，教学方法很好，孩子进步很快！',
        images: [],
        createTime: '2023-11-10 16:45'
      }
    ]
  },
  
  onLoad: function() {
    // 页面加载时执行
  },
  
  previewImage: function(e) {
    const urls = e.currentTarget.dataset.urls;
    const current = e.currentTarget.dataset.current;
    
    wx.previewImage({
      current,
      urls
    });
  },
  
  viewDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: `/pages/profile/feedback-detail?id=${id}`
    });
  }
})