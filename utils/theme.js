// theme.js - 主题管理工具

const storage = require('./storage');
const eventBus = require('./eventBus');

/**
 * 主题管理工具
 * 用于管理应用的主题样式，支持多主题切换和自定义主题
 */
const theme = {
  // 主题配置
  config: {
    // 默认主题
    defaultTheme: 'default',
    
    // 主题存储键名
    storageKey: 'app_theme',
    
    // 主题变更事件名
    changeEventName: 'theme_changed',
    
    // 是否跟随系统
    followSystem: true,
    
    // 是否自动应用深色模式
    autoDarkMode: true,
    
    // 深色模式时间范围（小时）
    darkModeTimeRange: [19, 7] // 晚上7点到早上7点
  },
  
  // 当前主题
  _currentTheme: null,
  
  // 是否为深色模式
  _isDarkMode: false,
  
  // 可用主题列表
  _themes: {
    // 默认主题
    'default': {
      name: '默认蓝',
      primaryColor: '#0080ff',
      secondaryColor: '#66b3ff',
      backgroundColor: '#f5f5f5',
      textColor: '#333333',
      cardColor: '#ffffff',
      borderColor: '#e0e0e0',
      successColor: '#4caf50',
      warningColor: '#ff9800',
      errorColor: '#f44336',
      infoColor: '#2196f3',
      isDark: false
    },
    
    // 深色主题
    'dark': {
      name: '深色模式',
      primaryColor: '#2196f3',
      secondaryColor: '#90caf9',
      backgroundColor: '#121212',
      textColor: '#ffffff',
      cardColor: '#1e1e1e',
      borderColor: '#333333',
      successColor: '#81c784',
      warningColor: '#ffb74d',
      errorColor: '#e57373',
      infoColor: '#64b5f6',
      isDark: true
    },
    
    // 游泳主题
    'swimming': {
      name: '游泳蓝',
      primaryColor: '#03a9f4',
      secondaryColor: '#4fc3f7',
      backgroundColor: '#e1f5fe',
      textColor: '#01579b',
      cardColor: '#ffffff',
      borderColor: '#b3e5fc',
      successColor: '#00bfa5',
      warningColor: '#ffc107',
      errorColor: '#f44336',
      infoColor: '#00b0ff',
      isDark: false
    },
    
    // 活力主题
    'energetic': {
      name: '活力橙',
      primaryColor: '#ff9800',
      secondaryColor: '#ffb74d',
      backgroundColor: '#fff3e0',
      textColor: '#e65100',
      cardColor: '#ffffff',
      borderColor: '#ffe0b2',
      successColor: '#8bc34a',
      warningColor: '#ff5722',
      errorColor: '#f44336',
      infoColor: '#29b6f6',
      isDark: false
    },
    
    // 清新主题
    'fresh': {
      name: '清新绿',
      primaryColor: '#4caf50',
      secondaryColor: '#81c784',
      backgroundColor: '#e8f5e9',
      textColor: '#1b5e20',
      cardColor: '#ffffff',
      borderColor: '#c8e6c9',
      successColor: '#00c853',
      warningColor: '#ffc107',
      errorColor: '#f44336',
      infoColor: '#00b0ff',
      isDark: false
    }
  },
  
  /**
   * 初始化主题管理器
   * @param {object} options - 配置选项
   */
  init: function(options = {}) {
    // 合并配置
    this.config = { ...this.config, ...options };
    
    // 注册自定义主题
    if (options.customThemes) {
      this.registerThemes(options.customThemes);
    }
    
    // 加载保存的主题
    this._loadSavedTheme();
    
    // 如果启用跟随系统，监听系统主题变化
    if (this.config.followSystem) {
      this._listenSystemThemeChange();
    }
    
    // 如果启用自动深色模式，根据时间设置深色模式
    if (this.config.autoDarkMode) {
      this._checkTimeDarkMode();
    }
  },
  
  /**
   * 获取当前主题
   * @returns {object} 当前主题对象
   */
  getCurrentTheme: function() {
    return this._themes[this._currentTheme] || this._themes[this.config.defaultTheme];
  },
  
  /**
   * 获取当前主题名称
   * @returns {string} 当前主题名称
   */
  getCurrentThemeName: function() {
    return this._currentTheme || this.config.defaultTheme;
  },
  
  /**
   * 获取所有可用主题
   * @returns {object} 主题列表
   */
  getThemes: function() {
    return this._themes;
  },
  
  /**
   * 获取主题列表（用于显示）
   * @returns {array} 主题列表数组
   */
  getThemeList: function() {
    return Object.keys(this._themes).map(key => {
      const theme = this._themes[key];
      return {
        id: key,
        name: theme.name,
        primaryColor: theme.primaryColor,
        isDark: theme.isDark
      };
    });
  },
  
  /**
   * 切换主题
   * @param {string} themeName - 主题名称
   * @returns {boolean} 是否切换成功
   */
  switchTheme: function(themeName) {
    // 检查主题是否存在
    if (!this._themes[themeName]) {
      console.error(`Theme '${themeName}' not found`);
      return false;
    }
    
    // 设置当前主题
    this._currentTheme = themeName;
    
    // 保存主题设置
    storage.set(this.config.storageKey, themeName);
    
    // 应用主题
    this._applyTheme();
    
    return true;
  },
  
  /**
   * 切换到深色模式
   * @returns {boolean} 是否切换成功
   */
  switchToDarkMode: function() {
    // 查找深色主题
    const darkTheme = Object.keys(this._themes).find(key => this._themes[key].isDark);
    
    if (darkTheme) {
      return this.switchTheme(darkTheme);
    }
    
    // 如果没有深色主题，使用内置的dark主题
    if (this._themes['dark']) {
      return this.switchTheme('dark');
    }
    
    console.error('No dark theme available');
    return false;
  },
  
  /**
   * 切换到浅色模式
   * @returns {boolean} 是否切换成功
   */
  switchToLightMode: function() {
    // 查找非深色主题
    const lightTheme = Object.keys(this._themes).find(key => !this._themes[key].isDark);
    
    if (lightTheme) {
      return this.switchTheme(lightTheme);
    }
    
    // 如果没有浅色主题，使用默认主题
    return this.switchTheme(this.config.defaultTheme);
  },
  
  /**
   * 切换深色/浅色模式
   * @returns {boolean} 是否切换成功
   */
  toggleDarkMode: function() {
    const currentTheme = this.getCurrentTheme();
    
    if (currentTheme.isDark) {
      return this.switchToLightMode();
    } else {
      return this.switchToDarkMode();
    }
  },
  
  /**
   * 注册新主题
   * @param {string} themeName - 主题名称
   * @param {object} themeConfig - 主题配置
   * @returns {boolean} 是否注册成功
   */
  registerTheme: function(themeName, themeConfig) {
    // 检查主题名称
    if (!themeName || typeof themeName !== 'string') {
      console.error('Invalid theme name');
      return false;
    }
    
    // 检查主题配置
    if (!themeConfig || typeof themeConfig !== 'object') {
      console.error('Invalid theme config');
      return false;
    }
    
    // 注册主题
    this._themes[themeName] = {
      ...this._themes[this.config.defaultTheme],
      ...themeConfig,
      name: themeConfig.name || themeName
    };
    
    return true;
  },
  
  /**
   * 批量注册主题
   * @param {object} themes - 主题配置对象
   * @returns {boolean} 是否全部注册成功
   */
  registerThemes: function(themes) {
    if (!themes || typeof themes !== 'object') {
      console.error('Invalid themes object');
      return false;
    }
    
    let success = true;
    
    Object.keys(themes).forEach(themeName => {
      const result = this.registerTheme(themeName, themes[themeName]);
      if (!result) success = false;
    });
    
    return success;
  },
  
  /**
   * 删除主题
   * @param {string} themeName - 主题名称
   * @returns {boolean} 是否删除成功
   */
  removeTheme: function(themeName) {
    // 不能删除默认主题
    if (themeName === this.config.defaultTheme) {
      console.error(`Cannot remove default theme '${themeName}'`);
      return false;
    }
    
    // 检查主题是否存在
    if (!this._themes[themeName]) {
      console.error(`Theme '${themeName}' not found`);
      return false;
    }
    
    // 如果删除的是当前主题，切换到默认主题
    if (themeName === this._currentTheme) {
      this.switchTheme(this.config.defaultTheme);
    }
    
    // 删除主题
    delete this._themes[themeName];
    
    return true;
  },
  
  /**
   * 获取CSS变量对象
   * @returns {object} CSS变量对象
   */
  getCssVariables: function() {
    const theme = this.getCurrentTheme();
    
    return {
      '--primary-color': theme.primaryColor,
      '--secondary-color': theme.secondaryColor,
      '--background-color': theme.backgroundColor,
      '--text-color': theme.textColor,
      '--card-color': theme.cardColor,
      '--border-color': theme.borderColor,
      '--success-color': theme.successColor,
      '--warning-color': theme.warningColor,
      '--error-color': theme.errorColor,
      '--info-color': theme.infoColor
    };
  },
  
  /**
   * 获取CSS变量字符串
   * @returns {string} CSS变量字符串
   */
  getCssVariablesString: function() {
    const variables = this.getCssVariables();
    let result = '';
    
    Object.keys(variables).forEach(key => {
      result += `${key}: ${variables[key]};`;
    });
    
    return result;
  },
  
  /**
   * 加载保存的主题
   * @private
   */
  _loadSavedTheme: function() {
    // 从存储中获取主题设置
    const savedTheme = storage.get(this.config.storageKey);
    
    // 如果有保存的主题且主题存在，使用保存的主题
    if (savedTheme && this._themes[savedTheme]) {
      this._currentTheme = savedTheme;
    } else {
      // 否则使用默认主题
      this._currentTheme = this.config.defaultTheme;
    }
    
    // 应用主题
    this._applyTheme();
  },
  
  /**
   * 应用当前主题
   * @private
   */
  _applyTheme: function() {
    const theme = this.getCurrentTheme();
    
    // 触发主题变更事件
    eventBus.emit(this.config.changeEventName, {
      themeName: this._currentTheme,
      theme: theme
    });
    
    // 更新深色模式状态
    this._isDarkMode = theme.isDark;
    
    // 在小程序中，可以通过全局数据或页面数据来应用主题
    // 这里我们将主题数据保存到全局，供页面使用
    const app = getApp();
    if (app) {
      if (!app.globalData) app.globalData = {};
      app.globalData.theme = theme;
      app.globalData.themeVars = this.getCssVariables();
    }
  },
  
  /**
   * 监听系统主题变化
   * @private
   */
  _listenSystemThemeChange: function() {
    // 检查是否支持获取系统主题
    if (wx.onThemeChange) {
      wx.onThemeChange(({ theme }) => {
        if (theme === 'dark') {
          this.switchToDarkMode();
        } else {
          this.switchToLightMode();
        }
      });
      
      // 获取当前系统主题
      wx.getSystemInfo({
        success: (res) => {
          if (res.theme === 'dark') {
            this.switchToDarkMode();
          } else {
            this.switchToLightMode();
          }
        }
      });
    }
  },
  
  /**
   * 根据时间检查是否应该启用深色模式
   * @private
   */
  _checkTimeDarkMode: function() {
    const now = new Date();
    const hour = now.getHours();
    const [startHour, endHour] = this.config.darkModeTimeRange;
    
    // 判断当前时间是否在深色模式时间范围内
    let shouldBeDark = false;
    
    if (startHour > endHour) {
      // 跨天的情况，如晚上8点到早上6点
      shouldBeDark = hour >= startHour || hour < endHour;
    } else {
      // 同一天的情况，如早上6点到晚上8点
      shouldBeDark = hour >= startHour && hour < endHour;
    }
    
    // 根据时间切换主题
    if (shouldBeDark && !this._isDarkMode) {
      this.switchToDarkMode();
    } else if (!shouldBeDark && this._isDarkMode) {
      this.switchToLightMode();
    }
    
    // 每小时检查一次
    setTimeout(() => {
      this._checkTimeDarkMode();
    }, 60 * 60 * 1000);
  }
};

module.exports = theme;