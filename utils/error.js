// error.js - 错误处理机制

const errorHandler = {
  // 错误类型
  errorTypes: {
    NETWORK: 'network_error',     // 网络错误
    API: 'api_error',             // API错误
    AUTH: 'auth_error',           // 认证错误
    PARAM: 'parameter_error',     // 参数错误
    BUSINESS: 'business_error',   // 业务逻辑错误
    SYSTEM: 'system_error',       // 系统错误
    UNKNOWN: 'unknown_error'      // 未知错误
  },
  
  // 错误提示文本
  errorMessages: {
    network_error: '网络连接失败，请检查网络设置',
    api_error: '服务请求失败',
    auth_error: '登录已过期，请重新登录',
    parameter_error: '参数错误',
    business_error: '操作失败',
    system_error: '系统错误，请稍后再试',
    unknown_error: '未知错误，请稍后再试'
  },
  
  /**
   * 全局错误处理
   * @param {object|string} error - 错误对象或错误消息
   * @param {string} context - 错误发生的上下文
   * @param {object} options - 额外选项
   */
  handleError: function(error, context = '', options = {}) {
    // 标准化错误对象
    const errorObj = this._normalizeError(error);
    
    // 记录错误日志
    this._logError(errorObj, context);
    
    // 显示用户友好提示（除非明确禁用）
    if (options.showToUser !== false) {
      this._showErrorToUser(errorObj, options);
    }
    
    // 上报错误（如果启用）
    if (options.report !== false) {
      this._reportError(errorObj, context);
    }
    
    return errorObj;
  },
  
  /**
   * 标准化错误对象
   * @private
   * @param {object|string} error - 错误对象或错误消息
   * @returns {object} 标准化的错误对象
   */
  _normalizeError: function(error) {
    // 如果是字符串，转换为对象
    if (typeof error === 'string') {
      return {
        type: this.errorTypes.UNKNOWN,
        message: error,
        originalError: null,
        code: -1,
        data: null
      };
    }
    
    // 如果是Error实例
    if (error instanceof Error) {
      return {
        type: this.errorTypes.SYSTEM,
        message: error.message,
        originalError: error,
        stack: error.stack,
        code: -1,
        data: null
      };
    }
    
    // 如果是API错误对象
    if (error.statusCode || error.errMsg) {
      return {
        type: this.errorTypes.API,
        message: error.errMsg || '请求失败',
        code: error.statusCode || -1,
        originalError: error,
        data: error.data || null
      };
    }
    
    // 其他对象，保持原样并添加默认字段
    return {
      type: error.type || this.errorTypes.UNKNOWN,
      message: error.message || '未知错误',
      code: error.code || -1,
      originalError: error,
      data: error.data || null
    };
  },
  
  /**
   * 记录错误日志
   * @private
   * @param {object} error - 错误对象
   * @param {string} context - 错误发生的上下文
   */
  _logError: function(error, context) {
    const logPrefix = context ? `[${context}]` : '';
    console.error(`${logPrefix} 错误:`, error);
    
    // 如果有堆栈信息，也记录下来
    if (error.stack) {
      console.error(`${logPrefix} 堆栈:`, error.stack);
    }
  },
  
  /**
   * 向用户展示错误
   * @private
   * @param {object} error - 错误对象
   * @param {object} options - 显示选项
   */
  _showErrorToUser: function(error, options = {}) {
    // 获取用户友好的错误消息
    const message = this._getUserFriendlyMessage(error);
    
    // 根据选项决定显示方式
    if (options.showModal) {
      wx.showModal({
        title: options.modalTitle || '提示',
        content: message,
        showCancel: false
      });
    } else {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: options.duration || 2000
      });
    }
  },
  
  /**
   * 获取用户友好的错误消息
   * @private
   * @param {object} error - 错误对象
   * @returns {string} 用户友好的错误消息
   */
  _getUserFriendlyMessage: function(error) {
    // 如果有自定义消息，优先使用
    if (error.userMessage) {
      return error.userMessage;
    }
    
    // 根据错误类型获取默认消息
    if (error.type && this.errorMessages[error.type]) {
      return this.errorMessages[error.type];
    }
    
    // 使用错误对象中的消息
    if (error.message) {
      return error.message;
    }
    
    // 最后的默认消息
    return '操作失败，请稍后再试';
  },
  
  /**
   * 上报错误到服务器
   * @private
   * @param {object} error - 错误对象
   * @param {string} context - 错误发生的上下文
   */
  _reportError: function(error, context) {
    // 实际项目中，这里应该实现错误上报逻辑
    // 例如发送到日志服务器或监控系统
    
    // 示例代码（实际使用时应替换为真实实现）
    /*
    const reportData = {
      type: error.type,
      message: error.message,
      code: error.code,
      context: context,
      time: Date.now(),
      // 可以添加更多信息，如用户ID、设备信息等
      userInfo: getApp().globalData.userInfo ? {
        userId: getApp().globalData.userInfo.id
      } : null,
      systemInfo: wx.getSystemInfoSync()
    };
    
    // 发送到服务器
    wx.request({
      url: 'https://api.example.com/error-report',
      method: 'POST',
      data: reportData,
      fail: () => {
        console.error('错误上报失败');
      }
    });
    */
  },
  
  /**
   * 创建业务错误
   * @param {string} message - 错误消息
   * @param {number} code - 错误代码
   * @param {object} data - 额外数据
   * @returns {object} 业务错误对象
   */
  createBusinessError: function(message, code = -1, data = null) {
    return {
      type: this.errorTypes.BUSINESS,
      message: message,
      code: code,
      data: data
    };
  },
  
  /**
   * 创建参数错误
   * @param {string} message - 错误消息
   * @param {string} paramName - 参数名称
   * @returns {object} 参数错误对象
   */
  createParameterError: function(message, paramName = '') {
    return {
      type: this.errorTypes.PARAM,
      message: message || `参数错误: ${paramName}`,
      code: 400,
      data: { param: paramName }
    };
  },
  
  /**
   * 创建认证错误
   * @param {string} message - 错误消息
   * @returns {object} 认证错误对象
   */
  createAuthError: function(message = '认证失败') {
    return {
      type: this.errorTypes.AUTH,
      message: message,
      code: 401,
      data: null
    };
  }
};

module.exports = errorHandler;