// booking.js
Page({
  data: {
    activeTab: 'venue', // 当前激活的标签页：venue-场馆预约，course-课程预约
    currentMonth: '',
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    days: [],
    timeSlots: [
      { id: 1, time: '08:00-10:00', isAvailable: true, isSelected: false },
      { id: 2, time: '10:00-12:00', isAvailable: true, isSelected: false },
      { id: 3, time: '12:00-14:00', isAvailable: false, isSelected: false },
      { id: 4, time: '14:00-16:00', isAvailable: true, isSelected: false },
      { id: 5, time: '16:00-18:00', isAvailable: true, isSelected: false },
      { id: 6, time: '18:00-20:00', isAvailable: true, isSelected: false },
      { id: 7, time: '20:00-22:00', isAvailable: false, isSelected: false }
    ],
    courses: [
      {
        id: 1,
        name: '儿童游泳启蒙班',
        description: '适合4-6岁儿童，从水性培养到基本泳姿学习',
        price: 680,
        duration: '8课时',
        image: '/images/courses/course1.jpg'
      },
      {
        id: 2,
        name: '成人游泳速成班',
        description: '适合零基础成人，克服恐水心理，掌握基本游泳技能',
        price: 880,
        duration: '10课时',
        image: '/images/courses/course2.jpg'
      },
      {
        id: 3,
        name: '自由泳提高班',
        description: '适合已掌握基本泳姿的学员，提高自由泳技术',
        price: 980,
        duration: '12课时',
        image: '/images/courses/course3.jpg'
      },
      {
        id: 4,
        name: '蛙泳技术班',
        description: '专注于蛙泳技术的训练和提高',
        price: 980,
        duration: '12课时',
        image: '/images/courses/course4.jpg'
      }
    ]
  },
  onLoad() {
    this.initCalendar();
  },
  // 初始化日历数据
  initCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    
    this.setData({
      currentMonth: `${year}年${monthNames[month]}`
    });
    
    // 生成一周的日期
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      days.push({
        day: date.getDate(),
        weekday: this.data.weekdays[date.getDay()],
        isToday: i === 0,
        isSelected: i === 0,
        date: date
      });
    }
    
    this.setData({ days });
  },
  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },
  // 选择日期
  selectDay(e) {
    const index = e.currentTarget.dataset.index;
    const days = this.data.days.map((day, i) => {
      return {
        ...day,
        isSelected: i === index
      };
    });
    
    this.setData({ days });
  },
  // 选择时间段
  selectTimeSlot(e) {
    const id = e.currentTarget.dataset.id;
    const timeSlots = this.data.timeSlots.map(slot => {
      if (!slot.isAvailable) return slot;
      
      return {
        ...slot,
        isSelected: slot.id === id
      };
    });
    
    this.setData({ timeSlots });
  },
  // 上一周
  prevWeek() {
    // 实际应用中需要计算上一周的日期
    wx.showToast({
      title: '已是最早日期',
      icon: 'none'
    });
  },
  // 下一周
  nextWeek() {
    // 实际应用中需要计算下一周的日期
    const days = this.data.days.map(day => {
      const newDate = new Date(day.date);
      newDate.setDate(newDate.getDate() + 7);
      
      return {
        day: newDate.getDate(),
        weekday: this.data.weekdays[newDate.getDay()],
        isToday: false,
        isSelected: false,
        date: newDate
      };
    });
    
    this.setData({ 
      days,
      currentMonth: `${days[0].date.getFullYear()}年${['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][days[0].date.getMonth()]}` 
    });
  },
  // 提交预约
  submitBooking() {
    if (this.data.activeTab === 'venue') {
      // 场馆预约逻辑
      const selectedDay = this.data.days.find(day => day.isSelected);
      const selectedTimeSlot = this.data.timeSlots.find(slot => slot.isSelected);
      
      if (!selectedDay || !selectedTimeSlot) {
        wx.showToast({
          title: '请选择日期和时间',
          icon: 'none'
        });
        return;
      }
      
      wx.showLoading({ title: '提交中...' });
      
      // 模拟提交预约
      setTimeout(() => {
        wx.hideLoading();
        wx.showModal({
          title: '预约成功',
          content: `您已成功预约${selectedDay.date.getMonth() + 1}月${selectedDay.day}日 ${selectedTimeSlot.time}的场馆`,
          showCancel: false,
          success: () => {
            // 重置选择状态
            this.resetSelection();
          }
        });
      }, 1500);
    } else if (this.data.activeTab === 'course') {
      // 课程预约逻辑
      // 获取选中的课程
      const selectedCourse = this.data.selectedCourse;
      
      if (!selectedCourse) {
        wx.showToast({
          title: '请选择课程',
          icon: 'none'
        });
        return;
      }
      
      // 这里可以添加提交预约的逻辑
      wx.showLoading({
        title: '提交中...'
      });
      
      // 模拟提交
      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({
          title: '预约成功',
          icon: 'success'
        });
        
        // 重置选择
        this.resetCourseSelection();
      }, 1500);
    }
  },
  // 选择课程
  selectCourse(e) {
    const id = e.currentTarget.dataset.id;
    const course = this.data.courses.find(course => course.id === id);
    
    wx.navigateTo({
      url: `/pages/booking/course-detail?id=${id}`
    });
  },
  
  // 重置选择
  resetSelection() {
    const timeSlots = this.data.timeSlots.map(slot => {
      return {
        ...slot,
        isSelected: false
      };
    });
    
    this.setData({ timeSlots });
  },
  
  // 重置课程选择
  resetCourseSelection() {
    this.setData({
      selectedCourse: null
    });
  },
  


})