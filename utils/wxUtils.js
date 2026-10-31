// wxUtils.js - 微信小程序工具函数封装

const errorHandler = require('./error');

/**
 * 微信小程序API封装
 * 将微信API Promise化，并统一处理错误
 */
const wxUtils = {
  /**
   * 显示加载提示
   * @param {string} [title='加载中'] - 提示文本
   * @param {boolean} [mask=true] - 是否显示透明蒙层
   */
  showLoading: function(title = '加载中', mask = true) {
    wx.showLoading({
      title: title,
      mask: mask
    });
  },
  
  /**
   * 隐藏加载提示
   */
  hideLoading: function() {
    wx.hideLoading();
  },
  
  /**
   * 显示消息提示框
   * @param {string} title - 提示内容
   * @param {string} [icon='none'] - 图标类型
   * @param {number} [duration=2000] - 提示持续时间（毫秒）
   * @param {boolean} [mask=false] - 是否显示透明蒙层
   * @returns {Promise} Promise对象
   */
  showToast: function(title, icon = 'none', duration = 2000, mask = false) {
    return new Promise(resolve => {
      wx.showToast({
        title: title,
        icon: icon,
        duration: duration,
        mask: mask,
        success: resolve,
        fail: resolve,
        complete: resolve
      });
    });
  },
  
  /**
   * 显示模态对话框
   * @param {string} title - 标题
   * @param {string} content - 内容
   * @param {boolean} [showCancel=true] - 是否显示取消按钮
   * @param {string} [cancelText='取消'] - 取消按钮文字
   * @param {string} [confirmText='确定'] - 确认按钮文字
   * @returns {Promise} Promise对象，resolve参数中包含用户点击的按钮（confirm/cancel）
   */
  showModal: function(title, content, showCancel = true, cancelText = '取消', confirmText = '确定') {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        cancelText: cancelText,
        confirmText: confirmText,
        success: resolve,
        fail: err => {
          errorHandler.handleError(err, 'wxUtils.showModal');
          reject(err);
        }
      });
    });
  },
  
  /**
   * 显示操作菜单
   * @param {Array<string>} itemList - 菜单项列表
   * @param {string} [title=''] - 标题
   * @returns {Promise} Promise对象，resolve参数中包含用户点击的按钮序号（从0开始）
   */
  showActionSheet: function(itemList, title = '') {
    return new Promise((resolve, reject) => {
      wx.showActionSheet({
        itemList: itemList,
        title: title,
        success: res => resolve(res.tapIndex),
        fail: err => {
          // 用户取消不算错误
          if (err.errMsg.indexOf('cancel') >= 0) {
            resolve(-1);
          } else {
            errorHandler.handleError(err, 'wxUtils.showActionSheet');
            reject(err);
          }
        }
      });
    });
  },
  
  /**
   * 页面导航
   * @param {string} url - 页面路径
   * @param {boolean} [redirect=false] - 是否重定向（关闭当前页面）
   * @returns {Promise} Promise对象
   */
  navigateTo: function(url, redirect = false) {
    return new Promise((resolve, reject) => {
      const navigateFunc = redirect ? wx.redirectTo : wx.navigateTo;
      navigateFunc({
        url: url,
        success: resolve,
        fail: err => {
          errorHandler.handleError(err, `wxUtils.${redirect ? 'redirectTo' : 'navigateTo'}`);
          reject(err);
        }
      });
    });
  },
  
  /**
   * 返回上一页
   * @param {number} [delta=1] - 返回的页面数
   * @returns {Promise} Promise对象
   */
  navigateBack: function(delta = 1) {
    return new Promise((resolve) => {
      wx.navigateBack({
        delta: delta,
        success: resolve,
        fail: resolve // 失败也resolve，避免卡死
      });
    });
  },
  
  /**
   * 获取系统信息
   * @returns {Promise} Promise对象，resolve参数为系统信息
   */
  getSystemInfo: function() {
    return new Promise((resolve, reject) => {
      wx.getSystemInfo({
        success: resolve,
        fail: err => {
          errorHandler.handleError(err, 'wxUtils.getSystemInfo');
          reject(err);
        }
      });
    });
  },
  
  /**
   * 获取位置信息
   * @param {boolean} [withAltitude=false] - 是否获取高度信息
   * @returns {Promise} Promise对象，resolve参数为位置信息
   */
  getLocation: function(withAltitude = false) {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        altitude: withAltitude,
        success: resolve,
        fail: err => {
          errorHandler.handleError(err, 'wxUtils.getLocation');
          reject(err);
        }
      });
    });
  },
  
  /**
   * 选择图片
   * @param {number} [count=9] - 最多可选择图片数量
   * @param {Array<string>} [sizeType=['original', 'compressed']] - 图片类型
   * @param {Array<string>} [sourceType=['album', 'camera']] - 图片来源
   * @returns {Promise} Promise对象，resolve参数为选择的图片信息
   */
  chooseImage: function(count = 9, sizeType = ['original', 'compressed'], sourceType = ['album', 'camera']) {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: count,
        sizeType: sizeType,
        sourceType: sourceType,
        success: resolve,
        fail: err => {
          // 用户取消不算错误
          if (err.errMsg.indexOf('cancel') >= 0) {
            resolve({ tempFilePaths: [], tempFiles: [] });
          } else {
            errorHandler.handleError(err, 'wxUtils.chooseImage');
            reject(err);
          }
        }
      });
    });
  },
  
  /**
   * 预览图片
   * @param {string} current - 当前显示图片的链接
   * @param {Array<string>} urls - 需要预览的图片链接列表
   * @returns {Promise} Promise对象
   */
  previewImage: function(current, urls) {
    return new Promise((resolve, reject) => {
      wx.previewImage({
        current: current,
        urls: urls,
        success: resolve,
        fail: err => {
          errorHandler.handleError(err, 'wxUtils.previewImage');
          reject(err);
        }
      });
    });
  },
  
  /**
   * 上传文件
   * @param {string} url - 上传地址
   * @param {string} filePath - 文件路径
   * @param {string} name - 文件对应的key
   * @param {object} [formData={}] - 附加的表单数据
   * @param {object} [header={}] - 请求头
   * @returns {Promise} Promise对象，resolve参数为上传结果
   */
  uploadFile: function(url, filePath, name, formData = {}, header = {}) {
    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: url,
        filePath: filePath,
        name: name,
        formData: formData,
        header: header,
        success: res => {
          // 尝试解析返回的JSON数据
          try {
            if (typeof res.data === 'string') {
              res.data = JSON.parse(res.data);
            }
          } catch (e) {
            // 解析失败，保持原样
          }
          resolve(res);
        },
        fail: err => {
          errorHandler.handleError(err, 'wxUtils.uploadFile');
          reject(err);
        }
      });
      
      // 返回上传任务，方便外部监听进度
      resolve(uploadTask);
    });
  },
  
  /**
   * 下载文件
   * @param {string} url - 下载地址
   * @param {object} [header={}] - 请求头
   * @returns {Promise} Promise对象，resolve参数为下载结果
   */
  downloadFile: function(url, header = {}) {
    return new Promise((resolve, reject) => {
      const downloadTask = wx.downloadFile({
        url: url,
        header: header,
        success: resolve,
        fail: err => {
          errorHandler.handleError(err, 'wxUtils.downloadFile');
          reject(err);
        }
      });
      
      // 返回下载任务，方便外部监听进度
      resolve(downloadTask);
    });
  },
  
  /**
   * 保存图片到相册
   * @param {string} filePath - 图片文件路径
   * @returns {Promise} Promise对象
   */
  saveImageToPhotosAlbum: function(filePath) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: filePath,
        success: resolve,
        fail: err => {
          errorHandler.handleError(err, 'wxUtils.saveImageToPhotosAlbum');
          reject(err);
        }
      });
    });
  },
  
  /**
   * 获取用户信息
   * @returns {Promise} Promise对象，resolve参数为用户信息
   */
  getUserProfile: function() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: resolve,
        fail: err => {
          // 用户拒绝不算错误
          if (err.errMsg.indexOf('fail auth deny') >= 0) {
            resolve(null);
          } else {
            errorHandler.handleError(err, 'wxUtils.getUserProfile');
            reject(err);
          }
        }
      });
    });
  },
  
  /**
   * 检查并请求权限
   * @param {string} scope - 需要请求的权限类型
   * @param {string} [title='需要您的授权'] - 提示标题
   * @param {string} [content=''] - 提示内容
   * @returns {Promise} Promise对象，resolve参数为是否授权
   */
  checkPermission: function(scope, title = '需要您的授权', content = '') {
    return new Promise((resolve, reject) => {
      // 检查权限状态
      wx.getSetting({
        success: res => {
          if (res.authSetting[scope] === true) {
            // 已授权
            resolve(true);
          } else if (res.authSetting[scope] === false) {
            // 已拒绝授权，引导用户打开设置页
            this.showModal(title, content || '请在设置中打开相应权限', true, '取消', '去设置')
              .then(modalRes => {
                if (modalRes.confirm) {
                  wx.openSetting({
                    success: settingRes => {
                      resolve(settingRes.authSetting[scope] === true);
                    },
                    fail: err => {
                      errorHandler.handleError(err, 'wxUtils.checkPermission.openSetting');
                      resolve(false);
                    }
                  });
                } else {
                  resolve(false);
                }
              });
          } else {
            // 首次授权，直接请求
            this._requestPermission(scope)
              .then(resolve)
              .catch(reject);
          }
        },
        fail: err => {
          errorHandler.handleError(err, 'wxUtils.checkPermission.getSetting');
          reject(err);
        }
      });
    });
  },
  
  /**
   * 请求权限
   * @private
   * @param {string} scope - 需要请求的权限类型
   * @returns {Promise} Promise对象，resolve参数为是否授权
   */
  _requestPermission: function(scope) {
    return new Promise((resolve, reject) => {
      // 映射scope到对应的请求方法
      const scopeMap = {
        'scope.userLocation': 'getLocation',
        'scope.userLocationBackground': 'startLocationUpdateBackground',
        'scope.record': 'startRecord',
        'scope.camera': 'camera',
        'scope.writePhotosAlbum': 'saveImageToPhotosAlbum',
        'scope.werun': 'getWeRunData'
      };
      
      const method = scopeMap[scope];
      if (!method) {
        reject(new Error(`未知的权限类型: ${scope}`));
        return;
      }
      
      // 构造请求参数
      const params = {
        success: () => resolve(true),
        fail: err => {
          // 用户拒绝不算错误
          if (err.errMsg.indexOf('auth deny') >= 0) {
            resolve(false);
          } else {
            errorHandler.handleError(err, `wxUtils._requestPermission.${method}`);
            reject(err);
          }
        }
      };
      
      // 特殊处理某些方法的参数
      if (method === 'getLocation') {
        params.type = 'gcj02';
      } else if (method === 'saveImageToPhotosAlbum') {
        params.filePath = 'temp'; // 这里会失败，但可以触发授权弹窗
      } else if (method === 'camera') {
        // camera需要通过组件使用，这里用createCameraContext模拟
        try {
          const context = wx.createCameraContext();
          if (context) {
            resolve(true);
          } else {
            resolve(false);
          }
          return;
        } catch (e) {
          resolve(false);
          return;
        }
      }
      
      // 调用对应方法
      wx[method](params);
    });
  },
  
  /**
   * 设置剪贴板内容
   * @param {string} data - 剪贴板内容
   * @returns {Promise} Promise对象
   */
  setClipboardData: function(data) {
    return new Promise((resolve, reject) => {
      wx.setClipboardData({
        data: data,
        success: resolve,
        fail: err => {
          errorHandler.handleError(err, 'wxUtils.setClipboardData');
          reject(err);
        }
      });
    });
  },
  
  /**
   * 获取剪贴板内容
   * @returns {Promise} Promise对象，resolve参数为剪贴板内容
   */
  getClipboardData: function() {
    return new Promise((resolve, reject) => {
      wx.getClipboardData({
        success: res => resolve(res.data),
        fail: err => {
          errorHandler.handleError(err, 'wxUtils.getClipboardData');
          reject(err);
        }
      });
    });
  },
  
  /**
   * 打开地图选择位置
   * @param {object} [options={}] - 选项
   * @returns {Promise} Promise对象，resolve参数为选择的位置信息
   */
  chooseLocation: function(options = {}) {
    return new Promise((resolve, reject) => {
      wx.chooseLocation({
        ...options,
        success: resolve,
        fail: err => {
          // 用户取消不算错误
          if (err.errMsg.indexOf('cancel') >= 0) {
            resolve(null);
          } else {
            errorHandler.handleError(err, 'wxUtils.chooseLocation');
            reject(err);
          }
        }
      });
    });
  },
  
  /**
   * 使用微信内置地图查看位置
   * @param {object} options - 位置参数
   * @returns {Promise} Promise对象
   */
  openLocation: function(options) {
    return new Promise((resolve, reject) => {
      wx.openLocation({
        ...options,
        success: resolve,
        fail: err => {
          errorHandler.handleError(err, 'wxUtils.openLocation');
          reject(err);
        }
      });
    });
  },
  
  /**
   * 拨打电话
   * @param {string} phoneNumber - 电话号码
   * @returns {Promise} Promise对象
   */
  makePhoneCall: function(phoneNumber) {
    return new Promise((resolve, reject) => {
      wx.makePhoneCall({
        phoneNumber: phoneNumber,
        success: resolve,
        fail: err => {
          // 用户取消不算错误
          if (err.errMsg.indexOf('cancel') >= 0) {
            resolve();
          } else {
            errorHandler.handleError(err, 'wxUtils.makePhoneCall');
            reject(err);
          }
        }
      });
    });
  },
  
  /**
   * 扫描二维码
   * @param {boolean} [onlyFromCamera=false] - 是否只能从相机扫码
   * @param {Array<string>} [scanType=['qrCode', 'barCode']] - 扫码类型
   * @returns {Promise} Promise对象，resolve参数为扫码结果
   */
  scanCode: function(onlyFromCamera = false, scanType = ['qrCode', 'barCode']) {
    return new Promise((resolve, reject) => {
      wx.scanCode({
        onlyFromCamera: onlyFromCamera,
        scanType: scanType,
        success: resolve,
        fail: err => {
          // 用户取消不算错误
          if (err.errMsg.indexOf('cancel') >= 0) {
            resolve(null);
          } else {
            errorHandler.handleError(err, 'wxUtils.scanCode');
            reject(err);
          }
        }
      });
    });
  },
  
  /**
   * 设置页面标题
   * @param {string} title - 页面标题
   * @returns {Promise} Promise对象
   */
  setNavigationBarTitle: function(title) {
    return new Promise((resolve, reject) => {
      wx.setNavigationBarTitle({
        title: title,
        success: resolve,
        fail: err => {
          errorHandler.handleError(err, 'wxUtils.setNavigationBarTitle');
          reject(err);
        }
      });
    });
  },
  
  /**
   * 获取小程序更新管理器
   * @returns {object} 更新管理器
   */
  getUpdateManager: function() {
    return wx.getUpdateManager();
  },
  
  /**
   * 检查小程序更新
   * @returns {Promise} Promise对象，resolve参数为是否有更新
   */
  checkUpdate: function() {
    return new Promise(resolve => {
      if (typeof wx.getUpdateManager !== 'function') {
        resolve(false);
        return;
      }
      
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate(res => {
        resolve(res.hasUpdate);
      });
      
      // 如果检查失败，也返回false
      setTimeout(() => {
        resolve(false);
      }, 5000);
    });
  },
  
  /**
   * 安装小程序更新
   * @returns {Promise} Promise对象
   */
  applyUpdate: function() {
    return new Promise((resolve, reject) => {
      if (typeof wx.getUpdateManager !== 'function') {
        reject(new Error('当前微信版本不支持更新管理器'));
        return;
      }
      
      const updateManager = wx.getUpdateManager();
      
      updateManager.onUpdateReady(() => {
        this.showModal('更新提示', '新版本已经准备好，是否重启应用？')
          .then(res => {
            if (res.confirm) {
              updateManager.applyUpdate();
            } else {
              resolve(false);
            }
          });
      });
      
      updateManager.onUpdateFailed(() => {
        this.showModal('更新提示', '新版本下载失败，请检查网络后重试')
          .then(() => {
            reject(new Error('小程序更新失败'));
          });
      });
    });
  }
};

module.exports = wxUtils;