// request.js - API请求封装

const request = {
  // API基础URL，根据实际环境配置
  baseUrl: 'https://api.example.com',
  
  // 请求超时时间（毫秒）
  timeout: 10000,
  
  // 请求头
  header: {
    'content-type': 'application/json'
  },
  
  /**
   * 设置请求头
   * @param {object} header - 请求头对象
   */
  setHeader: function(header) {
    this.header = {
      ...this.header,
      ...header
    };
  },
  
  /**
   * 设置认证令牌
   * @param {string} token - 认证令牌
   */
  setToken: function(token) {
    if (token) {
      this.header['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.header['Authorization'];
    }
  },
  
  /**
   * GET请求
   * @param {string} url - 请求路径
   * @param {object} data - 请求参数
   * @param {object} options - 额外选项
   * @returns {Promise} Promise对象
   */
  get: function(url, data = {}, options = {}) {
    return this.request('GET', url, data, options);
  },
  
  /**
   * POST请求
   * @param {string} url - 请求路径
   * @param {object} data - 请求数据
   * @param {object} options - 额外选项
   * @returns {Promise} Promise对象
   */
  post: function(url, data = {}, options = {}) {
    return this.request('POST', url, data, options);
  },
  
  /**
   * PUT请求
   * @param {string} url - 请求路径
   * @param {object} data - 请求数据
   * @param {object} options - 额外选项
   * @returns {Promise} Promise对象
   */
  put: function(url, data = {}, options = {}) {
    return this.request('PUT', url, data, options);
  },
  
  /**
   * DELETE请求
   * @param {string} url - 请求路径
   * @param {object} data - 请求数据
   * @param {object} options - 额外选项
   * @returns {Promise} Promise对象
   */
  delete: function(url, data = {}, options = {}) {
    return this.request('DELETE', url, data, options);
  },
  
  /**
   * 统一请求方法
   * @param {string} method - 请求方法
   * @param {string} url - 请求路径
   * @param {object} data - 请求数据
   * @param {object} options - 额外选项
   * @returns {Promise} Promise对象
   */
  request: function(method, url, data = {}, options = {}) {
    // 合并选项
    const requestOptions = {
      timeout: options.timeout || this.timeout,
      header: {
        ...this.header,
        ...(options.header || {})
      }
    };
    
    // 完整URL
    const fullUrl = url.startsWith('http') ? url : this.baseUrl + url;
    
    // 显示加载提示
    if (options.showLoading !== false) {
      wx.showLoading({
        title: options.loadingText || '加载中...',
        mask: options.loadingMask || true
      });
    }
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: fullUrl,
        method: method,
        data: data,
        header: requestOptions.header,
        timeout: requestOptions.timeout,
        success: res => {
          // 请求成功，检查状态码
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            // 处理HTTP错误
            this._handleError(res, reject);
          }
        },
        fail: err => {
          // 请求失败
          this._handleError(err, reject);
        },
        complete: () => {
          // 隐藏加载提示
          if (options.showLoading !== false) {
            wx.hideLoading();
          }
        }
      });
    });
  },
  
  /**
   * 处理请求错误
   * @private
   * @param {object} err - 错误对象
   * @param {function} reject - Promise的reject函数
   */
  _handleError: function(err, reject) {
    // 构建错误对象
    const error = {
      code: err.statusCode || -1,
      message: err.errMsg || '网络请求失败',
      data: err.data || null
    };
    
    // 根据状态码处理特定错误
    if (err.statusCode) {
      switch (err.statusCode) {
        case 401:
          error.message = '未授权，请重新登录';
          // 可以在这里处理登录过期逻辑
          break;
        case 403:
          error.message = '拒绝访问';
          break;
        case 404:
          error.message = '请求的资源不存在';
          break;
        case 500:
          error.message = '服务器错误';
          break;
        default:
          error.message = `请求失败(${err.statusCode})`;
      }
    }
    
    // 拒绝Promise
    reject(error);
    
    // 可以在这里添加全局错误处理，如错误上报
    console.error('API请求错误:', error);
  }
};

module.exports = request;