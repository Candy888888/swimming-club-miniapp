// knowledge.js - 游泳知识库页面
Page({
  data: {
    categories: [
      { id: 1, name: '游泳技巧', icon: '/images/icons/skill.png' },
      { id: 2, name: '训练计划', icon: '/images/icons/plan.png' },
      { id: 3, name: '安全知识', icon: '/images/icons/safety.png' },
      { id: 4, name: '比赛规则', icon: '/images/icons/rule.png' },
      { id: 5, name: '装备选择', icon: '/images/icons/equipment.png' },
      { id: 6, name: '营养饮食', icon: '/images/icons/diet.png' }
    ],
    articles: [
      {
        id: 1,
        title: '自由泳呼吸技巧详解',
        cover: '/images/teams/article1.jpg',
        category: '游泳技巧',
        views: 1256,
        likes: 328,
        publishDate: '2023-07-15',
        summary: '正确的呼吸技巧对自由泳的速度和耐力有着决定性的影响...',
        isRecommended: true
      },
      {
        id: 2,
        title: '游泳初学者的8周进阶计划',
        cover: '/images/teams/article2.jpg',
        category: '训练计划',
        views: 986,
        likes: 245,
        publishDate: '2023-07-20',
        summary: '这套为期8周的训练计划专为游泳初学者设计，循序渐进提高技能...',
        isRecommended: true
      },
      {
        id: 3,
        title: '游泳前后的拉伸动作指南',
        cover: '/images/teams/article3.jpg',
        category: '训练计划',
        views: 756,
        likes: 189,
        publishDate: '2023-07-25',
        summary: '正确的拉伸可以预防受伤，提高游泳效率，本文详细介绍游泳前后的拉伸动作...',
        isRecommended: false
      },
      {
        id: 4,
        title: '如何选择适合自己的泳镜',
        cover: '/images/teams/article4.jpg',
        category: '装备选择',
        views: 632,
        likes: 157,
        publishDate: '2023-08-01',
        summary: '泳镜是游泳的必备装备，如何选择一款舒适、防水、防雾的泳镜...',
        isRecommended: false
      },
      {
        id: 5,
        title: '游泳运动员的营养补充指南',
        cover: '/images/teams/article5.jpg',
        category: '营养饮食',
        views: 542,
        likes: 136,
        publishDate: '2023-08-05',
        summary: '游泳是一项高消耗的运动，合理的营养补充对提高训练效果和比赛成绩至关重要...',
        isRecommended: true
      }
    ],
    searchValue: '',
    activeCategory: 0 // 0表示全部
  },
  
  onLoad: function() {
    // 页面加载时执行
  },
  
  onSearch: function(e) {
    const value = e.detail.value;
    this.setData({
      searchValue: value
    });
    // 实际应用中，这里应该有搜索逻辑
  },
  
  clearSearch: function() {
    this.setData({
      searchValue: ''
    });
  },
  
  selectCategory: function(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      activeCategory: id
    });
  },
  
  viewArticle: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/team/article-detail?id=${id}`
    });
  },
  
  getFilteredArticles: function() {
    let result = this.data.articles;
    
    // 按分类筛选
    if (this.data.activeCategory !== 0) {
      const category = this.data.categories.find(c => c.id === this.data.activeCategory);
      if (category) {
        result = result.filter(article => article.category === category.name);
      }
    }
    
    // 按搜索关键词筛选
    if (this.data.searchValue) {
      const keyword = this.data.searchValue.toLowerCase();
      result = result.filter(article => 
        article.title.toLowerCase().includes(keyword) || 
        article.summary.toLowerCase().includes(keyword)
      );
    }
    
    return result;
  }
})