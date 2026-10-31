// i18n.js - 国际化工具

const storage = require('./storage');
const eventBus = require('./eventBus');

/**
 * 国际化工具
 * 用于实现多语言支持，管理语言包和文本翻译
 */
const i18n = {
  // 配置选项
  config: {
    // 默认语言
    defaultLocale: 'zh-CN',
    
    // 当前语言
    currentLocale: 'zh-CN',
    
    // 支持的语言列表
    supportedLocales: ['zh-CN', 'en-US'],
    
    // 语言存储键名
    storageKey: 'app_locale',
    
    // 语言变更事件名
    changeEventName: 'locale_changed',
    
    // 是否跟随系统语言
    followSystemLanguage: true,
    
    // 是否在找不到翻译时使用键名
    fallbackToKey: true,
    
    // 是否在找不到当前语言翻译时使用默认语言
    fallbackToDefaultLocale: true
  },
  
  // 语言包
  _locales: {
    // 简体中文
    'zh-CN': {
      // 通用
      common: {
        ok: '确定',
        cancel: '取消',
        confirm: '确认',
        save: '保存',
        delete: '删除',
        edit: '编辑',
        add: '添加',
        search: '搜索',
        loading: '加载中...',
        noData: '暂无数据',
        noMoreData: '没有更多数据了',
        networkError: '网络错误，请稍后重试',
        unknownError: '未知错误，请稍后重试'
      },
      
      // 错误信息
      error: {
        networkError: '网络连接失败，请检查网络设置',
        serverError: '服务器错误，请稍后重试',
        timeoutError: '请求超时，请稍后重试',
        authError: '登录已过期，请重新登录',
        paramError: '参数错误，请检查输入',
        notFound: '请求的资源不存在',
        forbidden: '没有权限访问该资源'
      },
      
      // 表单验证
      validation: {
        required: '{field}不能为空',
        email: '请输入有效的邮箱地址',
        phone: '请输入有效的手机号码',
        idCard: '请输入有效的身份证号码',
        minLength: '{field}长度不能少于{min}个字符',
        maxLength: '{field}长度不能超过{max}个字符',
        numberRange: '{field}必须在{min}到{max}之间',
        invalidFormat: '{field}格式不正确'
      },
      
      // 用户相关
      user: {
        login: '登录',
        register: '注册',
        logout: '退出登录',
        username: '用户名',
        password: '密码',
        nickname: '昵称',
        email: '邮箱',
        phone: '手机号',
        avatar: '头像',
        profile: '个人资料',
        settings: '设置',
        forgotPassword: '忘记密码',
        resetPassword: '重置密码',
        changePassword: '修改密码',
        oldPassword: '原密码',
        newPassword: '新密码',
        confirmPassword: '确认密码',
        loginSuccess: '登录成功',
        registerSuccess: '注册成功',
        logoutSuccess: '已安全退出登录',
        passwordChanged: '密码修改成功'
      },
      
      // 游泳相关
      swimming: {
        pool: '游泳池',
        course: '课程',
        coach: '教练',
        booking: '预约',
        schedule: '日程',
        member: '会员',
        memberCard: '会员卡',
        ticket: '票券',
        lane: '泳道',
        locker: '储物柜',
        equipment: '器材',
        temperature: '水温',
        waterQuality: '水质',
        openTime: '开放时间',
        closeTime: '关闭时间',
        duration: '时长',
        price: '价格',
        discount: '折扣',
        promotion: '促销',
        notice: '公告',
        rules: '规则',
        faq: '常见问题',
        feedback: '反馈',
        rating: '评分',
        comment: '评论',
        bookingSuccess: '预约成功',
        bookingCancelled: '预约已取消',
        checkIn: '签到',
        checkOut: '签出',
        checkInSuccess: '签到成功',
        checkOutSuccess: '签出成功'
      },
      
      // 时间相关
      time: {
        year: '年',
        month: '月',
        day: '日',
        hour: '时',
        minute: '分',
        second: '秒',
        today: '今天',
        yesterday: '昨天',
        tomorrow: '明天',
        thisWeek: '本周',
        lastWeek: '上周',
        nextWeek: '下周',
        thisMonth: '本月',
        lastMonth: '上月',
        nextMonth: '下月',
        morning: '上午',
        afternoon: '下午',
        evening: '晚上',
        monday: '星期一',
        tuesday: '星期二',
        wednesday: '星期三',
        thursday: '星期四',
        friday: '星期五',
        saturday: '星期六',
        sunday: '星期日'
      },
      
      // 设置相关
      settings: {
        language: '语言',
        theme: '主题',
        notification: '通知',
        privacy: '隐私',
        about: '关于',
        feedback: '反馈',
        help: '帮助',
        version: '版本',
        update: '更新',
        darkMode: '深色模式',
        autoLogin: '自动登录',
        clearCache: '清除缓存',
        cacheCleared: '缓存已清除'
      }
    },
    
    // 英文
    'en-US': {
      // 通用
      common: {
        ok: 'OK',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        add: 'Add',
        search: 'Search',
        loading: 'Loading...',
        noData: 'No Data',
        noMoreData: 'No More Data',
        networkError: 'Network Error, Please Try Again Later',
        unknownError: 'Unknown Error, Please Try Again Later'
      },
      
      // 错误信息
      error: {
        networkError: 'Network Connection Failed, Please Check Your Network Settings',
        serverError: 'Server Error, Please Try Again Later',
        timeoutError: 'Request Timeout, Please Try Again Later',
        authError: 'Login Expired, Please Login Again',
        paramError: 'Parameter Error, Please Check Your Input',
        notFound: 'The Requested Resource Does Not Exist',
        forbidden: 'No Permission To Access This Resource'
      },
      
      // 表单验证
      validation: {
        required: '{field} Cannot Be Empty',
        email: 'Please Enter A Valid Email Address',
        phone: 'Please Enter A Valid Phone Number',
        idCard: 'Please Enter A Valid ID Card Number',
        minLength: '{field} Cannot Be Less Than {min} Characters',
        maxLength: '{field} Cannot Exceed {max} Characters',
        numberRange: '{field} Must Be Between {min} And {max}',
        invalidFormat: '{field} Format Is Incorrect'
      },
      
      // 用户相关
      user: {
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
        username: 'Username',
        password: 'Password',
        nickname: 'Nickname',
        email: 'Email',
        phone: 'Phone',
        avatar: 'Avatar',
        profile: 'Profile',
        settings: 'Settings',
        forgotPassword: 'Forgot Password',
        resetPassword: 'Reset Password',
        changePassword: 'Change Password',
        oldPassword: 'Old Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm Password',
        loginSuccess: 'Login Successful',
        registerSuccess: 'Registration Successful',
        logoutSuccess: 'Logged Out Successfully',
        passwordChanged: 'Password Changed Successfully'
      },
      
      // 游泳相关
      swimming: {
        pool: 'Swimming Pool',
        course: 'Course',
        coach: 'Coach',
        booking: 'Booking',
        schedule: 'Schedule',
        member: 'Member',
        memberCard: 'Membership Card',
        ticket: 'Ticket',
        lane: 'Lane',
        locker: 'Locker',
        equipment: 'Equipment',
        temperature: 'Water Temperature',
        waterQuality: 'Water Quality',
        openTime: 'Opening Time',
        closeTime: 'Closing Time',
        duration: 'Duration',
        price: 'Price',
        discount: 'Discount',
        promotion: 'Promotion',
        notice: 'Notice',
        rules: 'Rules',
        faq: 'FAQ',
        feedback: 'Feedback',
        rating: 'Rating',
        comment: 'Comment',
        bookingSuccess: 'Booking Successful',
        bookingCancelled: 'Booking Cancelled',
        checkIn: 'Check In',
        checkOut: 'Check Out',
        checkInSuccess: 'Check In Successful',
        checkOutSuccess: 'Check Out Successful'
      },
      
      // 时间相关
      time: {
        year: 'Year',
        month: 'Month',
        day: 'Day',
        hour: 'Hour',
        minute: 'Minute',
        second: 'Second',
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
        thisWeek: 'This Week',
        lastWeek: 'Last Week',
        nextWeek: 'Next Week',
        thisMonth: 'This Month',
        lastMonth: 'Last Month',
        nextMonth: 'Next Month',
        morning: 'Morning',
        afternoon: 'Afternoon',
        evening: 'Evening',
        monday: 'Monday',
        tuesday: 'Tuesday',
        wednesday: 'Wednesday',
        thursday: 'Thursday',
        friday: 'Friday',
        saturday: 'Saturday',
        sunday: 'Sunday'
      },
      
      // 设置相关
      settings: {
        language: 'Language',
        theme: 'Theme',
        notification: 'Notification',
        privacy: 'Privacy',
        about: 'About',
        feedback: 'Feedback',
        help: 'Help',
        version: 'Version',
        update: 'Update',
        darkMode: 'Dark Mode',
        autoLogin: 'Auto Login',
        clearCache: 'Clear Cache',
        cacheCleared: 'Cache Cleared'
      }
    }
  },
  
  /**
   * 初始化国际化工具
   * @param {object} options - 配置选项
   */
  init: function(options = {}) {
    // 合并配置
    this.config = { ...this.config, ...options };
    
    // 注册自定义语言包
    if (options.locales) {
      this.registerLocales(options.locales);
    }
    
    // 加载保存的语言设置
    this._loadSavedLocale();
    
    // 如果启用跟随系统语言，获取系统语言
    if (this.config.followSystemLanguage) {
      this._getSystemLanguage();
    }
  },
  
  /**
   * 翻译文本
   * @param {string} key - 翻译键名，支持点号分隔的路径，如 'common.ok'
   * @param {object} [params] - 替换参数
   * @param {string} [locale] - 指定语言，不传则使用当前语言
   * @returns {string} 翻译后的文本
   */
  translate: function(key, params, locale) {
    // 如果键名为空，直接返回空字符串
    if (!key) {
      return '';
    }
    
    // 使用指定语言或当前语言
    const targetLocale = locale || this.config.currentLocale;
    
    // 获取翻译文本
    let text = this._getTextByKey(key, targetLocale);
    
    // 如果找不到翻译且启用了默认语言回退
    if (text === null && this.config.fallbackToDefaultLocale && targetLocale !== this.config.defaultLocale) {
      text = this._getTextByKey(key, this.config.defaultLocale);
    }
    
    // 如果仍然找不到翻译且启用了键名回退
    if (text === null && this.config.fallbackToKey) {
      text = key;
    }
    
    // 如果有替换参数，进行替换
    if (text !== null && params) {
      text = this._replaceParams(text, params);
    }
    
    return text !== null ? text : '';
  },
  
  /**
   * 翻译文本（简写方法）
   * @param {string} key - 翻译键名
   * @param {object} [params] - 替换参数
   * @returns {string} 翻译后的文本
   */
  t: function(key, params) {
    return this.translate(key, params);
  },
  
  /**
   * 切换语言
   * @param {string} locale - 语言代码
   * @returns {boolean} 是否切换成功
   */
  setLocale: function(locale) {
    // 检查语言是否支持
    if (!this.isSupported(locale)) {
      console.error(`Locale '${locale}' is not supported`);
      return false;
    }
    
    // 如果与当前语言相同，直接返回成功
    if (locale === this.config.currentLocale) {
      return true;
    }
    
    // 更新当前语言
    this.config.currentLocale = locale;
    
    // 保存语言设置
    storage.set(this.config.storageKey, locale);
    
    // 触发语言变更事件
    eventBus.emit(this.config.changeEventName, { locale });
    
    return true;
  },
  
  /**
   * 获取当前语言
   * @returns {string} 当前语言代码
   */
  getLocale: function() {
    return this.config.currentLocale;
  },
  
  /**
   * 获取支持的语言列表
   * @returns {array} 支持的语言代码列表
   */
  getSupportedLocales: function() {
    return this.config.supportedLocales;
  },
  
  /**
   * 获取语言名称
   * @param {string} [locale] - 语言代码，不传则使用当前语言
   * @returns {string} 语言名称
   */
  getLocaleName: function(locale) {
    const targetLocale = locale || this.config.currentLocale;
    
    // 语言名称映射
    const localeNames = {
      'zh-CN': '简体中文',
      'zh-TW': '繁體中文',
      'en-US': 'English',
      'ja-JP': '日本語',
      'ko-KR': '한국어',
      'fr-FR': 'Français',
      'de-DE': 'Deutsch',
      'es-ES': 'Español',
      'it-IT': 'Italiano',
      'ru-RU': 'Русский'
    };
    
    return localeNames[targetLocale] || targetLocale;
  },
  
  /**
   * 获取语言列表（用于显示）
   * @returns {array} 语言列表数组
   */
  getLocaleList: function() {
    return this.config.supportedLocales.map(locale => ({
      code: locale,
      name: this.getLocaleName(locale)
    }));
  },
  
  /**
   * 检查语言是否支持
   * @param {string} locale - 语言代码
   * @returns {boolean} 是否支持
   */
  isSupported: function(locale) {
    return this.config.supportedLocales.includes(locale);
  },
  
  /**
   * 注册语言包
   * @param {string} locale - 语言代码
   * @param {object} messages - 语言包对象
   * @returns {boolean} 是否注册成功
   */
  registerLocale: function(locale, messages) {
    // 检查参数
    if (!locale || typeof locale !== 'string') {
      console.error('Invalid locale code');
      return false;
    }
    
    if (!messages || typeof messages !== 'object') {
      console.error('Invalid locale messages');
      return false;
    }
    
    // 如果语言包不存在，创建新的
    if (!this._locales[locale]) {
      this._locales[locale] = {};
    }
    
    // 深度合并语言包
    this._locales[locale] = this._deepMerge(this._locales[locale], messages);
    
    // 如果是新语言，添加到支持的语言列表
    if (!this.config.supportedLocales.includes(locale)) {
      this.config.supportedLocales.push(locale);
    }
    
    return true;
  },
  
  /**
   * 批量注册语言包
   * @param {object} locales - 语言包对象，键为语言代码，值为语言包
   * @returns {boolean} 是否全部注册成功
   */
  registerLocales: function(locales) {
    if (!locales || typeof locales !== 'object') {
      console.error('Invalid locales object');
      return false;
    }
    
    let success = true;
    
    Object.keys(locales).forEach(locale => {
      const result = this.registerLocale(locale, locales[locale]);
      if (!result) success = false;
    });
    
    return success;
  },
  
  /**
   * 格式化日期
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {string} [format='YYYY-MM-DD'] - 格式化模式
   * @param {string} [locale] - 指定语言，不传则使用当前语言
   * @returns {string} 格式化后的日期字符串
   */
  formatDate: function(date, format = 'YYYY-MM-DD', locale) {
    const targetLocale = locale || this.config.currentLocale;
    
    // 转换为Date对象
    let dateObj;
    if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      dateObj = new Date();
    }
    
    // 如果日期无效，返回空字符串
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    // 获取日期各部分
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();
    const weekday = dateObj.getDay();
    
    // 星期几的翻译
    const weekdays = [
      this.translate('time.sunday', null, targetLocale),
      this.translate('time.monday', null, targetLocale),
      this.translate('time.tuesday', null, targetLocale),
      this.translate('time.wednesday', null, targetLocale),
      this.translate('time.thursday', null, targetLocale),
      this.translate('time.friday', null, targetLocale),
      this.translate('time.saturday', null, targetLocale)
    ];
    
    // 月份的翻译
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // 替换格式化模式中的占位符
    return format
      .replace(/YYYY/g, year.toString())
      .replace(/YY/g, year.toString().slice(-2))
      .replace(/MM/g, month < 10 ? `0${month}` : month.toString())
      .replace(/M/g, month.toString())
      .replace(/DD/g, day < 10 ? `0${day}` : day.toString())
      .replace(/D/g, day.toString())
      .replace(/HH/g, hours < 10 ? `0${hours}` : hours.toString())
      .replace(/H/g, hours.toString())
      .replace(/hh/g, (hours % 12 || 12) < 10 ? `0${hours % 12 || 12}` : (hours % 12 || 12).toString())
      .replace(/h/g, (hours % 12 || 12).toString())
      .replace(/mm/g, minutes < 10 ? `0${minutes}` : minutes.toString())
      .replace(/m/g, minutes.toString())
      .replace(/ss/g, seconds < 10 ? `0${seconds}` : seconds.toString())
      .replace(/s/g, seconds.toString())
      .replace(/A/g, hours < 12 ? 'AM' : 'PM')
      .replace(/a/g, hours < 12 ? 'am' : 'pm')
      .replace(/dddd/g, weekdays[weekday])
      .replace(/MMMM/g, targetLocale.startsWith('zh') ? `${month}${this.translate('time.month', null, targetLocale)}` : months[month - 1]);
  },
  
  /**
   * 格式化数字
   * @param {number} number - 数字
   * @param {object} [options] - 格式化选项
   * @param {string} [locale] - 指定语言，不传则使用当前语言
   * @returns {string} 格式化后的数字字符串
   */
  formatNumber: function(number, options = {}, locale) {
    const targetLocale = locale || this.config.currentLocale;
    
    // 默认选项
    const defaultOptions = {
      // 小数位数
      decimals: 2,
      // 千位分隔符
      thousandsSeparator: ',',
      // 小数点
      decimalPoint: '.',
      // 是否保留尾随零
      keepTrailingZeros: false
    };
    
    // 合并选项
    const formatOptions = { ...defaultOptions, ...options };
    
    // 根据语言调整默认分隔符
    if (targetLocale.startsWith('zh')) {
      formatOptions.thousandsSeparator = ',';
      formatOptions.decimalPoint = '.';
    } else if (targetLocale.startsWith('de') || targetLocale.startsWith('fr')) {
      formatOptions.thousandsSeparator = ' ';
      formatOptions.decimalPoint = ',';
    }
    
    // 转换为数字
    const num = parseFloat(number);
    
    // 如果不是有效数字，返回原值
    if (isNaN(num)) {
      return number.toString();
    }
    
    // 格式化数字
    const parts = num.toFixed(formatOptions.decimals).split('.');
    
    // 处理整数部分（添加千位分隔符）
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, formatOptions.thousandsSeparator);
    
    // 处理小数部分（移除尾随零）
    if (parts.length > 1 && !formatOptions.keepTrailingZeros) {
      parts[1] = parts[1].replace(/0+$/, '');
      
      // 如果小数部分为空，移除小数点
      if (parts[1] === '') {
        return parts[0];
      }
    }
    
    // 组合整数和小数部分
    return parts.join(formatOptions.decimalPoint);
  },
  
  /**
   * 格式化货币
   * @param {number} amount - 金额
   * @param {object} [options] - 格式化选项
   * @param {string} [locale] - 指定语言，不传则使用当前语言
   * @returns {string} 格式化后的货币字符串
   */
  formatCurrency: function(amount, options = {}, locale) {
    const targetLocale = locale || this.config.currentLocale;
    
    // 默认选项
    const defaultOptions = {
      // 货币符号
      symbol: '¥',
      // 货币符号位置（before/after）
      symbolPosition: 'before',
      // 小数位数
      decimals: 2,
      // 是否保留尾随零
      keepTrailingZeros: true
    };
    
    // 根据语言设置默认货币符号
    if (targetLocale.startsWith('en')) {
      defaultOptions.symbol = '$';
    } else if (targetLocale.startsWith('zh')) {
      defaultOptions.symbol = '¥';
    } else if (targetLocale.startsWith('ja')) {
      defaultOptions.symbol = '¥';
    } else if (targetLocale.startsWith('ko')) {
      defaultOptions.symbol = '₩';
    } else if (targetLocale.startsWith('fr') || targetLocale.startsWith('de') || targetLocale.startsWith('es') || targetLocale.startsWith('it')) {
      defaultOptions.symbol = '€';
      defaultOptions.symbolPosition = 'after';
    } else if (targetLocale.startsWith('ru')) {
      defaultOptions.symbol = '₽';
      defaultOptions.symbolPosition = 'after';
    }
    
    // 合并选项
    const formatOptions = { ...defaultOptions, ...options };
    
    // 格式化数字部分
    const formattedNumber = this.formatNumber(amount, {
      decimals: formatOptions.decimals,
      keepTrailingZeros: formatOptions.keepTrailingZeros
    }, targetLocale);
    
    // 添加货币符号
    if (formatOptions.symbolPosition === 'before') {
      return `${formatOptions.symbol}${formattedNumber}`;
    } else {
      return `${formattedNumber} ${formatOptions.symbol}`;
    }
  },
  
  /**
   * 加载保存的语言设置
   * @private
   */
  _loadSavedLocale: function() {
    // 从存储中获取语言设置
    const savedLocale = storage.get(this.config.storageKey);
    
    // 如果有保存的语言且语言受支持，使用保存的语言
    if (savedLocale && this.isSupported(savedLocale)) {
      this.config.currentLocale = savedLocale;
    }
  },
  
  /**
   * 获取系统语言
   * @private
   */
  _getSystemLanguage: function() {
    try {
      // 获取系统信息
      wx.getSystemInfo({
        success: (res) => {
          if (res.language) {
            // 将系统语言转换为支持的语言格式
            const systemLocale = this._normalizeLocale(res.language);
            
            // 如果系统语言受支持且与当前语言不同，切换语言
            if (this.isSupported(systemLocale) && systemLocale !== this.config.currentLocale) {
              this.setLocale(systemLocale);
            }
          }
        }
      });
    } catch (e) {
      console.error('Failed to get system language:', e);
    }
  },
  
  /**
   * 标准化语言代码
   * @private
   * @param {string} locale - 语言代码
   * @returns {string} 标准化后的语言代码
   */
  _normalizeLocale: function(locale) {
    if (!locale) return this.config.defaultLocale;
    
    // 语言映射表
    const localeMap = {
      'zh': 'zh-CN',
      'zh_CN': 'zh-CN',
      'zh-Hans': 'zh-CN',
      'zh_TW': 'zh-TW',
      'zh-Hant': 'zh-TW',
      'en': 'en-US',
      'en_US': 'en-US',
      'ja': 'ja-JP',
      'ja_JP': 'ja-JP',
      'ko': 'ko-KR',
      'ko_KR': 'ko-KR',
      'fr': 'fr-FR',
      'fr_FR': 'fr-FR',
      'de': 'de-DE',
      'de_DE': 'de-DE',
      'es': 'es-ES',
      'es_ES': 'es-ES',
      'it': 'it-IT',
      'it_IT': 'it-IT',
      'ru': 'ru-RU',
      'ru_RU': 'ru-RU'
    };
    
    // 如果有直接映射，使用映射结果
    if (localeMap[locale]) {
      return localeMap[locale];
    }
    
    // 尝试匹配语言前缀
    const prefix = locale.split(/[-_]/)[0].toLowerCase();
    for (const key of this.config.supportedLocales) {
      if (key.startsWith(prefix)) {
        return key;
      }
    }
    
    // 如果没有匹配，返回默认语言
    return this.config.defaultLocale;
  },
  
  /**
   * 根据键名获取翻译文本
   * @private
   * @param {string} key - 翻译键名
   * @param {string} locale - 语言代码
   * @returns {string|null} 翻译文本，找不到则返回null
   */
  _getTextByKey: function(key, locale) {
    // 如果语言包不存在，返回null
    if (!this._locales[locale]) {
      return null;
    }
    
    // 分割键名路径
    const path = key.split('.');
    
    // 从语言包中查找翻译
    let result = this._locales[locale];
    for (const segment of path) {
      if (result && typeof result === 'object' && segment in result) {
        result = result[segment];
      } else {
        return null;
      }
    }
    
    // 如果结果是对象而不是字符串，返回null
    if (result && typeof result === 'object') {
      return null;
    }
    
    return result;
  },
  
  /**
   * 替换文本中的参数
   * @private
   * @param {string} text - 文本
   * @param {object} params - 参数对象
   * @returns {string} 替换后的文本
   */
  _replaceParams: function(text, params) {
    if (!text || !params) {
      return text;
    }
    
    // 替换{param}格式的参数
    return text.replace(/\{([^{}]+)\}/g, (match, key) => {
      return params[key] !== undefined ? params[key] : match;
    });
  },
  
  /**
   * 深度合并对象
   * @private
   * @param {object} target - 目标对象
   * @param {object} source - 源对象
   * @returns {object} 合并后的对象
   */
  _deepMerge: function(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        if (result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
          result[key] = this._deepMerge(result[key], source[key]);
        } else {
          result[key] = { ...source[key] };
        }
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }
};

module.exports = i18n;