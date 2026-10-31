// eventBus.js - 事件总线，用于组件间通信

/**
 * 事件总线
 * 提供发布-订阅模式的事件机制，用于跨页面、跨组件通信
 */
const eventBus = {
  // 事件监听器映射
  _listeners: {},
  
  // 一次性事件监听器映射
  _onceListeners: {},
  
  /**
   * 注册事件监听器
   * @param {string} eventName - 事件名称
   * @param {function} callback - 回调函数
   * @param {object} [context] - 回调函数上下文
   * @returns {function} 取消监听的函数
   */
  on: function(eventName, callback, context) {
    if (typeof eventName !== 'string' || typeof callback !== 'function') {
      console.error('EventBus.on: 参数无效');
      return () => {};
    }
    
    // 确保事件监听器数组存在
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [];
    }
    
    // 创建监听器对象
    const listener = {
      callback: callback,
      context: context
    };
    
    // 添加到监听器数组
    this._listeners[eventName].push(listener);
    
    // 返回取消监听的函数
    return () => {
      this.off(eventName, callback, context);
    };
  },
  
  /**
   * 注册一次性事件监听器
   * @param {string} eventName - 事件名称
   * @param {function} callback - 回调函数
   * @param {object} [context] - 回调函数上下文
   * @returns {function} 取消监听的函数
   */
  once: function(eventName, callback, context) {
    if (typeof eventName !== 'string' || typeof callback !== 'function') {
      console.error('EventBus.once: 参数无效');
      return () => {};
    }
    
    // 确保一次性事件监听器数组存在
    if (!this._onceListeners[eventName]) {
      this._onceListeners[eventName] = [];
    }
    
    // 创建监听器对象
    const listener = {
      callback: callback,
      context: context
    };
    
    // 添加到一次性监听器数组
    this._onceListeners[eventName].push(listener);
    
    // 返回取消监听的函数
    return () => {
      this.off(eventName, callback, context, true);
    };
  },
  
  /**
   * 取消事件监听
   * @param {string} eventName - 事件名称
   * @param {function} [callback] - 回调函数，不提供则移除该事件的所有监听器
   * @param {object} [context] - 回调函数上下文
   * @param {boolean} [isOnce=false] - 是否为一次性监听器
   */
  off: function(eventName, callback, context, isOnce = false) {
    if (typeof eventName !== 'string') {
      console.error('EventBus.off: 事件名称无效');
      return;
    }
    
    // 确定要操作的监听器集合
    const listenersMap = isOnce ? this._onceListeners : this._listeners;
    
    // 如果没有提供回调函数，移除该事件的所有监听器
    if (!callback) {
      listenersMap[eventName] = [];
      return;
    }
    
    // 获取监听器数组
    const listeners = listenersMap[eventName];
    if (!listeners || listeners.length === 0) {
      return;
    }
    
    // 查找并移除匹配的监听器
    for (let i = listeners.length - 1; i >= 0; i--) {
      const listener = listeners[i];
      if (listener.callback === callback && (!context || listener.context === context)) {
        listeners.splice(i, 1);
      }
    }
  },
  
  /**
   * 触发事件
   * @param {string} eventName - 事件名称
   * @param {...*} args - 传递给监听器的参数
   * @returns {boolean} 是否有监听器被触发
   */
  emit: function(eventName, ...args) {
    if (typeof eventName !== 'string') {
      console.error('EventBus.emit: 事件名称无效');
      return false;
    }
    
    let triggered = false;
    
    // 触发普通监听器
    const listeners = this._listeners[eventName];
    if (listeners && listeners.length > 0) {
      // 复制一份监听器数组，防止回调中修改监听器列表
      const listenersCopy = [...listeners];
      
      for (const listener of listenersCopy) {
        try {
          listener.callback.apply(listener.context, args);
          triggered = true;
        } catch (e) {
          console.error(`EventBus: 事件 "${eventName}" 的监听器执行出错:`, e);
        }
      }
    }
    
    // 触发一次性监听器
    const onceListeners = this._onceListeners[eventName];
    if (onceListeners && onceListeners.length > 0) {
      // 复制一份监听器数组，防止回调中修改监听器列表
      const onceListenersCopy = [...onceListeners];
      
      // 清空一次性监听器数组
      this._onceListeners[eventName] = [];
      
      for (const listener of onceListenersCopy) {
        try {
          listener.callback.apply(listener.context, args);
          triggered = true;
        } catch (e) {
          console.error(`EventBus: 一次性事件 "${eventName}" 的监听器执行出错:`, e);
        }
      }
    }
    
    return triggered;
  },
  
  /**
   * 获取指定事件的监听器数量
   * @param {string} eventName - 事件名称
   * @param {boolean} [includeOnce=true] - 是否包含一次性监听器
   * @returns {number} 监听器数量
   */
  listenerCount: function(eventName, includeOnce = true) {
    if (typeof eventName !== 'string') {
      return 0;
    }
    
    let count = 0;
    
    // 计算普通监听器数量
    const listeners = this._listeners[eventName];
    if (listeners) {
      count += listeners.length;
    }
    
    // 计算一次性监听器数量
    if (includeOnce) {
      const onceListeners = this._onceListeners[eventName];
      if (onceListeners) {
        count += onceListeners.length;
      }
    }
    
    return count;
  },
  
  /**
   * 获取所有已注册的事件名称
   * @returns {Array<string>} 事件名称数组
   */
  eventNames: function() {
    const names = new Set();
    
    // 收集普通事件名称
    Object.keys(this._listeners).forEach(name => {
      if (this._listeners[name].length > 0) {
        names.add(name);
      }
    });
    
    // 收集一次性事件名称
    Object.keys(this._onceListeners).forEach(name => {
      if (this._onceListeners[name].length > 0) {
        names.add(name);
      }
    });
    
    return Array.from(names);
  },
  
  /**
   * 移除所有事件监听器
   */
  removeAllListeners: function() {
    this._listeners = {};
    this._onceListeners = {};
  }
};

module.exports = eventBus;