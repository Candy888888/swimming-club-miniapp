// string.js - 字符串工具

/**
 * 字符串工具
 * 用于处理字符串相关的操作，包括格式化、转换、验证等功能
 */
const stringUtils = {
  /**
   * 检查字符串是否为空
   * @param {string} str - 要检查的字符串
   * @returns {boolean} 如果字符串为null、undefined、空字符串或只包含空白字符，则返回true
   */
  isEmpty: function(str) {
    return str === null || str === undefined || str.trim() === '';
  },
  
  /**
   * 检查字符串是否不为空
   * @param {string} str - 要检查的字符串
   * @returns {boolean} 如果字符串不为null、undefined、空字符串且不只包含空白字符，则返回true
   */
  isNotEmpty: function(str) {
    return !this.isEmpty(str);
  },
  
  /**
   * 获取字符串的长度，如果字符串为null或undefined，则返回0
   * @param {string} str - 要获取长度的字符串
   * @returns {number} 字符串的长度
   */
  length: function(str) {
    return str === null || str === undefined ? 0 : str.length;
  },
  
  /**
   * 截取字符串，如果字符串为null或undefined，则返回空字符串
   * @param {string} str - 要截取的字符串
   * @param {number} start - 开始位置（包含）
   * @param {number} [end] - 结束位置（不包含），如果不指定则截取到字符串末尾
   * @returns {string} 截取后的字符串
   */
  substring: function(str, start, end) {
    if (str === null || str === undefined) {
      return '';
    }
    return end ? str.substring(start, end) : str.substring(start);
  },
  
  /**
   * 将字符串转换为大写
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  toUpperCase: function(str) {
    return str === null || str === undefined ? '' : str.toUpperCase();
  },
  
  /**
   * 将字符串转换为小写
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  toLowerCase: function(str) {
    return str === null || str === undefined ? '' : str.toLowerCase();
  },
  
  /**
   * 将字符串的首字母转换为大写
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  capitalize: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  /**
   * 将字符串的首字母转换为小写
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  uncapitalize: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    return str.charAt(0).toLowerCase() + str.slice(1);
  },
  
  /**
   * 将字符串中的每个单词的首字母转换为大写
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  capitalizeWords: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    return str.replace(/\b\w/g, char => char.toUpperCase());
  },
  
  /**
   * 将驼峰命名法转换为下划线命名法
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  camelToSnake: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
  },
  
  /**
   * 将下划线命名法转换为驼峰命名法
   * @param {string} str - 要转换的字符串
   * @param {boolean} [firstUpper=false] - 首字母是否大写，默认为false
   * @returns {string} 转换后的字符串
   */
  snakeToCamel: function(str, firstUpper = false) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    const result = str.toLowerCase().replace(/_([a-z])/g, (match, char) => char.toUpperCase());
    return firstUpper ? this.capitalize(result) : result;
  },
  
  /**
   * 将驼峰命名法转换为短横线命名法
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  camelToKebab: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    return str.replace(/([A-Z])/g, '-$1').toLowerCase();
  },
  
  /**
   * 将短横线命名法转换为驼峰命名法
   * @param {string} str - 要转换的字符串
   * @param {boolean} [firstUpper=false] - 首字母是否大写，默认为false
   * @returns {string} 转换后的字符串
   */
  kebabToCamel: function(str, firstUpper = false) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    const result = str.toLowerCase().replace(/-([a-z])/g, (match, char) => char.toUpperCase());
    return firstUpper ? this.capitalize(result) : result;
  },
  
  /**
   * 去除字符串两端的空白字符
   * @param {string} str - 要处理的字符串
   * @returns {string} 处理后的字符串
   */
  trim: function(str) {
    return str === null || str === undefined ? '' : str.trim();
  },
  
  /**
   * 去除字符串左侧的空白字符
   * @param {string} str - 要处理的字符串
   * @returns {string} 处理后的字符串
   */
  trimLeft: function(str) {
    return str === null || str === undefined ? '' : str.replace(/^\s+/, '');
  },
  
  /**
   * 去除字符串右侧的空白字符
   * @param {string} str - 要处理的字符串
   * @returns {string} 处理后的字符串
   */
  trimRight: function(str) {
    return str === null || str === undefined ? '' : str.replace(/\s+$/, '');
  },
  
  /**
   * 将字符串填充到指定长度
   * @param {string} str - 要填充的字符串
   * @param {number} length - 目标长度
   * @param {string} [char=' '] - 填充字符，默认为空格
   * @param {boolean} [end=true] - 是否在末尾填充，默认为true，false表示在开头填充
   * @returns {string} 填充后的字符串
   */
  pad: function(str, length, char = ' ', end = true) {
    if (str === null || str === undefined) {
      str = '';
    }
    
    if (str.length >= length) {
      return str;
    }
    
    const padStr = char.repeat(length - str.length);
    return end ? str + padStr : padStr + str;
  },
  
  /**
   * 将字符串在左侧填充到指定长度
   * @param {string} str - 要填充的字符串
   * @param {number} length - 目标长度
   * @param {string} [char=' '] - 填充字符，默认为空格
   * @returns {string} 填充后的字符串
   */
  padLeft: function(str, length, char = ' ') {
    return this.pad(str, length, char, false);
  },
  
  /**
   * 将字符串在右侧填充到指定长度
   * @param {string} str - 要填充的字符串
   * @param {number} length - 目标长度
   * @param {string} [char=' '] - 填充字符，默认为空格
   * @returns {string} 填充后的字符串
   */
  padRight: function(str, length, char = ' ') {
    return this.pad(str, length, char, true);
  },
  
  /**
   * 重复字符串指定次数
   * @param {string} str - 要重复的字符串
   * @param {number} count - 重复次数
   * @returns {string} 重复后的字符串
   */
  repeat: function(str, count) {
    if (str === null || str === undefined) {
      return '';
    }
    
    if (count <= 0) {
      return '';
    }
    
    return str.repeat(count);
  },
  
  /**
   * 反转字符串
   * @param {string} str - 要反转的字符串
   * @returns {string} 反转后的字符串
   */
  reverse: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    
    return str.split('').reverse().join('');
  },
  
  /**
   * 截断字符串到指定长度，并添加省略号
   * @param {string} str - 要截断的字符串
   * @param {number} maxLength - 最大长度
   * @param {string} [ellipsis='...'] - 省略号，默认为'...'
   * @returns {string} 截断后的字符串
   */
  truncate: function(str, maxLength, ellipsis = '...') {
    if (str === null || str === undefined) {
      return '';
    }
    
    if (str.length <= maxLength) {
      return str;
    }
    
    return str.substring(0, maxLength - ellipsis.length) + ellipsis;
  },
  
  /**
   * 检查字符串是否以指定前缀开始
   * @param {string} str - 要检查的字符串
   * @param {string} prefix - 前缀
   * @param {boolean} [ignoreCase=false] - 是否忽略大小写，默认为false
   * @returns {boolean} 如果字符串以指定前缀开始，则返回true
   */
  startsWith: function(str, prefix, ignoreCase = false) {
    if (str === null || str === undefined || prefix === null || prefix === undefined) {
      return false;
    }
    
    if (ignoreCase) {
      return str.toLowerCase().startsWith(prefix.toLowerCase());
    } else {
      return str.startsWith(prefix);
    }
  },
  
  /**
   * 检查字符串是否以指定后缀结束
   * @param {string} str - 要检查的字符串
   * @param {string} suffix - 后缀
   * @param {boolean} [ignoreCase=false] - 是否忽略大小写，默认为false
   * @returns {boolean} 如果字符串以指定后缀结束，则返回true
   */
  endsWith: function(str, suffix, ignoreCase = false) {
    if (str === null || str === undefined || suffix === null || suffix === undefined) {
      return false;
    }
    
    if (ignoreCase) {
      return str.toLowerCase().endsWith(suffix.toLowerCase());
    } else {
      return str.endsWith(suffix);
    }
  },
  
  /**
   * 检查字符串是否包含指定子字符串
   * @param {string} str - 要检查的字符串
   * @param {string} substring - 子字符串
   * @param {boolean} [ignoreCase=false] - 是否忽略大小写，默认为false
   * @returns {boolean} 如果字符串包含指定子字符串，则返回true
   */
  contains: function(str, substring, ignoreCase = false) {
    if (str === null || str === undefined || substring === null || substring === undefined) {
      return false;
    }
    
    if (ignoreCase) {
      return str.toLowerCase().includes(substring.toLowerCase());
    } else {
      return str.includes(substring);
    }
  },
  
  /**
   * 计算字符串中指定子字符串出现的次数
   * @param {string} str - 要检查的字符串
   * @param {string} substring - 子字符串
   * @param {boolean} [ignoreCase=false] - 是否忽略大小写，默认为false
   * @returns {number} 子字符串出现的次数
   */
  countOccurrences: function(str, substring, ignoreCase = false) {
    if (str === null || str === undefined || substring === null || substring === undefined || substring === '') {
      return 0;
    }
    
    let count = 0;
    let position = 0;
    const searchStr = ignoreCase ? str.toLowerCase() : str;
    const searchSubstring = ignoreCase ? substring.toLowerCase() : substring;
    
    while ((position = searchStr.indexOf(searchSubstring, position)) !== -1) {
      count++;
      position += searchSubstring.length;
    }
    
    return count;
  },
  
  /**
   * 替换字符串中的所有匹配项
   * @param {string} str - 要处理的字符串
   * @param {string|RegExp} search - 要搜索的字符串或正则表达式
   * @param {string} replacement - 替换字符串
   * @returns {string} 替换后的字符串
   */
  replaceAll: function(str, search, replacement) {
    if (str === null || str === undefined) {
      return '';
    }
    
    if (typeof search === 'string') {
      search = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    }
    
    return str.replace(search, replacement);
  },
  
  /**
   * 将字符串拆分为数组
   * @param {string} str - 要拆分的字符串
   * @param {string|RegExp} separator - 分隔符
   * @returns {Array} 拆分后的数组
   */
  split: function(str, separator) {
    if (str === null || str === undefined) {
      return [];
    }
    
    return str.split(separator);
  },
  
  /**
   * 将数组连接为字符串
   * @param {Array} arr - 要连接的数组
   * @param {string} [separator=''] - 分隔符，默认为空字符串
   * @returns {string} 连接后的字符串
   */
  join: function(arr, separator = '') {
    if (!Array.isArray(arr)) {
      return '';
    }
    
    return arr.join(separator);
  },
  
  /**
   * 将字符串转换为整数
   * @param {string} str - 要转换的字符串
   * @param {number} [radix=10] - 进制，默认为10
   * @returns {number} 转换后的整数，如果转换失败则返回NaN
   */
  toInt: function(str, radix = 10) {
    if (str === null || str === undefined || str === '') {
      return NaN;
    }
    
    return parseInt(str, radix);
  },
  
  /**
   * 将字符串转换为浮点数
   * @param {string} str - 要转换的字符串
   * @returns {number} 转换后的浮点数，如果转换失败则返回NaN
   */
  toFloat: function(str) {
    if (str === null || str === undefined || str === '') {
      return NaN;
    }
    
    return parseFloat(str);
  },
  
  /**
   * 将字符串转换为布尔值
   * @param {string} str - 要转换的字符串
   * @returns {boolean} 转换后的布尔值，'true', '1', 'yes', 'y', 'on'（忽略大小写）返回true，其他返回false
   */
  toBoolean: function(str) {
    if (str === null || str === undefined || str === '') {
      return false;
    }
    
    const trueValues = ['true', '1', 'yes', 'y', 'on'];
    return trueValues.includes(str.toLowerCase());
  },
  
  /**
   * 将字符串中的HTML特殊字符转义
   * @param {string} str - 要转义的字符串
   * @returns {string} 转义后的字符串
   */
  escapeHtml: function(str) {
    if (str === null || str === undefined) {
      return '';
    }
    
    const htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    
    return str.replace(/[&<>"']/g, char => htmlEscapes[char]);
  },
  
  /**
   * 将转义的HTML特殊字符还原
   * @param {string} str - 要还原的字符串
   * @returns {string} 还原后的字符串
   */
  unescapeHtml: function(str) {
    if (str === null || str === undefined) {
      return '';
    }
    
    const htmlUnescapes = {
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&#39;': "'"
    };
    
    return str.replace(/&(?:amp|lt|gt|quot|#39);/g, entity => htmlUnescapes[entity]);
  },
  
  /**
   * 将字符串中的URL特殊字符编码
   * @param {string} str - 要编码的字符串
   * @returns {string} 编码后的字符串
   */
  encodeUrl: function(str) {
    if (str === null || str === undefined) {
      return '';
    }
    
    return encodeURIComponent(str);
  },
  
  /**
   * 将编码的URL字符串解码
   * @param {string} str - 要解码的字符串
   * @returns {string} 解码后的字符串
   */
  decodeUrl: function(str) {
    if (str === null || str === undefined) {
      return '';
    }
    
    try {
      return decodeURIComponent(str);
    } catch (e) {
      return str; // 如果解码失败，返回原字符串
    }
  },
  
  /**
   * 将字符串转换为Base64编码
   * @param {string} str - 要编码的字符串
   * @returns {string} Base64编码后的字符串
   */
  toBase64: function(str) {
    if (str === null || str === undefined) {
      return '';
    }
    
    try {
      // 在小程序环境中使用wx.arrayBufferToBase64
      if (typeof wx !== 'undefined' && wx.arrayBufferToBase64) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);
        return wx.arrayBufferToBase64(bytes);
      }
      // 在浏览器环境中使用btoa
      else if (typeof btoa === 'function') {
        return btoa(unescape(encodeURIComponent(str)));
      }
      // 其他环境
      else {
        return str; // 不支持的环境返回原字符串
      }
    } catch (e) {
      return str; // 如果编码失败，返回原字符串
    }
  },
  
  /**
   * 将Base64编码的字符串解码
   * @param {string} str - 要解码的Base64字符串
   * @returns {string} 解码后的字符串
   */
  fromBase64: function(str) {
    if (str === null || str === undefined) {
      return '';
    }
    
    try {
      // 在小程序环境中使用wx.base64ToArrayBuffer
      if (typeof wx !== 'undefined' && wx.base64ToArrayBuffer) {
        const bytes = wx.base64ToArrayBuffer(str);
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
      }
      // 在浏览器环境中使用atob
      else if (typeof atob === 'function') {
        return decodeURIComponent(escape(atob(str)));
      }
      // 其他环境
      else {
        return str; // 不支持的环境返回原字符串
      }
    } catch (e) {
      return str; // 如果解码失败，返回原字符串
    }
  },
  
  /**
   * 生成指定长度的随机字符串
   * @param {number} length - 字符串长度
   * @param {string} [chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'] - 可用字符集
   * @returns {string} 随机字符串
   */
  random: function(length, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    if (length <= 0) {
      return '';
    }
    
    let result = '';
    const charsLength = chars.length;
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * charsLength));
    }
    
    return result;
  },
  
  /**
   * 生成UUID（通用唯一标识符）
   * @returns {string} UUID字符串
   */
  uuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  
  /**
   * 计算字符串的MD5哈希值（仅在支持的环境中可用）
   * @param {string} str - 要计算哈希值的字符串
   * @returns {string} MD5哈希值，如果不支持则返回空字符串
   */
  md5: function(str) {
    if (str === null || str === undefined) {
      return '';
    }
    
    // 在小程序环境中，可以使用第三方库或原生API
    if (typeof wx !== 'undefined' && wx.md5) {
      return wx.md5(str);
    }
    
    // 注意：此处不实现具体的MD5算法，建议使用第三方库
    console.warn('MD5计算需要第三方库支持');
    return '';
  },
  
  /**
   * 计算字符串的SHA1哈希值（仅在支持的环境中可用）
   * @param {string} str - 要计算哈希值的字符串
   * @returns {string} SHA1哈希值，如果不支持则返回空字符串
   */
  sha1: function(str) {
    if (str === null || str === undefined) {
      return '';
    }
    
    // 在小程序环境中，可以使用第三方库或原生API
    if (typeof wx !== 'undefined' && wx.sha1) {
      return wx.sha1(str);
    }
    
    // 注意：此处不实现具体的SHA1算法，建议使用第三方库
    console.warn('SHA1计算需要第三方库支持');
    return '';
  },
  
  /**
   * 计算字符串的字节长度（假设UTF-8编码）
   * @param {string} str - 要计算字节长度的字符串
   * @returns {number} 字节长度
   */
  byteLength: function(str) {
    if (str === null || str === undefined) {
      return 0;
    }
    
    // 使用TextEncoder计算字节长度（如果支持）
    if (typeof TextEncoder !== 'undefined') {
      return new TextEncoder().encode(str).length;
    }
    
    // 简单估算：ASCII字符占1字节，其他字符占3字节
    let length = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      length += charCode < 128 ? 1 : 3;
    }
    
    return length;
  },
  
  /**
   * 将字符串按指定字节长度截断（假设UTF-8编码）
   * @param {string} str - 要截断的字符串
   * @param {number} byteLength - 最大字节长度
   * @param {string} [ellipsis='...'] - 省略号，默认为'...'
   * @returns {string} 截断后的字符串
   */
  truncateByteLength: function(str, byteLength, ellipsis = '...') {
    if (str === null || str === undefined) {
      return '';
    }
    
    const ellipsisLength = this.byteLength(ellipsis);
    if (byteLength <= ellipsisLength) {
      return ellipsis.substring(0, 1); // 如果最大字节长度小于省略号长度，返回省略号的第一个字符
    }
    
    const maxByteLength = byteLength - ellipsisLength;
    let result = '';
    let currentByteLength = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charAt(i);
      const charByteLength = this.byteLength(char);
      
      if (currentByteLength + charByteLength <= maxByteLength) {
        result += char;
        currentByteLength += charByteLength;
      } else {
        return result + ellipsis;
      }
    }
    
    return result; // 如果不需要截断，返回原字符串
  },
  
  /**
   * 将字符串格式化为指定格式（类似C语言的sprintf）
   * @param {string} format - 格式字符串，使用{0}, {1}等作为占位符
   * @param {...*} args - 要替换占位符的参数
   * @returns {string} 格式化后的字符串
   */
  format: function(format, ...args) {
    if (format === null || format === undefined) {
      return '';
    }
    
    return format.replace(/{(\d+)}/g, (match, index) => {
      const i = parseInt(index, 10);
      return i >= 0 && i < args.length ? args[i] : match;
    });
  },
  
  /**
   * 将字符串中的换行符转换为HTML换行标签
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  nl2br: function(str) {
    if (str === null || str === undefined) {
      return '';
    }
    
    return str.replace(/\r\n|\r|\n/g, '<br>');
  },
  
  /**
   * 将字符串中的制表符转换为空格
   * @param {string} str - 要转换的字符串
   * @param {number} [spaces=4] - 每个制表符对应的空格数，默认为4
   * @returns {string} 转换后的字符串
   */
  tab2space: function(str, spaces = 4) {
    if (str === null || str === undefined) {
      return '';
    }
    
    return str.replace(/\t/g, ' '.repeat(spaces));
  },
  
  /**
   * 将字符串中的多个连续空白字符替换为单个空格
   * @param {string} str - 要处理的字符串
   * @returns {string} 处理后的字符串
   */
  normalizeSpace: function(str) {
    if (str === null || str === undefined) {
      return '';
    }
    
    return str.replace(/\s+/g, ' ').trim();
  },
  
  /**
   * 将字符串按单词包装到指定宽度
   * @param {string} str - 要包装的字符串
   * @param {number} [width=80] - 每行的最大宽度，默认为80
   * @param {string} [breakChar='\n'] - 换行字符，默认为'\n'
   * @returns {string} 包装后的字符串
   */
  wordWrap: function(str, width = 80, breakChar = '\n') {
    if (str === null || str === undefined) {
      return '';
    }
    
    const regex = new RegExp(`(.{1,${width}})(\s|$)`, 'g');
    return str.replace(regex, (match, p1) => p1 + breakChar).trim();
  },
  
  /**
   * 检查字符串是否为有效的JSON格式
   * @param {string} str - 要检查的字符串
   * @returns {boolean} 如果是有效的JSON格式，则返回true
   */
  isValidJson: function(str) {
    if (str === null || str === undefined || str === '') {
      return false;
    }
    
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  /**
   * 将字符串解析为JSON对象
   * @param {string} str - 要解析的字符串
   * @param {*} [defaultValue=null] - 解析失败时返回的默认值
   * @returns {*} 解析后的JSON对象，如果解析失败则返回默认值
   */
  parseJson: function(str, defaultValue = null) {
    if (str === null || str === undefined || str === '') {
      return defaultValue;
    }
    
    try {
      return JSON.parse(str);
    } catch (e) {
      return defaultValue;
    }
  },
  
  /**
   * 将对象转换为JSON字符串
   * @param {*} obj - 要转换的对象
   * @param {number|string} [space=null] - 缩进空格数或字符串，默认为null（不缩进）
   * @returns {string} JSON字符串，如果转换失败则返回空字符串
   */
  toJson: function(obj, space = null) {
    if (obj === undefined) {
      return '';
    }
    
    try {
      return JSON.stringify(obj, null, space);
    } catch (e) {
      return '';
    }
  },
  
  /**
   * 将字符串中的变量占位符替换为对象中的值
   * @param {string} str - 包含占位符的字符串，如'Hello, ${name}!'
   * @param {object} obj - 包含替换值的对象，如{name: 'World'}
   * @returns {string} 替换后的字符串
   */
  template: function(str, obj) {
    if (str === null || str === undefined) {
      return '';
    }
    
    if (obj === null || obj === undefined) {
      return str;
    }
    
    return str.replace(/\${([^{}]*)}/g, (match, key) => {
      const value = key.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
      return value !== undefined ? value : match;
    });
  },
  
  /**
   * 将字符串中的第一个匹配项替换为新字符串
   * @param {string} str - 要处理的字符串
   * @param {string|RegExp} search - 要搜索的字符串或正则表达式
   * @param {string} replacement - 替换字符串
   * @returns {string} 替换后的字符串
   */
  replace: function(str, search, replacement) {
    if (str === null || str === undefined) {
      return '';
    }
    
    if (typeof search === 'string') {
      const index = str.indexOf(search);
      if (index === -1) {
        return str;
      }
      return str.substring(0, index) + replacement + str.substring(index + search.length);
    } else {
      return str.replace(search, replacement);
    }
  },
  
  /**
   * 将字符串中的字符转义为正则表达式安全的字符串
   * @param {string} str - 要转义的字符串
   * @returns {string} 转义后的字符串
   */
  escapeRegExp: function(str) {
    if (str === null || str === undefined) {
      return '';
    }
    
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },
  
  /**
   * 将字符串转换为驼峰命名法（第一个单词小写）
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  toCamelCase: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    
    // 将字符串按非字母数字字符拆分，并将每个单词的首字母大写（除了第一个单词）
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
      .replace(/^[A-Z]/, chr => chr.toLowerCase());
  },
  
  /**
   * 将字符串转换为帕斯卡命名法（所有单词首字母大写）
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  toPascalCase: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    
    // 将字符串按非字母数字字符拆分，并将每个单词的首字母大写
    return str
      .replace(/\w+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .replace(/[^a-zA-Z0-9]/g, '');
  },
  
  /**
   * 将字符串转换为蛇形命名法（下划线分隔，全小写）
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  toSnakeCase: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    
    return str
      .replace(/([A-Z])/g, '_$1')
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .toLowerCase()
      .replace(/^_+|_+$/g, '')
      .replace(/_+/g, '_');
  },
  
  /**
   * 将字符串转换为短横线命名法（连字符分隔，全小写）
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  toKebabCase: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    
    return str
      .replace(/([A-Z])/g, '-$1')
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .toLowerCase()
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-');
  },
  
  /**
   * 将字符串转换为常量命名法（下划线分隔，全大写）
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  toConstantCase: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    
    return this.toSnakeCase(str).toUpperCase();
  },
  
  /**
   * 将字符串转换为标题命名法（每个单词首字母大写）
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  toTitleCase: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    
    return str.replace(/\w\S*/g, word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase());
  },
  
  /**
   * 将字符串转换为句子命名法（第一个单词首字母大写，其余小写）
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  toSentenceCase: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  },
  
  /**
   * 将字符串转换为路径命名法（斜杠分隔，全小写）
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  toPathCase: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    
    return this.toKebabCase(str).replace(/-/g, '/');
  },
  
  /**
   * 将字符串转换为点命名法（点分隔，全小写）
   * @param {string} str - 要转换的字符串
   * @returns {string} 转换后的字符串
   */
  toDotCase: function(str) {
    if (str === null || str === undefined || str === '') {
      return '';
    }
    
    return this.toKebabCase(str).replace(/-/g, '.');
  }
};

module.exports = stringUtils;