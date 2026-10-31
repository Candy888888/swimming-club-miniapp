// membership.js - 会员招募页面
Page({
  data: {
    membershipLevels: [
      {
        id: 1,
        name: '天使会籍',
        price: 50000,
        originalPrice: 100000,
        duration: '365天',
        color: '#87ceeb',
        cardImage: '/images/membership/angel_card.svg',
        isRecommended: true,
        isPreOpen: true, // 业前标识
        benefits: [
          '充5万送5万',
          '免会员费',
          '开课礼包',
          '权益详情见协议'
        ],
        postOpenBenefits: [ // 开业后权益
          '充5万送1万',
          '运动装备',
          '权益详情见会员合同'
        ]
      },
      {
        id: 2,
        name: '卓越会籍',
        price: 20000,
        originalPrice: 40000,
        duration: '365天',
        color: '#0066cc',
        cardImage: '/images/membership/excellent_card.svg',
        isPreOpen: true, // 业前标识
        benefits: [
          '充2万免会员费',
          '开课礼包',
          '权益详情见协议'
        ],
        postOpenBenefits: [ // 开业后权益
          '充2万送2000',
          '运动装备',
          '权益详情见会员合同'
        ]
      },
      {
        id: 3,
        name: '金牌会籍',
        price: 10500,
        originalPrice: 15000,
        duration: '365天',
        color: '#ffd700',
        cardImage: '/images/membership/gold_card.svg',
        isPreOpen: true, // 业前标识
        benefits: [
          '买10500的课包',
          '送开课礼包',
          '权益详情见协议'
        ],
        postOpenBenefits: [ // 开业后权益
          '买10500的课包',
          '权益详情见会员合同'
        ]
      }
    ],
    testimonials: [
      {
        id: 1,
        avatar: '/images/avatars/user1.jpg',
        name: '张先生',
        level: '尊享会员',
        content: '加入会员后，我的游泳技术提升很快，教练非常专业，设施也很完善，非常满意！',
        rating: 5
      },
      {
        id: 2,
        avatar: '/images/avatars/user2.jpg',
        name: '李女士',
        level: '高级会员',
        content: '环境很好，教练很耐心，每次来都能学到新东西，值得推荐！',
        rating: 5
      },
      {
        id: 3,
        avatar: '/images/avatars/user3.jpg',
        name: '王先生',
        level: '基础会员',
        content: '性价比很高，基础会员已经能满足我的需求，准备续费高级会员了。',
        rating: 4
      }
    ],
    faqs: [
      {
        question: '会员卡可以转让或共享吗？',
        answer: '会员卡为实名制，不可转让或与他人共享使用。',
        isExpanded: false
      },
      {
        question: '会员有什么特殊优惠吗？',
        answer: '会员可享受俱乐部内所有收费项目9折优惠，同时参加会员专属活动。',
        isExpanded: false
      },
      {
        question: '如何预约教练课程？',
        answer: '可通过小程序"我的课表"功能或前台预约教练课程，建议提前24小时预约。',
        isExpanded: false
      },
      {
        question: '会员卡过期后如何续费？',
        answer: '可在会员卡到期前30天内在小程序或前台办理续费，续费可享受额外优惠。',
        isExpanded: false
      }
    ],
    currentTab: 0, // 0: 会员权益, 1: 会员评价, 2: 常见问题
    isPreOpenPhase: true // 默认显示业前权益
  },
  
  onLoad: function() {
    // 页面加载时执行
  },
  
  switchTab: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    });
  },
  
  toggleFaq: function(e) {
    const index = e.currentTarget.dataset.index;
    const faqs = this.data.faqs;
    faqs[index].isExpanded = !faqs[index].isExpanded;
    
    this.setData({
      faqs: faqs
    });
  },
  
  switchPhase: function(e) {
    const phase = e.currentTarget.dataset.phase;
    this.setData({
      isPreOpenPhase: phase === 'pre'
    });
  },
  
  selectMembership: function(e) {
    const id = e.currentTarget.dataset.id;
    const selectedLevel = this.data.membershipLevels.find(level => level.id === id);
    const isPreOpen = this.data.isPreOpenPhase;
    
    let benefitsText = '';
    if (isPreOpen) {
      benefitsText = selectedLevel.benefits.join('、');
    } else {
      benefitsText = selectedLevel.postOpenBenefits.join('、');
    }
    
    wx.showModal({
      title: '确认购买',
      content: `您选择了${selectedLevel.name}，价格${selectedLevel.price}元/${selectedLevel.duration}\n\n${isPreOpen ? '业前权益' : '开业后权益'}：${benefitsText}\n\n是否确认购买？`,
      success: (res) => {
        if (res.confirm) {
          // 实际应用中，这里应该跳转到支付页面
          wx.navigateTo({
            url: '/pages/profile/payment?type=membership&id=' + id + '&phase=' + (isPreOpen ? 'pre' : 'post')
          });
        }
      }
    });
  },
  
  contactService: function() {
    wx.showModal({
      title: '联系客服',
      content: '您可以拨打客服电话 400-123-4567 或添加微信客服 SwimClub2023',
      showCancel: false
    });
  }
})