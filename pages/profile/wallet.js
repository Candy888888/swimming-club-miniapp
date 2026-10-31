// wallet.js
Page({
  data: {
    balance: 500.00,
    currentTab: 0, // 0: 交易记录, 1: 我的银行卡
    transactions: [
      {
        id: 1,
        title: '游泳课程预约',
        time: '2023-12-15 14:30',
        amount: 150.00,
        type: 'expense'
      },
      {
        id: 2,
        title: '账户充值',
        time: '2023-12-10 10:15',
        amount: 500.00,
        type: 'income'
      },
      {
        id: 3,
        title: '会员卡续费',
        time: '2023-11-30 16:45',
        amount: 699.00,
        type: 'expense'
      },
      {
        id: 4,
        title: '退款-取消课程',
        time: '2023-11-25 09:20',
        amount: 120.00,
        type: 'income'
      }
    ],
    bankCards: [
      {
        id: 1,
        type: '储蓄卡',
        lastFourDigits: '6789',
        bank: '中国建设银行',
        logo: '/images/banks/ccb.png',
        color: '#0066b3'
      },
      {
        id: 2,
        type: '信用卡',
        lastFourDigits: '1234',
        bank: '中国工商银行',
        logo: '/images/banks/icbc.png',
        color: '#e50012'
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
  
  showRecharge: function() {
    wx.showActionSheet({
      itemList: ['微信支付', '支付宝', '银行卡'],
      success: (res) => {
        if (!res.cancel) {
          // 根据选择的支付方式跳转到相应的充值页面
          wx.showModal({
            title: '充值',
            content: '请输入充值金额',
            editable: true,
            placeholderText: '请输入金额',
            success: (res) => {
              if (res.confirm) {
                const amount = parseFloat(res.content);
                if (!isNaN(amount) && amount > 0) {
                  // 模拟充值成功
                  setTimeout(() => {
                    const newBalance = this.data.balance + amount;
                    const newTransactions = [{
                      id: this.data.transactions.length + 1,
                      title: '账户充值',
                      time: this.formatTime(new Date()),
                      amount: amount,
                      type: 'income'
                    }, ...this.data.transactions];
                    
                    this.setData({
                      balance: newBalance,
                      transactions: newTransactions
                    });
                    
                    wx.showToast({
                      title: '充值成功',
                      icon: 'success'
                    });
                  }, 1000);
                } else {
                  wx.showToast({
                    title: '请输入有效金额',
                    icon: 'none'
                  });
                }
              }
            }
          });
        }
      }
    });
  },
  
  showWithdraw: function() {
    if (this.data.bankCards.length === 0) {
      wx.showModal({
        title: '提示',
        content: '请先添加银行卡',
        showCancel: false
      });
      return;
    }
    
    wx.showModal({
      title: '提现',
      content: '请输入提现金额',
      editable: true,
      placeholderText: '请输入金额',
      success: (res) => {
        if (res.confirm) {
          const amount = parseFloat(res.content);
          if (!isNaN(amount) && amount > 0) {
            if (amount > this.data.balance) {
              wx.showToast({
                title: '余额不足',
                icon: 'none'
              });
              return;
            }
            
            // 模拟提现成功
            setTimeout(() => {
              const newBalance = this.data.balance - amount;
              const newTransactions = [{
                id: this.data.transactions.length + 1,
                title: '账户提现',
                time: this.formatTime(new Date()),
                amount: amount,
                type: 'expense'
              }, ...this.data.transactions];
              
              this.setData({
                balance: newBalance,
                transactions: newTransactions
              });
              
              wx.showToast({
                title: '提现申请已提交',
                icon: 'success'
              });
            }, 1000);
          } else {
            wx.showToast({
              title: '请输入有效金额',
              icon: 'none'
            });
          }
        }
      }
    });
  },
  
  addBankCard: function() {
    wx.showModal({
      title: '添加银行卡',
      content: '暂未开放此功能，敬请期待',
      showCancel: false
    });
  },
  
  formatTime: function(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    return [year, month, day].map(this.formatNumber).join('-') + ' ' + 
           [hour, minute].map(this.formatNumber).join(':');
  },
  
  formatNumber: function(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  }
})