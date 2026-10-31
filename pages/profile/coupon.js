// coupon.js
Page({
  data: {
    currentTab: 0, // 0: 未使用, 1: 已使用, 2: 已过期
    unusedCoupons: [
      {
        id: 1,
        name: '新人专享券',
        type: 'cash',
        value: 50,
        condition: '满200元可用',
        validPeriod: '有效期至2024-01-31',
        description: '适用于所有游泳课程'
      },
      {
        id: 2,
        name: '会员日优惠',
        type: 'discount',
        value: 8.5,
        condition: '无门槛',
        validPeriod: '有效期至2024-02-15',
        description: '每月15日会员专享折扣'
      },
      {
        id: 3,
        name: '生日特惠券',
        type: 'cash',
        value: 100,
        condition: '满500元可用',
        validPeriod: '有效期至2024-03-01',
        description: '生日当月可用于所有服务'
      }
    ],
    usedCoupons: [
      {
        id: 4,
        name: '开业庆典券',
        type: 'cash',
        value: 30,
        condition: '满100元可用',
        validPeriod: '已使用于2023-11-20',
        description: '适用于所有游泳课程'
      }
    ],
    expiredCoupons: [
      {
        id: 5,
        name: '周年庆优惠',
        type: 'discount',
        value: 7.5,
        condition: '无门槛',
        validPeriod: '已于2023-10-31过期',
        description: '适用于所有游泳课程'
      },
      {
        id: 6,
        name: '限时特惠券',
        type: 'cash',
        value: 20,
        condition: '满100元可用',
        validPeriod: '已于2023-09-30过期',
        description: '仅限工作日使用'
      }
    ]
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
  
  useCoupon: function(e) {
    const id = e.currentTarget.dataset.id;
    const coupon = this.data.unusedCoupons.find(item => item.id === id);
    
    wx.showModal({
      title: '使用优惠券',
      content: `确定要使用「${coupon.name}」吗？`,
      success: (res) => {
        if (res.confirm) {
          // 实际应用中，这里应该跳转到相应的使用页面
          wx.navigateTo({
            url: '/pages/booking/booking?couponId=' + id
          });
        }
      }
    });
  },
  
  showCouponCode: function() {
    wx.showModal({
      title: '兑换优惠券',
      content: '请输入优惠券兑换码',
      editable: true,
      placeholderText: '请输入兑换码',
      success: (res) => {
        if (res.confirm && res.content) {
          // 模拟兑换成功
          if (res.content === 'SWIM2023') {
            // 添加新优惠券
            const newCoupon = {
              id: this.data.unusedCoupons.length + this.data.usedCoupons.length + this.data.expiredCoupons.length + 1,
              name: '兑换优惠券',
              type: 'cash',
              value: 30,
              condition: '满200元可用',
              validPeriod: '有效期至2024-04-30',
              description: '通过兑换码获得的优惠券'
            };
            
            const unusedCoupons = [newCoupon, ...this.data.unusedCoupons];
            
            this.setData({
              unusedCoupons
            });
            
            wx.showToast({
              title: '兑换成功',
              icon: 'success'
            });
          } else {
            wx.showToast({
              title: '兑换码无效',
              icon: 'none'
            });
          }
        }
      }
    });
  }
})