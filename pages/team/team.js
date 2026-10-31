// team.js
const storage = require('../../utils/storage');
const globalState = require('../../utils/state');

Page({
  data: {
    activeTab: 'teams', // 默认选中泳队介绍
    teams: [
      { 
        id: 1, 
        name: '启蒙组', 
        logo: '/images/teams/team1.png', 
        description: '适合4-6岁儿童的启蒙游泳训练，培养水性和基本游泳技能',
        ageRange: '4-6岁',
        coachCount: 3,
        studentCount: 25
      },
      { 
        id: 2, 
        name: '小鲨鱼组A', 
        logo: '/images/teams/team2.png', 
        description: '适合7-9岁儿童的基础游泳训练，学习基本泳姿和技术',
        ageRange: '7-9岁',
        coachCount: 4,
        studentCount: 30
      },
      { 
        id: 3, 
        name: '小鲨鱼组B', 
        logo: '/images/teams/team3.png', 
        description: '适合7-9岁有基础的儿童游泳训练，提高泳姿和技术',
        ageRange: '7-9岁',
        coachCount: 4,
        studentCount: 28
      },
      { 
        id: 4, 
        name: '进阶组', 
        logo: '/images/teams/team4.png', 
        description: '适合10-12岁儿童的进阶游泳训练，完善四种泳姿',
        ageRange: '10-12岁',
        coachCount: 5,
        studentCount: 35
      },
      { 
        id: 5, 
        name: '泳队组', 
        logo: '/images/teams/team5.png', 
        description: '适合12-16岁青少年的专业游泳训练，参加各类比赛',
        ageRange: '12-16岁',
        coachCount: 6,
        studentCount: 40
      },
      { 
        id: 6, 
        name: '冠军组', 
        logo: '/images/teams/team6.png', 
        description: '适合有竞技目标的青少年游泳训练，冲击高水平比赛',
        ageRange: '14-18岁',
        coachCount: 4,
        studentCount: 20
      }
    ],
    coaches: [
      {
        id: 1,
        name: '王教练',
        avatar: '/images/coaches/coach1.jpg',
        title: '国家一级教练',
        description: '前国家队运动员，20年教学经验，培养多名省市冠军',
        tags: ['自由泳', '蝶泳', '专业训练']
      },
      {
        id: 2,
        name: '李教练',
        avatar: '/images/coaches/coach2.jpg',
        title: '国家二级教练',
        description: '15年教学经验，擅长儿童启蒙和基础训练',
        tags: ['儿童教学', '蛙泳', '仰泳']
      },
      {
        id: 3,
        name: '张教练',
        avatar: '/images/coaches/coach3.jpg',
        title: '资深游泳教练',
        description: '10年教学经验，专注青少年游泳技术提高',
        tags: ['青少年训练', '四式教学', '比赛指导']
      },
      {
        id: 4,
        name: '刘教练',
        avatar: '/images/coaches/coach4.jpg',
        title: '专业游泳教练',
        description: '8年教学经验，擅长成人零基础教学',
        tags: ['成人教学', '恐水克服', '技术分析']
      }
    ]
  },
  onLoad() {
    // 页面加载时执行
    this.loadJoinedTeams();
  },
  
  // 加载已加入的泳队信息
  loadJoinedTeams() {
    // 从本地存储获取已加入的泳队ID列表
    const joinedTeamIds = storage.get('joinedTeams', []);
    
    // 更新泳队列表，标记已加入的泳队
    const teams = this.data.teams.map(team => {
      return {
        ...team,
        joined: joinedTeamIds.includes(team.id)
      };
    });
    
    this.setData({ teams });
  },
  // 切换标签
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },
  // 跳转到泳队详情
  navigateToTeamDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/team/detail?id=${id}&type=team`
    });
  },
  // 跳转到教练详情
  navigateToCoachDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/team/detail?id=${id}&type=coach`
    });
  },
  
  // 加入或退出泳队
  toggleJoinTeam(e) {
    // 阻止冒泡，避免触发navigateToTeamDetail
    const teamId = e.currentTarget.dataset.id;
    // 从本地存储获取已加入的泳队ID列表
    let joinedTeamIds = storage.get('joinedTeams', []);
    
    // 检查是否已加入该泳队
    const isJoined = joinedTeamIds.includes(teamId);
    
    // 获取当前泳队信息
    const currentTeam = this.data.teams.find(team => team.id === teamId);
    const teamName = currentTeam ? currentTeam.name : '';
    
    // 显示确认对话框
    wx.showModal({
      title: isJoined ? '退出泳队' : '加入泳队',
      content: isJoined ? `确定要退出${teamName}吗？` : '是否要加入泳队',
      confirmColor: '#3B82F6',
      success: (res) => {
        if (res.confirm) {
          // 立即更新UI，提供即时反馈
          const teams = this.data.teams.map(team => {
            if (team.id === teamId) {
              return {
                ...team,
                joined: !isJoined
              };
            }
            return team;
          });
          
          this.setData({ teams });
          
          // 用户点击确定
          if (isJoined) {
            // 已加入，执行退出操作
            joinedTeamIds = joinedTeamIds.filter(id => id !== teamId);
            wx.showToast({
              title: '已退出泳队',
              icon: 'success',
              duration: 1500
            });
          } else {
            // 未加入，执行加入操作
            joinedTeamIds.push(teamId);
            wx.showToast({
              title: '加入成功',
              icon: 'success',
              duration: 1500
            });
          }
          
          // 更新本地存储
          storage.set('joinedTeams', joinedTeamIds);
          
          // 更新全局状态
          globalState.set('joinedTeams', joinedTeamIds);
        } else {
          // 用户点击取消，显示取消操作的提示
          wx.showToast({
            title: '操作已取消',
            icon: 'none',
            duration: 1000
          });
        }
      }
    });
  }
})