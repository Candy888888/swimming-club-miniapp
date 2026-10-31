// state.js - 全局状态管理

/**
 * 简易全局状态管理
 * 提供全局状态存储、订阅和更新功能
 */
const globalState = {
  // 存储状态数据
  _state: {},
  
  // 存储订阅回调
  _listeners: {},
  
  /**
   * 初始化状态
   * @param {object} initialState - 初始状态对象
   */
  init: function(initialState = {}) {
    this._state = { ...initialState };
  },
  
  /**
   * 获取状态值
   * @param {string} key - 状态键名
   * @param {*} defaultValue - 默认值（当状态不存在时返回）
   * @returns {*} 状态值
   */
  get: function(key, defaultValue = null) {
    if (key === undefined) {
      return { ...this._state }; // 返回整个状态的副本
    }
    
    return this._state.hasOwnProperty(key) ? this._state[key] : defaultValue;
  },
  
  /**
   * 设置状态值
   * @param {string|object} keyOrObject - 状态键名或包含多个状态的对象
   * @param {*} value - 状态值（当第一个参数为键名时使用）
   * @returns {boolean} 是否成功设置
   */
  set: function(keyOrObject, value) {
    // 处理对象形式的更新
    if (typeof keyOrObject === 'object' && keyOrObject !== null) {
      const updates = {};
      let hasChanges = false;
      
      // 检查每个键的变化
      Object.keys(keyOrObject).forEach(key => {
        if (this._state[key] !== keyOrObject[key]) {
          updates[key] = keyOrObject[key];
          hasChanges = true;
        }
      });
      
      // 如果有变化，更新状态并通知订阅者
      if (hasChanges) {
        this._state = { ...this._state, ...keyOrObject };
        this._notifyListeners(updates);
      }
      
      return hasChanges;
    }
    
    // 处理键值对形式的更新
    if (typeof keyOrObject === 'string') {
      const key = keyOrObject;
      
      // 检查值是否有变化
      if (this._state[key] !== value) {
        this._state[key] = value;
        this._notifyListeners({ [key]: value });
        return true;
      }
    }
    
    return false;
  },
  
  /**
   * 移除状态
   * @param {string} key - 要移除的状态键名
   * @returns {boolean} 是否成功移除
   */
  remove: function(key) {
    if (this._state.hasOwnProperty(key)) {
      const { [key]: removedValue, ...rest } = this._state;
      this._state = rest;
      this._notifyListeners({ [key]: undefined });
      return true;
    }
    return false;
  },
  
  /**
   * 清空所有状态
   */
  clear: function() {
    const oldState = { ...this._state };
    this._state = {};
    this._notifyListeners(oldState, true);
  },
  
  /**
   * 订阅状态变化
   * @param {string|function} keyOrCallback - 状态键名或回调函数
   * @param {function} [callback] - 状态变化回调函数（当第一个参数为键名时使用）
   * @returns {function} 取消订阅的函数
   */
  subscribe: function(keyOrCallback, callback) {
    // 生成唯一的监听器ID
    const listenerId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    
    if (typeof keyOrCallback === 'function') {
      // 订阅所有状态变化
      this._listeners[listenerId] = {
        key: null,
        callback: keyOrCallback
      };
    } else if (typeof keyOrCallback === 'string' && typeof callback === 'function') {
      // 订阅特定键的状态变化
      this._listeners[listenerId] = {
        key: keyOrCallback,
        callback: callback
      };
    } else {
      // 参数无效
      return () => {};
    }
    
    // 返回取消订阅的函数
    return () => {
      delete this._listeners[listenerId];
    };
  },
  
  /**
   * 通知订阅者状态变化
   * @private
   * @param {object} changedState - 变化的状态
   * @param {boolean} isClear - 是否为清空操作
   */
  _notifyListeners: function(changedState, isClear = false) {
    const changedKeys = Object.keys(changedState);
    
    Object.keys(this._listeners).forEach(id => {
      const listener = this._listeners[id];
      
      // 如果是清空操作，通知所有监听器
      if (isClear) {
        if (!listener.key) {
          // 全局监听器接收整个旧状态作为变化
          listener.callback(changedState, {});
        } else if (changedState.hasOwnProperty(listener.key)) {
          // 特定键的监听器接收该键的旧值
          listener.callback(changedState[listener.key], undefined);
        }
        return;
      }
      
      // 通知全局监听器
      if (!listener.key) {
        listener.callback(changedState, this._state);
        return;
      }
      
      // 通知特定键的监听器
      if (changedKeys.includes(listener.key)) {
        listener.callback(changedState[listener.key], this._state[listener.key]);
      }
    });
  }
};

module.exports = globalState;