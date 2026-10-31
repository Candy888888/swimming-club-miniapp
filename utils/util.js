// util.js - 通用工具函数

/**
 * 格式化时间
 * @param {Date} date - 日期对象
 * @param {string} format - 格式化模板，默认为'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的时间字符串
 */
const formatTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) {
    date = new Date();
  }
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date);
  }
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  
  return format
    .replace('YYYY', year)
    .replace('MM', padZero(month))
    .replace('DD', padZero(day))
    .replace('HH', padZero(hour))
    .replace('mm', padZero(minute))
    .replace('ss', padZero(second));
};

/**
 * 数字补零
 * @param {number} n - 数字
 * @returns {string} 补零后的字符串
 */
const padZero = n => {
  return n < 10 ? '0' + n : '' + n;
};

/**
 * 防抖函数
 * @param {function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间，单位毫秒
 * @returns {function} 防抖后的函数
 */
const debounce = (fn, delay = 300) => {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * 节流函数
 * @param {function} fn - 需要节流的函数
 * @param {number} interval - 间隔时间，单位毫秒
 * @returns {function} 节流后的函数
 */
const throttle = (fn, interval = 300) => {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
};

/**
 * 深拷贝对象
 * @param {object} obj - 需要拷贝的对象
 * @returns {object} 拷贝后的新对象
 */
const deepClone = obj => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  // 处理普通对象
  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  
  return clonedObj;
};

/**
 * 生成UUID
 * @returns {string} UUID字符串
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * 获取URL参数
 * @param {string} url - URL字符串
 * @returns {object} 参数对象
 */
const getUrlParams = url => {
  const params = {};
  if (!url || url.indexOf('?') === -1) {
    return params;
  }
  
  const queryString = url.split('?')[1];
  const paramPairs = queryString.split('&');
  
  paramPairs.forEach(pair => {
    const [key, value] = pair.split('=');
    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });
  
  return params;
};

/**
 * 检查对象是否为空
 * @param {object} obj - 需要检查的对象
 * @returns {boolean} 是否为空
 */
const isEmpty = obj => {
  if (obj === null || obj === undefined) {
    return true;
  }
  
  if (typeof obj === 'string') {
    return obj.trim() === '';
  }
  
  if (Array.isArray(obj)) {
    return obj.length === 0;
  }
  
  if (typeof obj === 'object') {
    return Object.keys(obj).length === 0;
  }
  
  return false;
};

/**
 * 格式化金额
 * @param {number} amount - 金额数值
 * @param {number} decimals - 小数位数
 * @param {string} decimalSeparator - 小数点符号
 * @param {string} thousandsSeparator - 千分位符号
 * @returns {string} 格式化后的金额字符串
 */
const formatAmount = (amount, decimals = 2, decimalSeparator = '.', thousandsSeparator = ',') => {
  if (isNaN(amount)) {
    return '0.00';
  }
  
  const fixedAmount = parseFloat(amount).toFixed(decimals);
  const [intPart, decimalPart] = fixedAmount.split('.');
  
  // 添加千分位分隔符
  const formattedIntPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  
  return decimals > 0
    ? `${formattedIntPart}${decimalSeparator}${decimalPart}`
    : formattedIntPart;
};

/**
 * 计算两个日期之间的天数差
 * @param {Date|string|number} date1 - 第一个日期
 * @param {Date|string|number} date2 - 第二个日期
 * @returns {number} 天数差
 */
const daysBetween = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  // 重置时间部分，只比较日期
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  
  // 计算毫秒差并转换为天数
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
const isValidPhone = phone => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证邮箱
 * @param {string} email - 邮箱
 * @returns {boolean} 是否有效
 */
const isValidEmail = email => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
  return emailRegex.test(email);
};

/**
 * 验证身份证号
 * @param {string} idCard - 身份证号
 * @returns {boolean} 是否有效
 */
const isValidIdCard = idCard => {
  const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idCardRegex.test(idCard);
};

/**
 * 获取文件扩展名
 * @param {string} filename - 文件名
 * @returns {string} 扩展名
 */
const getFileExtension = filename => {
  if (!filename || typeof filename !== 'string') {
    return '';
  }
  return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
};

/**
 * 将对象转换为查询字符串
 * @param {object} obj - 对象
 * @returns {string} 查询字符串
 */
const objectToQueryString = obj => {
  if (!obj || typeof obj !== 'object') {
    return '';
  }
  
  return Object.keys(obj)
    .filter(key => obj[key] !== undefined && obj[key] !== null)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
};

module.exports = {
  formatTime,
  padZero,
  debounce,
  throttle,
  deepClone,
  generateUUID,
  getUrlParams,
  isEmpty,
  formatAmount,
  daysBetween,
  isValidPhone,
  isValidEmail,
  isValidIdCard,
  getFileExtension,
  objectToQueryString
};