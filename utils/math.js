// math.js - 数学计算工具

/**
 * 数学计算工具
 * 用于处理数学计算和数值操作，包括基本运算、随机数生成、数值格式化等功能
 */
const mathUtils = {
  /**
   * 加法运算，解决JavaScript浮点数计算精度问题
   * @param {number} a - 加数
   * @param {number} b - 被加数
   * @returns {number} 和
   */
  add: function(a, b) {
    const precision = this._getPrecision(a, b);
    const multiplier = Math.pow(10, precision);
    return (this._round(a * multiplier) + this._round(b * multiplier)) / multiplier;
  },
  
  /**
   * 减法运算，解决JavaScript浮点数计算精度问题
   * @param {number} a - 被减数
   * @param {number} b - 减数
   * @returns {number} 差
   */
  subtract: function(a, b) {
    const precision = this._getPrecision(a, b);
    const multiplier = Math.pow(10, precision);
    return (this._round(a * multiplier) - this._round(b * multiplier)) / multiplier;
  },
  
  /**
   * 乘法运算，解决JavaScript浮点数计算精度问题
   * @param {number} a - 乘数
   * @param {number} b - 被乘数
   * @returns {number} 积
   */
  multiply: function(a, b) {
    const precision = this._getPrecision(a, b);
    const multiplier = Math.pow(10, precision);
    return (this._round(a * multiplier) * this._round(b * multiplier)) / (multiplier * multiplier);
  },
  
  /**
   * 除法运算，解决JavaScript浮点数计算精度问题
   * @param {number} a - 被除数
   * @param {number} b - 除数
   * @returns {number} 商
   */
  divide: function(a, b) {
    if (b === 0) {
      throw new Error('除数不能为零');
    }
    const precision = this._getPrecision(a, b);
    const multiplier = Math.pow(10, precision);
    return (this._round(a * multiplier) / this._round(b * multiplier));
  },
  
  /**
   * 四舍五入到指定小数位
   * @param {number} value - 要四舍五入的数值
   * @param {number} [decimals=0] - 小数位数
   * @returns {number} 四舍五入后的数值
   */
  round: function(value, decimals = 0) {
    if (isNaN(value)) {
      return NaN;
    }
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
  },
  
  /**
   * 向上取整到指定小数位
   * @param {number} value - 要向上取整的数值
   * @param {number} [decimals=0] - 小数位数
   * @returns {number} 向上取整后的数值
   */
  ceil: function(value, decimals = 0) {
    if (isNaN(value)) {
      return NaN;
    }
    const multiplier = Math.pow(10, decimals);
    return Math.ceil(value * multiplier) / multiplier;
  },
  
  /**
   * 向下取整到指定小数位
   * @param {number} value - 要向下取整的数值
   * @param {number} [decimals=0] - 小数位数
   * @returns {number} 向下取整后的数值
   */
  floor: function(value, decimals = 0) {
    if (isNaN(value)) {
      return NaN;
    }
    const multiplier = Math.pow(10, decimals);
    return Math.floor(value * multiplier) / multiplier;
  },
  
  /**
   * 截断数值到指定小数位（不进行四舍五入）
   * @param {number} value - 要截断的数值
   * @param {number} [decimals=0] - 小数位数
   * @returns {number} 截断后的数值
   */
  truncate: function(value, decimals = 0) {
    if (isNaN(value)) {
      return NaN;
    }
    const multiplier = Math.pow(10, decimals);
    return Math.trunc(value * multiplier) / multiplier;
  },
  
  /**
   * 生成指定范围内的随机整数
   * @param {number} min - 最小值（包含）
   * @param {number} max - 最大值（包含）
   * @returns {number} 随机整数
   */
  randomInt: function(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  /**
   * 生成指定范围内的随机浮点数
   * @param {number} min - 最小值（包含）
   * @param {number} max - 最大值（不包含）
   * @param {number} [decimals=2] - 小数位数
   * @returns {number} 随机浮点数
   */
  randomFloat: function(min, max, decimals = 2) {
    const random = Math.random() * (max - min) + min;
    return this.round(random, decimals);
  },
  
  /**
   * 计算数组的总和
   * @param {Array<number>} arr - 数字数组
   * @returns {number} 总和
   */
  sum: function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return 0;
    }
    return arr.reduce((sum, num) => this.add(sum, num), 0);
  },
  
  /**
   * 计算数组的平均值
   * @param {Array<number>} arr - 数字数组
   * @param {number} [decimals=2] - 结果小数位数
   * @returns {number} 平均值
   */
  average: function(arr, decimals = 2) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return 0;
    }
    return this.round(this.sum(arr) / arr.length, decimals);
  },
  
  /**
   * 计算数组的最大值
   * @param {Array<number>} arr - 数字数组
   * @returns {number} 最大值
   */
  max: function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return NaN;
    }
    return Math.max(...arr);
  },
  
  /**
   * 计算数组的最小值
   * @param {Array<number>} arr - 数字数组
   * @returns {number} 最小值
   */
  min: function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return NaN;
    }
    return Math.min(...arr);
  },
  
  /**
   * 计算数组的中位数
   * @param {Array<number>} arr - 数字数组
   * @returns {number} 中位数
   */
  median: function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return NaN;
    }
    
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    } else {
      return sorted[mid];
    }
  },
  
  /**
   * 计算数组的众数（出现次数最多的数）
   * @param {Array<number>} arr - 数字数组
   * @returns {Array<number>} 众数数组（可能有多个众数）
   */
  mode: function(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return [];
    }
    
    // 统计每个数字出现的次数
    const frequency = {};
    arr.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
    
    // 找出出现次数最多的数字
    let maxFrequency = 0;
    let modes = [];
    
    for (const num in frequency) {
      if (frequency[num] > maxFrequency) {
        maxFrequency = frequency[num];
        modes = [parseFloat(num)];
      } else if (frequency[num] === maxFrequency) {
        modes.push(parseFloat(num));
      }
    }
    
    return modes;
  },
  
  /**
   * 计算数组的方差
   * @param {Array<number>} arr - 数字数组
   * @param {boolean} [isSample=true] - 是否为样本方差（除以n-1），false为总体方差（除以n）
   * @param {number} [decimals=2] - 结果小数位数
   * @returns {number} 方差
   */
  variance: function(arr, isSample = true, decimals = 2) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return NaN;
    }
    
    if (arr.length === 1 && isSample) {
      return 0;
    }
    
    const mean = this.average(arr, 10); // 使用较高精度计算平均值
    const squaredDiffs = arr.map(num => Math.pow(num - mean, 2));
    const divisor = isSample ? arr.length - 1 : arr.length;
    
    return this.round(this.sum(squaredDiffs) / divisor, decimals);
  },
  
  /**
   * 计算数组的标准差
   * @param {Array<number>} arr - 数字数组
   * @param {boolean} [isSample=true] - 是否为样本标准差，false为总体标准差
   * @param {number} [decimals=2] - 结果小数位数
   * @returns {number} 标准差
   */
  stdDev: function(arr, isSample = true, decimals = 2) {
    const variance = this.variance(arr, isSample, 10); // 使用较高精度计算方差
    return this.round(Math.sqrt(variance), decimals);
  },
  
  /**
   * 计算百分比
   * @param {number} value - 值
   * @param {number} total - 总数
   * @param {number} [decimals=2] - 结果小数位数
   * @returns {number} 百分比值
   */
  percentage: function(value, total, decimals = 2) {
    if (total === 0) {
      return 0;
    }
    return this.round((value / total) * 100, decimals);
  },
  
  /**
   * 将数字格式化为千分位分隔的字符串
   * @param {number} num - 要格式化的数字
   * @param {number} [decimals=2] - 小数位数
   * @param {string} [decimalPoint='.'] - 小数点符号
   * @param {string} [thousandsSep=','] - 千分位分隔符
   * @returns {string} 格式化后的字符串
   */
  formatNumber: function(num, decimals = 2, decimalPoint = '.', thousandsSep = ',') {
    if (isNaN(num)) {
      return '';
    }
    
    // 四舍五入到指定小数位
    const roundedNum = this.round(num, decimals);
    
    // 将数字转换为字符串
    const numStr = roundedNum.toString();
    
    // 分离整数部分和小数部分
    const parts = numStr.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? parts[1] : '';
    
    // 添加千分位分隔符到整数部分
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    
    // 处理小数部分，确保小数位数正确
    let formattedDecimalPart = '';
    if (decimals > 0) {
      formattedDecimalPart = decimalPart.padEnd(decimals, '0').slice(0, decimals);
      return `${formattedIntegerPart}${decimalPoint}${formattedDecimalPart}`;
    } else {
      return formattedIntegerPart;
    }
  },
  
  /**
   * 将数字格式化为货币字符串
   * @param {number} num - 要格式化的数字
   * @param {string} [currencySymbol='¥'] - 货币符号
   * @param {number} [decimals=2] - 小数位数
   * @param {string} [decimalPoint='.'] - 小数点符号
   * @param {string} [thousandsSep=','] - 千分位分隔符
   * @param {string} [symbolPosition='before'] - 货币符号位置，'before'或'after'
   * @returns {string} 格式化后的货币字符串
   */
  formatCurrency: function(num, currencySymbol = '¥', decimals = 2, decimalPoint = '.', thousandsSep = ',', symbolPosition = 'before') {
    const formattedNumber = this.formatNumber(num, decimals, decimalPoint, thousandsSep);
    
    if (symbolPosition === 'before') {
      return `${currencySymbol}${formattedNumber}`;
    } else {
      return `${formattedNumber} ${currencySymbol}`;
    }
  },
  
  /**
   * 将数字转换为中文数字
   * @param {number} num - 要转换的数字
   * @param {boolean} [uppercase=false] - 是否使用大写中文数字
   * @returns {string} 中文数字字符串
   */
  toChineseNumber: function(num, uppercase = false) {
    if (isNaN(num)) {
      return '';
    }
    
    // 处理负数
    const isNegative = num < 0;
    num = Math.abs(num);
    
    // 处理小数
    const parts = num.toString().split('.');
    const integerPart = parseInt(parts[0]);
    const decimalPart = parts.length > 1 ? parts[1] : '';
    
    // 中文数字字符
    const chineseDigits = uppercase ? 
      ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'] : 
      ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    
    // 中文单位字符
    const chineseUnits = uppercase ? 
      ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟', '兆'] : 
      ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '兆'];
    
    // 处理整数部分
    let chineseInteger = '';
    const integerStr = integerPart.toString();
    
    if (integerStr === '0') {
      chineseInteger = chineseDigits[0];
    } else {
      for (let i = 0; i < integerStr.length; i++) {
        const digit = parseInt(integerStr[i]);
        const unit = chineseUnits[integerStr.length - 1 - i];
        
        if (digit === 0) {
          // 处理连续的零
          if (i > 0 && parseInt(integerStr[i - 1]) !== 0) {
            chineseInteger += chineseDigits[digit];
          }
        } else {
          chineseInteger += chineseDigits[digit] + unit;
        }
      }
    }
    
    // 处理小数部分
    let chineseDecimal = '';
    if (decimalPart) {
      chineseDecimal = uppercase ? '点' : '点';
      for (let i = 0; i < decimalPart.length; i++) {
        const digit = parseInt(decimalPart[i]);
        chineseDecimal += chineseDigits[digit];
      }
    }
    
    // 组合结果
    let result = chineseInteger + chineseDecimal;
    if (isNegative) {
      result = (uppercase ? '负' : '负') + result;
    }
    
    return result;
  },
  
  /**
   * 将数字转换为中文金额
   * @param {number} num - 要转换的数字
   * @param {boolean} [uppercase=true] - 是否使用大写中文金额
   * @returns {string} 中文金额字符串
   */
  toChineseCurrency: function(num, uppercase = true) {
    if (isNaN(num)) {
      return '';
    }
    
    // 处理负数
    const isNegative = num < 0;
    num = Math.abs(num);
    
    // 四舍五入到分
    num = this.round(num, 2);
    
    // 处理整数和小数部分
    const parts = num.toString().split('.');
    let yuan = parseInt(parts[0]);
    let cent = parts.length > 1 ? parts[1].padEnd(2, '0') : '00';
    
    // 中文数字字符
    const chineseDigits = uppercase ? 
      ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'] : 
      ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    
    // 中文单位字符
    const chineseUnits = uppercase ? 
      ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟', '兆'] : 
      ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '兆'];
    
    // 中文货币单位
    const currencyUnits = uppercase ? 
      ['圆', '角', '分'] : 
      ['元', '角', '分'];
    
    // 处理整数部分
    let chineseYuan = '';
    const yuanStr = yuan.toString();
    
    if (yuanStr === '0') {
      if (cent === '00') {
        return uppercase ? '零圆整' : '零元整';
      }
    } else {
      for (let i = 0; i < yuanStr.length; i++) {
        const digit = parseInt(yuanStr[i]);
        const unit = chineseUnits[yuanStr.length - 1 - i];
        
        if (digit === 0) {
          // 处理连续的零
          if (i > 0 && parseInt(yuanStr[i - 1]) !== 0) {
            chineseYuan += chineseDigits[digit];
          }
        } else {
          chineseYuan += chineseDigits[digit] + unit;
        }
      }
      chineseYuan += currencyUnits[0];
    }
    
    // 处理小数部分
    let chineseCent = '';
    const jiao = parseInt(cent[0]);
    const fen = parseInt(cent[1]);
    
    if (jiao !== 0) {
      chineseCent += chineseDigits[jiao] + currencyUnits[1];
    }
    
    if (fen !== 0) {
      chineseCent += chineseDigits[fen] + currencyUnits[2];
    }
    
    // 组合结果
    let result = '';
    if (chineseYuan && chineseCent) {
      result = chineseYuan + chineseCent;
    } else if (chineseYuan) {
      result = chineseYuan + '整';
    } else {
      result = chineseCent;
    }
    
    if (isNegative) {
      result = (uppercase ? '负' : '负') + result;
    }
    
    return result;
  },
  
  /**
   * 计算两点之间的距离
   * @param {number} x1 - 第一个点的x坐标
   * @param {number} y1 - 第一个点的y坐标
   * @param {number} x2 - 第二个点的x坐标
   * @param {number} y2 - 第二个点的y坐标
   * @param {number} [decimals=2] - 结果小数位数
   * @returns {number} 两点之间的距离
   */
  distance: function(x1, y1, x2, y2, decimals = 2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return this.round(Math.sqrt(dx * dx + dy * dy), decimals);
  },
  
  /**
   * 计算数值的阶乘
   * @param {number} n - 要计算阶乘的非负整数
   * @returns {number} 阶乘结果
   */
  factorial: function(n) {
    if (n < 0 || !Number.isInteger(n)) {
      throw new Error('阶乘只能计算非负整数');
    }
    
    if (n === 0 || n === 1) {
      return 1;
    }
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    
    return result;
  },
  
  /**
   * 计算排列数（从n个不同元素中取出m个元素的排列数）
   * @param {number} n - 总元素数
   * @param {number} m - 取出的元素数
   * @returns {number} 排列数
   */
  permutation: function(n, m) {
    if (n < 0 || m < 0 || !Number.isInteger(n) || !Number.isInteger(m)) {
      throw new Error('排列数计算需要非负整数');
    }
    
    if (m > n) {
      return 0;
    }
    
    let result = 1;
    for (let i = n - m + 1; i <= n; i++) {
      result *= i;
    }
    
    return result;
  },
  
  /**
   * 计算组合数（从n个不同元素中取出m个元素的组合数）
   * @param {number} n - 总元素数
   * @param {number} m - 取出的元素数
   * @returns {number} 组合数
   */
  combination: function(n, m) {
    if (n < 0 || m < 0 || !Number.isInteger(n) || !Number.isInteger(m)) {
      throw new Error('组合数计算需要非负整数');
    }
    
    if (m > n) {
      return 0;
    }
    
    // 优化：使用较小的m计算
    if (m > n / 2) {
      m = n - m;
    }
    
    let result = 1;
    for (let i = 1; i <= m; i++) {
      result = result * (n - m + i) / i;
    }
    
    return Math.round(result);
  },
  
  /**
   * 判断一个数是否为素数
   * @param {number} n - 要判断的数
   * @returns {boolean} 是否为素数
   */
  isPrime: function(n) {
    if (n <= 1 || !Number.isInteger(n)) {
      return false;
    }
    
    if (n <= 3) {
      return true;
    }
    
    if (n % 2 === 0 || n % 3 === 0) {
      return false;
    }
    
    const sqrtN = Math.sqrt(n);
    for (let i = 5; i <= sqrtN; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) {
        return false;
      }
    }
    
    return true;
  },
  
  /**
   * 计算最大公约数
   * @param {number} a - 第一个数
   * @param {number} b - 第二个数
   * @returns {number} 最大公约数
   */
  gcd: function(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      throw new Error('最大公约数计算需要整数');
    }
    
    if (b === 0) {
      return a;
    }
    
    return this.gcd(b, a % b);
  },
  
  /**
   * 计算最小公倍数
   * @param {number} a - 第一个数
   * @param {number} b - 第二个数
   * @returns {number} 最小公倍数
   */
  lcm: function(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      throw new Error('最小公倍数计算需要整数');
    }
    
    if (a === 0 || b === 0) {
      return 0;
    }
    
    return (a * b) / this.gcd(a, b);
  },
  
  /**
   * 将角度转换为弧度
   * @param {number} degrees - 角度
   * @returns {number} 弧度
   */
  toRadians: function(degrees) {
    return degrees * (Math.PI / 180);
  },
  
  /**
   * 将弧度转换为角度
   * @param {number} radians - 弧度
   * @returns {number} 角度
   */
  toDegrees: function(radians) {
    return radians * (180 / Math.PI);
  },
  
  /**
   * 获取数字的精度（小数位数）
   * @private
   * @param {number} a - 第一个数
   * @param {number} b - 第二个数
   * @returns {number} 最大精度
   */
  _getPrecision: function(a, b) {
    const aStr = a.toString();
    const bStr = b.toString();
    const aDecimals = aStr.indexOf('.') >= 0 ? aStr.split('.')[1].length : 0;
    const bDecimals = bStr.indexOf('.') >= 0 ? bStr.split('.')[1].length : 0;
    return Math.max(aDecimals, bDecimals);
  },
  
  /**
   * 四舍五入数字（内部使用）
   * @private
   * @param {number} num - 要四舍五入的数字
   * @returns {number} 四舍五入后的数字
   */
  _round: function(num) {
    return Math.round(num);
  }
};

module.exports = mathUtils;