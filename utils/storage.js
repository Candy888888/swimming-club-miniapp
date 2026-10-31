// storage.js - 数据缓存机制

const storage = {
  /**
   * 存储数据到本地缓存
   * @param {string} key - 缓存的键名
   * @param {any} value - 要缓存的数据
   * @param {number} expireTime - 过期时间（毫秒），可选
   */
  set: function(key, value, expireTime) {
    try {
      // 如果设置了过期时间，添加过期时间戳
      if (expireTime) {
        const expireAt = Date.now() + expireTime;
        const data = {
          data: value,
          expireAt: expireAt
        };
        wx.setStorageSync(key, data);
      } else {
        // 没有过期时间，直接存储
        wx.setStorageSync(key, {
          data: value,
          expireAt: null
        });
      }
      return true;
    } catch (e) {
      console.error('存储数据失败', e);
      return false;
    }
  },

  /**
   * 从本地缓存获取数据
   * @param {string} key - 缓存的键名
   * @param {any} defaultValue - 默认值，当获取失败或已过期时返回
   * @returns {any} 缓存的数据或默认值
   */
  get: function(key, defaultValue = null) {
    try {
      const storedData = wx.getStorageSync(key);
      
      // 检查是否存在数据
      if (!storedData) return defaultValue;
      
      // 检查是否过期
      if (storedData.expireAt && Date.now() > storedData.expireAt) {
        // 已过期，删除并返回默认值
        this.remove(key);
        return defaultValue;
      }
      
      // 返回数据
      return storedData.data;
    } catch (e) {
      console.error('获取数据失败', e);
      return defaultValue;
    }
  },

  /**
   * 移除本地缓存中的数据
   * @param {string} key - 缓存的键名
   */
  remove: function(key) {
    try {
      wx.removeStorageSync(key);
      return true;
    } catch (e) {
      console.error('删除数据失败', e);
      return false;
    }
  },

  /**
   * 清除所有本地缓存数据
   */
  clear: function() {
    try {
      wx.clearStorageSync();
      return true;
    } catch (e) {
      console.error('清除数据失败', e);
      return false;
    }
  },

  /**
   * 获取当前缓存信息
   * @returns {object} 缓存信息
   */
  getInfo: function() {
    try {
      return wx.getStorageInfoSync();
    } catch (e) {
      console.error('获取缓存信息失败', e);
      return null;
    }
  }
};

module.exports = storage;