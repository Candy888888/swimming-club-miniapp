// analytics.js - 数据分析和统计工具

const storage = require('./storage');

/**
 * 数据分析和统计工具
 * 用于收集用户行为数据，分析用户使用情况
 */
const analytics = {
  // 配置选项
  config: {
    // 是否启用数据分析
    enabled: true,
    
    // 是否自动上报
    autoReport: true,
    
    // 自动上报间隔（毫秒）
    reportInterval: 30 * 1000, // 30秒
    
    // 最大缓存事件数量
    maxCacheEvents: 100,
    
    // 缓存键名
    cacheKey: 'analytics_events',
    
    // 用户ID存储键名
    userIdKey: 'analytics_user_id',
    
    // 会话ID存储键名
    sessionIdKey: 'analytics_session_id',
    
    // 会话超时时间（毫秒）
    sessionTimeout: 30 * 60 * 1000, // 30分钟
    
    // 上报API地址
    reportUrl: 'https://api.example.com/analytics'
  },
  
  // 事件缓存
  _eventCache: [],
  
  // 定时上报任务ID
  _reportTimerId: null,
  
  // 用户ID
  _userId: null,
  
  // 会话ID
  _sessionId: null,
  
  // 会话开始时间
  _sessionStartTime: 0,
  
  // 最后活动时间
  _lastActivityTime: 0,
  
  /**
   * 初始化分析工具
   * @param {object} options - 配置选项
   */
  init: function(options = {}) {
    // 合并配置
    this.config = { ...this.config, ...options };
    
    // 如果未启用，直接返回
    if (!this.config.enabled) {
      return;
    }
    
    // 加载缓存的事件
    this._loadCachedEvents();
    
    // 获取或生成用户ID
    this._initUserId();
    
    // 创建或恢复会话
    this._initSession();
    
    // 注册应用生命周期事件
    this._registerAppEvents();
    
    // 如果启用自动上报，启动定时上报任务
    if (this.config.autoReport) {
      this._startAutoReport();
    }
    
    // 记录初始化事件
    this.trackEvent('app_init', {
      version: typeof __wxConfig !== 'undefined' ? __wxConfig.version : ''
    });
  },
  
  /**
   * 跟踪事件
   * @param {string} eventName - 事件名称
   * @param {object} [params={}] - 事件参数
   */
  trackEvent: function(eventName, params = {}) {
    // 如果未启用，直接返回
    if (!this.config.enabled) {
      return;
    }
    
    // 更新最后活动时间
    this._updateLastActivityTime();
    
    // 创建事件对象
    const event = {
      eventId: this._generateId(),
      eventName: eventName,
      params: params,
      timestamp: Date.now(),
      userId: this._userId,
      sessionId: this._sessionId,
      platform: 'miniprogram',
      scene: this._getScene(),
      page: this._getCurrentPage()
    };
    
    // 添加到缓存
    this._eventCache.push(event);
    
    // 如果缓存事件数量超过最大值，保存并上报
    if (this._eventCache.length >= this.config.maxCacheEvents) {
      this._saveCachedEvents();
      
      if (this.config.autoReport) {
        this.reportEvents();
      }
    }
  },
  
  /**
   * 跟踪页面浏览
   * @param {string} pagePath - 页面路径
   * @param {object} [params={}] - 页面参数
   */
  trackPageView: function(pagePath, params = {}) {
    this.trackEvent('page_view', {
      page_path: pagePath,
      ...params
    });
  },
  
  /**
   * 跟踪用户登录
   * @param {string} userId - 用户ID
   * @param {object} [userInfo={}] - 用户信息
   */
  trackLogin: function(userId, userInfo = {}) {
    // 更新用户ID
    this._userId = userId;
    storage.set(this.config.userIdKey, userId);
    
    // 记录登录事件
    this.trackEvent('user_login', {
      user_id: userId,
      ...userInfo
    });
  },
  
  /**
   * 跟踪用户注销
   */
  trackLogout: function() {
    // 记录注销事件
    this.trackEvent('user_logout', {
      user_id: this._userId
    });
  },
  
  /**
   * 跟踪错误
   * @param {string|Error} error - 错误对象或错误消息
   * @param {string} [context=''] - 错误发生的上下文
   */
  trackError: function(error, context = '') {
    let errorInfo = {};
    
    if (error instanceof Error) {
      errorInfo = {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    } else if (typeof error === 'string') {
      errorInfo = {
        message: error
      };
    } else if (typeof error === 'object') {
      errorInfo = { ...error };
    }
    
    this.trackEvent('error', {
      ...errorInfo,
      context: context
    });
  },
  
  /**
   * 上报事件数据
   * @returns {Promise} Promise对象
   */
  reportEvents: function() {
    // 如果未启用或没有事件，直接返回
    if (!this.config.enabled || this._eventCache.length === 0) {
      return Promise.resolve();
    }
    
    // 保存缓存事件
    this._saveCachedEvents();
    
    // 获取所有缓存事件
    const events = storage.get(this.config.cacheKey) || [];
    if (events.length === 0) {
      return Promise.resolve();
    }
    
    // 构建上报数据
    const reportData = {
      app_id: typeof __wxConfig !== 'undefined' ? __wxConfig.appId : '',
      version: typeof __wxConfig !== 'undefined' ? __wxConfig.version : '',
      events: events
    };
    
    // 上报数据
    return new Promise((resolve, reject) => {
      // 实际项目中，这里应该调用真实的上报API
      // 这里使用模拟实现
      this._mockReportApi(reportData)
        .then(res => {
          // 上报成功，清除已上报的事件
          storage.remove(this.config.cacheKey);
          resolve(res);
        })
        .catch(err => {
          console.error('Analytics report failed:', err);
          reject(err);
        });
    });
  },
  
  /**
   * 清除所有缓存的事件数据
   */
  clearEvents: function() {
    this._eventCache = [];
    storage.remove(this.config.cacheKey);
  },
  
  /**
   * 设置用户属性
   * @param {object} properties - 用户属性
   */
  setUserProperties: function(properties) {
    if (!this.config.enabled || !properties) {
      return;
    }
    
    this.trackEvent('set_user_properties', properties);
  },
  
  /**
   * 初始化用户ID
   * @private
   */
  _initUserId: function() {
    // 尝试从存储中获取用户ID
    this._userId = storage.get(this.config.userIdKey);
    
    // 如果没有，生成一个新的
    if (!this._userId) {
      this._userId = this._generateId();
      storage.set(this.config.userIdKey, this._userId);
    }
  },
  
  /**
   * 初始化会话
   * @private
   */
  _initSession: function() {
    const now = Date.now();
    const sessionData = storage.get(this.config.sessionIdKey);
    
    // 如果有会话数据且未超时，恢复会话
    if (sessionData && sessionData.lastActivity && 
        now - sessionData.lastActivity < this.config.sessionTimeout) {
      this._sessionId = sessionData.id;
      this._sessionStartTime = sessionData.startTime;
    } else {
      // 创建新会话
      this._sessionId = this._generateId();
      this._sessionStartTime = now;
    }
    
    // 更新最后活动时间
    this._lastActivityTime = now;
    
    // 保存会话数据
    this._saveSessionData();
  },
  
  /**
   * 保存会话数据
   * @private
   */
  _saveSessionData: function() {
    storage.set(this.config.sessionIdKey, {
      id: this._sessionId,
      startTime: this._sessionStartTime,
      lastActivity: this._lastActivityTime
    });
  },
  
  /**
   * 更新最后活动时间
   * @private
   */
  _updateLastActivityTime: function() {
    const now = Date.now();
    
    // 如果超过会话超时时间，创建新会话
    if (now - this._lastActivityTime > this.config.sessionTimeout) {
      this._sessionId = this._generateId();
      this._sessionStartTime = now;
      
      // 记录会话开始事件
      this.trackEvent('session_start', {
        previous_session_id: this._sessionId
      });
    }
    
    this._lastActivityTime = now;
    this._saveSessionData();
  },
  
  /**
   * 注册应用生命周期事件
   * @private
   */
  _registerAppEvents: function() {
    // 获取App实例
    const app = getApp();
    if (!app) return;
    
    // 保存原始方法
    const originalOnShow = app.onShow;
    const originalOnHide = app.onHide;
    const originalOnError = app.onError;
    
    // 重写onShow方法
    app.onShow = (options) => {
      // 调用原始方法
      if (typeof originalOnShow === 'function') {
        originalOnShow.call(app, options);
      }
      
      // 记录应用显示事件
      this.trackEvent('app_show', {
        scene: options ? options.scene : '',
        path: options ? options.path : '',
        query: options ? JSON.stringify(options.query || {}) : '{}'
      });
    };
    
    // 重写onHide方法
    app.onHide = () => {
      // 调用原始方法
      if (typeof originalOnHide === 'function') {
        originalOnHide.call(app);
      }
      
      // 记录应用隐藏事件
      this.trackEvent('app_hide', {
        session_duration: Date.now() - this._sessionStartTime
      });
      
      // 保存缓存事件
      this._saveCachedEvents();
      
      // 如果启用自动上报，立即上报
      if (this.config.autoReport) {
        this.reportEvents();
      }
    };
    
    // 重写onError方法
    app.onError = (error) => {
      // 调用原始方法
      if (typeof originalOnError === 'function') {
        originalOnError.call(app, error);
      }
      
      // 记录应用错误事件
      this.trackError(error, 'app_error');
    };
    
    // 注册页面生命周期事件
    this._registerPageEvents();
  },
  
  /**
   * 注册页面生命周期事件
   * @private
   */
  _registerPageEvents: function() {
    // 保存原始Page构造函数
    const originalPage = Page;
    
    // 重写Page构造函数
    Page = (config) => {
      // 保存原始生命周期方法
      const originalOnLoad = config.onLoad;
      const originalOnShow = config.onShow;
      const originalOnHide = config.onHide;
      const originalOnUnload = config.onUnload;
      
      // 重写onLoad方法
      config.onLoad = function(options) {
        // 调用原始方法
        if (typeof originalOnLoad === 'function') {
          originalOnLoad.call(this, options);
        }
        
        // 记录页面加载事件
        analytics.trackEvent('page_load', {
          page: this.route,
          options: JSON.stringify(options || {})
        });
      };
      
      // 重写onShow方法
      config.onShow = function() {
        // 调用原始方法
        if (typeof originalOnShow === 'function') {
          originalOnShow.call(this);
        }
        
        // 记录页面显示事件
        analytics.trackPageView(this.route);
      };
      
      // 重写onHide方法
      config.onHide = function() {
        // 调用原始方法
        if (typeof originalOnHide === 'function') {
          originalOnHide.call(this);
        }
        
        // 记录页面隐藏事件
        analytics.trackEvent('page_hide', {
          page: this.route
        });
      };
      
      // 重写onUnload方法
      config.onUnload = function() {
        // 调用原始方法
        if (typeof originalOnUnload === 'function') {
          originalOnUnload.call(this);
        }
        
        // 记录页面卸载事件
        analytics.trackEvent('page_unload', {
          page: this.route
        });
      };
      
      // 调用原始Page构造函数
      return originalPage(config);
    };
  },
  
  /**
   * 启动自动上报任务
   * @private
   */
  _startAutoReport: function() {
    // 清除已有的定时器
    if (this._reportTimerId) {
      clearInterval(this._reportTimerId);
    }
    
    // 创建新的定时器
    this._reportTimerId = setInterval(() => {
      // 如果有缓存事件，上报
      if (this._eventCache.length > 0 || storage.get(this.config.cacheKey)) {
        this.reportEvents();
      }
    }, this.config.reportInterval);
  },
  
  /**
   * 停止自动上报任务
   */
  stopAutoReport: function() {
    if (this._reportTimerId) {
      clearInterval(this._reportTimerId);
      this._reportTimerId = null;
    }
  },
  
  /**
   * 加载缓存的事件
   * @private
   */
  _loadCachedEvents: function() {
    const cachedEvents = storage.get(this.config.cacheKey) || [];
    this._eventCache = cachedEvents;
  },
  
  /**
   * 保存缓存的事件
   * @private
   */
  _saveCachedEvents: function() {
    if (this._eventCache.length === 0) {
      return;
    }
    
    // 获取已有的缓存事件
    const cachedEvents = storage.get(this.config.cacheKey) || [];
    
    // 合并事件
    const allEvents = [...cachedEvents, ...this._eventCache];
    
    // 保存到存储
    storage.set(this.config.cacheKey, allEvents);
    
    // 清空内存缓存
    this._eventCache = [];
  },
  
  /**
   * 生成唯一ID
   * @private
   * @returns {string} 唯一ID
   */
  _generateId: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  /**
   * 获取当前场景值
   * @private
   * @returns {string} 场景值
   */
  _getScene: function() {
    try {
      const launchInfo = wx.getLaunchOptionsSync();
      return launchInfo.scene ? launchInfo.scene.toString() : '';
    } catch (e) {
      return '';
    }
  },
  
  /**
   * 获取当前页面路径
   * @private
   * @returns {string} 页面路径
   */
  _getCurrentPage: function() {
    const pages = getCurrentPages();
    if (pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      return currentPage.route || '';
    }
    return '';
  },
  
  /**
   * 模拟上报API调用
   * @private
   * @param {object} data - 上报数据
   * @returns {Promise} Promise对象
   */
  _mockReportApi: function(data) {
    return new Promise(resolve => {
      // 模拟网络延迟
      setTimeout(() => {
        console.log('Analytics data reported:', data);
        resolve({ success: true });
      }, 500);
    });
  }
};

module.exports = analytics;