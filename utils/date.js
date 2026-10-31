// date.js - 日期时间工具

/**
 * 日期时间工具
 * 用于处理日期和时间相关的操作，包括日期格式化、计算、比较等功能
 */
const dateUtils = {
  /**
   * 格式化日期
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {string} format - 格式化模式，默认为 'YYYY-MM-DD'
   * @returns {string} 格式化后的日期字符串
   * 
   * 支持的格式化占位符：
   * - YYYY: 四位年份，如 2023
   * - YY: 两位年份，如 23
   * - MM: 两位月份，如 01-12
   * - M: 一位月份，如 1-12
   * - DD: 两位日期，如 01-31
   * - D: 一位日期，如 1-31
   * - HH: 两位小时（24小时制），如 00-23
   * - H: 一位小时（24小时制），如 0-23
   * - hh: 两位小时（12小时制），如 01-12
   * - h: 一位小时（12小时制），如 1-12
   * - mm: 两位分钟，如 00-59
   * - m: 一位分钟，如 0-59
   * - ss: 两位秒钟，如 00-59
   * - s: 一位秒钟，如 0-59
   * - SSS: 三位毫秒，如 000-999
   * - A: AM/PM
   * - a: am/pm
   * - Q: 季度，如 1-4
   * - dddd: 星期几的完整名称，如 星期一
   * - ddd: 星期几的简短名称，如 周一
   * - d: 一周中的第几天，如 0-6（0表示星期日）
   */
  format: function(date, format = 'YYYY-MM-DD') {
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
    const milliseconds = dateObj.getMilliseconds();
    const weekday = dateObj.getDay();
    const quarter = Math.floor(month / 3) + 1;
    
    // 星期几的名称
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const shortWeekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
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
      .replace(/SSS/g, milliseconds < 10 ? `00${milliseconds}` : (milliseconds < 100 ? `0${milliseconds}` : milliseconds.toString()))
      .replace(/A/g, hours < 12 ? 'AM' : 'PM')
      .replace(/a/g, hours < 12 ? 'am' : 'pm')
      .replace(/Q/g, quarter.toString())
      .replace(/dddd/g, weekdays[weekday])
      .replace(/ddd/g, shortWeekdays[weekday])
      .replace(/d/g, weekday.toString());
  },
  
  /**
   * 解析日期字符串为Date对象
   * @param {string} dateStr - 日期字符串
   * @param {string} format - 日期字符串的格式，默认为 'YYYY-MM-DD'
   * @returns {Date|null} 解析后的Date对象，解析失败则返回null
   */
  parse: function(dateStr, format = 'YYYY-MM-DD') {
    if (!dateStr) return null;
    
    // 尝试直接解析
    const directParsed = new Date(dateStr);
    if (!isNaN(directParsed.getTime())) {
      return directParsed;
    }
    
    // 如果直接解析失败，根据格式解析
    const patterns = {
      'YYYY': { pattern: /YYYY/, index: 0, value: null },
      'MM': { pattern: /MM/, index: 0, value: null },
      'DD': { pattern: /DD/, index: 0, value: null },
      'HH': { pattern: /HH/, index: 0, value: null },
      'mm': { pattern: /mm/, index: 0, value: null },
      'ss': { pattern: /ss/, index: 0, value: null }
    };
    
    // 获取各部分在格式中的位置
    let formatParts = format;
    for (const key in patterns) {
      const match = formatParts.match(patterns[key].pattern);
      if (match) {
        patterns[key].index = match.index;
        formatParts = formatParts.replace(patterns[key].pattern, ''.padStart(key.length, ' '));
      }
    }
    
    // 根据位置从日期字符串中提取值
    for (const key in patterns) {
      if (patterns[key].index >= 0) {
        const value = dateStr.substr(patterns[key].index, key.length);
        patterns[key].value = parseInt(value, 10);
      }
    }
    
    // 设置默认值
    const year = patterns['YYYY'].value !== null ? patterns['YYYY'].value : 1970;
    const month = patterns['MM'].value !== null ? patterns['MM'].value - 1 : 0;
    const day = patterns['DD'].value !== null ? patterns['DD'].value : 1;
    const hour = patterns['HH'].value !== null ? patterns['HH'].value : 0;
    const minute = patterns['mm'].value !== null ? patterns['mm'].value : 0;
    const second = patterns['ss'].value !== null ? patterns['ss'].value : 0;
    
    // 创建Date对象
    const result = new Date(year, month, day, hour, minute, second);
    
    // 验证解析结果
    if (isNaN(result.getTime())) {
      return null;
    }
    
    return result;
  },
  
  /**
   * 获取当前日期时间
   * @param {string} format - 返回格式，默认为 'YYYY-MM-DD HH:mm:ss'
   * @returns {string|Date} 当前日期时间，如果format为null则返回Date对象
   */
  now: function(format = 'YYYY-MM-DD HH:mm:ss') {
    const now = new Date();
    return format ? this.format(now, format) : now;
  },
  
  /**
   * 获取今天的日期
   * @param {string} format - 返回格式，默认为 'YYYY-MM-DD'
   * @returns {string|Date} 今天的日期，如果format为null则返回Date对象
   */
  today: function(format = 'YYYY-MM-DD') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return format ? this.format(today, format) : today;
  },
  
  /**
   * 获取明天的日期
   * @param {string} format - 返回格式，默认为 'YYYY-MM-DD'
   * @returns {string|Date} 明天的日期，如果format为null则返回Date对象
   */
  tomorrow: function(format = 'YYYY-MM-DD') {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return format ? this.format(tomorrow, format) : tomorrow;
  },
  
  /**
   * 获取昨天的日期
   * @param {string} format - 返回格式，默认为 'YYYY-MM-DD'
   * @returns {string|Date} 昨天的日期，如果format为null则返回Date对象
   */
  yesterday: function(format = 'YYYY-MM-DD') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    return format ? this.format(yesterday, format) : yesterday;
  },
  
  /**
   * 获取本周的开始日期（星期一）
   * @param {string} format - 返回格式，默认为 'YYYY-MM-DD'
   * @returns {string|Date} 本周的开始日期，如果format为null则返回Date对象
   */
  startOfWeek: function(format = 'YYYY-MM-DD') {
    const now = new Date();
    const dayOfWeek = now.getDay() || 7; // 将周日的0转换为7
    const diff = dayOfWeek - 1; // 计算与周一的差值
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);
    return format ? this.format(startOfWeek, format) : startOfWeek;
  },
  
  /**
   * 获取本周的结束日期（星期日）
   * @param {string} format - 返回格式，默认为 'YYYY-MM-DD'
   * @returns {string|Date} 本周的结束日期，如果format为null则返回Date对象
   */
  endOfWeek: function(format = 'YYYY-MM-DD') {
    const now = new Date();
    const dayOfWeek = now.getDay() || 7; // 将周日的0转换为7
    const diff = 7 - dayOfWeek; // 计算与周日的差值
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + diff);
    endOfWeek.setHours(23, 59, 59, 999);
    return format ? this.format(endOfWeek, format) : endOfWeek;
  },
  
  /**
   * 获取本月的开始日期
   * @param {string} format - 返回格式，默认为 'YYYY-MM-DD'
   * @returns {string|Date} 本月的开始日期，如果format为null则返回Date对象
   */
  startOfMonth: function(format = 'YYYY-MM-DD') {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return format ? this.format(startOfMonth, format) : startOfMonth;
  },
  
  /**
   * 获取本月的结束日期
   * @param {string} format - 返回格式，默认为 'YYYY-MM-DD'
   * @returns {string|Date} 本月的结束日期，如果format为null则返回Date对象
   */
  endOfMonth: function(format = 'YYYY-MM-DD') {
    const now = new Date();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    return format ? this.format(endOfMonth, format) : endOfMonth;
  },
  
  /**
   * 获取本年的开始日期
   * @param {string} format - 返回格式，默认为 'YYYY-MM-DD'
   * @returns {string|Date} 本年的开始日期，如果format为null则返回Date对象
   */
  startOfYear: function(format = 'YYYY-MM-DD') {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    return format ? this.format(startOfYear, format) : startOfYear;
  },
  
  /**
   * 获取本年的结束日期
   * @param {string} format - 返回格式，默认为 'YYYY-MM-DD'
   * @returns {string|Date} 本年的结束日期，如果format为null则返回Date对象
   */
  endOfYear: function(format = 'YYYY-MM-DD') {
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    return format ? this.format(endOfYear, format) : endOfYear;
  },
  
  /**
   * 添加指定时间
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {number} amount - 添加的数量
   * @param {string} unit - 时间单位，支持 'year', 'month', 'week', 'day', 'hour', 'minute', 'second'
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 计算后的日期，如果format为null则返回Date对象
   */
  add: function(date, amount, unit, format = null) {
    // 转换为Date对象
    let dateObj;
    if (date instanceof Date) {
      dateObj = new Date(date);
    } else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date);
    } else {
      dateObj = new Date();
    }
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 根据单位添加时间
    switch (unit.toLowerCase()) {
      case 'year':
        dateObj.setFullYear(dateObj.getFullYear() + amount);
        break;
      case 'month':
        dateObj.setMonth(dateObj.getMonth() + amount);
        break;
      case 'week':
        dateObj.setDate(dateObj.getDate() + (amount * 7));
        break;
      case 'day':
        dateObj.setDate(dateObj.getDate() + amount);
        break;
      case 'hour':
        dateObj.setHours(dateObj.getHours() + amount);
        break;
      case 'minute':
        dateObj.setMinutes(dateObj.getMinutes() + amount);
        break;
      case 'second':
        dateObj.setSeconds(dateObj.getSeconds() + amount);
        break;
      default:
        return null;
    }
    
    return format ? this.format(dateObj, format) : dateObj;
  },
  
  /**
   * 减去指定时间
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {number} amount - 减去的数量
   * @param {string} unit - 时间单位，支持 'year', 'month', 'week', 'day', 'hour', 'minute', 'second'
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 计算后的日期，如果format为null则返回Date对象
   */
  subtract: function(date, amount, unit, format = null) {
    return this.add(date, -amount, unit, format);
  },
  
  /**
   * 计算两个日期之间的差值
   * @param {Date|string|number} date1 - 第一个日期
   * @param {Date|string|number} date2 - 第二个日期
   * @param {string} unit - 返回的差值单位，支持 'year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'
   * @returns {number} 两个日期之间的差值
   */
  diff: function(date1, date2, unit = 'day') {
    // 转换为Date对象
    const dateObj1 = date1 instanceof Date ? date1 : new Date(date1);
    const dateObj2 = date2 instanceof Date ? date2 : new Date(date2);
    
    // 如果日期无效，返回NaN
    if (isNaN(dateObj1.getTime()) || isNaN(dateObj2.getTime())) {
      return NaN;
    }
    
    // 计算毫秒差值
    const diffMs = dateObj2.getTime() - dateObj1.getTime();
    
    // 根据单位计算差值
    switch (unit.toLowerCase()) {
      case 'year':
        return dateObj2.getFullYear() - dateObj1.getFullYear();
      case 'month':
        return (dateObj2.getFullYear() - dateObj1.getFullYear()) * 12 + (dateObj2.getMonth() - dateObj1.getMonth());
      case 'week':
        return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
      case 'day':
        return Math.floor(diffMs / (24 * 60 * 60 * 1000));
      case 'hour':
        return Math.floor(diffMs / (60 * 60 * 1000));
      case 'minute':
        return Math.floor(diffMs / (60 * 1000));
      case 'second':
        return Math.floor(diffMs / 1000);
      case 'millisecond':
        return diffMs;
      default:
        return NaN;
    }
  },
  
  /**
   * 比较两个日期的大小
   * @param {Date|string|number} date1 - 第一个日期
   * @param {Date|string|number} date2 - 第二个日期
   * @returns {number} 如果date1小于date2，返回-1；如果date1等于date2，返回0；如果date1大于date2，返回1
   */
  compare: function(date1, date2) {
    // 转换为Date对象
    const dateObj1 = date1 instanceof Date ? date1 : new Date(date1);
    const dateObj2 = date2 instanceof Date ? date2 : new Date(date2);
    
    // 如果日期无效，返回NaN
    if (isNaN(dateObj1.getTime()) || isNaN(dateObj2.getTime())) {
      return NaN;
    }
    
    // 比较时间戳
    const time1 = dateObj1.getTime();
    const time2 = dateObj2.getTime();
    
    if (time1 < time2) {
      return -1;
    } else if (time1 > time2) {
      return 1;
    } else {
      return 0;
    }
  },
  
  /**
   * 判断两个日期是否相等（忽略时间部分）
   * @param {Date|string|number} date1 - 第一个日期
   * @param {Date|string|number} date2 - 第二个日期
   * @returns {boolean} 如果两个日期相等，返回true；否则返回false
   */
  isSameDay: function(date1, date2) {
    // 转换为Date对象
    const dateObj1 = date1 instanceof Date ? date1 : new Date(date1);
    const dateObj2 = date2 instanceof Date ? date2 : new Date(date2);
    
    // 如果日期无效，返回false
    if (isNaN(dateObj1.getTime()) || isNaN(dateObj2.getTime())) {
      return false;
    }
    
    // 比较年、月、日
    return (
      dateObj1.getFullYear() === dateObj2.getFullYear() &&
      dateObj1.getMonth() === dateObj2.getMonth() &&
      dateObj1.getDate() === dateObj2.getDate()
    );
  },
  
  /**
   * 判断两个日期是否在同一个月
   * @param {Date|string|number} date1 - 第一个日期
   * @param {Date|string|number} date2 - 第二个日期
   * @returns {boolean} 如果两个日期在同一个月，返回true；否则返回false
   */
  isSameMonth: function(date1, date2) {
    // 转换为Date对象
    const dateObj1 = date1 instanceof Date ? date1 : new Date(date1);
    const dateObj2 = date2 instanceof Date ? date2 : new Date(date2);
    
    // 如果日期无效，返回false
    if (isNaN(dateObj1.getTime()) || isNaN(dateObj2.getTime())) {
      return false;
    }
    
    // 比较年、月
    return (
      dateObj1.getFullYear() === dateObj2.getFullYear() &&
      dateObj1.getMonth() === dateObj2.getMonth()
    );
  },
  
  /**
   * 判断两个日期是否在同一年
   * @param {Date|string|number} date1 - 第一个日期
   * @param {Date|string|number} date2 - 第二个日期
   * @returns {boolean} 如果两个日期在同一年，返回true；否则返回false
   */
  isSameYear: function(date1, date2) {
    // 转换为Date对象
    const dateObj1 = date1 instanceof Date ? date1 : new Date(date1);
    const dateObj2 = date2 instanceof Date ? date2 : new Date(date2);
    
    // 如果日期无效，返回false
    if (isNaN(dateObj1.getTime()) || isNaN(dateObj2.getTime())) {
      return false;
    }
    
    // 比较年
    return dateObj1.getFullYear() === dateObj2.getFullYear();
  },
  
  /**
   * 判断日期是否为闰年
   * @param {Date|string|number|number} date - 日期对象、日期字符串、时间戳或年份
   * @returns {boolean} 如果是闰年，返回true；否则返回false
   */
  isLeapYear: function(date) {
    let year;
    
    if (typeof date === 'number' && date > 0 && date < 10000) {
      // 如果是年份数字
      year = date;
    } else {
      // 转换为Date对象
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // 如果日期无效，返回false
      if (isNaN(dateObj.getTime())) {
        return false;
      }
      
      year = dateObj.getFullYear();
    }
    
    // 判断闰年：能被4整除但不能被100整除，或者能被400整除
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  },
  
  /**
   * 获取指定月份的天数
   * @param {number} year - 年份
   * @param {number} month - 月份（1-12）
   * @returns {number} 月份的天数
   */
  getDaysInMonth: function(year, month) {
    // 月份需要减1，因为Date对象的月份从0开始
    return new Date(year, month, 0).getDate();
  },
  
  /**
   * 获取指定日期是一年中的第几天
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @returns {number} 一年中的第几天（1-366）
   */
  getDayOfYear: function(date) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // 如果日期无效，返回NaN
    if (isNaN(dateObj.getTime())) {
      return NaN;
    }
    
    // 计算一年中的第几天
    const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
    const diff = dateObj.getTime() - startOfYear.getTime();
    return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
  },
  
  /**
   * 获取指定日期是一年中的第几周（ISO 8601标准，每周从周一开始）
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @returns {number} 一年中的第几周（1-53）
   */
  getWeekOfYear: function(date) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // 如果日期无效，返回NaN
    if (isNaN(dateObj.getTime())) {
      return NaN;
    }
    
    // 设置为当天的零点
    dateObj.setHours(0, 0, 0, 0);
    
    // 设置为本周的周四（ISO 8601标准规定，每年的第一周包含该年的第一个周四）
    dateObj.setDate(dateObj.getDate() + 3 - ((dateObj.getDay() + 6) % 7));
    
    // 计算一年中的第几周
    const startOfYear = new Date(dateObj.getFullYear(), 0, 1);
    const weekNumber = Math.floor(((dateObj.getTime() - startOfYear.getTime()) / 86400000 + 1) / 7) + 1;
    
    return weekNumber;
  },
  
  /**
   * 获取两个日期之间的所有日期
   * @param {Date|string|number} startDate - 开始日期
   * @param {Date|string|number} endDate - 结束日期
   * @param {string} format - 返回格式，默认为 'YYYY-MM-DD'
   * @returns {Array} 日期数组
   */
  getDatesBetween: function(startDate, endDate, format = 'YYYY-MM-DD') {
    // 转换为Date对象
    const startDateObj = startDate instanceof Date ? startDate : new Date(startDate);
    const endDateObj = endDate instanceof Date ? endDate : new Date(endDate);
    
    // 如果日期无效，返回空数组
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return [];
    }
    
    // 确保开始日期不晚于结束日期
    if (startDateObj > endDateObj) {
      return [];
    }
    
    const dates = [];
    const currentDate = new Date(startDateObj);
    
    // 设置为当天的零点
    currentDate.setHours(0, 0, 0, 0);
    
    // 循环获取每一天
    while (currentDate <= endDateObj) {
      dates.push(format ? this.format(currentDate, format) : new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  },
  
  /**
   * 获取相对时间描述（如：刚刚、5分钟前、1小时前、昨天等）
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {Date|string|number} [baseDate=new Date()] - 基准日期，默认为当前时间
   * @returns {string} 相对时间描述
   */
  getRelativeTime: function(date, baseDate = new Date()) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? date : new Date(date);
    const baseDateObj = baseDate instanceof Date ? baseDate : new Date(baseDate);
    
    // 如果日期无效，返回空字符串
    if (isNaN(dateObj.getTime()) || isNaN(baseDateObj.getTime())) {
      return '';
    }
    
    // 计算时间差（毫秒）
    const diff = baseDateObj.getTime() - dateObj.getTime();
    
    // 计算时间差（秒）
    const diffSeconds = Math.floor(diff / 1000);
    
    // 根据时间差返回相对时间描述
    if (diffSeconds < 0) {
      // 未来时间
      const absDiff = Math.abs(diffSeconds);
      
      if (absDiff < 60) {
        return '即将';
      } else if (absDiff < 3600) {
        return `${Math.floor(absDiff / 60)}分钟后`;
      } else if (absDiff < 86400) {
        return `${Math.floor(absDiff / 3600)}小时后`;
      } else if (absDiff < 172800) {
        return '明天';
      } else if (absDiff < 2592000) {
        return `${Math.floor(absDiff / 86400)}天后`;
      } else if (absDiff < 31536000) {
        return `${Math.floor(absDiff / 2592000)}个月后`;
      } else {
        return `${Math.floor(absDiff / 31536000)}年后`;
      }
    } else {
      // 过去时间
      if (diffSeconds < 60) {
        return '刚刚';
      } else if (diffSeconds < 3600) {
        return `${Math.floor(diffSeconds / 60)}分钟前`;
      } else if (diffSeconds < 86400) {
        return `${Math.floor(diffSeconds / 3600)}小时前`;
      } else if (diffSeconds < 172800) {
        return '昨天';
      } else if (diffSeconds < 2592000) {
        return `${Math.floor(diffSeconds / 86400)}天前`;
      } else if (diffSeconds < 31536000) {
        return `${Math.floor(diffSeconds / 2592000)}个月前`;
      } else {
        return `${Math.floor(diffSeconds / 31536000)}年前`;
      }
    }
  },
  
  /**
   * 获取日期的时间部分
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {string} format - 返回格式，默认为 'HH:mm:ss'
   * @returns {string} 时间部分
   */
  getTimeString: function(date, format = 'HH:mm:ss') {
    // 转换为Date对象
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // 如果日期无效，返回空字符串
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return this.format(dateObj, format);
  },
  
  /**
   * 获取日期的日期部分（不包含时间）
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {string} format - 返回格式，默认为 'YYYY-MM-DD'
   * @returns {string} 日期部分
   */
  getDateString: function(date, format = 'YYYY-MM-DD') {
    // 转换为Date对象
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // 如果日期无效，返回空字符串
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    return this.format(dateObj, format);
  },
  
  /**
   * 获取时间戳
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @returns {number} 时间戳（毫秒）
   */
  getTimestamp: function(date) {
    // 如果没有传入日期，返回当前时间戳
    if (!date) {
      return Date.now();
    }
    
    // 转换为Date对象
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // 如果日期无效，返回NaN
    if (isNaN(dateObj.getTime())) {
      return NaN;
    }
    
    return dateObj.getTime();
  },
  
  /**
   * 获取Unix时间戳
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @returns {number} Unix时间戳（秒）
   */
  getUnixTimestamp: function(date) {
    const timestamp = this.getTimestamp(date);
    return isNaN(timestamp) ? NaN : Math.floor(timestamp / 1000);
  },
  
  /**
   * 判断日期是否有效
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @returns {boolean} 如果日期有效，返回true；否则返回false
   */
  isValid: function(date) {
    // 如果没有传入日期，返回false
    if (!date) {
      return false;
    }
    
    // 转换为Date对象
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // 判断日期是否有效
    return !isNaN(dateObj.getTime());
  },
  
  /**
   * 判断日期是否在指定范围内
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {Date|string|number} startDate - 开始日期
   * @param {Date|string|number} endDate - 结束日期
   * @param {string} rangeType - 范围类型，'[]'表示闭区间，'()'表示开区间，'[)'表示左闭右开，'(]'表示左开右闭，默认为'[]'
   * @returns {boolean} 如果日期在范围内，返回true；否则返回false
   */
  isBetween: function(date, startDate, endDate, rangeType = '[]') {
    // 转换为Date对象
    const dateObj = date instanceof Date ? date : new Date(date);
    const startDateObj = startDate instanceof Date ? startDate : new Date(startDate);
    const endDateObj = endDate instanceof Date ? endDate : new Date(endDate);
    
    // 如果日期无效，返回false
    if (isNaN(dateObj.getTime()) || isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return false;
    }
    
    // 获取时间戳
    const timestamp = dateObj.getTime();
    const startTimestamp = startDateObj.getTime();
    const endTimestamp = endDateObj.getTime();
    
    // 根据范围类型判断
    switch (rangeType) {
      case '[]':
        return timestamp >= startTimestamp && timestamp <= endTimestamp;
      case '()':
        return timestamp > startTimestamp && timestamp < endTimestamp;
      case '[)':
        return timestamp >= startTimestamp && timestamp < endTimestamp;
      case '(]':
        return timestamp > startTimestamp && timestamp <= endTimestamp;
      default:
        return false;
    }
  },
  
  /**
   * 判断日期是否是周末
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @returns {boolean} 如果是周末，返回true；否则返回false
   */
  isWeekend: function(date) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // 如果日期无效，返回false
    if (isNaN(dateObj.getTime())) {
      return false;
    }
    
    // 获取星期几（0表示周日，6表示周六）
    const day = dateObj.getDay();
    
    // 判断是否是周末
    return day === 0 || day === 6;
  },
  
  /**
   * 判断日期是否是工作日
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @returns {boolean} 如果是工作日，返回true；否则返回false
   */
  isWeekday: function(date) {
    return !this.isWeekend(date);
  },
  
  /**
   * 获取日期的季度
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @returns {number} 季度（1-4）
   */
  getQuarter: function(date) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // 如果日期无效，返回NaN
    if (isNaN(dateObj.getTime())) {
      return NaN;
    }
    
    // 获取月份（0-11）
    const month = dateObj.getMonth();
    
    // 计算季度
    return Math.floor(month / 3) + 1;
  },
  
  /**
   * 获取日期的星期几
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {string} format - 返回格式，支持 'number'（0-6）, 'en'（Sunday-Saturday）, 'zh'（星期日-星期六）, 'short-en'（Sun-Sat）, 'short-zh'（周日-周六）
   * @returns {string|number} 星期几
   */
  getDayOfWeek: function(date, format = 'number') {
    // 转换为Date对象
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // 如果日期无效，返回NaN
    if (isNaN(dateObj.getTime())) {
      return NaN;
    }
    
    // 获取星期几（0-6）
    const day = dateObj.getDay();
    
    // 根据格式返回结果
    switch (format) {
      case 'number':
        return day;
      case 'en':
        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
      case 'zh':
        return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][day];
      case 'short-en':
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day];
      case 'short-zh':
        return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day];
      default:
        return day;
    }
  },
  
  /**
   * 设置日期的年份
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {number} year - 年份
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 设置后的日期，如果format为null则返回Date对象
   */
  setYear: function(date, year, format = null) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 设置年份
    dateObj.setFullYear(year);
    
    return format ? this.format(dateObj, format) : dateObj;
  },
  
  /**
   * 设置日期的月份
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {number} month - 月份（1-12）
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 设置后的日期，如果format为null则返回Date对象
   */
  setMonth: function(date, month, format = null) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 设置月份（月份需要减1，因为Date对象的月份从0开始）
    dateObj.setMonth(month - 1);
    
    return format ? this.format(dateObj, format) : dateObj;
  },
  
  /**
   * 设置日期的日
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {number} day - 日（1-31）
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 设置后的日期，如果format为null则返回Date对象
   */
  setDay: function(date, day, format = null) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 设置日
    dateObj.setDate(day);
    
    return format ? this.format(dateObj, format) : dateObj;
  },
  
  /**
   * 设置日期的小时
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {number} hours - 小时（0-23）
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 设置后的日期，如果format为null则返回Date对象
   */
  setHours: function(date, hours, format = null) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 设置小时
    dateObj.setHours(hours);
    
    return format ? this.format(dateObj, format) : dateObj;
  },
  
  /**
   * 设置日期的分钟
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {number} minutes - 分钟（0-59）
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 设置后的日期，如果format为null则返回Date对象
   */
  setMinutes: function(date, minutes, format = null) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 设置分钟
    dateObj.setMinutes(minutes);
    
    return format ? this.format(dateObj, format) : dateObj;
  },
  
  /**
   * 设置日期的秒钟
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {number} seconds - 秒钟（0-59）
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 设置后的日期，如果format为null则返回Date对象
   */
  setSeconds: function(date, seconds, format = null) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 设置秒钟
    dateObj.setSeconds(seconds);
    
    return format ? this.format(dateObj, format) : dateObj;
  },
  
  /**
   * 设置日期的毫秒
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {number} milliseconds - 毫秒（0-999）
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 设置后的日期，如果format为null则返回Date对象
   */
  setMilliseconds: function(date, milliseconds, format = null) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 设置毫秒
    dateObj.setMilliseconds(milliseconds);
    
    return format ? this.format(dateObj, format) : dateObj;
  },
  
  /**
   * 获取日期的最大值
   * @param {Array} dates - 日期数组
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 最大日期，如果format为null则返回Date对象
   */
  max: function(dates, format = null) {
    if (!Array.isArray(dates) || dates.length === 0) {
      return null;
    }
    
    // 转换为Date对象数组
    const dateObjs = dates.map(date => date instanceof Date ? date : new Date(date));
    
    // 过滤掉无效日期
    const validDateObjs = dateObjs.filter(date => !isNaN(date.getTime()));
    
    if (validDateObjs.length === 0) {
      return null;
    }
    
    // 获取最大日期
    const maxDate = new Date(Math.max(...validDateObjs.map(date => date.getTime())));
    
    return format ? this.format(maxDate, format) : maxDate;
  },
  
  /**
   * 获取日期的最小值
   * @param {Array} dates - 日期数组
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 最小日期，如果format为null则返回Date对象
   */
  min: function(dates, format = null) {
    if (!Array.isArray(dates) || dates.length === 0) {
      return null;
    }
    
    // 转换为Date对象数组
    const dateObjs = dates.map(date => date instanceof Date ? date : new Date(date));
    
    // 过滤掉无效日期
    const validDateObjs = dateObjs.filter(date => !isNaN(date.getTime()));
    
    if (validDateObjs.length === 0) {
      return null;
    }
    
    // 获取最小日期
    const minDate = new Date(Math.min(...validDateObjs.map(date => date.getTime())));
    
    return format ? this.format(minDate, format) : minDate;
  },
  
  /**
   * 克隆日期对象
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @returns {Date} 克隆后的日期对象
   */
  clone: function(date) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    return new Date(dateObj);
  },
  
  /**
   * 获取日期的开始时间（00:00:00.000）
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 日期的开始时间，如果format为null则返回Date对象
   */
  startOfDay: function(date, format = null) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 设置为当天的开始时间
    dateObj.setHours(0, 0, 0, 0);
    
    return format ? this.format(dateObj, format) : dateObj;
  },
  
  /**
   * 获取日期的结束时间（23:59:59.999）
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 日期的结束时间，如果format为null则返回Date对象
   */
  endOfDay: function(date, format = null) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 设置为当天的结束时间
    dateObj.setHours(23, 59, 59, 999);
    
    return format ? this.format(dateObj, format) : dateObj;
  },
  
  /**
   * 获取月份的开始日期
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 月份的开始日期，如果format为null则返回Date对象
   */
  startOfMonth: function(date, format = null) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 设置为当月的第一天
    dateObj.setDate(1);
    // 设置为当天的开始时间
    dateObj.setHours(0, 0, 0, 0);
    
    return format ? this.format(dateObj, format) : dateObj;
  },
  
  /**
   * 获取月份的结束日期
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 月份的结束日期，如果format为null则返回Date对象
   */
  endOfMonth: function(date, format = null) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 设置为下个月的第一天
    dateObj.setMonth(dateObj.getMonth() + 1, 1);
    // 减去一天，得到当月的最后一天
    dateObj.setDate(dateObj.getDate() - 1);
    // 设置为当天的结束时间
    dateObj.setHours(23, 59, 59, 999);
    
    return format ? this.format(dateObj, format) : dateObj;
  },
  
  /**
   * 获取年份的开始日期
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 年份的开始日期，如果format为null则返回Date对象
   */
  startOfYear: function(date, format = null) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 设置为当年的第一天
    dateObj.setMonth(0, 1);
    // 设置为当天的开始时间
    dateObj.setHours(0, 0, 0, 0);
    
    return format ? this.format(dateObj, format) : dateObj;
  },
  
  /**
   * 获取年份的结束日期
   * @param {Date|string|number} date - 日期对象、日期字符串或时间戳
   * @param {string} format - 返回格式，默认为null，返回Date对象
   * @returns {string|Date} 年份的结束日期，如果format为null则返回Date对象
   */
  endOfYear: function(date, format = null) {
    // 转换为Date对象
    const dateObj = date instanceof Date ? new Date(date) : new Date(date);
    
    // 如果日期无效，返回null
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    // 设置为当年的最后一天
    dateObj.setMonth(11, 31);
    // 设置为当天的结束时间
    dateObj.setHours(23, 59, 59, 999);
    
    return format ? this.format(dateObj, format) : dateObj;
  }
};

module.exports = dateUtils;