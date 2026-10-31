// merchandise.js - 游泳周边页面
Page({
  data: {
    categories: [
      { id: 1, name: '全部', active: true },
      { id: 2, name: '泳镜', active: false },
      { id: 3, name: '泳衣', active: false },
      { id: 4, name: '泳帽', active: false },
      { id: 5, name: '训练装备', active: false },
      { id: 6, name: '护理用品', active: false }
    ],
    products: [
      {
        id: 1,
        name: '专业防雾泳镜',
        image: '/images/products/goggles.jpg',
        price: 199,
        originalPrice: 299,
        sales: 1256,
        category: '泳镜',
        tags: ['防雾', '防水', 'UV防护'],
        rating: 4.8
      },
      {
        id: 2,
        name: '竞速训练泳衣',
        image: '/images/products/swimsuit.jpg',
        price: 399,
        originalPrice: 499,
        sales: 986,
        category: '泳衣',
        tags: ['速干', '耐氯', '舒适'],
        rating: 4.7
      },
      {
        id: 3,
        name: '硅胶防水泳帽',
        image: '/images/products/cap.jpg',
        price: 89,
        originalPrice: 129,
        sales: 2156,
        category: '泳帽',
        tags: ['防水', '舒适', '耐用'],
        rating: 4.9
      },
      {
        id: 4,
        name: '专业训练脚蹼',
        image: '/images/products/fins.jpg',
        price: 259,
        originalPrice: 359,
        sales: 756,
        category: '训练装备',
        tags: ['增强力量', '提高技术', '耐用'],
        rating: 4.6
      },
      {
        id: 5,
        name: '游泳耳塞鼻夹套装',
        image: '/images/products/earplug.jpg',
        price: 59,
        originalPrice: 89,
        sales: 3256,
        category: '训练装备',
        tags: ['防水', '舒适', '耐用'],
        rating: 4.5
      },
      {
        id: 6,
        name: '游泳后护肤套装',
        image: '/images/products/skincare.jpg',
        price: 159,
        originalPrice: 199,
        sales: 856,
        category: '护理用品',
        tags: ['保湿', '修复', '防氯'],
        rating: 4.7
      }
    ],
    searchValue: '',
    sortType: 'default', // default, sales, price-asc, price-desc
    currentCategory: '全部'
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
    const name = e.currentTarget.dataset.name;
    
    // 更新分类状态
    const categories = this.data.categories.map(item => {
      return {
        ...item,
        active: item.id === id
      };
    });
    
    this.setData({
      categories,
      currentCategory: name
    });
  },
  
  changeSort: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      sortType: type
    });
  },
  
  viewProduct: function(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/team/product-detail?id=${id}`
    });
  },
  
  getFilteredProducts: function() {
    let result = this.data.products;
    
    // 按分类筛选
    if (this.data.currentCategory !== '全部') {
      result = result.filter(product => product.category === this.data.currentCategory);
    }
    
    // 按搜索关键词筛选
    if (this.data.searchValue) {
      const keyword = this.data.searchValue.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(keyword) || 
        product.category.toLowerCase().includes(keyword) ||
        product.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    }
    
    // 排序
    switch(this.data.sortType) {
      case 'sales':
        result.sort((a, b) => b.sales - a.sales);
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        // 默认排序，保持原顺序
        break;
    }
    
    return result;
  },
  
  addToCart: function(e) {
    const id = e.currentTarget.dataset.id;
    // 实际应用中，这里应该有添加购物车的逻辑
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    });
    // 阻止事件冒泡
    e.stopPropagation();
  }
})