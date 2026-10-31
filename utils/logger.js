// logger.js - 日志记录工具

/**
 * 日志级别枚举
 */
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 100 // 禁用日志
};

/**
 * 日志记录器
 */
const logger = {
  // 当前日志级别
  _level: LogLevel.INFO,
  
  // 是否启用控制台输出
  _enableConsole: true,
  
  // 是否启用文件存储
  _enableStorage: false,
  
  // 日志存储键名前缀
  _storageKeyPrefix: 'app_log_',
  
  // 最大存储日志数量
  _maxStorageLogs: 100,
  
  // 日志级别名称映射
  _levelNames: ['DEBUG', 'INFO', 'WARN', 'ERROR'],
  
  /**
   * 初始化日志记录器
   * @param {object} options - 配置选项
   * @param {number} [options.level] - 日志级别
   * @param {boolean} [options.enableConsole] - 是否启用控制台输出
   * @param {boolean} [options.enableStorage] - 是否启用文件存储
   * @param {string} [options.storageKeyPrefix] - 日志存储键名前缀
   * @param {number} [options.maxStorageLogs] - 最大存储日志数量
   */
  init: function(options = {}) {
    if (options.level !== undefined) {
      this._level = options.level;
    }
    
    if (options.enableConsole !== undefined) {
      this._enableConsole = !!options.enableConsole;
    }
    
    if (options.enableStorage !== undefined) {
      this._enableStorage = !!options.enableStorage;
    }
    
    if (options.storageKeyPrefix) {
      this._storageKeyPrefix = options.storageKeyPrefix;
    }
    
    if (options.maxStorageLogs !== undefined) {
      this._maxStorageLogs = Math.max(1, options.maxStorageLogs);
    }
  },
  
  /**
   * 设置日志级别
   * @param {number} level - 日志级别
   */
  setLevel: function(level) {
    this._level = level;
  },
  
  /**
   * 启用或禁用控制台输出
   * @param {boolean} enable - 是否启用
   */
  enableConsole: function(enable) {
    this._enableConsole = !!enable;
  },
  
  /**
   * 启用或禁用日志存储
   * @param {boolean} enable - 是否启用
   */
  enableStorage: function(enable) {
    this._enableStorage = !!enable;
  },
  
  /**
   * 记录调试日志
   * @param {string} message - 日志消息
   * @param {...*} args - 额外参数
   */
  debug: function(message, ...args) {
    this._log(LogLevel.DEBUG, message, args);
  },
  
  /**
   * 记录信息日志
   * @param {string} message - 日志消息
   * @param {...*} args - 额外参数
   */
  info: function(message, ...args) {
    this._log(LogLevel.INFO, message, args);
  },
  
  /**
   * 记录警告日志
   * @param {string} message - 日志消息
   * @param {...*} args - 额外参数
   */
  warn: function(message, ...args) {
    this._log(LogLevel.WARN, message, args);
  },
  
  /**
   * 记录错误日志
   * @param {string} message - 日志消息
   * @param {...*} args - 额外参数
   */
  error: function(message, ...args) {
    this._log(LogLevel.ERROR, message, args);
  },
  
  /**
   * 记录日志
   * @private
   * @param {number} level - 日志级别
   * @param {string} message - 日志消息
   * @param {Array} args - 额外参数
   */
  _log: function(level, message, args) {
    // 检查日志级别
    if (level < this._level) {
      return;
    }
    
    // 创建日志对象
    const logEntry = this._createLogEntry(level, message, args);
    
    // 输出到控制台
    if (this._enableConsole) {
      this._logToConsole(logEntry);
    }
    
    // 保存到存储
    if (this._enableStorage) {
      this._logToStorage(logEntry);
    }
  },
  
  /**
   * 创建日志条目
   * @private
   * @param {number} level - 日志级别
   * @param {string} message - 日志消息
   * @param {Array} args - 额外参数
   * @returns {object} 日志条目对象
   */
  _createLogEntry: function(level, message, args) {
    return {
      timestamp: Date.now(),
      level: level,
      levelName: this._levelNames[level] || 'UNKNOWN',
      message: message,
      args: args.length > 0 ? this._formatArgs(args) : undefined,
      page: this._getCurrentPage()
    };
  },
  
  /**
   * 格式化参数
   * @private
   * @param {Array} args - 参数数组
   * @returns {Array} 格式化后的参数数组
   */
  _formatArgs: function(args) {
    return args.map(arg => {
      if (arg === undefined) return 'undefined';
      if (arg === null) return 'null';
      
      if (arg instanceof Error) {
        return {
          name: arg.name,
          message: arg.message,
          stack: arg.stack
        };
      }
      
      if (typeof arg === 'object') {
        try {
          return JSON.parse(JSON.stringify(arg));
        } catch (e) {
          return String(arg);
        }
      }
      
      return arg;
    });
  },
  
  /**
   * 获取当前页面路径
   * @private
   * @returns {string} 当前页面路径
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
   * 输出日志到控制台
   * @private
   * @param {object} logEntry - 日志条目对象
   */
  _logToConsole: function(logEntry) {
    const time = new Date(logEntry.timestamp).toLocaleTimeString();
    const prefix = `[${time}][${logEntry.levelName}][${logEntry.page}]`;
    
    switch (logEntry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, logEntry.message, ...(logEntry.args || []));
        break;
      case LogLevel.INFO:
        console.info(prefix, logEntry.message, ...(logEntry.args || []));
        break;
      case LogLevel.WARN:
        console.warn(prefix, logEntry.message, ...(logEntry.args || []));
        break;
      case LogLevel.ERROR:
        console.error(prefix, logEntry.message, ...(logEntry.args || []));
        break;
      default:
        console.log(prefix, logEntry.message, ...(logEntry.args || []));
    }
  },
  
  /**
   * 保存日志到存储
   * @private
   * @param {object} logEntry - 日志条目对象
   */
  _logToStorage: function(logEntry) {
    try {
      // 获取当前日期作为键名后缀
      const date = new Date(logEntry.timestamp);
      const dateStr = `${date.getFullYear()}${this._padZero(date.getMonth() + 1)}${this._padZero(date.getDate())}`;
      const storageKey = `${this._storageKeyPrefix}${dateStr}`;
      
      // 获取当前存储的日志
      let logs = wx.getStorageSync(storageKey) || [];
      
      // 添加新日志
      logs.push(logEntry);
      
      // 如果超出最大数量，删除最旧的日志
      if (logs.length > this._maxStorageLogs) {
        logs = logs.slice(logs.length - this._maxStorageLogs);
      }
      
      // 保存回存储
      wx.setStorageSync(storageKey, logs);
    } catch (e) {
      // 存储失败，输出到控制台
      console.error('Failed to save log to storage:', e);
    }
  },
  
  /**
   * 数字补零
   * @private
   * @param {number} num - 数字
   * @returns {string} 补零后的字符串
   */
  _padZero: function(num) {
    return num < 10 ? `0${num}` : `${num}`;
  },
  
  /**
   * 获取存储的日志
   * @param {string} [date] - 日期字符串，格式为'YYYYMMDD'，不提供则获取当天日志
   * @returns {Array} 日志数组
   */
  getStoredLogs: function(date) {
    if (!date) {
      const now = new Date();
      date = `${now.getFullYear()}${this._padZero(now.getMonth() + 1)}${this._padZero(now.getDate())}`;
    }
    
    const storageKey = `${this._storageKeyPrefix}${date}`;
    return wx.getStorageSync(storageKey) || [];
  },
  
  /**
   * 清除存储的日志
   * @param {string} [date] - 日期字符串，格式为'YYYYMMDD'，不提供则清除当天日志
   * @returns {boolean} 是否成功清除
   */
  clearStoredLogs: function(date) {
    try {
      if (!date) {
        const now = new Date();
        date = `${now.getFullYear()}${this._padZero(now.getMonth() + 1)}${this._padZero(now.getDate())}`;
      }
      
      const storageKey = `${this._storageKeyPrefix}${date}`;
      wx.removeStorageSync(storageKey);
      return true;
    } catch (e) {
      console.error('Failed to clear logs:', e);
      return false;
    }
  },
  
  /**
   * 导出日志
   * @param {string} [date] - 日期字符串，格式为'YYYYMMDD'，不提供则导出当天日志
   * @returns {string} 日志文本
   */
  exportLogs: function(date) {
    const logs = this.getStoredLogs(date);
    if (logs.length === 0) {
      return '没有可导出的日志';
    }
    
    return logs.map(log => {
      const time = new Date(log.timestamp).toLocaleString();
      let text = `[${time}][${log.levelName}][${log.page}] ${log.message}`;
      
      if (log.args && log.args.length > 0) {
        text += ' ' + JSON.stringify(log.args);
      }
      
      return text;
    }).join('\n');
  }
};

// 导出日志级别枚举和日志记录器
module.exports = {
  LogLevel,
  logger
};