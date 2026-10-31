// schedule.js - 我的课表页面
Page({
  data: {
    scheduleList: [
      {
        id: 1,
        courseName: '自由泳进阶班',
        date: '2023-08-15',
        time: '18:00-19:30',
        coach: '王教练',
        location: 'A馆-3号泳道',
        status: 'upcoming' // upcoming, completed, cancelled
      },
      {
        id: 2,
        courseName: '蛙泳技术提升',
        date: '2023-08-17',
        time: '19:00-20:30',
        coach: '李教练',
        location: 'A馆-4号泳道',
        status: 'upcoming'
      },
      {
        id: 3,
        courseName: '游泳体能训练',
        date: '2023-08-10',
        time: '18:00-19:00',
        coach: '张教练',
        location: 'B馆-健身区',
        status: 'completed'
      },
      {
        id: 4,
        courseName: '仰泳入门课',
        date: '2023-08-12',
        time: '16:30-18:00',
        coach: '刘教练',
        location: 'A馆-2号泳道',
        status: 'completed'
      },
      {
        id: 5,
        courseName: '蝶泳技术班',
        date: '2023-08-20',
        time: '10:00-11:30',
        coach: '赵教练',
        location: 'A馆-1号泳道',
        status: 'upcoming'
      }
    ],
    activeTab: 'upcoming' // upcoming, completed, all
  },
  
  onLoad: function() {
    // 页面加载时执行
  },
  
  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },
  
  getFilteredSchedule: function() {
    if (this.data.activeTab === 'all') {
      return this.data.scheduleList;
    } else {
      return this.data.scheduleList.filter(item => item.status === this.data.activeTab);
    }
  },
  
  viewCourseDetail: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/booking/course-detail?id=${id}`
    });
  },
  
  cancelCourse: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '取消课程',
      content: '确定要取消该课程吗？',
      success: (res) => {
        if (res.confirm) {
          // 这里应该有取消课程的API调用
          // 模拟更新状态
          const scheduleList = this.data.scheduleList.map(item => {
            if (item.id === id) {
              return {...item, status: 'cancelled'};
            }
            return item;
          });
          
          this.setData({
            scheduleList: scheduleList
          });
          
          wx.showToast({
            title: '课程已取消',
            icon: 'success'
          });
        }
      }
    });
  }
})