// api.js - API服务层，封装业务逻辑

const request = require('./request');
const errorHandler = require('./error');
const storage = require('./storage');

/**
 * API服务
 * 封装所有业务API请求，统一处理错误和缓存
 */
const api = {
  // 基础配置
  config: {
    // 是否启用API缓存
    enableCache: true,
    
    // 默认缓存时间（毫秒）
    defaultCacheTime: 5 * 60 * 1000, // 5分钟
    
    // 缓存前缀
    cachePrefix: 'api_cache_',
    
    // 是否自动处理错误
    autoHandleError: true
  },
  
  /**
   * 初始化API服务
   * @param {object} options - 配置选项
   */
  init: function(options = {}) {
    this.config = { ...this.config, ...options };
  },
  
  /**
   * 用户相关API
   */
  user: {
    /**
     * 获取用户信息
     * @param {string} userId - 用户ID
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    getUserInfo: function(userId, options = {}) {
      const url = `/user/${userId}`;
      return api.request('GET', url, {}, {
        cache: true,
        cacheTime: 10 * 60 * 1000, // 10分钟
        ...options
      });
    },
    
    /**
     * 更新用户信息
     * @param {string} userId - 用户ID
     * @param {object} data - 用户数据
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    updateUserInfo: function(userId, data, options = {}) {
      const url = `/user/${userId}`;
      return api.request('PUT', url, data, {
        invalidateCache: [`/user/${userId}`],
        ...options
      });
    },
    
    /**
     * 获取用户积分历史
     * @param {string} userId - 用户ID
     * @param {object} params - 查询参数
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    getPointsHistory: function(userId, params = {}, options = {}) {
      const url = `/user/${userId}/points`;
      return api.request('GET', url, params, {
        cache: true,
        ...options
      });
    },
    
    /**
     * 获取用户优惠券
     * @param {string} userId - 用户ID
     * @param {object} params - 查询参数
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    getCoupons: function(userId, params = {}, options = {}) {
      const url = `/user/${userId}/coupons`;
      return api.request('GET', url, params, {
        cache: true,
        ...options
      });
    }
  },
  
  /**
   * 课程相关API
   */
  course: {
    /**
     * 获取课程列表
     * @param {object} params - 查询参数
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    getCourses: function(params = {}, options = {}) {
      const url = '/courses';
      return api.request('GET', url, params, {
        cache: true,
        ...options
      });
    },
    
    /**
     * 获取课程详情
     * @param {string} courseId - 课程ID
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    getCourseDetail: function(courseId, options = {}) {
      const url = `/courses/${courseId}`;
      return api.request('GET', url, {}, {
        cache: true,
        ...options
      });
    },
    
    /**
     * 报名课程
     * @param {string} courseId - 课程ID
     * @param {object} data - 报名数据
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    enrollCourse: function(courseId, data = {}, options = {}) {
      const url = `/courses/${courseId}/enroll`;
      return api.request('POST', url, data, {
        invalidateCache: ['/courses', `/courses/${courseId}`, '/user/*/courses'],
        ...options
      });
    }
  },
  
  /**
   * 预约相关API
   */
  booking: {
    /**
     * 获取可预约时间段
     * @param {string} date - 日期
     * @param {object} params - 查询参数
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    getAvailableSlots: function(date, params = {}, options = {}) {
      const url = '/booking/slots';
      return api.request('GET', url, { date, ...params }, {
        cache: true,
        cacheTime: 5 * 60 * 1000, // 5分钟
        ...options
      });
    },
    
    /**
     * 创建预约
     * @param {object} data - 预约数据
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    createBooking: function(data, options = {}) {
      const url = '/booking';
      return api.request('POST', url, data, {
        invalidateCache: ['/booking/slots', '/user/*/bookings'],
        ...options
      });
    },
    
    /**
     * 获取用户预约列表
     * @param {string} userId - 用户ID
     * @param {object} params - 查询参数
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    getUserBookings: function(userId, params = {}, options = {}) {
      const url = `/user/${userId}/bookings`;
      return api.request('GET', url, params, {
        cache: true,
        ...options
      });
    },
    
    /**
     * 取消预约
     * @param {string} bookingId - 预约ID
     * @param {object} data - 取消原因等数据
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    cancelBooking: function(bookingId, data = {}, options = {}) {
      const url = `/booking/${bookingId}/cancel`;
      return api.request('POST', url, data, {
        invalidateCache: ['/booking/slots', '/user/*/bookings'],
        ...options
      });
    }
  },
  
  /**
   * 活动相关API
   */
  event: {
    /**
     * 获取活动列表
     * @param {object} params - 查询参数
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    getEvents: function(params = {}, options = {}) {
      const url = '/events';
      return api.request('GET', url, params, {
        cache: true,
        ...options
      });
    },
    
    /**
     * 获取活动详情
     * @param {string} eventId - 活动ID
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    getEventDetail: function(eventId, options = {}) {
      const url = `/events/${eventId}`;
      return api.request('GET', url, {}, {
        cache: true,
        ...options
      });
    },
    
    /**
     * 报名活动
     * @param {string} eventId - 活动ID
     * @param {object} data - 报名数据
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    joinEvent: function(eventId, data = {}, options = {}) {
      const url = `/events/${eventId}/join`;
      return api.request('POST', url, data, {
        invalidateCache: ['/events', `/events/${eventId}`],
        ...options
      });
    }
  },
  
  /**
   * 团队相关API
   */
  team: {
    /**
     * 获取团队列表
     * @param {object} params - 查询参数
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    getTeams: function(params = {}, options = {}) {
      const url = '/teams';
      return api.request('GET', url, params, {
        cache: true,
        ...options
      });
    },
    
    /**
     * 获取团队详情
     * @param {string} teamId - 团队ID
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    getTeamDetail: function(teamId, options = {}) {
      const url = `/teams/${teamId}`;
      return api.request('GET', url, {}, {
        cache: true,
        ...options
      });
    },
    
    /**
     * 获取教练列表
     * @param {object} params - 查询参数
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    getCoaches: function(params = {}, options = {}) {
      const url = '/coaches';
      return api.request('GET', url, params, {
        cache: true,
        ...options
      });
    },
    
    /**
     * 获取教练详情
     * @param {string} coachId - 教练ID
     * @param {object} options - 请求选项
     * @returns {Promise} Promise对象
     */
    getCoachDetail: function(coachId, options = {}) {
      const url = `/coaches/${coachId}`;
      return api.request('GET', url, {}, {
        cache: true,
        ...options
      });
    }
  },
  
  /**
   * 通用请求方法
   * @param {string} method - 请求方法
   * @param {string} url - 请求路径
   * @param {object} data - 请求数据
   * @param {object} options - 请求选项
   * @returns {Promise} Promise对象
   */
  request: function(method, url, data = {}, options = {}) {
    // 合并选项
    const requestOptions = {
      ...options,
      cache: options.cache !== undefined ? options.cache : this.config.enableCache,
      cacheTime: options.cacheTime || this.config.defaultCacheTime
    };
    
    // 生成缓存键
    const cacheKey = this._generateCacheKey(method, url, data);
    
    // 如果启用缓存且是GET请求，尝试从缓存获取
    if (requestOptions.cache && method === 'GET') {
      const cachedData = this._getCache(cacheKey);
      if (cachedData) {
        return Promise.resolve(cachedData);
      }
    }
    
    // 发起请求
    return new Promise((resolve, reject) => {
      const requestMethod = method.toLowerCase();
      
      let requestPromise;
      if (requestMethod === 'get') {
        requestPromise = request.get(url, data, requestOptions);
      } else if (requestMethod === 'post') {
        requestPromise = request.post(url, data, requestOptions);
      } else if (requestMethod === 'put') {
        requestPromise = request.put(url, data, requestOptions);
      } else if (requestMethod === 'delete') {
        requestPromise = request.delete(url, data, requestOptions);
      } else {
        requestPromise = request.request(method, url, data, requestOptions);
      }
      
      requestPromise
        .then(response => {
          // 如果启用缓存且是GET请求，保存到缓存
          if (requestOptions.cache && method === 'GET') {
            this._setCache(cacheKey, response, requestOptions.cacheTime);
          }
          
          // 如果需要使某些缓存失效
          if (requestOptions.invalidateCache && requestOptions.invalidateCache.length > 0) {
            this._invalidateCache(requestOptions.invalidateCache);
          }
          
          resolve(response);
        })
        .catch(error => {
          // 自动处理错误
          if (requestOptions.autoHandleError !== false && this.config.autoHandleError) {
            errorHandler.handleError(error, `API请求: ${method} ${url}`, {
              showToUser: requestOptions.showError !== false
            });
          }
          
          reject(error);
        });
    });
  },
  
  /**
   * 生成缓存键
   * @private
   * @param {string} method - 请求方法
   * @param {string} url - 请求路径
   * @param {object} data - 请求数据
   * @returns {string} 缓存键
   */
  _generateCacheKey: function(method, url, data) {
    const dataStr = JSON.stringify(data || {});
    return `${this.config.cachePrefix}${method}_${url}_${dataStr}`;
  },
  
  /**
   * 获取缓存数据
   * @private
   * @param {string} key - 缓存键
   * @returns {*} 缓存数据
   */
  _getCache: function(key) {
    return storage.get(key);
  },
  
  /**
   * 设置缓存数据
   * @private
   * @param {string} key - 缓存键
   * @param {*} data - 缓存数据
   * @param {number} expireTime - 过期时间（毫秒）
   */
  _setCache: function(key, data, expireTime) {
    storage.set(key, data, expireTime);
  },
  
  /**
   * 使缓存失效
   * @private
   * @param {Array<string>} patterns - 缓存键模式数组
   */
  _invalidateCache: function(patterns) {
    if (!patterns || !Array.isArray(patterns)) {
      return;
    }
    
    // 获取所有缓存信息
    const cacheInfo = storage.getInfo();
    const cacheKeys = Object.keys(cacheInfo);
    
    // 遍历所有缓存键
    cacheKeys.forEach(key => {
      // 只处理API缓存
      if (key.startsWith(this.config.cachePrefix)) {
        // 检查是否匹配任一模式
        const matched = patterns.some(pattern => {
          // 将*替换为正则表达式中的.*
          const regexPattern = pattern.replace(/\*/g, '.*');
          const regex = new RegExp(regexPattern);
          
          // 提取URL部分进行匹配
          const urlPart = key.split(this.config.cachePrefix)[1];
          return regex.test(urlPart);
        });
        
        // 如果匹配，删除缓存
        if (matched) {
          storage.remove(key);
        }
      }
    });
  },
  
  /**
   * 清除所有API缓存
   */
  clearCache: function() {
    // 获取所有缓存信息
    const cacheInfo = storage.getInfo();
    const cacheKeys = Object.keys(cacheInfo);
    
    // 遍历所有缓存键
    cacheKeys.forEach(key => {
      // 只清除API缓存
      if (key.startsWith(this.config.cachePrefix)) {
        storage.remove(key);
      }
    });
  }
};

module.exports = api;