// performance.js - 性能监控和优化工具

const storage = require('./storage');
const logger = require('./logger');

/**
 * 性能监控和优化工具
 * 用于监控和分析小程序性能，提供性能数据收集和优化建议
 */
const performance = {
  // 配置选项
  config: {
    // 是否启用性能监控
    enabled: true,
    
    // 是否自动上报
    autoReport: true,
    
    // 自动上报间隔（毫秒）
    reportInterval: 60 * 1000, // 60秒
    
    // 性能数据存储键名
    storageKey: 'performance_data',
    
    // 最大存储记录数
    maxRecords: 100,
    
    // 是否记录页面性能
    recordPagePerformance: true,
    
    // 是否记录网络请求性能
    recordNetworkPerformance: true,
    
    // 是否记录渲染性能
    recordRenderPerformance: true,
    
    // 是否记录内存使用情况
    recordMemoryUsage: true,
    
    // 是否记录API调用性能
    recordApiPerformance: true,
    
    // 是否记录启动性能
    recordLaunchPerformance: true,
    
    // 慢操作阈值（毫秒）
    slowOperationThreshold: 1000,
    
    // 慢页面加载阈值（毫秒）
    slowPageLoadThreshold: 500,
    
    // 慢网络请求阈值（毫秒）
    slowNetworkRequestThreshold: 1000,
    
    // 上报API地址
    reportUrl: 'https://api.example.com/performance'
  },
  
  // 性能数据
  _performanceData: {
    // 应用启动性能
    appLaunch: null,
    
    // 页面性能记录
    pages: {},
    
    // 网络请求性能记录
    networkRequests: [],
    
    // API调用性能记录
    apiCalls: [],
    
    // 渲染性能记录
    renders: [],
    
    // 内存使用记录
    memoryUsage: []
  },
  
  // 计时器记录
  _timers: {},
  
  // 页面加载时间记录
  _pageLoadTimes: {},
  
  // 自动上报定时器ID
  _reportTimerId: null,
  
  // 应用启动时间
  _appLaunchTime: 0,
  
  /**
   * 初始化性能监控
   * @param {object} options - 配置选项
   */
  init: function(options = {}) {
    // 合并配置
    this.config = { ...this.config, ...options };
    
    // 如果未启用，直接返回
    if (!this.config.enabled) {
      return;
    }
    
    // 记录应用启动时间
    this._appLaunchTime = Date.now();
    
    // 加载缓存的性能数据
    this._loadPerformanceData();
    
    // 监控应用启动性能
    if (this.config.recordLaunchPerformance) {
      this._monitorAppLaunch();
    }
    
    // 监控页面性能
    if (this.config.recordPagePerformance) {
      this._monitorPagePerformance();
    }
    
    // 监控网络请求性能
    if (this.config.recordNetworkPerformance) {
      this._monitorNetworkPerformance();
    }
    
    // 监控API调用性能
    if (this.config.recordApiPerformance) {
      this._monitorApiPerformance();
    }
    
    // 监控内存使用情况
    if (this.config.recordMemoryUsage) {
      this._monitorMemoryUsage();
    }
    
    // 如果启用自动上报，启动定时上报任务
    if (this.config.autoReport) {
      this._startAutoReport();
    }
  },
  
  /**
   * 开始计时
   * @param {string} name - 计时器名称
   * @param {object} [metadata={}] - 附加元数据
   * @returns {string} 计时器ID
   */
  startTimer: function(name, metadata = {}) {
    if (!this.config.enabled) return '';
    
    const timerId = `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    this._timers[timerId] = {
      name,
      startTime: Date.now(),
      metadata
    };
    
    return timerId;
  },
  
  /**
   * 结束计时
   * @param {string} timerId - 计时器ID
   * @param {object} [additionalData={}] - 附加数据
   * @returns {object|null} 计时结果
   */
  endTimer: function(timerId, additionalData = {}) {
    if (!this.config.enabled || !timerId || !this._timers[timerId]) {
      return null;
    }
    
    const endTime = Date.now();
    const timer = this._timers[timerId];
    const duration = endTime - timer.startTime;
    
    // 创建计时结果
    const result = {
      name: timer.name,
      startTime: timer.startTime,
      endTime: endTime,
      duration: duration,
      metadata: { ...timer.metadata, ...additionalData }
    };
    
    // 检查是否为慢操作
    if (duration > this.config.slowOperationThreshold) {
      result.isSlow = true;
      logger.warn(`Slow operation detected: ${timer.name} took ${duration}ms`);
    }
    
    // 根据计时器名称分类记录
    if (timer.name.startsWith('api_')) {
      this._performanceData.apiCalls.push(result);
    } else if (timer.name.startsWith('render_')) {
      this._performanceData.renders.push(result);
    } else if (timer.name.startsWith('network_')) {
      this._performanceData.networkRequests.push(result);
    }
    
    // 删除计时器
    delete this._timers[timerId];
    
    // 保存性能数据
    this._savePerformanceData();
    
    return result;
  },
  
  /**
   * 记录页面加载时间
   * @param {string} pagePath - 页面路径
   * @param {number} loadTime - 加载时间（毫秒）
   * @param {object} [pageData={}] - 页面数据
   */
  recordPageLoad: function(pagePath, loadTime, pageData = {}) {
    if (!this.config.enabled || !pagePath) {
      return;
    }
    
    // 创建页面加载记录
    const record = {
      pagePath,
      loadTime,
      timestamp: Date.now(),
      ...pageData
    };
    
    // 检查是否为慢页面加载
    if (loadTime > this.config.slowPageLoadThreshold) {
      record.isSlow = true;
      logger.warn(`Slow page load detected: ${pagePath} took ${loadTime}ms`);
    }
    
    // 记录页面加载时间
    if (!this._performanceData.pages[pagePath]) {
      this._performanceData.pages[pagePath] = [];
    }
    
    this._performanceData.pages[pagePath].push(record);
    
    // 保存性能数据
    this._savePerformanceData();
  },
  
  /**
   * 记录网络请求性能
   * @param {string} url - 请求URL
   * @param {string} method - 请求方法
   * @param {number} requestTime - 请求时间（毫秒）
   * @param {number} responseSize - 响应大小（字节）
   * @param {number} statusCode - 状态码
   * @param {object} [additionalData={}] - 附加数据
   */
  recordNetworkRequest: function(url, method, requestTime, responseSize, statusCode, additionalData = {}) {
    if (!this.config.enabled) {
      return;
    }
    
    // 创建网络请求记录
    const record = {
      url,
      method,
      requestTime,
      responseSize,
      statusCode,
      timestamp: Date.now(),
      ...additionalData
    };
    
    // 检查是否为慢网络请求
    if (requestTime > this.config.slowNetworkRequestThreshold) {
      record.isSlow = true;
      logger.warn(`Slow network request detected: ${method} ${url} took ${requestTime}ms`);
    }
    
    // 记录网络请求性能
    this._performanceData.networkRequests.push(record);
    
    // 限制记录数量
    if (this._performanceData.networkRequests.length > this.config.maxRecords) {
      this._performanceData.networkRequests.shift();
    }
    
    // 保存性能数据
    this._savePerformanceData();
  },
  
  /**
   * 记录API调用性能
   * @param {string} apiName - API名称
   * @param {number} duration - 调用时间（毫秒）
   * @param {boolean} success - 是否成功
   * @param {object} [params={}] - 调用参数
   */
  recordApiCall: function(apiName, duration, success, params = {}) {
    if (!this.config.enabled) {
      return;
    }
    
    // 创建API调用记录
    const record = {
      apiName,
      duration,
      success,
      timestamp: Date.now(),
      params: this._sanitizeParams(params)
    };
    
    // 记录API调用性能
    this._performanceData.apiCalls.push(record);
    
    // 限制记录数量
    if (this._performanceData.apiCalls.length > this.config.maxRecords) {
      this._performanceData.apiCalls.shift();
    }
    
    // 保存性能数据
    this._savePerformanceData();
  },
  
  /**
   * 记录渲染性能
   * @param {string} componentName - 组件名称
   * @param {number} renderTime - 渲染时间（毫秒）
   * @param {object} [componentData={}] - 组件数据
   */
  recordRender: function(componentName, renderTime, componentData = {}) {
    if (!this.config.enabled || !this.config.recordRenderPerformance) {
      return;
    }
    
    // 创建渲染记录
    const record = {
      componentName,
      renderTime,
      timestamp: Date.now(),
      ...componentData
    };
    
    // 记录渲染性能
    this._performanceData.renders.push(record);
    
    // 限制记录数量
    if (this._performanceData.renders.length > this.config.maxRecords) {
      this._performanceData.renders.shift();
    }
    
    // 保存性能数据
    this._savePerformanceData();
  },
  
  /**
   * 记录内存使用情况
   * @param {number} memoryUsage - 内存使用量（KB）
   */
  recordMemoryUsage: function(memoryUsage) {
    if (!this.config.enabled || !this.config.recordMemoryUsage) {
      return;
    }
    
    // 创建内存使用记录
    const record = {
      memoryUsage,
      timestamp: Date.now()
    };
    
    // 记录内存使用情况
    this._performanceData.memoryUsage.push(record);
    
    // 限制记录数量
    if (this._performanceData.memoryUsage.length > this.config.maxRecords) {
      this._performanceData.memoryUsage.shift();
    }
    
    // 保存性能数据
    this._savePerformanceData();
  },
  
  /**
   * 获取性能数据
   * @returns {object} 性能数据
   */
  getPerformanceData: function() {
    return this._performanceData;
  },
  
  /**
   * 获取页面性能数据
   * @param {string} [pagePath] - 页面路径，不指定则返回所有页面数据
   * @returns {object|array} 页面性能数据
   */
  getPagePerformance: function(pagePath) {
    if (pagePath) {
      return this._performanceData.pages[pagePath] || [];
    }
    return this._performanceData.pages;
  },
  
  /**
   * 获取网络请求性能数据
   * @returns {array} 网络请求性能数据
   */
  getNetworkPerformance: function() {
    return this._performanceData.networkRequests;
  },
  
  /**
   * 获取API调用性能数据
   * @returns {array} API调用性能数据
   */
  getApiPerformance: function() {
    return this._performanceData.apiCalls;
  },
  
  /**
   * 获取渲染性能数据
   * @returns {array} 渲染性能数据
   */
  getRenderPerformance: function() {
    return this._performanceData.renders;
  },
  
  /**
   * 获取内存使用数据
   * @returns {array} 内存使用数据
   */
  getMemoryUsage: function() {
    return this._performanceData.memoryUsage;
  },
  
  /**
   * 获取应用启动性能数据
   * @returns {object} 应用启动性能数据
   */
  getAppLaunchPerformance: function() {
    return this._performanceData.appLaunch;
  },
  
  /**
   * 获取性能分析报告
   * @returns {object} 性能分析报告
   */
  getPerformanceReport: function() {
    // 计算页面加载平均时间
    const pageLoadTimes = {};
    Object.keys(this._performanceData.pages).forEach(pagePath => {
      const pageData = this._performanceData.pages[pagePath];
      if (pageData.length > 0) {
        const totalTime = pageData.reduce((sum, record) => sum + record.loadTime, 0);
        pageLoadTimes[pagePath] = {
          avgLoadTime: totalTime / pageData.length,
          minLoadTime: Math.min(...pageData.map(record => record.loadTime)),
          maxLoadTime: Math.max(...pageData.map(record => record.loadTime)),
          loadCount: pageData.length,
          slowLoads: pageData.filter(record => record.isSlow).length
        };
      }
    });
    
    // 计算网络请求平均时间
    const networkRequests = this._performanceData.networkRequests;
    const networkStats = networkRequests.length > 0 ? {
      avgRequestTime: networkRequests.reduce((sum, record) => sum + record.requestTime, 0) / networkRequests.length,
      minRequestTime: Math.min(...networkRequests.map(record => record.requestTime)),
      maxRequestTime: Math.max(...networkRequests.map(record => record.requestTime)),
      requestCount: networkRequests.length,
      slowRequests: networkRequests.filter(record => record.isSlow).length,
      errorRequests: networkRequests.filter(record => record.statusCode >= 400).length
    } : {};
    
    // 计算API调用平均时间
    const apiCalls = this._performanceData.apiCalls;
    const apiStats = apiCalls.length > 0 ? {
      avgCallTime: apiCalls.reduce((sum, record) => sum + record.duration, 0) / apiCalls.length,
      minCallTime: Math.min(...apiCalls.map(record => record.duration)),
      maxCallTime: Math.max(...apiCalls.map(record => record.duration)),
      callCount: apiCalls.length,
      failedCalls: apiCalls.filter(record => !record.success).length
    } : {};
    
    // 计算渲染平均时间
    const renders = this._performanceData.renders;
    const renderStats = renders.length > 0 ? {
      avgRenderTime: renders.reduce((sum, record) => sum + record.renderTime, 0) / renders.length,
      minRenderTime: Math.min(...renders.map(record => record.renderTime)),
      maxRenderTime: Math.max(...renders.map(record => record.renderTime)),
      renderCount: renders.length
    } : {};
    
    // 计算内存使用情况
    const memoryUsage = this._performanceData.memoryUsage;
    const memoryStats = memoryUsage.length > 0 ? {
      avgMemoryUsage: memoryUsage.reduce((sum, record) => sum + record.memoryUsage, 0) / memoryUsage.length,
      minMemoryUsage: Math.min(...memoryUsage.map(record => record.memoryUsage)),
      maxMemoryUsage: Math.max(...memoryUsage.map(record => record.memoryUsage)),
      recordCount: memoryUsage.length
    } : {};
    
    // 生成性能报告
    return {
      timestamp: Date.now(),
      appLaunch: this._performanceData.appLaunch,
      pagePerformance: pageLoadTimes,
      networkPerformance: networkStats,
      apiPerformance: apiStats,
      renderPerformance: renderStats,
      memoryPerformance: memoryStats,
      performanceScore: this._calculatePerformanceScore(),
      optimizationSuggestions: this._generateOptimizationSuggestions()
    };
  },
  
  /**
   * 清除性能数据
   */
  clearPerformanceData: function() {
    this._performanceData = {
      appLaunch: null,
      pages: {},
      networkRequests: [],
      apiCalls: [],
      renders: [],
      memoryUsage: []
    };
    
    storage.remove(this.config.storageKey);
  },
  
  /**
   * 上报性能数据
   * @returns {Promise} Promise对象
   */
  reportPerformanceData: function() {
    if (!this.config.enabled) {
      return Promise.resolve();
    }
    
    // 生成性能报告
    const report = this.getPerformanceReport();
    
    // 上报数据
    return new Promise((resolve, reject) => {
      // 实际项目中，这里应该调用真实的上报API
      // 这里使用模拟实现
      this._mockReportApi(report)
        .then(res => {
          logger.info('Performance data reported successfully');
          resolve(res);
        })
        .catch(err => {
          logger.error('Failed to report performance data:', err);
          reject(err);
        });
    });
  },
  
  /**
   * 监控应用启动性能
   * @private
   */
  _monitorAppLaunch: function() {
    const app = getApp();
    if (!app) return;
    
    // 计算应用启动时间
    const now = Date.now();
    const launchTime = now - this._appLaunchTime;
    
    // 记录应用启动性能
    this._performanceData.appLaunch = {
      launchTime,
      timestamp: now,
      isSlow: launchTime > 1000 // 启动时间超过1秒认为较慢
    };
    
    // 如果启动时间过长，记录警告
    if (launchTime > 1000) {
      logger.warn(`Slow app launch detected: ${launchTime}ms`);
    }
    
    // 保存性能数据
    this._savePerformanceData();
  },
  
  /**
   * 监控页面性能
   * @private
   */
  _monitorPagePerformance: function() {
    // 保存原始Page构造函数
    const originalPage = Page;
    const self = this;
    
    // 重写Page构造函数
    Page = function(config) {
      // 保存原始生命周期方法
      const originalOnLoad = config.onLoad;
      const originalOnReady = config.onReady;
      const originalOnShow = config.onShow;
      const originalOnHide = config.onHide;
      const originalOnUnload = config.onUnload;
      
      // 页面加载时间记录
      let pageLoadStartTime = 0;
      
      // 重写onLoad方法
      config.onLoad = function(options) {
        // 记录页面加载开始时间
        pageLoadStartTime = Date.now();
        
        // 调用原始方法
        if (typeof originalOnLoad === 'function') {
          originalOnLoad.call(this, options);
        }
      };
      
      // 重写onReady方法
      config.onReady = function() {
        // 计算页面加载时间
        const loadTime = Date.now() - pageLoadStartTime;
        
        // 记录页面加载时间
        if (this.route) {
          self.recordPageLoad(this.route, loadTime, {
            options: this.options || {}
          });
        }
        
        // 调用原始方法
        if (typeof originalOnReady === 'function') {
          originalOnReady.call(this);
        }
      };
      
      // 调用原始Page构造函数
      return originalPage(config);
    };
  },
  
  /**
   * 监控网络请求性能
   * @private
   */
  _monitorNetworkPerformance: function() {
    // 保存原始wx.request方法
    const originalRequest = wx.request;
    const self = this;
    
    // 重写wx.request方法
    wx.request = function(options) {
      const startTime = Date.now();
      const url = options.url;
      const method = options.method || 'GET';
      
      // 保存原始success回调
      const originalSuccess = options.success;
      
      // 保存原始fail回调
      const originalFail = options.fail;
      
      // 保存原始complete回调
      const originalComplete = options.complete;
      
      // 重写success回调
      options.success = function(res) {
        // 计算请求时间
        const endTime = Date.now();
        const requestTime = endTime - startTime;
        
        // 记录网络请求性能
        self.recordNetworkRequest(
          url,
          method,
          requestTime,
          self._getResponseSize(res),
          res.statusCode,
          {
            headers: res.header,
            requestData: self._sanitizeParams(options.data)
          }
        );
        
        // 调用原始success回调
        if (typeof originalSuccess === 'function') {
          originalSuccess.call(this, res);
        }
      };
      
      // 重写fail回调
      options.fail = function(err) {
        // 计算请求时间
        const endTime = Date.now();
        const requestTime = endTime - startTime;
        
        // 记录网络请求性能
        self.recordNetworkRequest(
          url,
          method,
          requestTime,
          0,
          0,
          {
            error: err,
            requestData: self._sanitizeParams(options.data)
          }
        );
        
        // 调用原始fail回调
        if (typeof originalFail === 'function') {
          originalFail.call(this, err);
        }
      };
      
      // 调用原始wx.request方法
      return originalRequest(options);
    };
  },
  
  /**
   * 监控API调用性能
   * @private
   */
  _monitorApiPerformance: function() {
    // 需要监控的API列表
    const apisToMonitor = [
      'request', 'uploadFile', 'downloadFile',
      'connectSocket', 'sendSocketMessage', 'closeSocket',
      'chooseImage', 'previewImage', 'getImageInfo',
      'saveImageToPhotosAlbum', 'startRecord', 'playVoice',
      'getLocation', 'openLocation', 'chooseLocation',
      'openDocument', 'getSavedFileList', 'getSavedFileInfo',
      'removeSavedFile', 'openDocument', 'getFileInfo',
      'login', 'checkSession', 'authorize',
      'getUserInfo', 'requestPayment', 'showShareMenu',
      'hideShareMenu', 'updateShareMenu', 'getShareInfo',
      'navigateTo', 'redirectTo', 'switchTab', 'navigateBack'
    ];
    
    const self = this;
    
    // 遍历API列表，重写方法
    apisToMonitor.forEach(apiName => {
      if (wx[apiName]) {
        const originalApi = wx[apiName];
        
        wx[apiName] = function(options) {
          const startTime = Date.now();
          let success = true;
          
          // 创建新的options对象
          const newOptions = { ...options };
          
          // 保存原始success回调
          const originalSuccess = newOptions.success;
          
          // 保存原始fail回调
          const originalFail = newOptions.fail;
          
          // 保存原始complete回调
          const originalComplete = newOptions.complete;
          
          // 重写success回调
          newOptions.success = function(res) {
            // 计算API调用时间
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            // 记录API调用性能
            self.recordApiCall(
              `api_${apiName}`,
              duration,
              true,
              self._sanitizeParams(options)
            );
            
            // 调用原始success回调
            if (typeof originalSuccess === 'function') {
              originalSuccess.call(this, res);
            }
          };
          
          // 重写fail回调
          newOptions.fail = function(err) {
            // 计算API调用时间
            const endTime = Date.now();
            const duration = endTime - startTime;
            success = false;
            
            // 记录API调用性能
            self.recordApiCall(
              `api_${apiName}`,
              duration,
              false,
              {
                ...self._sanitizeParams(options),
                error: err
              }
            );
            
            // 调用原始fail回调
            if (typeof originalFail === 'function') {
              originalFail.call(this, err);
            }
          };
          
          // 调用原始API方法
          return originalApi(newOptions);
        };
      }
    });
  },
  
  /**
   * 监控内存使用情况
   * @private
   */
  _monitorMemoryUsage: function() {
    // 检查是否支持获取内存信息
    if (wx.getPerformance) {
      // 定时获取内存使用情况
      const checkMemory = () => {
        try {
          const performance = wx.getPerformance();
          const memory = performance.getMemoryStats();
          
          if (memory && memory.jsHeapSizeLimit) {
            // 记录内存使用情况（KB）
            this.recordMemoryUsage(Math.floor(memory.usedJSHeapSize / 1024));
          }
        } catch (e) {
          logger.error('Failed to get memory usage:', e);
        }
        
        // 每30秒检查一次
        setTimeout(checkMemory, 30000);
      };
      
      // 开始检查内存
      checkMemory();
    } else {
      // 如果不支持，尝试使用系统信息
      wx.getSystemInfo({
        success: (res) => {
          if (res.memory) {
            // 记录内存使用情况（KB）
            this.recordMemoryUsage(res.memory);
          }
        }
      });
    }
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
      this.reportPerformanceData();
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
   * 加载性能数据
   * @private
   */
  _loadPerformanceData: function() {
    const data = storage.get(this.config.storageKey);
    if (data) {
      this._performanceData = data;
    }
  },
  
  /**
   * 保存性能数据
   * @private
   */
  _savePerformanceData: function() {
    storage.set(this.config.storageKey, this._performanceData);
  },
  
  /**
   * 计算性能得分
   * @private
   * @returns {object} 性能得分
   */
  _calculatePerformanceScore: function() {
    // 页面加载得分（满分100）
    let pageLoadScore = 100;
    let pageLoadCount = 0;
    let totalSlowPages = 0;
    
    Object.keys(this._performanceData.pages).forEach(pagePath => {
      const pageData = this._performanceData.pages[pagePath];
      if (pageData.length > 0) {
        pageLoadCount += pageData.length;
        const slowLoads = pageData.filter(record => record.isSlow).length;
        totalSlowPages += slowLoads;
      }
    });
    
    if (pageLoadCount > 0) {
      // 每10%的慢页面加载减10分
      const slowPagePercentage = (totalSlowPages / pageLoadCount) * 100;
      pageLoadScore -= Math.floor(slowPagePercentage / 10) * 10;
    }
    
    // 网络请求得分（满分100）
    let networkScore = 100;
    const networkRequests = this._performanceData.networkRequests;
    if (networkRequests.length > 0) {
      // 每10%的慢请求减10分
      const slowRequests = networkRequests.filter(record => record.isSlow).length;
      const slowRequestPercentage = (slowRequests / networkRequests.length) * 100;
      networkScore -= Math.floor(slowRequestPercentage / 10) * 10;
      
      // 每5%的错误请求减10分
      const errorRequests = networkRequests.filter(record => record.statusCode >= 400).length;
      const errorRequestPercentage = (errorRequests / networkRequests.length) * 100;
      networkScore -= Math.floor(errorRequestPercentage / 5) * 10;
    }
    
    // API调用得分（满分100）
    let apiScore = 100;
    const apiCalls = this._performanceData.apiCalls;
    if (apiCalls.length > 0) {
      // 每5%的失败API调用减10分
      const failedCalls = apiCalls.filter(record => !record.success).length;
      const failedCallPercentage = (failedCalls / apiCalls.length) * 100;
      apiScore -= Math.floor(failedCallPercentage / 5) * 10;
    }
    
    // 应用启动得分（满分100）
    let launchScore = 100;
    if (this._performanceData.appLaunch) {
      // 启动时间超过1秒减10分，超过2秒减30分，超过3秒减60分，超过5秒减100分
      const launchTime = this._performanceData.appLaunch.launchTime;
      if (launchTime > 5000) {
        launchScore = 0;
      } else if (launchTime > 3000) {
        launchScore = 40;
      } else if (launchTime > 2000) {
        launchScore = 70;
      } else if (launchTime > 1000) {
        launchScore = 90;
      }
    }
    
    // 计算总得分（加权平均）
    const totalScore = Math.round(
      (pageLoadScore * 0.3) + // 页面加载占30%
      (networkScore * 0.3) +  // 网络请求占30%
      (apiScore * 0.2) +      // API调用占20%
      (launchScore * 0.2)     // 应用启动占20%
    );
    
    return {
      total: totalScore,
      pageLoad: pageLoadScore,
      network: networkScore,
      api: apiScore,
      launch: launchScore
    };
  },
  
  /**
   * 生成优化建议
   * @private
   * @returns {array} 优化建议列表
   */
  _generateOptimizationSuggestions: function() {
    const suggestions = [];
    const score = this._calculatePerformanceScore();
    
    // 页面加载优化建议
    if (score.pageLoad < 80) {
      suggestions.push({
        category: 'page_load',
        priority: 'high',
        title: '优化页面加载性能',
        description: '页面加载时间过长，影响用户体验',
        suggestions: [
          '减少页面初始化时的数据请求',
          '优化页面结构，减少复杂组件',
          '使用懒加载技术加载非关键资源',
          '优化setData调用，减少数据量和频率'
        ]
      });
    }
    
    // 网络请求优化建议
    if (score.network < 80) {
      suggestions.push({
        category: 'network',
        priority: 'high',
        title: '优化网络请求',
        description: '网络请求性能不佳，可能导致页面加载缓慢',
        suggestions: [
          '合并多个请求，减少请求次数',
          '实现数据缓存，避免重复请求',
          '优化请求数据结构，减少传输数据量',
          '使用CDN加速静态资源加载',
          '实现请求超时和重试机制'
        ]
      });
    }
    
    // API调用优化建议
    if (score.api < 80) {
      suggestions.push({
        category: 'api',
        priority: 'medium',
        title: '优化API调用',
        description: 'API调用存在问题，可能影响功能稳定性',
        suggestions: [
          '处理API调用异常，增加错误重试机制',
          '优化API调用时机，避免频繁调用',
          '使用Promise或async/await简化异步调用'
        ]
      });
    }
    
    // 应用启动优化建议
    if (score.launch < 80) {
      suggestions.push({
        category: 'launch',
        priority: 'high',
        title: '优化应用启动性能',
        description: '应用启动时间过长，影响首次使用体验',
        suggestions: [
          '减少启动时加载的资源和代码',
          '优化app.js中的初始化逻辑',
          '延迟加载非关键功能',
          '使用分包加载优化启动时间'
        ]
      });
    }
    
    // 内存使用优化建议
    const memoryUsage = this._performanceData.memoryUsage;
    if (memoryUsage.length > 0) {
      const latestMemory = memoryUsage[memoryUsage.length - 1].memoryUsage;
      if (latestMemory > 50 * 1024) { // 超过50MB
        suggestions.push({
          category: 'memory',
          priority: 'medium',
          title: '优化内存使用',
          description: '内存使用量较大，可能导致应用卡顿或崩溃',
          suggestions: [
            '及时释放不再使用的资源',
            '优化图片加载和缓存策略',
            '减少页面中的大型数据结构',
            '避免频繁创建临时对象'
          ]
        });
      }
    }
    
    // 渲染性能优化建议
    const renders = this._performanceData.renders;
    if (renders.length > 0) {
      const slowRenders = renders.filter(r => r.renderTime > 50).length;
      if (slowRenders > renders.length * 0.2) { // 超过20%的渲染较慢
        suggestions.push({
          category: 'render',
          priority: 'medium',
          title: '优化渲染性能',
          description: '页面渲染性能不佳，可能导致界面卡顿',
          suggestions: [
            '减少不必要的setData调用',
            '优化复杂列表的渲染逻辑',
            '使用懒渲染和虚拟列表技术',
            '避免频繁更新大型数据结构'
          ]
        });
      }
    }
    
    return suggestions;
  },
  
  /**
   * 获取响应大小
   * @private
   * @param {object} res - 响应对象
   * @returns {number} 响应大小（字节）
   */
  _getResponseSize: function(res) {
    if (!res) return 0;
    
    let size = 0;
    
    // 尝试从header中获取内容长度
    if (res.header && res.header['Content-Length']) {
      size = parseInt(res.header['Content-Length'], 10) || 0;
    }
    
    // 如果没有Content-Length，尝试估算数据大小
    if (size === 0 && res.data) {
      if (typeof res.data === 'string') {
        size = res.data.length;
      } else if (typeof res.data === 'object') {
        try {
          const jsonStr = JSON.stringify(res.data);
          size = jsonStr.length;
        } catch (e) {
          // 忽略错误
        }
      }
    }
    
    return size;
  },
  
  /**
   * 清理参数（移除敏感信息）
   * @private
   * @param {object} params - 参数对象
   * @returns {object} 清理后的参数对象
   */
  _sanitizeParams: function(params) {
    if (!params) return {};
    
    // 创建参数副本
    const sanitized = { ...params };
    
    // 敏感字段列表
    const sensitiveFields = [
      'password', 'pwd', 'token', 'secret', 'key', 'auth',
      'credential', 'pin', 'code', 'session', 'accessToken'
    ];
    
    // 移除敏感字段
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '******';
      }
    });
    
    return sanitized;
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
        console.log('Performance data reported:', data);
        resolve({ success: true });
      }, 500);
    });
  }
};

module.exports = performance;