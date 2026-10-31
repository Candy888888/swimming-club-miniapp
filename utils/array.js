// array.js - 数组工具

/**
 * 数组工具
 * 用于处理数组相关的操作，包括过滤、排序、转换等功能
 */
const arrayUtils = {
  /**
   * 检查是否为数组
   * @param {*} arr - 要检查的值
   * @returns {boolean} 如果是数组则返回true，否则返回false
   */
  isArray: function(arr) {
    return Array.isArray(arr);
  },
  
  /**
   * 检查数组是否为空
   * @param {Array} arr - 要检查的数组
   * @returns {boolean} 如果数组为null、undefined或长度为0，则返回true
   */
  isEmpty: function(arr) {
    return !this.isArray(arr) || arr.length === 0;
  },
  
  /**
   * 检查数组是否不为空
   * @param {Array} arr - 要检查的数组
   * @returns {boolean} 如果数组不为null、undefined且长度大于0，则返回true
   */
  isNotEmpty: function(arr) {
    return this.isArray(arr) && arr.length > 0;
  },
  
  /**
   * 获取数组的长度，如果不是数组则返回0
   * @param {Array} arr - 要获取长度的数组
   * @returns {number} 数组的长度
   */
  length: function(arr) {
    return this.isArray(arr) ? arr.length : 0;
  },
  
  /**
   * 获取数组的第一个元素
   * @param {Array} arr - 要获取元素的数组
   * @returns {*} 数组的第一个元素，如果数组为空则返回undefined
   */
  first: function(arr) {
    return this.isArray(arr) && arr.length > 0 ? arr[0] : undefined;
  },
  
  /**
   * 获取数组的最后一个元素
   * @param {Array} arr - 要获取元素的数组
   * @returns {*} 数组的最后一个元素，如果数组为空则返回undefined
   */
  last: function(arr) {
    return this.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : undefined;
  },
  
  /**
   * 获取数组中指定索引的元素，支持负索引（从末尾开始计数）
   * @param {Array} arr - 要获取元素的数组
   * @param {number} index - 索引，负数表示从末尾开始计数
   * @returns {*} 指定索引的元素，如果索引越界则返回undefined
   */
  get: function(arr, index) {
    if (!this.isArray(arr)) {
      return undefined;
    }
    
    if (index < 0) {
      index = arr.length + index;
    }
    
    return index >= 0 && index < arr.length ? arr[index] : undefined;
  },
  
  /**
   * 创建一个新数组，包含原数组中的所有元素
   * @param {Array} arr - 要复制的数组
   * @returns {Array} 复制后的新数组，如果不是数组则返回空数组
   */
  clone: function(arr) {
    return this.isArray(arr) ? [...arr] : [];
  },
  
  /**
   * 创建一个新数组，包含原数组中的所有元素（深拷贝）
   * @param {Array} arr - 要复制的数组
   * @returns {Array} 复制后的新数组，如果不是数组则返回空数组
   */
  deepClone: function(arr) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    try {
      return JSON.parse(JSON.stringify(arr));
    } catch (e) {
      return this.clone(arr);
    }
  },
  
  /**
   * 将多个数组合并为一个新数组
   * @param {...Array} arrays - 要合并的数组
   * @returns {Array} 合并后的新数组
   */
  concat: function(...arrays) {
    return [].concat(...arrays.filter(arr => this.isArray(arr)));
  },
  
  /**
   * 将数组中的所有元素连接为一个字符串
   * @param {Array} arr - 要连接的数组
   * @param {string} [separator=','] - 分隔符，默认为逗号
   * @returns {string} 连接后的字符串，如果不是数组则返回空字符串
   */
  join: function(arr, separator = ',') {
    return this.isArray(arr) ? arr.join(separator) : '';
  },
  
  /**
   * 将字符串拆分为数组
   * @param {string} str - 要拆分的字符串
   * @param {string|RegExp} [separator=','] - 分隔符，默认为逗号
   * @returns {Array} 拆分后的数组，如果不是字符串则返回空数组
   */
  split: function(str, separator = ',') {
    return typeof str === 'string' ? str.split(separator) : [];
  },
  
  /**
   * 对数组进行排序（不修改原数组）
   * @param {Array} arr - 要排序的数组
   * @param {Function} [compareFn] - 比较函数
   * @returns {Array} 排序后的新数组，如果不是数组则返回空数组
   */
  sort: function(arr, compareFn) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    const newArr = this.clone(arr);
    return compareFn ? newArr.sort(compareFn) : newArr.sort();
  },
  
  /**
   * 对数组进行排序（修改原数组）
   * @param {Array} arr - 要排序的数组
   * @param {Function} [compareFn] - 比较函数
   * @returns {Array} 排序后的数组，如果不是数组则返回空数组
   */
  sortInPlace: function(arr, compareFn) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    return compareFn ? arr.sort(compareFn) : arr.sort();
  },
  
  /**
   * 对数组中的对象按照指定属性进行排序
   * @param {Array} arr - 要排序的数组
   * @param {string|Function} key - 排序依据的属性名或获取排序值的函数
   * @param {boolean} [ascending=true] - 是否升序排序，默认为true
   * @returns {Array} 排序后的新数组，如果不是数组则返回空数组
   */
  sortBy: function(arr, key, ascending = true) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    const newArr = this.clone(arr);
    const getValue = typeof key === 'function' ? key : item => item && item[key];
    const direction = ascending ? 1 : -1;
    
    return newArr.sort((a, b) => {
      const valueA = getValue(a);
      const valueB = getValue(b);
      
      if (valueA === valueB) return 0;
      if (valueA === undefined || valueA === null) return 1;
      if (valueB === undefined || valueB === null) return -1;
      
      return valueA < valueB ? -direction : direction;
    });
  },
  
  /**
   * 反转数组（不修改原数组）
   * @param {Array} arr - 要反转的数组
   * @returns {Array} 反转后的新数组，如果不是数组则返回空数组
   */
  reverse: function(arr) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    return this.clone(arr).reverse();
  },
  
  /**
   * 反转数组（修改原数组）
   * @param {Array} arr - 要反转的数组
   * @returns {Array} 反转后的数组，如果不是数组则返回空数组
   */
  reverseInPlace: function(arr) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    return arr.reverse();
  },
  
  /**
   * 过滤数组中的元素
   * @param {Array} arr - 要过滤的数组
   * @param {Function} predicate - 过滤函数，返回true表示保留元素
   * @returns {Array} 过滤后的新数组，如果不是数组则返回空数组
   */
  filter: function(arr, predicate) {
    if (!this.isArray(arr) || typeof predicate !== 'function') {
      return [];
    }
    
    return arr.filter(predicate);
  },
  
  /**
   * 过滤数组中的假值（false、null、0、""、undefined、NaN）
   * @param {Array} arr - 要过滤的数组
   * @returns {Array} 过滤后的新数组，如果不是数组则返回空数组
   */
  compact: function(arr) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    return arr.filter(Boolean);
  },
  
  /**
   * 转换数组中的元素
   * @param {Array} arr - 要转换的数组
   * @param {Function} mapper - 转换函数
   * @returns {Array} 转换后的新数组，如果不是数组则返回空数组
   */
  map: function(arr, mapper) {
    if (!this.isArray(arr) || typeof mapper !== 'function') {
      return [];
    }
    
    return arr.map(mapper);
  },
  
  /**
   * 对数组中的元素执行累积操作
   * @param {Array} arr - 要操作的数组
   * @param {Function} reducer - 累积函数
   * @param {*} [initialValue] - 初始值
   * @returns {*} 累积结果，如果不是数组则返回初始值
   */
  reduce: function(arr, reducer, initialValue) {
    if (!this.isArray(arr) || typeof reducer !== 'function') {
      return initialValue;
    }
    
    return initialValue !== undefined ? arr.reduce(reducer, initialValue) : arr.reduce(reducer);
  },
  
  /**
   * 检查数组中是否所有元素都满足条件
   * @param {Array} arr - 要检查的数组
   * @param {Function} predicate - 条件函数
   * @returns {boolean} 如果所有元素都满足条件则返回true，否则返回false
   */
  every: function(arr, predicate) {
    if (!this.isArray(arr) || typeof predicate !== 'function') {
      return false;
    }
    
    return arr.every(predicate);
  },
  
  /**
   * 检查数组中是否存在满足条件的元素
   * @param {Array} arr - 要检查的数组
   * @param {Function} predicate - 条件函数
   * @returns {boolean} 如果存在满足条件的元素则返回true，否则返回false
   */
  some: function(arr, predicate) {
    if (!this.isArray(arr) || typeof predicate !== 'function') {
      return false;
    }
    
    return arr.some(predicate);
  },
  
  /**
   * 查找数组中第一个满足条件的元素
   * @param {Array} arr - 要查找的数组
   * @param {Function} predicate - 条件函数
   * @returns {*} 满足条件的元素，如果没有找到则返回undefined
   */
  find: function(arr, predicate) {
    if (!this.isArray(arr) || typeof predicate !== 'function') {
      return undefined;
    }
    
    return arr.find(predicate);
  },
  
  /**
   * 查找数组中第一个满足条件的元素的索引
   * @param {Array} arr - 要查找的数组
   * @param {Function|*} predicateOrValue - 条件函数或要查找的值
   * @returns {number} 满足条件的元素的索引，如果没有找到则返回-1
   */
  findIndex: function(arr, predicateOrValue) {
    if (!this.isArray(arr)) {
      return -1;
    }
    
    if (typeof predicateOrValue === 'function') {
      return arr.findIndex(predicateOrValue);
    } else {
      return arr.indexOf(predicateOrValue);
    }
  },
  
  /**
   * 查找数组中最后一个满足条件的元素的索引
   * @param {Array} arr - 要查找的数组
   * @param {Function|*} predicateOrValue - 条件函数或要查找的值
   * @returns {number} 满足条件的元素的索引，如果没有找到则返回-1
   */
  findLastIndex: function(arr, predicateOrValue) {
    if (!this.isArray(arr)) {
      return -1;
    }
    
    if (typeof predicateOrValue === 'function') {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (predicateOrValue(arr[i], i, arr)) {
          return i;
        }
      }
      return -1;
    } else {
      return arr.lastIndexOf(predicateOrValue);
    }
  },
  
  /**
   * 检查数组中是否包含指定元素
   * @param {Array} arr - 要检查的数组
   * @param {*} value - 要查找的值
   * @returns {boolean} 如果数组中包含指定元素则返回true，否则返回false
   */
  includes: function(arr, value) {
    if (!this.isArray(arr)) {
      return false;
    }
    
    return arr.includes(value);
  },
  
  /**
   * 获取数组中指定元素的所有索引
   * @param {Array} arr - 要查找的数组
   * @param {*} value - 要查找的值
   * @returns {Array} 包含所有匹配索引的数组
   */
  indicesOf: function(arr, value) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    const indices = [];
    let idx = -1;
    while ((idx = arr.indexOf(value, idx + 1)) !== -1) {
      indices.push(idx);
    }
    return indices;
  },
  
  /**
   * 获取数组的一部分（不修改原数组）
   * @param {Array} arr - 要获取部分的数组
   * @param {number} [start=0] - 开始索引
   * @param {number} [end] - 结束索引（不包含）
   * @returns {Array} 数组的一部分，如果不是数组则返回空数组
   */
  slice: function(arr, start = 0, end) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    return end !== undefined ? arr.slice(start, end) : arr.slice(start);
  },
  
  /**
   * 删除数组中的一部分并可能插入新元素（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {number} start - 开始索引
   * @param {number} [deleteCount=0] - 要删除的元素数量
   * @param {...*} items - 要插入的元素
   * @returns {Array} 包含被删除元素的数组，如果不是数组则返回空数组
   */
  splice: function(arr, start, deleteCount = 0, ...items) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    return arr.splice(start, deleteCount, ...items);
  },
  
  /**
   * 向数组末尾添加一个或多个元素（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {...*} items - 要添加的元素
   * @returns {number} 新数组的长度，如果不是数组则返回0
   */
  push: function(arr, ...items) {
    if (!this.isArray(arr)) {
      return 0;
    }
    
    return arr.push(...items);
  },
  
  /**
   * 从数组末尾删除一个元素（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @returns {*} 被删除的元素，如果数组为空则返回undefined
   */
  pop: function(arr) {
    if (!this.isArray(arr) || arr.length === 0) {
      return undefined;
    }
    
    return arr.pop();
  },
  
  /**
   * 向数组开头添加一个或多个元素（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {...*} items - 要添加的元素
   * @returns {number} 新数组的长度，如果不是数组则返回0
   */
  unshift: function(arr, ...items) {
    if (!this.isArray(arr)) {
      return 0;
    }
    
    return arr.unshift(...items);
  },
  
  /**
   * 从数组开头删除一个元素（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @returns {*} 被删除的元素，如果数组为空则返回undefined
   */
  shift: function(arr) {
    if (!this.isArray(arr) || arr.length === 0) {
      return undefined;
    }
    
    return arr.shift();
  },
  
  /**
   * 填充数组的所有元素（修改原数组）
   * @param {Array} arr - 要填充的数组
   * @param {*} value - 填充值
   * @param {number} [start=0] - 开始索引
   * @param {number} [end] - 结束索引（不包含）
   * @returns {Array} 填充后的数组，如果不是数组则返回空数组
   */
  fill: function(arr, value, start = 0, end) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    return end !== undefined ? arr.fill(value, start, end) : arr.fill(value, start);
  },
  
  /**
   * 创建指定长度的数组并填充值
   * @param {number} length - 数组长度
   * @param {*} [value] - 填充值，默认为undefined
   * @returns {Array} 创建的数组
   */
  createArray: function(length, value) {
    if (length <= 0) {
      return [];
    }
    
    return value !== undefined ? Array(length).fill(value) : Array(length);
  },
  
  /**
   * 创建指定范围的数字数组
   * @param {number} start - 开始值（包含）
   * @param {number} end - 结束值（不包含）
   * @param {number} [step=1] - 步长
   * @returns {Array} 创建的数组
   */
  range: function(start, end, step = 1) {
    if (step === 0 || (start < end && step < 0) || (start > end && step > 0)) {
      return [];
    }
    
    const length = Math.ceil(Math.abs((end - start) / step));
    return Array.from({ length }, (_, i) => start + i * step);
  },
  
  /**
   * 获取数组中的唯一元素
   * @param {Array} arr - 要操作的数组
   * @returns {Array} 包含唯一元素的新数组，如果不是数组则返回空数组
   */
  unique: function(arr) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    return [...new Set(arr)];
  },
  
  /**
   * 获取数组中的唯一对象，根据指定的键或函数确定唯一性
   * @param {Array} arr - 要操作的数组
   * @param {string|Function} [keyOrFn] - 用于确定唯一性的键或函数
   * @returns {Array} 包含唯一对象的新数组，如果不是数组则返回空数组
   */
  uniqueBy: function(arr, keyOrFn) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    if (!keyOrFn) {
      return this.unique(arr);
    }
    
    const getKey = typeof keyOrFn === 'function' ? keyOrFn : item => item && item[keyOrFn];
    const seen = new Map();
    
    return arr.filter(item => {
      const key = getKey(item);
      if (seen.has(key)) {
        return false;
      }
      seen.set(key, true);
      return true;
    });
  },
  
  /**
   * 获取多个数组的交集
   * @param {...Array} arrays - 要操作的数组
   * @returns {Array} 包含交集元素的新数组
   */
  intersection: function(...arrays) {
    if (arrays.length === 0) {
      return [];
    }
    
    const validArrays = arrays.filter(arr => this.isArray(arr));
    if (validArrays.length === 0) {
      return [];
    }
    
    if (validArrays.length === 1) {
      return this.unique(validArrays[0]);
    }
    
    return validArrays.reduce((result, arr) => {
      return result.filter(item => arr.includes(item));
    }, this.unique(validArrays[0]));
  },
  
  /**
   * 获取多个数组的并集
   * @param {...Array} arrays - 要操作的数组
   * @returns {Array} 包含并集元素的新数组
   */
  union: function(...arrays) {
    return this.unique(this.concat(...arrays));
  },
  
  /**
   * 获取第一个数组中存在但在其他数组中不存在的元素
   * @param {Array} arr - 基准数组
   * @param {...Array} others - 其他数组
   * @returns {Array} 包含差集元素的新数组，如果不是数组则返回空数组
   */
  difference: function(arr, ...others) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    const otherValues = new Set(this.concat(...others));
    return arr.filter(item => !otherValues.has(item));
  },
  
  /**
   * 将数组分组为指定大小的块
   * @param {Array} arr - 要分组的数组
   * @param {number} size - 每组的大小
   * @returns {Array} 分组后的新数组，如果不是数组则返回空数组
   */
  chunk: function(arr, size) {
    if (!this.isArray(arr) || size <= 0) {
      return [];
    }
    
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },
  
  /**
   * 将数组平铺一层
   * @param {Array} arr - 要平铺的数组
   * @returns {Array} 平铺后的新数组，如果不是数组则返回空数组
   */
  flatten: function(arr) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    return [].concat(...arr.map(item => this.isArray(item) ? item : [item]));
  },
  
  /**
   * 将数组完全平铺（递归平铺所有嵌套数组）
   * @param {Array} arr - 要平铺的数组
   * @returns {Array} 平铺后的新数组，如果不是数组则返回空数组
   */
  flattenDeep: function(arr) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    return arr.reduce((result, item) => {
      return result.concat(this.isArray(item) ? this.flattenDeep(item) : item);
    }, []);
  },
  
  /**
   * 将数组平铺到指定深度
   * @param {Array} arr - 要平铺的数组
   * @param {number} [depth=1] - 平铺深度
   * @returns {Array} 平铺后的新数组，如果不是数组则返回空数组
   */
  flattenDepth: function(arr, depth = 1) {
    if (!this.isArray(arr) || depth <= 0) {
      return this.isArray(arr) ? this.clone(arr) : [];
    }
    
    return arr.reduce((result, item) => {
      return result.concat(this.isArray(item) && depth > 1 ? this.flattenDepth(item, depth - 1) : item);
    }, []);
  },
  
  /**
   * 移除数组中的指定元素（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {...*} values - 要移除的元素
   * @returns {Array} 操作后的数组，如果不是数组则返回空数组
   */
  remove: function(arr, ...values) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    const valueSet = new Set(values);
    let i = 0;
    while (i < arr.length) {
      if (valueSet.has(arr[i])) {
        arr.splice(i, 1);
      } else {
        i++;
      }
    }
    return arr;
  },
  
  /**
   * 根据条件移除数组中的元素（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {Function} predicate - 条件函数，返回true表示移除元素
   * @returns {Array} 被移除的元素组成的数组，如果不是数组则返回空数组
   */
  removeIf: function(arr, predicate) {
    if (!this.isArray(arr) || typeof predicate !== 'function') {
      return [];
    }
    
    const removed = [];
    let i = 0;
    while (i < arr.length) {
      if (predicate(arr[i], i, arr)) {
        removed.push(arr[i]);
        arr.splice(i, 1);
      } else {
        i++;
      }
    }
    return removed;
  },
  
  /**
   * 从数组中随机获取一个元素
   * @param {Array} arr - 要获取元素的数组
   * @returns {*} 随机元素，如果数组为空则返回undefined
   */
  sample: function(arr) {
    if (!this.isArray(arr) || arr.length === 0) {
      return undefined;
    }
    
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  },
  
  /**
   * 从数组中随机获取多个元素
   * @param {Array} arr - 要获取元素的数组
   * @param {number} size - 要获取的元素数量
   * @param {boolean} [allowDuplicates=false] - 是否允许重复，默认为false
   * @returns {Array} 包含随机元素的新数组，如果不是数组则返回空数组
   */
  sampleSize: function(arr, size, allowDuplicates = false) {
    if (!this.isArray(arr) || arr.length === 0 || size <= 0) {
      return [];
    }
    
    if (allowDuplicates) {
      return Array.from({ length: size }, () => this.sample(arr));
    } else {
      const shuffled = this.shuffle(arr);
      return shuffled.slice(0, Math.min(size, arr.length));
    }
  },
  
  /**
   * 随机打乱数组（不修改原数组）
   * @param {Array} arr - 要打乱的数组
   * @returns {Array} 打乱后的新数组，如果不是数组则返回空数组
   */
  shuffle: function(arr) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    const newArr = this.clone(arr);
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  },
  
  /**
   * 随机打乱数组（修改原数组）
   * @param {Array} arr - 要打乱的数组
   * @returns {Array} 打乱后的数组，如果不是数组则返回空数组
   */
  shuffleInPlace: function(arr) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },
  
  /**
   * 计算数组中元素的出现次数
   * @param {Array} arr - 要计算的数组
   * @returns {Object} 元素出现次数的对象，如果不是数组则返回空对象
   */
  countOccurrences: function(arr) {
    if (!this.isArray(arr)) {
      return {};
    }
    
    return arr.reduce((counts, value) => {
      counts[value] = (counts[value] || 0) + 1;
      return counts;
    }, {});
  },
  
  /**
   * 根据指定的键或函数对数组进行分组
   * @param {Array} arr - 要分组的数组
   * @param {string|Function} keyOrFn - 分组依据的键或函数
   * @returns {Object} 分组后的对象，如果不是数组则返回空对象
   */
  groupBy: function(arr, keyOrFn) {
    if (!this.isArray(arr)) {
      return {};
    }
    
    const getKey = typeof keyOrFn === 'function' ? keyOrFn : item => item && item[keyOrFn];
    
    return arr.reduce((groups, item) => {
      const key = getKey(item);
      if (key !== undefined && key !== null) {
        groups[key] = groups[key] || [];
        groups[key].push(item);
      }
      return groups;
    }, {});
  },
  
  /**
   * 将对象数组转换为对象，使用指定的键和值属性
   * @param {Array} arr - 要转换的对象数组
   * @param {string|Function} keyProp - 键属性名或获取键的函数
   * @param {string|Function} [valueProp] - 值属性名或获取值的函数，如果不指定则使用整个对象作为值
   * @returns {Object} 转换后的对象，如果不是数组则返回空对象
   */
  toObject: function(arr, keyProp, valueProp) {
    if (!this.isArray(arr)) {
      return {};
    }
    
    const getKey = typeof keyProp === 'function' ? keyProp : item => item && item[keyProp];
    const getValue = valueProp ? (typeof valueProp === 'function' ? valueProp : item => item && item[valueProp]) : item => item;
    
    return arr.reduce((obj, item) => {
      const key = getKey(item);
      if (key !== undefined && key !== null) {
        obj[key] = getValue(item);
      }
      return obj;
    }, {});
  },
  
  /**
   * 将数组转换为Map对象
   * @param {Array} arr - 要转换的数组
   * @param {Function} keyFn - 获取键的函数
   * @param {Function} [valueFn] - 获取值的函数，如果不指定则使用原始元素作为值
   * @returns {Map} 转换后的Map对象，如果不是数组则返回空Map
   */
  toMap: function(arr, keyFn, valueFn) {
    if (!this.isArray(arr) || typeof keyFn !== 'function') {
      return new Map();
    }
    
    const getValue = valueFn || (item => item);
    const map = new Map();
    
    arr.forEach(item => {
      const key = keyFn(item);
      if (key !== undefined && key !== null) {
        map.set(key, getValue(item));
      }
    });
    
    return map;
  },
  
  /**
   * 将数组转换为Set对象
   * @param {Array} arr - 要转换的数组
   * @returns {Set} 转换后的Set对象，如果不是数组则返回空Set
   */
  toSet: function(arr) {
    if (!this.isArray(arr)) {
      return new Set();
    }
    
    return new Set(arr);
  },
  
  /**
   * 将数组中的对象按照指定的键进行索引
   * @param {Array} arr - 要索引的对象数组
   * @param {string|Function} keyProp - 键属性名或获取键的函数
   * @returns {Object} 索引后的对象，如果不是数组则返回空对象
   */
  indexBy: function(arr, keyProp) {
    return this.toObject(arr, keyProp);
  },
  
  /**
   * 将数组中的对象按照指定的键进行分组，并对每个分组应用转换函数
   * @param {Array} arr - 要分组的对象数组
   * @param {string|Function} keyProp - 键属性名或获取键的函数
   * @param {Function} [transformFn] - 应用于每个分组的转换函数，如果不指定则返回原始分组
   * @returns {Object} 分组后的对象，如果不是数组则返回空对象
   */
  groupByAndTransform: function(arr, keyProp, transformFn) {
    if (!this.isArray(arr)) {
      return {};
    }
    
    const groups = this.groupBy(arr, keyProp);
    
    if (typeof transformFn !== 'function') {
      return groups;
    }
    
    const result = {};
    for (const key in groups) {
      if (Object.prototype.hasOwnProperty.call(groups, key)) {
        result[key] = transformFn(groups[key], key);
      }
    }
    
    return result;
  },
  
  /**
   * 将数组中的元素两两组合
   * @param {Array} arr - 要组合的数组
   * @returns {Array} 包含所有可能组合的新数组，如果不是数组则返回空数组
   */
  pairs: function(arr) {
    if (!this.isArray(arr) || arr.length < 2) {
      return [];
    }
    
    const result = [];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        result.push([arr[i], arr[j]]);
      }
    }
    return result;
  },
  
  /**
   * 将数组中的元素与另一个数组中的元素组合
   * @param {Array} arr1 - 第一个数组
   * @param {Array} arr2 - 第二个数组
   * @returns {Array} 包含所有可能组合的新数组，如果不是数组则返回空数组
   */
  cartesian: function(arr1, arr2) {
    if (!this.isArray(arr1) || !this.isArray(arr2) || arr1.length === 0 || arr2.length === 0) {
      return [];
    }
    
    const result = [];
    for (const item1 of arr1) {
      for (const item2 of arr2) {
        result.push([item1, item2]);
      }
    }
    return result;
  },
  
  /**
   * 获取数组的所有排列
   * @param {Array} arr - 要获取排列的数组
   * @returns {Array} 包含所有可能排列的新数组，如果不是数组则返回空数组
   */
  permutations: function(arr) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    if (arr.length <= 1) {
      return [this.clone(arr)];
    }
    
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      const restPermutations = this.permutations(rest);
      for (const perm of restPermutations) {
        result.push([arr[i], ...perm]);
      }
    }
    return result;
  },
  
  /**
   * 获取数组的所有组合
   * @param {Array} arr - 要获取组合的数组
   * @param {number} k - 组合中元素的数量
   * @returns {Array} 包含所有可能组合的新数组，如果不是数组则返回空数组
   */
  combinations: function(arr, k) {
    if (!this.isArray(arr) || k <= 0 || k > arr.length) {
      return [];
    }
    
    if (k === arr.length) {
      return [this.clone(arr)];
    }
    
    if (k === 1) {
      return arr.map(item => [item]);
    }
    
    const result = [];
    for (let i = 0; i <= arr.length - k; i++) {
      const head = arr[i];
      const tailCombinations = this.combinations(arr.slice(i + 1), k - 1);
      for (const comb of tailCombinations) {
        result.push([head, ...comb]);
      }
    }
    return result;
  },
  
  /**
   * 将数组中的元素向左旋转指定位置（不修改原数组）
   * @param {Array} arr - 要旋转的数组
   * @param {number} positions - 旋转位置数，正数表示向左旋转，负数表示向右旋转
   * @returns {Array} 旋转后的新数组，如果不是数组则返回空数组
   */
  rotate: function(arr, positions) {
    if (!this.isArray(arr) || arr.length <= 1) {
      return this.isArray(arr) ? this.clone(arr) : [];
    }
    
    const len = arr.length;
    positions = ((positions % len) + len) % len; // 处理负数和大于数组长度的情况
    
    if (positions === 0) {
      return this.clone(arr);
    }
    
    return [...arr.slice(positions), ...arr.slice(0, positions)];
  },
  
  /**
   * 将数组中的元素向左旋转指定位置（修改原数组）
   * @param {Array} arr - 要旋转的数组
   * @param {number} positions - 旋转位置数，正数表示向左旋转，负数表示向右旋转
   * @returns {Array} 旋转后的数组，如果不是数组则返回空数组
   */
  rotateInPlace: function(arr, positions) {
    if (!this.isArray(arr) || arr.length <= 1) {
      return this.isArray(arr) ? arr : [];
    }
    
    const len = arr.length;
    positions = ((positions % len) + len) % len; // 处理负数和大于数组长度的情况
    
    if (positions === 0) {
      return arr;
    }
    
    // 使用三次反转法实现旋转
    this.reverseInPlace(arr, 0, positions - 1);
    this.reverseInPlace(arr, positions, len - 1);
    this.reverseInPlace(arr, 0, len - 1);
    
    return arr;
  },
  
  /**
   * 反转数组的指定部分（修改原数组）
   * @param {Array} arr - 要反转的数组
   * @param {number} start - 开始索引
   * @param {number} end - 结束索引
   * @returns {Array} 反转后的数组，如果不是数组则返回空数组
   */
  reverseInPlace: function(arr, start, end) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    start = Math.max(0, start);
    end = Math.min(arr.length - 1, end);
    
    while (start < end) {
      [arr[start], arr[end]] = [arr[end], arr[start]];
      start++;
      end--;
    }
    
    return arr;
  },
  
  /**
   * 将数组中的元素交换位置（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {number} i - 第一个元素的索引
   * @param {number} j - 第二个元素的索引
   * @returns {Array} 交换后的数组，如果不是数组则返回空数组
   */
  swap: function(arr, i, j) {
    if (!this.isArray(arr) || i < 0 || j < 0 || i >= arr.length || j >= arr.length) {
      return this.isArray(arr) ? arr : [];
    }
    
    [arr[i], arr[j]] = [arr[j], arr[i]];
    return arr;
  },
  
  /**
   * 将数组中的元素移动到指定位置（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {number} fromIndex - 要移动的元素的索引
   * @param {number} toIndex - 目标位置的索引
   * @returns {Array} 移动后的数组，如果不是数组则返回空数组
   */
  move: function(arr, fromIndex, toIndex) {
    if (!this.isArray(arr) || fromIndex < 0 || toIndex < 0 || fromIndex >= arr.length || toIndex >= arr.length) {
      return this.isArray(arr) ? arr : [];
    }
    
    if (fromIndex === toIndex) {
      return arr;
    }
    
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    
    return arr;
  },
  
  /**
   * 将数组中的元素向上移动一位（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {number} index - 要移动的元素的索引
   * @returns {Array} 移动后的数组，如果不是数组则返回空数组
   */
  moveUp: function(arr, index) {
    if (index <= 0) {
      return this.isArray(arr) ? arr : [];
    }
    
    return this.move(arr, index, index - 1);
  },
  
  /**
   * 将数组中的元素向下移动一位（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {number} index - 要移动的元素的索引
   * @returns {Array} 移动后的数组，如果不是数组则返回空数组
   */
  moveDown: function(arr, index) {
    if (!this.isArray(arr) || index < 0 || index >= arr.length - 1) {
      return this.isArray(arr) ? arr : [];
    }
    
    return this.move(arr, index, index + 1);
  },
  
  /**
   * 将数组中的元素移动到数组的开头（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {number} index - 要移动的元素的索引
   * @returns {Array} 移动后的数组，如果不是数组则返回空数组
   */
  moveToStart: function(arr, index) {
    if (!this.isArray(arr) || index < 0 || index >= arr.length) {
      return this.isArray(arr) ? arr : [];
    }
    
    return this.move(arr, index, 0);
  },
  
  /**
   * 将数组中的元素移动到数组的末尾（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {number} index - 要移动的元素的索引
   * @returns {Array} 移动后的数组，如果不是数组则返回空数组
   */
  moveToEnd: function(arr, index) {
    if (!this.isArray(arr) || index < 0 || index >= arr.length) {
      return this.isArray(arr) ? arr : [];
    }
    
    return this.move(arr, index, arr.length - 1);
  },
  
  /**
   * 将数组中的元素插入到指定位置（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {number} index - 插入位置的索引
   * @param {...*} items - 要插入的元素
   * @returns {Array} 插入后的数组，如果不是数组则返回空数组
   */
  insert: function(arr, index, ...items) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    index = Math.min(Math.max(0, index), arr.length);
    arr.splice(index, 0, ...items);
    
    return arr;
  },
  
  /**
   * 将数组中的元素替换为新元素（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {number} index - 替换位置的索引
   * @param {*} item - 新元素
   * @returns {Array} 替换后的数组，如果不是数组则返回空数组
   */
  replace: function(arr, index, item) {
    if (!this.isArray(arr) || index < 0 || index >= arr.length) {
      return this.isArray(arr) ? arr : [];
    }
    
    arr[index] = item;
    return arr;
  },
  
  /**
   * 将数组中满足条件的元素替换为新值（不修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {Function} predicate - 条件函数，返回true表示替换元素
   * @param {*} newValue - 新值
   * @returns {Array} 替换后的新数组，如果不是数组则返回空数组
   */
  replaceIf: function(arr, predicate, newValue) {
    if (!this.isArray(arr) || typeof predicate !== 'function') {
      return this.isArray(arr) ? this.clone(arr) : [];
    }
    
    return arr.map(item => predicate(item) ? newValue : item);
  },
  
  /**
   * 将数组中满足条件的元素替换为新值（修改原数组）
   * @param {Array} arr - 要操作的数组
   * @param {Function} predicate - 条件函数，返回true表示替换元素
   * @param {*} newValue - 新值
   * @returns {Array} 替换后的数组，如果不是数组则返回空数组
   */
  replaceIfInPlace: function(arr, predicate, newValue) {
    if (!this.isArray(arr) || typeof predicate !== 'function') {
      return this.isArray(arr) ? arr : [];
    }
    
    for (let i = 0; i < arr.length; i++) {
      if (predicate(arr[i], i, arr)) {
        arr[i] = newValue;
      }
    }
    
    return arr;
  },
  
  /**
   * 将数组中的元素分类为满足条件和不满足条件的两组
   * @param {Array} arr - 要分类的数组
   * @param {Function} predicate - 条件函数，返回true表示元素满足条件
   * @returns {Array} 包含两个数组的数组，第一个数组包含满足条件的元素，第二个数组包含不满足条件的元素
   */
  partition: function(arr, predicate) {
    if (!this.isArray(arr) || typeof predicate !== 'function') {
      return [[], []];
    }
    
    const pass = [];
    const fail = [];
    
    arr.forEach(item => {
      if (predicate(item)) {
        pass.push(item);
      } else {
        fail.push(item);
      }
    });
    
    return [pass, fail];
  },
  
  /**
   * 将数组中的元素按照指定大小分割成多个数组
   * @param {Array} arr - 要分割的数组
   * @param {number} size - 每个数组的大小
   * @returns {Array} 分割后的数组，如果不是数组则返回空数组
   */
  split: function(arr, size) {
    return this.chunk(arr, size);
  },
  
  /**
   * 获取数组中的最大值
   * @param {Array} arr - 要操作的数组
   * @param {Function} [compareFn] - 比较函数
   * @returns {*} 最大值，如果数组为空则返回undefined
   */
  max: function(arr, compareFn) {
    if (!this.isArray(arr) || arr.length === 0) {
      return undefined;
    }
    
    if (compareFn) {
      return arr.reduce((max, current) => {
        return compareFn(max, current) >= 0 ? max : current;
      });
    } else {
      return Math.max(...arr);
    }
  },
  
  /**
   * 获取数组中的最小值
   * @param {Array} arr - 要操作的数组
   * @param {Function} [compareFn] - 比较函数
   * @returns {*} 最小值，如果数组为空则返回undefined
   */
  min: function(arr, compareFn) {
    if (!this.isArray(arr) || arr.length === 0) {
      return undefined;
    }
    
    if (compareFn) {
      return arr.reduce((min, current) => {
        return compareFn(min, current) <= 0 ? min : current;
      });
    } else {
      return Math.min(...arr);
    }
  },
  
  /**
   * 计算数组中所有数字的总和
   * @param {Array} arr - 要计算的数组
   * @returns {number} 总和，如果数组为空则返回0
   */
  sum: function(arr) {
    if (!this.isArray(arr) || arr.length === 0) {
      return 0;
    }
    
    return arr.reduce((sum, value) => sum + (typeof value === 'number' ? value : 0), 0);
  },
  
  /**
   * 计算数组中所有数字的平均值
   * @param {Array} arr - 要计算的数组
   * @returns {number} 平均值，如果数组为空则返回0
   */
  average: function(arr) {
    if (!this.isArray(arr) || arr.length === 0) {
      return 0;
    }
    
    const numbers = arr.filter(value => typeof value === 'number');
    if (numbers.length === 0) {
      return 0;
    }
    
    return this.sum(numbers) / numbers.length;
  },
  
  /**
   * 计算数组中所有数字的乘积
   * @param {Array} arr - 要计算的数组
   * @returns {number} 乘积，如果数组为空则返回1
   */
  product: function(arr) {
    if (!this.isArray(arr) || arr.length === 0) {
      return 1;
    }
    
    return arr.reduce((product, value) => product * (typeof value === 'number' ? value : 1), 1);
  },
  
  /**
   * 计算数组中所有数字的中位数
   * @param {Array} arr - 要计算的数组
   * @returns {number} 中位数，如果数组为空则返回0
   */
  median: function(arr) {
    if (!this.isArray(arr) || arr.length === 0) {
      return 0;
    }
    
    const numbers = arr.filter(value => typeof value === 'number').sort((a, b) => a - b);
    if (numbers.length === 0) {
      return 0;
    }
    
    const mid = Math.floor(numbers.length / 2);
    return numbers.length % 2 === 0 ? (numbers[mid - 1] + numbers[mid]) / 2 : numbers[mid];
  },
  
  /**
   * 计算数组中出现次数最多的元素（众数）
   * @param {Array} arr - 要计算的数组
   * @returns {*} 众数，如果有多个众数则返回第一个，如果数组为空则返回undefined
   */
  mode: function(arr) {
    if (!this.isArray(arr) || arr.length === 0) {
      return undefined;
    }
    
    const counts = this.countOccurrences(arr);
    let maxCount = 0;
    let mode;
    
    for (const value in counts) {
      if (counts[value] > maxCount) {
        maxCount = counts[value];
        mode = value;
      }
    }
    
    // 将字符串转换回原始类型（如果可能）
    return mode === undefined ? undefined : this.parseValue(mode);
  },
  
  /**
   * 尝试将字符串解析为原始值
   * @private
   * @param {string} value - 要解析的字符串
   * @returns {*} 解析后的值
   */
  parseValue: function(value) {
    if (value === 'undefined') return undefined;
    if (value === 'null') return null;
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (!isNaN(value)) return Number(value);
    return value;
  },
  
  /**
   * 计算数组中所有数字的方差
   * @param {Array} arr - 要计算的数组
   * @returns {number} 方差，如果数组为空则返回0
   */
  variance: function(arr) {
    if (!this.isArray(arr) || arr.length === 0) {
      return 0;
    }
    
    const numbers = arr.filter(value => typeof value === 'number');
    if (numbers.length === 0) {
      return 0;
    }
    
    const avg = this.average(numbers);
    return this.sum(numbers.map(num => Math.pow(num - avg, 2))) / numbers.length;
  },
  
  /**
   * 计算数组中所有数字的标准差
   * @param {Array} arr - 要计算的数组
   * @returns {number} 标准差，如果数组为空则返回0
   */
  stdDev: function(arr) {
    return Math.sqrt(this.variance(arr));
  },
  
  /**
   * 计算数组中所有数字的百分位数
   * @param {Array} arr - 要计算的数组
   * @param {number} percentile - 百分位数（0-100）
   * @returns {number} 百分位数值，如果数组为空则返回0
   */
  percentile: function(arr, percentile) {
    if (!this.isArray(arr) || arr.length === 0 || percentile < 0 || percentile > 100) {
      return 0;
    }
    
    const numbers = arr.filter(value => typeof value === 'number').sort((a, b) => a - b);
    if (numbers.length === 0) {
      return 0;
    }
    
    if (percentile === 0) {
      return numbers[0];
    }
    
    if (percentile === 100) {
      return numbers[numbers.length - 1];
    }
    
    const index = (percentile / 100) * (numbers.length - 1);
    const floor = Math.floor(index);
    const ceil = Math.ceil(index);
    
    if (floor === ceil) {
      return numbers[floor];
    }
    
    return numbers[floor] + (index - floor) * (numbers[ceil] - numbers[floor]);
  },
  
  /**
   * 计算数组中所有数字的四分位数范围（IQR）
   * @param {Array} arr - 要计算的数组
   * @returns {number} 四分位数范围，如果数组为空则返回0
   */
  iqr: function(arr) {
    if (!this.isArray(arr) || arr.length === 0) {
      return 0;
    }
    
    const q1 = this.percentile(arr, 25);
    const q3 = this.percentile(arr, 75);
    
    return q3 - q1;
  },
  
  /**
   * 检测数组中的异常值（使用IQR方法）
   * @param {Array} arr - 要检测的数组
   * @param {number} [k=1.5] - IQR的倍数，默认为1.5
   * @returns {Array} 异常值数组，如果不是数组则返回空数组
   */
  outliers: function(arr, k = 1.5) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    const numbers = arr.filter(value => typeof value === 'number');
    if (numbers.length === 0) {
      return [];
    }
    
    const q1 = this.percentile(numbers, 25);
    const q3 = this.percentile(numbers, 75);
    const iqr = q3 - q1;
    
    const lowerBound = q1 - k * iqr;
    const upperBound = q3 + k * iqr;
    
    return numbers.filter(num => num < lowerBound || num > upperBound);
  },
  
  /**
   * 计算数组中所有数字的累积和
   * @param {Array} arr - 要计算的数组
   * @returns {Array} 累积和数组，如果不是数组则返回空数组
   */
  cumulativeSum: function(arr) {
    if (!this.isArray(arr)) {
      return [];
    }
    
    const numbers = arr.filter(value => typeof value === 'number');
    if (numbers.length === 0) {
      return [];
    }
    
    const result = [];
    let sum = 0;
    
    for (const num of numbers) {
      sum += num;
      result.push(sum);
    }
    
    return result;
  },
  
  /**
   * 计算数组中所有数字的移动平均值
   * @param {Array} arr - 要计算的数组
   * @param {number} windowSize - 窗口大小
   * @returns {Array} 移动平均值数组，如果不是数组则返回空数组
   */
  movingAverage: function(arr, windowSize) {
    if (!this.isArray(arr) || windowSize <= 0) {
      return [];
    }
    
    const numbers = arr.filter(value => typeof value === 'number');
    if (numbers.length === 0 || windowSize > numbers.length) {
      return [];
    }
    
    const result = [];
    let sum = 0;
    
    // 计算第一个窗口的和
    for (let i = 0; i < windowSize; i++) {
      sum += numbers[i];
    }
    
    result.push(sum / windowSize);
    
    // 计算后续窗口的移动平均值
    for (let i = windowSize; i < numbers.length; i++) {
      sum = sum - numbers[i - windowSize] + numbers[i];
      result.push(sum / windowSize);
    }
    
    return result;
  },
  
  /**
   * 计算数组中所有数字的指数移动平均值
   * @param {Array} arr - 要计算的数组
   * @param {number} alpha - 平滑因子（0-1之间）
   * @returns {Array} 指数移动平均值数组，如果不是数组则返回空数组
   */
  exponentialMovingAverage: function(arr, alpha) {
    if (!this.isArray(arr) || alpha < 0 || alpha > 1) {
      return [];
    }
    
    const numbers = arr.filter(value => typeof value === 'number');
    if (numbers.length === 0) {
      return [];
    }
    
    const result = [numbers[0]];
    let ema = numbers[0];
    
    for (let i = 1; i < numbers.length; i++) {
      ema = alpha * numbers[i] + (1 - alpha) * ema;
      result.push(ema);
    }
    
    return result;
  }
};

module.exports = arrayUtils;