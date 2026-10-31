// validator.js - 数据验证工具

const validator = {
  /**
   * 验证是否为空
   * @param {*} value - 要验证的值
   * @returns {boolean} 是否为空
   */
  isEmpty: function(value) {
    if (value === null || value === undefined) {
      return true;
    }
    
    if (typeof value === 'string') {
      return value.trim() === '';
    }
    
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }
    
    return false;
  },
  
  /**
   * 验证是否为数字
   * @param {*} value - 要验证的值
   * @returns {boolean} 是否为数字
   */
  isNumber: function(value) {
    if (typeof value === 'number') {
      return !isNaN(value) && isFinite(value);
    }
    
    if (typeof value === 'string' && value.trim() !== '') {
      return !isNaN(Number(value)) && isFinite(Number(value));
    }
    
    return false;
  },
  
  /**
   * 验证是否为整数
   * @param {*} value - 要验证的值
   * @returns {boolean} 是否为整数
   */
  isInteger: function(value) {
    if (!this.isNumber(value)) {
      return false;
    }
    
    const num = Number(value);
    return Number.isInteger(num);
  },
  
  /**
   * 验证是否为正数
   * @param {*} value - 要验证的值
   * @returns {boolean} 是否为正数
   */
  isPositive: function(value) {
    if (!this.isNumber(value)) {
      return false;
    }
    
    return Number(value) > 0;
  },
  
  /**
   * 验证是否为非负数
   * @param {*} value - 要验证的值
   * @returns {boolean} 是否为非负数
   */
  isNonNegative: function(value) {
    if (!this.isNumber(value)) {
      return false;
    }
    
    return Number(value) >= 0;
  },
  
  /**
   * 验证是否在指定范围内
   * @param {*} value - 要验证的值
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @returns {boolean} 是否在范围内
   */
  inRange: function(value, min, max) {
    if (!this.isNumber(value)) {
      return false;
    }
    
    const num = Number(value);
    return num >= min && num <= max;
  },
  
  /**
   * 验证字符串长度是否在指定范围内
   * @param {string} value - 要验证的字符串
   * @param {number} min - 最小长度
   * @param {number} max - 最大长度
   * @returns {boolean} 是否在范围内
   */
  lengthInRange: function(value, min, max) {
    if (typeof value !== 'string') {
      return false;
    }
    
    return value.length >= min && value.length <= max;
  },
  
  /**
   * 验证是否为有效手机号
   * @param {string} value - 要验证的手机号
   * @returns {boolean} 是否有效
   */
  isPhone: function(value) {
    if (typeof value !== 'string') {
      return false;
    }
    
    // 中国大陆手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(value);
  },
  
  /**
   * 验证是否为有效邮箱
   * @param {string} value - 要验证的邮箱
   * @returns {boolean} 是否有效
   */
  isEmail: function(value) {
    if (typeof value !== 'string') {
      return false;
    }
    
    const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
    return emailRegex.test(value);
  },
  
  /**
   * 验证是否为有效身份证号
   * @param {string} value - 要验证的身份证号
   * @returns {boolean} 是否有效
   */
  isIdCard: function(value) {
    if (typeof value !== 'string') {
      return false;
    }
    
    // 简单的身份证号格式验证
    const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!idCardRegex.test(value)) {
      return false;
    }
    
    // 对18位身份证进行进一步验证
    if (value.length === 18) {
      // 加权因子
      const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      // 校验码
      const codes = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      
      // 获取前17位
      const idCard17 = value.substring(0, 17);
      
      // 获取校验码
      const idCardMod = value.substring(17, 18);
      
      // 根据前17位计算出校验码
      let sum = 0;
      for (let i = 0; i < 17; i++) {
        sum += parseInt(idCard17.charAt(i)) * weights[i];
      }
      
      const mod = sum % 11;
      const calcCode = codes[mod];
      
      // 检查计算的校验码与输入的校验码是否一致
      return calcCode === idCardMod.toUpperCase();
    }
    
    return true; // 15位身份证不做进一步校验
  },
  
  /**
   * 验证是否为有效URL
   * @param {string} value - 要验证的URL
   * @returns {boolean} 是否有效
   */
  isUrl: function(value) {
    if (typeof value !== 'string') {
      return false;
    }
    
    try {
      new URL(value);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  /**
   * 验证是否为有效日期
   * @param {*} value - 要验证的日期
   * @returns {boolean} 是否有效
   */
  isDate: function(value) {
    if (value instanceof Date) {
      return !isNaN(value.getTime());
    }
    
    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }
    
    return false;
  },
  
  /**
   * 验证是否为有效的中文姓名
   * @param {string} value - 要验证的姓名
   * @returns {boolean} 是否有效
   */
  isChineseName: function(value) {
    if (typeof value !== 'string') {
      return false;
    }
    
    // 中文姓名格式：2-15个汉字
    const nameRegex = /^[\u4e00-\u9fa5]{2,15}$/;
    return nameRegex.test(value);
  },
  
  /**
   * 验证是否包含特殊字符
   * @param {string} value - 要验证的字符串
   * @returns {boolean} 是否包含特殊字符
   */
  hasSpecialChar: function(value) {
    if (typeof value !== 'string') {
      return false;
    }
    
    // 特殊字符正则表达式,包含常见中英文标点符号
    const specialCharRegex = /[`~!@#$%^&*()_\+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：""【】、；''，。、]/im;
    return specialCharRegex.test(value);
  },
  
  /**
   * 验证密码强度
   * @param {string} value - 要验证的密码
   * @param {object} options - 验证选项
   * @returns {boolean} 是否符合强度要求
   */
  isStrongPassword: function(value, options = {}) {
    if (typeof value !== 'string') {
      return false;
    }
    
    const defaultOptions = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    };
    
    const opts = { ...defaultOptions, ...options };
    
    // 长度检查
    if (value.length < opts.minLength) {
      return false;
    }
    
    // 大写字母检查
    if (opts.requireUppercase && !/[A-Z]/.test(value)) {
      return false;
    }
    
    // 小写字母检查
    if (opts.requireLowercase && !/[a-z]/.test(value)) {
      return false;
    }
    
    // 数字检查
    if (opts.requireNumbers && !/[0-9]/.test(value)) {
      return false;
    }
    
    // 特殊字符检查
    if (opts.requireSpecialChars && !this.hasSpecialChar(value)) {
      return false;
    }
    
    return true;
  }
};

module.exports = validator;
