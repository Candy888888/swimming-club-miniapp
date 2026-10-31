// object.js - 对象工具

/**
 * 对象工具
 * 用于处理对象相关的操作，包括对象的合并、克隆、比较等功能
 */
const objectUtils = {
  /**
   * 检查值是否为对象
   * @param {*} obj - 要检查的值
   * @returns {boolean} 如果是对象则返回true，否则返回false
   */
  isObject: function(obj) {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
  },
  
  /**
   * 检查对象是否为空
   * @param {Object} obj - 要检查的对象
   * @returns {boolean} 如果对象为null、undefined或没有自身可枚举属性，则返回true
   */
  isEmpty: function(obj) {
    if (obj === null || obj === undefined) {
      return true;
    }
    
    if (!this.isObject(obj)) {
      return false;
    }
    
    return Object.keys(obj).length === 0;
  },
  
  /**
   * 检查对象是否不为空
   * @param {Object} obj - 要检查的对象
   * @returns {boolean} 如果对象不为null、undefined且有自身可枚举属性，则返回true
   */
  isNotEmpty: function(obj) {
    return !this.isEmpty(obj);
  },
  
  /**
   * 获取对象的所有键
   * @param {Object} obj - 要获取键的对象
   * @returns {Array} 包含所有键的数组，如果不是对象则返回空数组
   */
  keys: function(obj) {
    if (!this.isObject(obj)) {
      return [];
    }
    
    return Object.keys(obj);
  },
  
  /**
   * 获取对象的所有值
   * @param {Object} obj - 要获取值的对象
   * @returns {Array} 包含所有值的数组，如果不是对象则返回空数组
   */
  values: function(obj) {
    if (!this.isObject(obj)) {
      return [];
    }
    
    return Object.values(obj);
  },
  
  /**
   * 获取对象的所有键值对
   * @param {Object} obj - 要获取键值对的对象
   * @returns {Array} 包含所有键值对的数组，如果不是对象则返回空数组
   */
  entries: function(obj) {
    if (!this.isObject(obj)) {
      return [];
    }
    
    return Object.entries(obj);
  },
  
  /**
   * 浅拷贝对象
   * @param {Object} obj - 要拷贝的对象
   * @returns {Object} 拷贝后的新对象，如果不是对象则返回空对象
   */
  clone: function(obj) {
    if (!this.isObject(obj)) {
      return {};
    }
    
    return { ...obj };
  },
  
  /**
   * 深拷贝对象
   * @param {Object} obj - 要拷贝的对象
   * @returns {Object} 拷贝后的新对象，如果不是对象则返回空对象
   */
  deepClone: function(obj) {
    if (!this.isObject(obj)) {
      return {};
    }
    
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      // 如果对象包含循环引用或其他无法序列化的值，则使用递归方法
      const clone = {};
      
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (this.isObject(obj[key])) {
            clone[key] = this.deepClone(obj[key]);
          } else if (Array.isArray(obj[key])) {
            clone[key] = obj[key].map(item => {
              return this.isObject(item) ? this.deepClone(item) : item;
            });
          } else {
            clone[key] = obj[key];
          }
        }
      }
      
      return clone;
    }
  },
  
  /**
   * 浅合并多个对象
   * @param {...Object} objects - 要合并的对象
   * @returns {Object} 合并后的新对象
   */
  merge: function(...objects) {
    return Object.assign({}, ...objects.filter(obj => this.isObject(obj)));
  },
  
  /**
   * 深合并多个对象
   * @param {...Object} objects - 要合并的对象
   * @returns {Object} 合并后的新对象
   */
  deepMerge: function(...objects) {
    const validObjects = objects.filter(obj => this.isObject(obj));
    if (validObjects.length === 0) {
      return {};
    }
    
    const result = {};
    
    validObjects.forEach(obj => {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (this.isObject(obj[key])) {
            if (this.isObject(result[key])) {
              result[key] = this.deepMerge(result[key], obj[key]);
            } else {
              result[key] = this.deepClone(obj[key]);
            }
          } else if (Array.isArray(obj[key])) {
            if (Array.isArray(result[key])) {
              result[key] = [...result[key], ...obj[key]];
            } else {
              result[key] = [...obj[key]];
            }
          } else {
            result[key] = obj[key];
          }
        }
      }
    });
    
    return result;
  },
  
  /**
   * 比较两个对象是否相等（浅比较）
   * @param {Object} obj1 - 第一个对象
   * @param {Object} obj2 - 第二个对象
   * @returns {boolean} 如果两个对象相等则返回true，否则返回false
   */
  isEqual: function(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    }
    
    if (!this.isObject(obj1) || !this.isObject(obj2)) {
      return false;
    }
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) {
      return false;
    }
    
    return keys1.every(key => {
      return keys2.includes(key) && obj1[key] === obj2[key];
    });
  },
  
  /**
   * 比较两个对象是否相等（深比较）
   * @param {Object} obj1 - 第一个对象
   * @param {Object} obj2 - 第二个对象
   * @returns {boolean} 如果两个对象相等则返回true，否则返回false
   */
  isDeepEqual: function(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    }
    
    if (!this.isObject(obj1) || !this.isObject(obj2)) {
      return false;
    }
    
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    
    if (keys1.length !== keys2.length) {
      return false;
    }
    
    return keys1.every(key => {
      if (!keys2.includes(key)) {
        return false;
      }
      
      const val1 = obj1[key];
      const val2 = obj2[key];
      
      if (this.isObject(val1) && this.isObject(val2)) {
        return this.isDeepEqual(val1, val2);
      }
      
      if (Array.isArray(val1) && Array.isArray(val2)) {
        if (val1.length !== val2.length) {
          return false;
        }
        
        for (let i = 0; i < val1.length; i++) {
          if (this.isObject(val1[i]) && this.isObject(val2[i])) {
            if (!this.isDeepEqual(val1[i], val2[i])) {
              return false;
            }
          } else if (val1[i] !== val2[i]) {
            return false;
          }
        }
        
        return true;
      }
      
      return val1 === val2;
    });
  },
  
  /**
   * 获取对象的指定属性
   * @param {Object} obj - 要获取属性的对象
   * @param {string} path - 属性路径，使用点号分隔，如'a.b.c'
   * @param {*} [defaultValue] - 如果属性不存在，则返回的默认值
   * @returns {*} 属性值或默认值
   */
  get: function(obj, path, defaultValue) {
    if (!this.isObject(obj) || typeof path !== 'string') {
      return defaultValue;
    }
    
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined || !Object.prototype.hasOwnProperty.call(result, key)) {
        return defaultValue;
      }
      
      result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
  },
  
  /**
   * 设置对象的指定属性
   * @param {Object} obj - 要设置属性的对象
   * @param {string} path - 属性路径，使用点号分隔，如'a.b.c'
   * @param {*} value - 要设置的值
   * @returns {Object} 设置后的对象
   */
  set: function(obj, path, value) {
    if (!this.isObject(obj) || typeof path !== 'string') {
      return obj;
    }
    
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      
      if (!Object.prototype.hasOwnProperty.call(current, key) || current[key] === null) {
        current[key] = {};
      } else if (!this.isObject(current[key])) {
        current[key] = {};
      }
      
      current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return obj;
  },
  
  /**
   * 删除对象的指定属性
   * @param {Object} obj - 要删除属性的对象
   * @param {string} path - 属性路径，使用点号分隔，如'a.b.c'
   * @returns {Object} 删除后的对象
   */
  unset: function(obj, path) {
    if (!this.isObject(obj) || typeof path !== 'string') {
      return obj;
    }
    
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      
      if (!Object.prototype.hasOwnProperty.call(current, key) || !this.isObject(current[key])) {
        return obj;
      }
      
      current = current[key];
    }
    
    const lastKey = keys[keys.length - 1];
    if (Object.prototype.hasOwnProperty.call(current, lastKey)) {
      delete current[lastKey];
    }
    
    return obj;
  },
  
  /**
   * 检查对象是否包含指定属性
   * @param {Object} obj - 要检查的对象
   * @param {string} path - 属性路径，使用点号分隔，如'a.b.c'
   * @returns {boolean} 如果对象包含指定属性则返回true，否则返回false
   */
  has: function(obj, path) {
    if (!this.isObject(obj) || typeof path !== 'string') {
      return false;
    }
    
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(current, key)) {
        return false;
      }
      
      current = current[key];
    }
    
    return true;
  },
  
  /**
   * 选择对象的指定属性
   * @param {Object} obj - 要选择属性的对象
   * @param {Array} keys - 要选择的属性名数组
   * @returns {Object} 包含选择属性的新对象
   */
  pick: function(obj, keys) {
    if (!this.isObject(obj) || !Array.isArray(keys)) {
      return {};
    }
    
    return keys.reduce((result, key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = obj[key];
      }
      return result;
    }, {});
  },
  
  /**
   * 排除对象的指定属性
   * @param {Object} obj - 要排除属性的对象
   * @param {Array} keys - 要排除的属性名数组
   * @returns {Object} 不包含排除属性的新对象
   */
  omit: function(obj, keys) {
    if (!this.isObject(obj)) {
      return {};
    }
    
    if (!Array.isArray(keys)) {
      return this.clone(obj);
    }
    
    const result = this.clone(obj);
    keys.forEach(key => {
      delete result[key];
    });
    
    return result;
  },
  
  /**
   * 将对象转换为查询字符串
   * @param {Object} obj - 要转换的对象
   * @returns {string} 查询字符串
   */
  toQueryString: function(obj) {
    if (!this.isObject(obj)) {
      return '';
    }
    
    return Object.entries(obj)
      .filter(([_, value]) => value !== null && value !== undefined)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(item => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`).join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');
  },
  
  /**
   * 将查询字符串转换为对象
   * @param {string} queryString - 要转换的查询字符串
   * @returns {Object} 转换后的对象
   */
  fromQueryString: function(queryString) {
    if (typeof queryString !== 'string') {
      return {};
    }
    
    if (queryString.startsWith('?')) {
      queryString = queryString.substring(1);
    }
    
    if (!queryString) {
      return {};
    }
    
    return queryString.split('&').reduce((result, part) => {
      const [key, value] = part.split('=').map(decodeURIComponent);
      
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        if (Array.isArray(result[key])) {
          result[key].push(value);
        } else {
          result[key] = [result[key], value];
        }
      } else {
        result[key] = value;
      }
      
      return result;
    }, {});
  },
  
  /**
   * 将对象转换为JSON字符串
   * @param {Object} obj - 要转换的对象
   * @param {number|string} [space] - 缩进空格数或字符串
   * @returns {string} JSON字符串，如果转换失败则返回空字符串
   */
  toJson: function(obj, space) {
    if (!this.isObject(obj)) {
      return '{}';
    }
    
    try {
      return JSON.stringify(obj, null, space);
    } catch (e) {
      return '{}';
    }
  },
  
  /**
   * 将JSON字符串转换为对象
   * @param {string} json - 要转换的JSON字符串
   * @returns {Object} 转换后的对象，如果转换失败则返回空对象
   */
  fromJson: function(json) {
    if (typeof json !== 'string') {
      return {};
    }
    
    try {
      return JSON.parse(json);
    } catch (e) {
      return {};
    }
  },
  
  /**
   * 过滤对象的属性
   * @param {Object} obj - 要过滤的对象
   * @param {Function} predicate - 过滤函数，返回true表示保留属性
   * @returns {Object} 过滤后的新对象
   */
  filter: function(obj, predicate) {
    if (!this.isObject(obj) || typeof predicate !== 'function') {
      return {};
    }
    
    return Object.entries(obj).reduce((result, [key, value]) => {
      if (predicate(value, key, obj)) {
        result[key] = value;
      }
      return result;
    }, {});
  },
  
  /**
   * 映射对象的属性
   * @param {Object} obj - 要映射的对象
   * @param {Function} mapper - 映射函数，接收值和键作为参数，返回新值
   * @returns {Object} 映射后的新对象
   */
  map: function(obj, mapper) {
    if (!this.isObject(obj) || typeof mapper !== 'function') {
      return {};
    }
    
    return Object.entries(obj).reduce((result, [key, value]) => {
      result[key] = mapper(value, key, obj);
      return result;
    }, {});
  },
  
  /**
   * 重命名对象的属性
   * @param {Object} obj - 要重命名属性的对象
   * @param {Object} keyMap - 键映射对象，键为原属性名，值为新属性名
   * @returns {Object} 重命名后的新对象
   */
  renameKeys: function(obj, keyMap) {
    if (!this.isObject(obj) || !this.isObject(keyMap)) {
      return this.isObject(obj) ? this.clone(obj) : {};
    }
    
    return Object.entries(obj).reduce((result, [key, value]) => {
      const newKey = Object.prototype.hasOwnProperty.call(keyMap, key) ? keyMap[key] : key;
      result[newKey] = value;
      return result;
    }, {});
  },
  
  /**
   * 将对象转换为数组
   * @param {Object} obj - 要转换的对象
   * @param {Function} [transformer] - 转换函数，接收值和键作为参数，返回数组元素
   * @returns {Array} 转换后的数组
   */
  toArray: function(obj, transformer) {
    if (!this.isObject(obj)) {
      return [];
    }
    
    if (typeof transformer === 'function') {
      return Object.entries(obj).map(([key, value]) => transformer(value, key, obj));
    } else {
      return Object.entries(obj).map(([key, value]) => ({ key, value }));
    }
  },
  
  /**
   * 将对象的值转换为指定类型
   * @param {Object} obj - 要转换的对象
   * @param {Object} schema - 类型模式，键为属性名，值为类型转换函数
   * @returns {Object} 转换后的新对象
   */
  cast: function(obj, schema) {
    if (!this.isObject(obj) || !this.isObject(schema)) {
      return this.isObject(obj) ? this.clone(obj) : {};
    }
    
    const result = this.clone(obj);
    
    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key) && Object.prototype.hasOwnProperty.call(result, key)) {
        const converter = schema[key];
        if (typeof converter === 'function') {
          try {
            result[key] = converter(result[key]);
          } catch (e) {
            // 如果转换失败，保留原值
          }
        }
      }
    }
    
    return result;
  },
  
  /**
   * 验证对象是否符合指定的模式
   * @param {Object} obj - 要验证的对象
   * @param {Object} schema - 验证模式，键为属性名，值为验证函数
   * @returns {Object} 包含验证结果的对象，有errors和valid属性
   */
  validate: function(obj, schema) {
    if (!this.isObject(obj) || !this.isObject(schema)) {
      return { valid: false, errors: ['Invalid object or schema'] };
    }
    
    const errors = [];
    
    for (const key in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, key)) {
        const validator = schema[key];
        if (typeof validator === 'function') {
          const value = Object.prototype.hasOwnProperty.call(obj, key) ? obj[key] : undefined;
          const result = validator(value, key, obj);
          
          if (result !== true) {
            errors.push({
              key,
              message: typeof result === 'string' ? result : `Invalid value for ${key}`
            });
          }
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  },
  
  /**
   * 扁平化对象，将嵌套属性转换为点号分隔的属性
   * @param {Object} obj - 要扁平化的对象
   * @param {string} [prefix=''] - 属性前缀
   * @returns {Object} 扁平化后的新对象
   */
  flatten: function(obj, prefix = '') {
    if (!this.isObject(obj)) {
      return {};
    }
    
    return Object.entries(obj).reduce((result, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (this.isObject(value)) {
        Object.assign(result, this.flatten(value, newKey));
      } else {
        result[newKey] = value;
      }
      
      return result;
    }, {});
  },
  
  /**
   * 将扁平化的对象转换为嵌套对象
   * @param {Object} obj - 要转换的扁平化对象
   * @returns {Object} 嵌套后的新对象
   */
  unflatten: function(obj) {
    if (!this.isObject(obj)) {
      return {};
    }
    
    const result = {};
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        this.set(result, key, obj[key]);
      }
    }
    
    return result;
  },
  
  /**
   * 获取对象的大小（属性数量）
   * @param {Object} obj - 要获取大小的对象
   * @returns {number} 对象的大小
   */
  size: function(obj) {
    if (!this.isObject(obj)) {
      return 0;
    }
    
    return Object.keys(obj).length;
  },
  
  /**
   * 检查对象是否包含指定的值
   * @param {Object} obj - 要检查的对象
   * @param {*} value - 要查找的值
   * @returns {boolean} 如果对象包含指定值则返回true，否则返回false
   */
  containsValue: function(obj, value) {
    if (!this.isObject(obj)) {
      return false;
    }
    
    return Object.values(obj).includes(value);
  },
  
  /**
   * 检查对象是否包含指定的键
   * @param {Object} obj - 要检查的对象
   * @param {string} key - 要查找的键
   * @returns {boolean} 如果对象包含指定键则返回true，否则返回false
   */
  containsKey: function(obj, key) {
    if (!this.isObject(obj) || typeof key !== 'string') {
      return false;
    }
    
    return Object.prototype.hasOwnProperty.call(obj, key);
  },
  
  /**
   * 反转对象的键和值
   * @param {Object} obj - 要反转的对象
   * @returns {Object} 反转后的新对象
   */
  invert: function(obj) {
    if (!this.isObject(obj)) {
      return {};
    }
    
    return Object.entries(obj).reduce((result, [key, value]) => {
      if (value !== null && value !== undefined) {
        result[value] = key;
      }
      return result;
    }, {});
  },
  
  /**
   * 创建一个新对象，其属性和值来自两个数组
   * @param {Array} keys - 键数组
   * @param {Array} values - 值数组
   * @returns {Object} 创建的新对象
   */
  zipObject: function(keys, values) {
    if (!Array.isArray(keys)) {
      return {};
    }
    
    const result = {};
    
    keys.forEach((key, index) => {
      if (typeof key === 'string' || typeof key === 'number' || typeof key === 'symbol') {
        result[key] = Array.isArray(values) && index < values.length ? values[index] : undefined;
      }
    });
    
    return result;
  },
  
  /**
   * 对象的默认值处理
   * @param {Object} obj - 要处理的对象
   * @param {Object} defaults - 默认值对象
   * @returns {Object} 处理后的新对象
   */
  defaults: function(obj, defaults) {
    if (!this.isObject(defaults)) {
      return this.isObject(obj) ? this.clone(obj) : {};
    }
    
    if (!this.isObject(obj)) {
      return this.clone(defaults);
    }
    
    const result = this.clone(obj);
    
    for (const key in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, key) && !Object.prototype.hasOwnProperty.call(result, key)) {
        result[key] = defaults[key];
      }
    }
    
    return result;
  },
  
  /**
   * 对象的深度默认值处理
   * @param {Object} obj - 要处理的对象
   * @param {Object} defaults - 默认值对象
   * @returns {Object} 处理后的新对象
   */
  defaultsDeep: function(obj, defaults) {
    if (!this.isObject(defaults)) {
      return this.isObject(obj) ? this.clone(obj) : {};
    }
    
    if (!this.isObject(obj)) {
      return this.deepClone(defaults);
    }
    
    const result = this.deepClone(obj);
    
    for (const key in defaults) {
      if (Object.prototype.hasOwnProperty.call(defaults, key)) {
        if (!Object.prototype.hasOwnProperty.call(result, key)) {
          result[key] = defaults[key];
        } else if (this.isObject(defaults[key]) && this.isObject(result[key])) {
          result[key] = this.defaultsDeep(result[key], defaults[key]);
        }
      }
    }
    
    return result;
  },
  
  /**
   * 创建一个函数，该函数返回指定对象属性的值
   * @param {string} path - 属性路径，使用点号分隔，如'a.b.c'
   * @returns {Function} 返回属性值的函数
   */
  property: function(path) {
    return obj => this.get(obj, path);
  },
  
  /**
   * 对象的安全访问，避免出现"Cannot read property of undefined"错误
   * @param {Function} fn - 访问对象的函数
   * @param {*} [defaultValue] - 如果访问失败，则返回的默认值
   * @returns {*} 访问结果或默认值
   */
  safeAccess: function(fn, defaultValue) {
    try {
      const result = fn();
      return result !== undefined ? result : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  },
  
  /**
   * 将对象转换为FormData对象
   * @param {Object} obj - 要转换的对象
   * @returns {FormData} 转换后的FormData对象
   */
  toFormData: function(obj) {
    if (!this.isObject(obj)) {
      return new FormData();
    }
    
    const formData = new FormData();
    
    const appendValue = (key, value) => {
      if (value === null || value === undefined) {
        return;
      }
      
      if (Array.isArray(value)) {
        value.forEach(item => appendValue(`${key}[]`, item));
      } else if (this.isObject(value) && !(value instanceof File || value instanceof Blob)) {
        for (const subKey in value) {
          if (Object.prototype.hasOwnProperty.call(value, subKey)) {
            appendValue(`${key}[${subKey}]`, value[subKey]);
          }
        }
      } else {
        formData.append(key, value);
      }
    };
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        appendValue(key, obj[key]);
      }
    }
    
    return formData;
  },
  
  /**
   * 从对象中提取指定路径的值
   * @param {Object} obj - 要提取值的对象
   * @param {Array} paths - 路径数组，每个路径可以是字符串或数组
   * @returns {Array} 提取的值数组
   */
  at: function(obj, paths) {
    if (!this.isObject(obj) || !Array.isArray(paths)) {
      return [];
    }
    
    return paths.map(path => {
      if (Array.isArray(path)) {
        path = path.join('.');
      }
      return this.get(obj, path);
    });
  },
  
  /**
   * 创建一个新对象，其中的键是原对象的值，值是原对象的键
   * @param {Object} obj - 要转换的对象
   * @returns {Object} 转换后的新对象
   */
  invertBy: function(obj) {
    if (!this.isObject(obj)) {
      return {};
    }
    
    return Object.entries(obj).reduce((result, [key, value]) => {
      if (value !== null && value !== undefined) {
        if (!Object.prototype.hasOwnProperty.call(result, value)) {
          result[value] = [];
        }
        result[value].push(key);
      }
      return result;
    }, {});
  },
  
  /**
   * 根据条件创建一个对象
   * @param {Array} pairs - 键值对数组，每个元素是[condition, key, value]形式
   * @returns {Object} 创建的新对象
   */
  conforms: function(pairs) {
    if (!Array.isArray(pairs)) {
      return {};
    }
    
    return pairs.reduce((result, pair) => {
      if (Array.isArray(pair) && pair.length >= 3) {
        const [condition, key, value] = pair;
        if (condition && typeof key === 'string') {
          result[key] = value;
        }
      }
      return result;
    }, {});
  },
  
  /**
   * 检查对象是否为空对象（没有自身可枚举属性）
   * @param {*} value - 要检查的值
   * @returns {boolean} 如果是空对象则返回true，否则返回false
   */
  isEmptyObject: function(value) {
    return this.isObject(value) && Object.keys(value).length === 0;
  },
  
  /**
   * 检查值是否为普通对象（不是数组、函数、正则表达式等）
   * @param {*} value - 要检查的值
   * @returns {boolean} 如果是普通对象则返回true，否则返回false
   */
  isPlainObject: function(value) {
    if (!this.isObject(value)) {
      return false;
    }
    
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
  }
};

module.exports = objectUtils;