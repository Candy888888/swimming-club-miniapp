// function.js - 函数工具

/**
 * 函数工具
 * 用于处理函数相关的操作，包括函数的防抖、节流、柯里化、组合等功能
 */
const functionUtils = {
  /**
   * 防抖函数
   * 在指定时间内多次调用，只执行最后一次
   * @param {Function} fn - 要防抖的函数
   * @param {number} delay - 延迟时间，单位毫秒
   * @param {boolean} [immediate=false] - 是否立即执行，默认为false
   * @returns {Function} 防抖后的函数
   */
  debounce: function(fn, delay, immediate = false) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    let timer = null;
    let result;
    
    const debounced = function(...args) {
      const context = this;
      
      if (timer) {
        clearTimeout(timer);
      }
      
      if (immediate) {
        const callNow = !timer;
        timer = setTimeout(() => {
          timer = null;
        }, delay);
        
        if (callNow) {
          result = fn.apply(context, args);
        }
      } else {
        timer = setTimeout(() => {
          result = fn.apply(context, args);
        }, delay);
      }
      
      return result;
    };
    
    debounced.cancel = function() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
    
    return debounced;
  },
  
  /**
   * 节流函数
   * 在指定时间内多次调用，按时间间隔执行
   * @param {Function} fn - 要节流的函数
   * @param {number} delay - 延迟时间，单位毫秒
   * @param {Object} [options] - 配置选项
   * @param {boolean} [options.leading=true] - 是否在延迟开始前调用函数
   * @param {boolean} [options.trailing=true] - 是否在延迟结束后调用函数
   * @returns {Function} 节流后的函数
   */
  throttle: function(fn, delay, options = {}) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    const { leading = true, trailing = true } = options;
    let lastCallTime = 0;
    let timer = null;
    let result;
    
    const throttled = function(...args) {
      const context = this;
      const now = Date.now();
      
      if (!lastCallTime && !leading) {
        lastCallTime = now;
      }
      
      const remaining = delay - (now - lastCallTime);
      
      if (remaining <= 0 || remaining > delay) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        
        lastCallTime = now;
        result = fn.apply(context, args);
      } else if (!timer && trailing) {
        timer = setTimeout(() => {
          lastCallTime = leading ? Date.now() : 0;
          timer = null;
          result = fn.apply(context, args);
        }, remaining);
      }
      
      return result;
    };
    
    throttled.cancel = function() {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastCallTime = 0;
    };
    
    return throttled;
  },
  
  /**
   * 只执行一次的函数
   * @param {Function} fn - 要执行的函数
   * @returns {Function} 只执行一次的函数
   */
  once: function(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    let called = false;
    let result;
    
    return function(...args) {
      if (!called) {
        called = true;
        result = fn.apply(this, args);
      }
      
      return result;
    };
  },
  
  /**
   * 延迟执行函数
   * @param {Function} fn - 要延迟执行的函数
   * @param {number} delay - 延迟时间，单位毫秒
   * @param {...*} args - 传递给函数的参数
   * @returns {Promise} 返回一个Promise，在延迟结束后解析为函数的返回值
   */
  delay: function(fn, delay, ...args) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(fn(...args));
      }, delay);
    });
  },
  
  /**
   * 函数柯里化
   * @param {Function} fn - 要柯里化的函数
   * @param {number} [arity] - 函数参数的数量，默认为原函数的参数数量
   * @returns {Function} 柯里化后的函数
   */
  curry: function(fn, arity) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    arity = arity || fn.length;
    
    return function curried(...args) {
      if (args.length >= arity) {
        return fn.apply(this, args);
      } else {
        return function(...moreArgs) {
          return curried.apply(this, args.concat(moreArgs));
        };
      }
    };
  },
  
  /**
   * 偏函数应用
   * @param {Function} fn - 要应用的函数
   * @param {...*} partialArgs - 部分参数
   * @returns {Function} 偏函数
   */
  partial: function(fn, ...partialArgs) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    return function(...args) {
      const newArgs = partialArgs.slice(0);
      let argIndex = 0;
      
      for (let i = 0; i < newArgs.length; i++) {
        if (newArgs[i] === undefined) {
          newArgs[i] = args[argIndex++];
        }
      }
      
      return fn.apply(this, newArgs.concat(args.slice(argIndex)));
    };
  },
  
  /**
   * 函数组合
   * 从右到左组合多个函数，前一个函数的返回值作为后一个函数的参数
   * @param {...Function} fns - 要组合的函数
   * @returns {Function} 组合后的函数
   */
  compose: function(...fns) {
    if (fns.length === 0) {
      return arg => arg;
    }
    
    if (fns.length === 1) {
      return fns[0];
    }
    
    return fns.reduce((a, b) => (...args) => a(b(...args)));
  },
  
  /**
   * 函数管道
   * 从左到右组合多个函数，前一个函数的返回值作为后一个函数的参数
   * @param {...Function} fns - 要组合的函数
   * @returns {Function} 组合后的函数
   */
  pipe: function(...fns) {
    if (fns.length === 0) {
      return arg => arg;
    }
    
    if (fns.length === 1) {
      return fns[0];
    }
    
    return fns.reduce((a, b) => (...args) => b(a(...args)));
  },
  
  /**
   * 函数记忆化
   * 缓存函数的计算结果
   * @param {Function} fn - 要记忆化的函数
   * @param {Function} [resolver] - 缓存键的解析函数，默认使用第一个参数作为缓存键
   * @returns {Function} 记忆化后的函数
   */
  memoize: function(fn, resolver) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    const memoized = function(...args) {
      const key = resolver ? resolver.apply(this, args) : args[0];
      const cache = memoized.cache;
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = fn.apply(this, args);
      cache.set(key, result);
      return result;
    };
    
    memoized.cache = new Map();
    return memoized;
  },
  
  /**
   * 函数重试
   * 在函数执行失败时进行重试
   * @param {Function} fn - 要重试的函数
   * @param {Object} [options] - 配置选项
   * @param {number} [options.retries=3] - 最大重试次数
   * @param {number} [options.interval=0] - 重试间隔时间，单位毫秒
   * @param {Function} [options.onRetry] - 重试回调函数，接收当前重试次数和错误信息
   * @returns {Function} 可重试的函数
   */
  retry: function(fn, options = {}) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    const { retries = 3, interval = 0, onRetry } = options;
    
    return async function(...args) {
      let lastError;
      
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          return await fn.apply(this, args);
        } catch (error) {
          lastError = error;
          
          if (attempt < retries) {
            if (typeof onRetry === 'function') {
              onRetry(attempt, error);
            }
            
            if (interval > 0) {
              await new Promise(resolve => setTimeout(resolve, interval));
            }
          }
        }
      }
      
      throw lastError;
    };
  },
  
  /**
   * 函数超时
   * 在指定时间内如果函数没有完成，则抛出超时错误
   * @param {Function} fn - 要设置超时的函数
   * @param {number} timeout - 超时时间，单位毫秒
   * @param {string} [message='Function execution timed out'] - 超时错误消息
   * @returns {Function} 设置了超时的函数
   */
  timeout: function(fn, timeout, message = 'Function execution timed out') {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    return async function(...args) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(message));
        }, timeout);
        
        Promise.resolve(fn.apply(this, args))
          .then(result => {
            clearTimeout(timer);
            resolve(result);
          })
          .catch(error => {
            clearTimeout(timer);
            reject(error);
          });
      });
    };
  },
  
  /**
   * 函数节流和防抖的结合
   * 在指定时间内多次调用，立即执行第一次，然后按时间间隔执行，最后一次延迟执行
   * @param {Function} fn - 要处理的函数
   * @param {number} wait - 等待时间，单位毫秒
   * @returns {Function} 处理后的函数
   */
  throttleAndDebounce: function(fn, wait) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    let lastCallTime = 0;
    let timer = null;
    let result;
    
    return function(...args) {
      const context = this;
      const now = Date.now();
      const remaining = wait - (now - lastCallTime);
      
      if (remaining <= 0 || remaining > wait) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        
        lastCallTime = now;
        result = fn.apply(context, args);
      } else if (!timer) {
        timer = setTimeout(() => {
          lastCallTime = Date.now();
          timer = null;
          result = fn.apply(context, args);
        }, remaining);
      }
      
      return result;
    };
  },
  
  /**
   * 函数重载
   * 根据参数类型和数量执行不同的函数
   * @param {Object} cases - 函数重载的情况，键为参数类型描述，值为对应的函数
   * @returns {Function} 重载后的函数
   */
  overload: function(cases) {
    if (!cases || typeof cases !== 'object') {
      throw new TypeError('Expected an object of cases');
    }
    
    return function(...args) {
      const types = args.map(arg => {
        if (arg === null) return 'null';
        if (arg === undefined) return 'undefined';
        if (Array.isArray(arg)) return 'array';
        return typeof arg;
      }).join(',');
      
      const fn = cases[types] || cases['default'];
      
      if (typeof fn === 'function') {
        return fn.apply(this, args);
      }
      
      throw new Error(`No matching case for arguments: ${types}`);
    };
  },
  
  /**
   * 函数缓冲执行
   * 收集一段时间内的函数调用，然后一次性执行
   * @param {Function} fn - 要缓冲执行的函数
   * @param {number} delay - 延迟时间，单位毫秒
   * @returns {Function} 缓冲执行的函数
   */
  buffer: function(fn, delay) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    let timer = null;
    const buffer = [];
    
    const flush = function() {
      if (buffer.length > 0) {
        fn(buffer.slice(0));
        buffer.length = 0;
      }
    };
    
    const buffered = function(item) {
      buffer.push(item);
      
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          flush();
        }, delay);
      }
    };
    
    buffered.flush = flush;
    
    return buffered;
  },
  
  /**
   * 函数限流
   * 限制函数在指定时间内最多执行的次数
   * @param {Function} fn - 要限流的函数
   * @param {number} limit - 最大执行次数
   * @param {number} interval - 时间间隔，单位毫秒
   * @returns {Function} 限流后的函数
   */
  rateLimit: function(fn, limit, interval) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    const calls = [];
    let timer = null;
    
    const rateLimited = function(...args) {
      const now = Date.now();
      calls.push(now);
      
      while (calls.length > 0 && calls[0] < now - interval) {
        calls.shift();
      }
      
      if (calls.length <= limit) {
        return fn.apply(this, args);
      }
      
      return undefined;
    };
    
    rateLimited.reset = function() {
      calls.length = 0;
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
    
    return rateLimited;
  },
  
  /**
   * 函数队列执行
   * 按顺序执行多个函数
   * @param {...Function} fns - 要执行的函数
   * @returns {Function} 队列执行的函数
   */
  sequence: function(...fns) {
    return async function(...args) {
      let result = args;
      
      for (const fn of fns) {
        if (typeof fn === 'function') {
          result = [await fn.apply(this, result)];
        }
      }
      
      return result[0];
    };
  },
  
  /**
   * 函数并行执行
   * 同时执行多个函数，并收集它们的结果
   * @param {...Function} fns - 要执行的函数
   * @returns {Function} 并行执行的函数
   */
  parallel: function(...fns) {
    return async function(...args) {
      return Promise.all(fns.map(fn => {
        if (typeof fn === 'function') {
          return fn.apply(this, args);
        }
        return undefined;
      }));
    };
  },
  
  /**
   * 函数竞争执行
   * 同时执行多个函数，返回最先完成的结果
   * @param {...Function} fns - 要执行的函数
   * @returns {Function} 竞争执行的函数
   */
  race: function(...fns) {
    return async function(...args) {
      return Promise.race(fns.map(fn => {
        if (typeof fn === 'function') {
          return fn.apply(this, args);
        }
        return undefined;
      }));
    };
  },
  
  /**
   * 函数重试直到成功
   * @param {Function} fn - 要重试的函数
   * @param {Object} [options] - 配置选项
   * @param {number} [options.maxRetries=Infinity] - 最大重试次数
   * @param {number} [options.interval=0] - 重试间隔时间，单位毫秒
   * @param {Function} [options.shouldRetry] - 判断是否应该重试的函数，接收错误信息和当前重试次数
   * @returns {Function} 可重试的函数
   */
  retryUntilSuccess: function(fn, options = {}) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    const { maxRetries = Infinity, interval = 0, shouldRetry } = options;
    
    return async function(...args) {
      let attempts = 0;
      
      while (attempts < maxRetries) {
        try {
          return await fn.apply(this, args);
        } catch (error) {
          attempts++;
          
          if (attempts >= maxRetries) {
            throw error;
          }
          
          if (typeof shouldRetry === 'function' && !shouldRetry(error, attempts)) {
            throw error;
          }
          
          if (interval > 0) {
            await new Promise(resolve => setTimeout(resolve, interval));
          }
        }
      }
    };
  },
  
  /**
   * 函数执行时间测量
   * @param {Function} fn - 要测量的函数
   * @param {boolean} [async=false] - 是否是异步函数
   * @returns {Function} 可测量执行时间的函数
   */
  measureTime: function(fn, async = false) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    if (async) {
      return async function(...args) {
        const start = performance.now();
        const result = await fn.apply(this, args);
        const end = performance.now();
        
        return {
          result,
          executionTime: end - start
        };
      };
    } else {
      return function(...args) {
        const start = performance.now();
        const result = fn.apply(this, args);
        const end = performance.now();
        
        return {
          result,
          executionTime: end - start
        };
      };
    }
  },
  
  /**
   * 函数执行结果缓存
   * 缓存函数的执行结果，并在缓存过期后重新执行
   * @param {Function} fn - 要缓存的函数
   * @param {Object} [options] - 配置选项
   * @param {number} [options.ttl=60000] - 缓存有效期，单位毫秒，默认为1分钟
   * @param {Function} [options.keyGenerator] - 缓存键生成函数，默认使用参数的JSON字符串作为缓存键
   * @returns {Function} 带缓存的函数
   */
  cacheWithExpiration: function(fn, options = {}) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    const { ttl = 60000, keyGenerator } = options;
    const cache = new Map();
    
    const generateKey = keyGenerator || (args => JSON.stringify(args));
    
    return async function(...args) {
      const key = generateKey(args);
      const now = Date.now();
      const cached = cache.get(key);
      
      if (cached && now < cached.expiration) {
        return cached.value;
      }
      
      const value = await fn.apply(this, args);
      cache.set(key, {
        value,
        expiration: now + ttl
      });
      
      return value;
    };
  },
  
  /**
   * 函数执行结果验证
   * 验证函数的执行结果是否符合条件
   * @param {Function} fn - 要验证的函数
   * @param {Function} validator - 验证函数，接收函数的执行结果
   * @param {*} [fallback] - 验证失败时的返回值
   * @returns {Function} 带验证的函数
   */
  validate: function(fn, validator, fallback) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    if (typeof validator !== 'function') {
      throw new TypeError('Expected validator to be a function');
    }
    
    return function(...args) {
      const result = fn.apply(this, args);
      
      if (validator(result)) {
        return result;
      }
      
      return fallback;
    };
  },
  
  /**
   * 函数执行结果转换
   * 转换函数的执行结果
   * @param {Function} fn - 要转换的函数
   * @param {Function} transformer - 转换函数，接收函数的执行结果
   * @returns {Function} 带转换的函数
   */
  transform: function(fn, transformer) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    if (typeof transformer !== 'function') {
      throw new TypeError('Expected transformer to be a function');
    }
    
    return function(...args) {
      const result = fn.apply(this, args);
      return transformer(result);
    };
  },
  
  /**
   * 函数执行结果过滤
   * 过滤函数的执行结果
   * @param {Function} fn - 要过滤的函数
   * @param {Function} predicate - 过滤函数，接收函数的执行结果
   * @param {*} [fallback] - 过滤失败时的返回值
   * @returns {Function} 带过滤的函数
   */
  filter: function(fn, predicate, fallback) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    if (typeof predicate !== 'function') {
      throw new TypeError('Expected predicate to be a function');
    }
    
    return function(...args) {
      const result = fn.apply(this, args);
      
      if (predicate(result)) {
        return result;
      }
      
      return fallback;
    };
  },
  
  /**
   * 函数执行结果映射
   * 映射函数的执行结果
   * @param {Function} fn - 要映射的函数
   * @param {Function} mapper - 映射函数，接收函数的执行结果
   * @returns {Function} 带映射的函数
   */
  map: function(fn, mapper) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    if (typeof mapper !== 'function') {
      throw new TypeError('Expected mapper to be a function');
    }
    
    return function(...args) {
      const result = fn.apply(this, args);
      return mapper(result);
    };
  },
  
  /**
   * 函数执行结果扁平化
   * 扁平化函数的执行结果
   * @param {Function} fn - 要扁平化的函数
   * @returns {Function} 带扁平化的函数
   */
  flatten: function(fn) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    return function(...args) {
      const result = fn.apply(this, args);
      
      if (Array.isArray(result)) {
        return result.flat();
      }
      
      return result;
    };
  },
  
  /**
   * 函数执行结果缓存（LRU）
   * 使用LRU（最近最少使用）策略缓存函数的执行结果
   * @param {Function} fn - 要缓存的函数
   * @param {Object} [options] - 配置选项
   * @param {number} [options.maxSize=100] - 缓存的最大大小
   * @param {Function} [options.keyGenerator] - 缓存键生成函数，默认使用参数的JSON字符串作为缓存键
   * @returns {Function} 带缓存的函数
   */
  lruCache: function(fn, options = {}) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    const { maxSize = 100, keyGenerator } = options;
    const cache = new Map();
    const generateKey = keyGenerator || (args => JSON.stringify(args));
    
    return function(...args) {
      const key = generateKey(args);
      
      if (cache.has(key)) {
        const value = cache.get(key);
        cache.delete(key);
        cache.set(key, value);
        return value;
      }
      
      const result = fn.apply(this, args);
      
      if (cache.size >= maxSize) {
        const oldestKey = cache.keys().next().value;
        cache.delete(oldestKey);
      }
      
      cache.set(key, result);
      return result;
    };
  },
  
  /**
   * 函数执行结果缓存（TTL）
   * 使用TTL（生存时间）策略缓存函数的执行结果
   * @param {Function} fn - 要缓存的函数
   * @param {Object} [options] - 配置选项
   * @param {number} [options.ttl=60000] - 缓存的生存时间，单位毫秒，默认为1分钟
   * @param {Function} [options.keyGenerator] - 缓存键生成函数，默认使用参数的JSON字符串作为缓存键
   * @returns {Function} 带缓存的函数
   */
  ttlCache: function(fn, options = {}) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    const { ttl = 60000, keyGenerator } = options;
    const cache = new Map();
    const generateKey = keyGenerator || (args => JSON.stringify(args));
    
    return function(...args) {
      const key = generateKey(args);
      const now = Date.now();
      
      if (cache.has(key)) {
        const { value, expiration } = cache.get(key);
        
        if (now < expiration) {
          return value;
        } else {
          cache.delete(key);
        }
      }
      
      const result = fn.apply(this, args);
      cache.set(key, {
        value: result,
        expiration: now + ttl
      });
      
      return result;
    };
  },
  
  /**
   * 函数执行结果缓存（自定义）
   * 使用自定义策略缓存函数的执行结果
   * @param {Function} fn - 要缓存的函数
   * @param {Object} [options] - 配置选项
   * @param {Function} [options.keyGenerator] - 缓存键生成函数，默认使用参数的JSON字符串作为缓存键
   * @param {Function} [options.shouldCache] - 判断是否应该缓存的函数，接收函数的执行结果
   * @param {Function} [options.shouldInvalidate] - 判断是否应该失效缓存的函数，接收缓存的值和当前参数
   * @returns {Function} 带缓存的函数
   */
  customCache: function(fn, options = {}) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    const { keyGenerator, shouldCache, shouldInvalidate } = options;
    const cache = new Map();
    const generateKey = keyGenerator || (args => JSON.stringify(args));
    
    return function(...args) {
      const key = generateKey(args);
      
      if (cache.has(key)) {
        const value = cache.get(key);
        
        if (shouldInvalidate && shouldInvalidate(value, args)) {
          cache.delete(key);
        } else {
          return value;
        }
      }
      
      const result = fn.apply(this, args);
      
      if (!shouldCache || shouldCache(result)) {
        cache.set(key, result);
      }
      
      return result;
    };
  },
  
  /**
   * 函数执行结果缓存（异步）
   * 缓存异步函数的执行结果
   * @param {Function} fn - 要缓存的异步函数
   * @param {Object} [options] - 配置选项
   * @param {number} [options.ttl=60000] - 缓存的生存时间，单位毫秒，默认为1分钟
   * @param {Function} [options.keyGenerator] - 缓存键生成函数，默认使用参数的JSON字符串作为缓存键
   * @returns {Function} 带缓存的异步函数
   */
  asyncCache: function(fn, options = {}) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    const { ttl = 60000, keyGenerator } = options;
    const cache = new Map();
    const generateKey = keyGenerator || (args => JSON.stringify(args));
    
    return async function(...args) {
      const key = generateKey(args);
      const now = Date.now();
      
      if (cache.has(key)) {
        const { value, expiration } = cache.get(key);
        
        if (now < expiration) {
          return value;
        } else {
          cache.delete(key);
        }
      }
      
      const result = await fn.apply(this, args);
      cache.set(key, {
        value: result,
        expiration: now + ttl
      });
      
      return result;
    };
  },
  
  /**
   * 函数执行结果缓存（Promise）
   * 缓存Promise函数的执行结果
   * @param {Function} fn - 要缓存的Promise函数
   * @param {Object} [options] - 配置选项
   * @param {number} [options.ttl=60000] - 缓存的生存时间，单位毫秒，默认为1分钟
   * @param {Function} [options.keyGenerator] - 缓存键生成函数，默认使用参数的JSON字符串作为缓存键
   * @returns {Function} 带缓存的Promise函数
   */
  promiseCache: function(fn, options = {}) {
    if (typeof fn !== 'function') {
      throw new TypeError('Expected a function');
    }
    
    const { ttl = 60000, keyGenerator } = options;
    const cache = new Map();
    const generateKey = keyGenerator || (args => JSON.stringify(args));
    
    return function(...args) {
      const key = generateKey(args);
      const now = Date.now();
      
      if (cache.has(key)) {
        const { value, expiration } = cache.get(key);
        
        if (now < expiration) {
          return value;
        } else {
          cache.delete(key);
        }
      }
      
      const result = fn.apply(this, args);
      
      if (result instanceof Promise) {
        cache.set(key, {
          value: result,
          expiration: now + ttl
        });
      }
      
      return result;
    };
  }
};

module.exports = functionUtils;