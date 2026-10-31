// auth.js - 用户认证管理

const storage = require('./storage');
const request = require('./request');
const errorHandler = require('./error');

// 存储键名
const TOKEN_KEY = 'user_token';
const USER_INFO_KEY = 'user_info';

const auth = {
  // 当前登录状态
  _isLoggedIn: false,
  
  // 用户信息
  _userInfo: null,
  
  // 认证令牌
  _token: null,
  
  // 令牌过期时间（毫秒时间戳）
  _tokenExpireTime: 0,
  
  /**
   * 初始化认证模块
   * @returns {Promise} Promise对象
   */
  init: function() {
    return new Promise((resolve) => {
      // 从存储中加载令牌
      const tokenData = storage.get(TOKEN_KEY);
      if (tokenData && tokenData.token) {
        this._token = tokenData.token;
        this._tokenExpireTime = tokenData.expireTime || 0;
        
        // 检查令牌是否过期
        if (this._tokenExpireTime > Date.now()) {
          // 设置请求头中的认证令牌
          request.setToken(this._token);
          this._isLoggedIn = true;
          
          // 从存储中加载用户信息
          this._userInfo = storage.get(USER_INFO_KEY) || null;
        } else {
          // 令牌已过期，清除
          this.logout(false);
        }
      }
      
      resolve(this._isLoggedIn);
    });
  },
  
  /**
   * 检查是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn: function() {
    return this._isLoggedIn;
  },
  
  /**
   * 获取用户信息
   * @returns {object|null} 用户信息对象
   */
  getUserInfo: function() {
    return this._userInfo;
  },
  
  /**
   * 获取认证令牌
   * @returns {string|null} 认证令牌
   */
  getToken: function() {
    return this._token;
  },
  
  /**
   * 使用微信登录
   * @returns {Promise} Promise对象
   */
  loginWithWechat: function() {
    return new Promise((resolve, reject) => {
      // 获取微信登录凭证
      wx.login({
        success: (res) => {
          if (res.code) {
            // 发送凭证到服务器换取令牌
            // 注意：这里使用模拟数据，实际项目中应该调用真实API
            this._mockLoginApi(res.code)
              .then(loginRes => {
                this._handleLoginSuccess(loginRes);
                resolve(loginRes);
              })
              .catch(err => {
                const error = errorHandler.handleError(err, 'loginWithWechat');
                reject(error);
              });
          } else {
            const error = errorHandler.createBusinessError('微信登录失败: ' + (res.errMsg || '未知错误'));
            errorHandler.handleError(error, 'loginWithWechat');
            reject(error);
          }
        },
        fail: (err) => {
          const error = errorHandler.handleError(err, 'loginWithWechat');
          reject(error);
        }
      });
    });
  },
  
  /**
   * 使用手机号和密码登录
   * @param {string} phone - 手机号
   * @param {string} password - 密码
   * @returns {Promise} Promise对象
   */
  loginWithPhone: function(phone, password) {
    return new Promise((resolve, reject) => {
      // 参数验证
      if (!phone || !password) {
        const error = errorHandler.createParameterError('手机号和密码不能为空');
        errorHandler.handleError(error, 'loginWithPhone');
        reject(error);
        return;
      }
      
      // 发送登录请求到服务器
      // 注意：这里使用模拟数据，实际项目中应该调用真实API
      this._mockLoginApi(null, { phone, password })
        .then(loginRes => {
          this._handleLoginSuccess(loginRes);
          resolve(loginRes);
        })
        .catch(err => {
          const error = errorHandler.handleError(err, 'loginWithPhone');
          reject(error);
        });
    });
  },
  
  /**
   * 登出
   * @param {boolean} [callApi=true] - 是否调用登出API
   * @returns {Promise} Promise对象
   */
  logout: function(callApi = true) {
    return new Promise((resolve) => {
      // 如果需要，调用登出API
      if (callApi && this._isLoggedIn) {
        // 实际项目中应该调用真实API
        // this._callLogoutApi();
      }
      
      // 清除认证状态
      this._isLoggedIn = false;
      this._token = null;
      this._tokenExpireTime = 0;
      this._userInfo = null;
      
      // 清除请求头中的认证令牌
      request.setToken(null);
      
      // 清除存储的认证信息
      storage.remove(TOKEN_KEY);
      storage.remove(USER_INFO_KEY);
      
      resolve(true);
    });
  },
  
  /**
   * 刷新令牌
   * @returns {Promise} Promise对象
   */
  refreshToken: function() {
    return new Promise((resolve, reject) => {
      if (!this._token) {
        const error = errorHandler.createAuthError('未登录，无法刷新令牌');
        reject(error);
        return;
      }
      
      // 发送刷新令牌请求到服务器
      // 注意：这里使用模拟数据，实际项目中应该调用真实API
      this._mockRefreshTokenApi()
        .then(refreshRes => {
          // 更新令牌信息
          this._token = refreshRes.token;
          this._tokenExpireTime = refreshRes.expireTime;
          
          // 更新存储
          storage.set(TOKEN_KEY, {
            token: this._token,
            expireTime: this._tokenExpireTime
          });
          
          // 更新请求头
          request.setToken(this._token);
          
          resolve(refreshRes);
        })
        .catch(err => {
          const error = errorHandler.handleError(err, 'refreshToken');
          
          // 如果刷新失败，可能需要重新登录
          if (error.code === 401) {
            this.logout(false);
          }
          
          reject(error);
        });
    });
  },
  
  /**
   * 更新用户信息
   * @param {object} userInfo - 用户信息对象
   * @param {boolean} [saveToStorage=true] - 是否保存到存储
   */
  updateUserInfo: function(userInfo, saveToStorage = true) {
    if (!userInfo) return;
    
    this._userInfo = { ...this._userInfo, ...userInfo };
    
    if (saveToStorage) {
      storage.set(USER_INFO_KEY, this._userInfo);
    }
  },
  
  /**
   * 处理登录成功
   * @private
   * @param {object} loginRes - 登录响应数据
   */
  _handleLoginSuccess: function(loginRes) {
    // 保存认证信息
    this._token = loginRes.token;
    this._tokenExpireTime = loginRes.expireTime;
    this._userInfo = loginRes.userInfo;
    this._isLoggedIn = true;
    
    // 设置请求头中的认证令牌
    request.setToken(this._token);
    
    // 保存到存储
    storage.set(TOKEN_KEY, {
      token: this._token,
      expireTime: this._tokenExpireTime
    });
    
    storage.set(USER_INFO_KEY, this._userInfo);
  },
  
  /**
   * 模拟登录API调用
   * @private
   * @param {string} [code] - 微信登录凭证
   * @param {object} [credentials] - 登录凭证
   * @returns {Promise} Promise对象
   */
  _mockLoginApi: function(code, credentials) {
    return new Promise((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        // 模拟登录响应数据
        const now = Date.now();
        const response = {
          token: 'mock_token_' + now,
          expireTime: now + 7200000, // 2小时后过期
          userInfo: {
            id: 'user_' + Math.floor(Math.random() * 10000),
            nickName: '游泳爱好者',
            avatarUrl: '/images/default-avatar.png',
            memberLevel: 2,
            points: 1250,
            coupons: 3,
            balance: 520.00,
            cardNumber: 'VIP' + Math.floor(10000000 + Math.random() * 90000000),
            cardExpireDate: '2023-12-31',
            remainingTimes: 8
          }
        };
        
        resolve(response);
      }, 500);
    });
  },
  
  /**
   * 模拟刷新令牌API调用
   * @private
   * @returns {Promise} Promise对象
   */
  _mockRefreshTokenApi: function() {
    return new Promise((resolve) => {
      // 模拟网络延迟
      setTimeout(() => {
        // 模拟刷新令牌响应数据
        const now = Date.now();
        const response = {
          token: 'mock_refreshed_token_' + now,
          expireTime: now + 7200000 // 2小时后过期
        };
        
        resolve(response);
      }, 300);
    });
  }
};

module.exports = auth;