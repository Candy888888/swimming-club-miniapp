// url.js - URL工具

/**
 * URL工具
 * 用于处理URL相关的操作，包括URL的解析、构建、参数处理等功能
 */
const urlUtils = {
  /**
   * 解析URL
   * @param {string} url - 要解析的URL
   * @returns {Object} 解析后的URL对象，包含协议、主机、端口、路径、查询参数、哈希等
   */
  parse: function(url) {
    if (typeof url !== 'string') {
      return {};
    }
    
    try {
      const parser = document.createElement('a');
      parser.href = url;
      
      const searchParams = this.parseQuery(parser.search);
      
      return {
        href: parser.href,
        protocol: parser.protocol.replace(/:$/, ''),
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        hash: parser.hash,
        params: searchParams,
        origin: parser.origin || `${parser.protocol}//${parser.host}`
      };
    } catch (e) {
      // 如果在非浏览器环境中，使用URL对象
      try {
        const parsedUrl = new URL(url);
        const searchParams = this.parseQuery(parsedUrl.search);
        
        return {
          href: parsedUrl.href,
          protocol: parsedUrl.protocol.replace(/:$/, ''),
          host: parsedUrl.host,
          hostname: parsedUrl.hostname,
          port: parsedUrl.port,
          pathname: parsedUrl.pathname,
          search: parsedUrl.search,
          hash: parsedUrl.hash,
          params: searchParams,
          origin: parsedUrl.origin
        };
      } catch (e) {
        // 如果URL对象也不可用，则使用正则表达式解析
        const regex = /^(?:(https?|ftp):\/\/)?(?:([^:@\/]+)(?::([^@\/]+))?@)?([^:\/?#]+)(?::(\d+))?([\/?#][^#]*)?(?:#(.*))?$/i;
        const match = url.match(regex);
        
        if (!match) {
          return {};
        }
        
        const protocol = match[1] || '';
        const auth = match[2] ? (match[3] ? `${match[2]}:${match[3]}` : match[2]) : '';
        const hostname = match[4] || '';
        const port = match[5] || '';
        const pathWithSearch = match[6] || '';
        const hash = match[7] ? `#${match[7]}` : '';
        
        const pathParts = pathWithSearch.split('?');
        const pathname = pathParts[0] || '';
        const search = pathParts.length > 1 ? `?${pathParts[1]}` : '';
        
        const host = port ? `${hostname}:${port}` : hostname;
        const origin = protocol ? `${protocol}://${host}` : '';
        const href = `${origin}${pathname}${search}${hash}`;
        
        return {
          href,
          protocol,
          host,
          hostname,
          port,
          pathname,
          search,
          hash,
          params: this.parseQuery(search),
          origin
        };
      }
    }
  },
  
  /**
   * 构建URL
   * @param {Object} urlParts - URL的各个部分
   * @returns {string} 构建后的URL
   */
  build: function(urlParts) {
    if (!urlParts || typeof urlParts !== 'object') {
      return '';
    }
    
    const {
      protocol = '',
      hostname = '',
      port = '',
      pathname = '',
      params = {},
      hash = ''
    } = urlParts;
    
    let url = '';
    
    // 添加协议
    if (protocol) {
      url += protocol.includes(':') ? protocol : `${protocol}:`;
      url += '//';
    }
    
    // 添加主机名
    url += hostname;
    
    // 添加端口
    if (port) {
      url += `:${port}`;
    }
    
    // 添加路径
    if (pathname) {
      if (!pathname.startsWith('/')) {
        url += '/';
      }
      url += pathname;
    }
    
    // 添加查询参数
    const queryString = this.buildQuery(params);
    if (queryString) {
      url += `?${queryString}`;
    }
    
    // 添加哈希
    if (hash) {
      if (!hash.startsWith('#')) {
        url += '#';
      }
      url += hash;
    }
    
    return url;
  },
  
  /**
   * 解析查询字符串
   * @param {string} queryString - 要解析的查询字符串
   * @returns {Object} 解析后的查询参数对象
   */
  parseQuery: function(queryString) {
    if (typeof queryString !== 'string') {
      return {};
    }
    
    // 移除开头的问号
    if (queryString.startsWith('?')) {
      queryString = queryString.substring(1);
    }
    
    if (!queryString) {
      return {};
    }
    
    return queryString.split('&').reduce((params, param) => {
      const [key, value] = param.split('=').map(part => decodeURIComponent(part.replace(/\+/g, ' ')));
      
      if (key) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
          if (Array.isArray(params[key])) {
            params[key].push(value);
          } else {
            params[key] = [params[key], value];
          }
        } else {
          params[key] = value;
        }
      }
      
      return params;
    }, {});
  },
  
  /**
   * 构建查询字符串
   * @param {Object} params - 查询参数对象
   * @returns {string} 构建后的查询字符串
   */
  buildQuery: function(params) {
    if (!params || typeof params !== 'object') {
      return '';
    }
    
    return Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(item => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`).join('&');
        }
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      })
      .join('&');
  },
  
  /**
   * 获取URL的查询参数
   * @param {string} url - 要获取参数的URL
   * @param {string} [name] - 参数名，如果不提供则返回所有参数
   * @param {*} [defaultValue] - 如果参数不存在，则返回的默认值
   * @returns {Object|string|Array|*} 查询参数或默认值
   */
  getParam: function(url, name, defaultValue) {
    const params = this.parse(url).params;
    
    if (name === undefined) {
      return params;
    }
    
    return params[name] !== undefined ? params[name] : defaultValue;
  },
  
  /**
   * 设置URL的查询参数
   * @param {string} url - 要设置参数的URL
   * @param {string|Object} name - 参数名或参数对象
   * @param {string} [value] - 参数值，如果name是对象则忽略
   * @returns {string} 设置参数后的URL
   */
  setParam: function(url, name, value) {
    const urlObj = this.parse(url);
    
    if (typeof name === 'object') {
      Object.assign(urlObj.params, name);
    } else if (typeof name === 'string') {
      urlObj.params[name] = value;
    }
    
    return this.build(urlObj);
  },
  
  /**
   * 删除URL的查询参数
   * @param {string} url - 要删除参数的URL
   * @param {string|Array} name - 要删除的参数名或参数名数组
   * @returns {string} 删除参数后的URL
   */
  removeParam: function(url, name) {
    const urlObj = this.parse(url);
    
    if (Array.isArray(name)) {
      name.forEach(param => {
        delete urlObj.params[param];
      });
    } else if (typeof name === 'string') {
      delete urlObj.params[name];
    }
    
    return this.build(urlObj);
  },
  
  /**
   * 检查URL是否包含指定参数
   * @param {string} url - 要检查的URL
   * @param {string} name - 参数名
   * @returns {boolean} 如果URL包含指定参数则返回true，否则返回false
   */
  hasParam: function(url, name) {
    const params = this.parse(url).params;
    return Object.prototype.hasOwnProperty.call(params, name);
  },
  
  /**
   * 获取URL的路径部分
   * @param {string} url - 要获取路径的URL
   * @returns {string} URL的路径部分
   */
  getPath: function(url) {
    return this.parse(url).pathname || '';
  },
  
  /**
   * 设置URL的路径部分
   * @param {string} url - 要设置路径的URL
   * @param {string} path - 新的路径
   * @returns {string} 设置路径后的URL
   */
  setPath: function(url, path) {
    const urlObj = this.parse(url);
    urlObj.pathname = path;
    return this.build(urlObj);
  },
  
  /**
   * 获取URL的哈希部分
   * @param {string} url - 要获取哈希的URL
   * @returns {string} URL的哈希部分
   */
  getHash: function(url) {
    const hash = this.parse(url).hash || '';
    return hash.startsWith('#') ? hash.substring(1) : hash;
  },
  
  /**
   * 设置URL的哈希部分
   * @param {string} url - 要设置哈希的URL
   * @param {string} hash - 新的哈希
   * @returns {string} 设置哈希后的URL
   */
  setHash: function(url, hash) {
    const urlObj = this.parse(url);
    urlObj.hash = hash.startsWith('#') ? hash : `#${hash}`;
    return this.build(urlObj);
  },
  
  /**
   * 获取URL的域名部分
   * @param {string} url - 要获取域名的URL
   * @returns {string} URL的域名部分
   */
  getDomain: function(url) {
    return this.parse(url).hostname || '';
  },
  
  /**
   * 获取URL的协议部分
   * @param {string} url - 要获取协议的URL
   * @returns {string} URL的协议部分
   */
  getProtocol: function(url) {
    return this.parse(url).protocol || '';
  },
  
  /**
   * 设置URL的协议部分
   * @param {string} url - 要设置协议的URL
   * @param {string} protocol - 新的协议
   * @returns {string} 设置协议后的URL
   */
  setProtocol: function(url, protocol) {
    const urlObj = this.parse(url);
    urlObj.protocol = protocol.replace(/:$/, '');
    return this.build(urlObj);
  },
  
  /**
   * 获取URL的端口部分
   * @param {string} url - 要获取端口的URL
   * @returns {string} URL的端口部分
   */
  getPort: function(url) {
    return this.parse(url).port || '';
  },
  
  /**
   * 设置URL的端口部分
   * @param {string} url - 要设置端口的URL
   * @param {string|number} port - 新的端口
   * @returns {string} 设置端口后的URL
   */
  setPort: function(url, port) {
    const urlObj = this.parse(url);
    urlObj.port = String(port);
    return this.build(urlObj);
  },
  
  /**
   * 获取URL的源部分
   * @param {string} url - 要获取源的URL
   * @returns {string} URL的源部分
   */
  getOrigin: function(url) {
    return this.parse(url).origin || '';
  },
  
  /**
   * 检查URL是否是绝对URL
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是绝对URL则返回true，否则返回false
   */
  isAbsolute: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  },
  
  /**
   * 检查URL是否是相对URL
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是相对URL则返回true，否则返回false
   */
  isRelative: function(url) {
    return !this.isAbsolute(url);
  },
  
  /**
   * 将相对URL转换为绝对URL
   * @param {string} relativeUrl - 相对URL
   * @param {string} baseUrl - 基础URL
   * @returns {string} 绝对URL
   */
  resolve: function(relativeUrl, baseUrl) {
    if (typeof relativeUrl !== 'string' || typeof baseUrl !== 'string') {
      return '';
    }
    
    try {
      return new URL(relativeUrl, baseUrl).href;
    } catch (e) {
      // 如果URL对象不可用，则使用DOM的方法
      try {
        const base = document.createElement('base');
        base.href = baseUrl;
        
        const link = document.createElement('a');
        link.href = relativeUrl;
        
        return link.href;
      } catch (e) {
        // 如果DOM方法也不可用，则使用简单的字符串拼接
        if (this.isAbsolute(relativeUrl)) {
          return relativeUrl;
        }
        
        const baseUrlObj = this.parse(baseUrl);
        const basePathParts = baseUrlObj.pathname.split('/');
        basePathParts.pop(); // 移除最后一个部分（文件名或空字符串）
        
        let resolvedPath = '';
        
        if (relativeUrl.startsWith('/')) {
          resolvedPath = relativeUrl;
        } else {
          resolvedPath = [...basePathParts, relativeUrl].join('/');
        }
        
        // 处理 ../ 和 ./
        const resolvedParts = [];
        resolvedPath.split('/').forEach(part => {
          if (part === '..') {
            resolvedParts.pop();
          } else if (part !== '.' && part !== '') {
            resolvedParts.push(part);
          }
        });
        
        resolvedPath = '/' + resolvedParts.join('/');
        
        return `${baseUrlObj.protocol}://${baseUrlObj.host}${resolvedPath}`;
      }
    }
  },
  
  /**
   * 规范化URL
   * @param {string} url - 要规范化的URL
   * @returns {string} 规范化后的URL
   */
  normalize: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    try {
      return new URL(url).href;
    } catch (e) {
      // 如果URL对象不可用，则使用DOM的方法
      try {
        const link = document.createElement('a');
        link.href = url;
        return link.href;
      } catch (e) {
        // 如果DOM方法也不可用，则使用简单的字符串处理
        return this.build(this.parse(url));
      }
    }
  },
  
  /**
   * 连接URL路径
   * @param {...string} paths - 要连接的路径
   * @returns {string} 连接后的URL路径
   */
  join: function(...paths) {
    if (paths.length === 0) {
      return '';
    }
    
    const normalizedPaths = paths.map(path => {
      if (typeof path !== 'string') {
        return '';
      }
      
      // 移除开头和结尾的斜杠
      return path.replace(/^\/|\/$/, '');
    }).filter(Boolean);
    
    if (normalizedPaths.length === 0) {
      return '/';
    }
    
    // 如果第一个路径以斜杠开头，则保留
    const firstPath = paths[0];
    const hasLeadingSlash = typeof firstPath === 'string' && firstPath.startsWith('/');
    
    // 如果最后一个路径以斜杠结尾，则保留
    const lastPath = paths[paths.length - 1];
    const hasTrailingSlash = typeof lastPath === 'string' && lastPath.endsWith('/');
    
    let result = normalizedPaths.join('/');
    
    if (hasLeadingSlash) {
      result = '/' + result;
    }
    
    if (hasTrailingSlash) {
      result = result + '/';
    }
    
    return result;
  },
  
  /**
   * 获取URL的文件扩展名
   * @param {string} url - 要获取扩展名的URL
   * @returns {string} URL的文件扩展名
   */
  getExtension: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    const pathname = this.parse(url).pathname;
    if (!pathname) {
      return '';
    }
    
    const lastDotIndex = pathname.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === pathname.length - 1) {
      return '';
    }
    
    return pathname.substring(lastDotIndex + 1);
  },
  
  /**
   * 获取URL的文件名
   * @param {string} url - 要获取文件名的URL
   * @returns {string} URL的文件名
   */
  getFileName: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    const pathname = this.parse(url).pathname;
    if (!pathname) {
      return '';
    }
    
    const lastSlashIndex = pathname.lastIndexOf('/');
    if (lastSlashIndex === -1) {
      return pathname;
    }
    
    return pathname.substring(lastSlashIndex + 1);
  },
  
  /**
   * 获取URL的目录部分
   * @param {string} url - 要获取目录的URL
   * @returns {string} URL的目录部分
   */
  getDirectory: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    const pathname = this.parse(url).pathname;
    if (!pathname) {
      return '/';
    }
    
    const lastSlashIndex = pathname.lastIndexOf('/');
    if (lastSlashIndex === -1) {
      return '/';
    }
    
    return pathname.substring(0, lastSlashIndex + 1);
  },
  
  /**
   * 检查URL是否是有效的URL
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是有效的URL则返回true，否则返回false
   */
  isValid: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  /**
   * 检查URL是否是安全的URL（使用https协议）
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是安全的URL则返回true，否则返回false
   */
  isSecure: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    return this.parse(url).protocol === 'https';
  },
  
  /**
   * 将URL转换为安全的URL（使用https协议）
   * @param {string} url - 要转换的URL
   * @returns {string} 转换后的URL
   */
  toSecure: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    return this.setProtocol(url, 'https');
  },
  
  /**
   * 将URL转换为不安全的URL（使用http协议）
   * @param {string} url - 要转换的URL
   * @returns {string} 转换后的URL
   */
  toInsecure: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    return this.setProtocol(url, 'http');
  },
  
  /**
   * 检查两个URL是否相同
   * @param {string} url1 - 第一个URL
   * @param {string} url2 - 第二个URL
   * @returns {boolean} 如果两个URL相同则返回true，否则返回false
   */
  isSame: function(url1, url2) {
    if (typeof url1 !== 'string' || typeof url2 !== 'string') {
      return false;
    }
    
    try {
      return new URL(url1).href === new URL(url2).href;
    } catch (e) {
      return this.normalize(url1) === this.normalize(url2);
    }
  },
  
  /**
   * 检查URL是否是同源的
   * @param {string} url1 - 第一个URL
   * @param {string} url2 - 第二个URL
   * @returns {boolean} 如果两个URL同源则返回true，否则返回false
   */
  isSameOrigin: function(url1, url2) {
    if (typeof url1 !== 'string' || typeof url2 !== 'string') {
      return false;
    }
    
    try {
      const parsedUrl1 = new URL(url1);
      const parsedUrl2 = new URL(url2);
      return parsedUrl1.origin === parsedUrl2.origin;
    } catch (e) {
      const origin1 = this.getOrigin(url1);
      const origin2 = this.getOrigin(url2);
      return origin1 === origin2;
    }
  },
  
  /**
   * 获取当前URL
   * @returns {string} 当前URL
   */
  getCurrent: function() {
    try {
      return window.location.href;
    } catch (e) {
      return '';
    }
  },
  
  /**
   * 获取当前URL的查询参数
   * @param {string} [name] - 参数名，如果不提供则返回所有参数
   * @param {*} [defaultValue] - 如果参数不存在，则返回的默认值
   * @returns {Object|string|Array|*} 查询参数或默认值
   */
  getCurrentParam: function(name, defaultValue) {
    try {
      const url = window.location.href;
      return this.getParam(url, name, defaultValue);
    } catch (e) {
      return name === undefined ? {} : defaultValue;
    }
  },
  
  /**
   * 获取当前URL的哈希部分
   * @returns {string} 当前URL的哈希部分
   */
  getCurrentHash: function() {
    try {
      return window.location.hash.substring(1);
    } catch (e) {
      return '';
    }
  },
  
  /**
   * 获取当前URL的路径部分
   * @returns {string} 当前URL的路径部分
   */
  getCurrentPath: function() {
    try {
      return window.location.pathname;
    } catch (e) {
      return '';
    }
  },
  
  /**
   * 编码URL
   * @param {string} url - 要编码的URL
   * @returns {string} 编码后的URL
   */
  encode: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    return encodeURI(url);
  },
  
  /**
   * 解码URL
   * @param {string} url - 要解码的URL
   * @returns {string} 解码后的URL
   */
  decode: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    try {
      return decodeURI(url);
    } catch (e) {
      return url;
    }
  },
  
  /**
   * 编码URL组件
   * @param {string} component - 要编码的URL组件
   * @returns {string} 编码后的URL组件
   */
  encodeComponent: function(component) {
    if (typeof component !== 'string') {
      return '';
    }
    
    return encodeURIComponent(component);
  },
  
  /**
   * 解码URL组件
   * @param {string} component - 要解码的URL组件
   * @returns {string} 解码后的URL组件
   */
  decodeComponent: function(component) {
    if (typeof component !== 'string') {
      return '';
    }
    
    try {
      return decodeURIComponent(component);
    } catch (e) {
      return component;
    }
  },
  
  /**
   * 获取URL的查询字符串
   * @param {string} url - 要获取查询字符串的URL
   * @returns {string} URL的查询字符串
   */
  getQueryString: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    const search = this.parse(url).search || '';
    return search.startsWith('?') ? search.substring(1) : search;
  },
  
  /**
   * 设置URL的查询字符串
   * @param {string} url - 要设置查询字符串的URL
   * @param {string|Object} queryString - 新的查询字符串或查询参数对象
   * @returns {string} 设置查询字符串后的URL
   */
  setQueryString: function(url, queryString) {
    if (typeof url !== 'string') {
      return '';
    }
    
    const urlObj = this.parse(url);
    
    if (typeof queryString === 'string') {
      urlObj.params = this.parseQuery(queryString);
    } else if (typeof queryString === 'object' && queryString !== null) {
      urlObj.params = queryString;
    }
    
    return this.build(urlObj);
  },
  
  /**
   * 添加URL的查询参数
   * @param {string} url - 要添加参数的URL
   * @param {string|Object} name - 参数名或参数对象
   * @param {string} [value] - 参数值，如果name是对象则忽略
   * @returns {string} 添加参数后的URL
   */
  addParam: function(url, name, value) {
    return this.setParam(url, name, value);
  },
  
  /**
   * 替换URL的查询参数
   * @param {string} url - 要替换参数的URL
   * @param {string|Object} name - 参数名或参数对象
   * @param {string} [value] - 参数值，如果name是对象则忽略
   * @returns {string} 替换参数后的URL
   */
  replaceParam: function(url, name, value) {
    if (typeof url !== 'string') {
      return '';
    }
    
    const urlObj = this.parse(url);
    
    if (typeof name === 'object') {
      urlObj.params = { ...name };
    } else if (typeof name === 'string') {
      urlObj.params = { [name]: value };
    }
    
    return this.build(urlObj);
  },
  
  /**
   * 清除URL的所有查询参数
   * @param {string} url - 要清除参数的URL
   * @returns {string} 清除参数后的URL
   */
  clearParams: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    const urlObj = this.parse(url);
    urlObj.params = {};
    return this.build(urlObj);
  },
  
  /**
   * 获取URL的所有路径段
   * @param {string} url - 要获取路径段的URL
   * @returns {Array} URL的路径段数组
   */
  getPathSegments: function(url) {
    if (typeof url !== 'string') {
      return [];
    }
    
    const pathname = this.parse(url).pathname || '';
    return pathname.split('/').filter(Boolean);
  },
  
  /**
   * 设置URL的路径段
   * @param {string} url - 要设置路径段的URL
   * @param {Array} segments - 新的路径段数组
   * @returns {string} 设置路径段后的URL
   */
  setPathSegments: function(url, segments) {
    if (typeof url !== 'string' || !Array.isArray(segments)) {
      return url;
    }
    
    const urlObj = this.parse(url);
    urlObj.pathname = '/' + segments.join('/');
    return this.build(urlObj);
  },
  
  /**
   * 添加URL的路径段
   * @param {string} url - 要添加路径段的URL
   * @param {string} segment - 要添加的路径段
   * @returns {string} 添加路径段后的URL
   */
  addPathSegment: function(url, segment) {
    if (typeof url !== 'string' || typeof segment !== 'string') {
      return url;
    }
    
    const segments = this.getPathSegments(url);
    segments.push(segment);
    return this.setPathSegments(url, segments);
  },
  
  /**
   * 删除URL的最后一个路径段
   * @param {string} url - 要删除路径段的URL
   * @returns {string} 删除路径段后的URL
   */
  removeLastPathSegment: function(url) {
    if (typeof url !== 'string') {
      return url;
    }
    
    const segments = this.getPathSegments(url);
    segments.pop();
    return this.setPathSegments(url, segments);
  },
  
  /**
   * 获取URL的子域名
   * @param {string} url - 要获取子域名的URL
   * @returns {string} URL的子域名
   */
  getSubdomain: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    const hostname = this.parse(url).hostname || '';
    const parts = hostname.split('.');
    
    if (parts.length <= 2) {
      return '';
    }
    
    return parts.slice(0, -2).join('.');
  },
  
  /**
   * 获取URL的顶级域名
   * @param {string} url - 要获取顶级域名的URL
   * @returns {string} URL的顶级域名
   */
  getTLD: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    const hostname = this.parse(url).hostname || '';
    const parts = hostname.split('.');
    
    if (parts.length < 2) {
      return '';
    }
    
    return parts[parts.length - 1];
  },
  
  /**
   * 获取URL的域名（不包含子域名）
   * @param {string} url - 要获取域名的URL
   * @returns {string} URL的域名
   */
  getDomainWithoutSubdomain: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    const hostname = this.parse(url).hostname || '';
    const parts = hostname.split('.');
    
    if (parts.length < 2) {
      return hostname;
    }
    
    return parts.slice(-2).join('.');
  },
  
  /**
   * 检查URL是否是外部链接
   * @param {string} url - 要检查的URL
   * @param {string} [base] - 基础URL，默认为当前URL
   * @returns {boolean} 如果是外部链接则返回true，否则返回false
   */
  isExternal: function(url, base) {
    if (typeof url !== 'string') {
      return false;
    }
    
    try {
      const currentOrigin = base ? new URL(base).origin : (typeof window !== 'undefined' ? window.location.origin : '');
      const urlOrigin = new URL(url, currentOrigin).origin;
      return urlOrigin !== currentOrigin;
    } catch (e) {
      return this.isAbsolute(url);
    }
  },
  
  /**
   * 检查URL是否是邮件链接
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是邮件链接则返回true，否则返回false
   */
  isMailto: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    return /^mailto:/i.test(url);
  },
  
  /**
   * 检查URL是否是电话链接
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是电话链接则返回true，否则返回false
   */
  isTel: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    return /^tel:/i.test(url);
  },
  
  /**
   * 检查URL是否是文件链接
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是文件链接则返回true，否则返回false
   */
  isFile: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    return /^file:/i.test(url);
  },
  
  /**
   * 检查URL是否是HTTP链接
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是HTTP链接则返回true，否则返回false
   */
  isHttp: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    return /^https?:/i.test(url);
  },
  
  /**
   * 检查URL是否是FTP链接
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是FTP链接则返回true，否则返回false
   */
  isFtp: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    return /^ftp:/i.test(url);
  },
  
  /**
   * 检查URL是否是数据URI
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是数据URI则返回true，否则返回false
   */
  isDataUri: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    return /^data:/i.test(url);
  },
  
  /**
   * 检查URL是否是锚点链接
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是锚点链接则返回true，否则返回false
   */
  isAnchor: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    return /^#/.test(url);
  },
  
  /**
   * 检查URL是否是JavaScript链接
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是JavaScript链接则返回true，否则返回false
   */
  isJavaScript: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    return /^javascript:/i.test(url);
  },
  
  /**
   * 获取URL的MIME类型
   * @param {string} url - 要获取MIME类型的URL
   * @returns {string} URL的MIME类型
   */
  getMimeType: function(url) {
    if (typeof url !== 'string') {
      return '';
    }
    
    const extension = this.getExtension(url).toLowerCase();
    const mimeTypes = {
      'html': 'text/html',
      'htm': 'text/html',
      'css': 'text/css',
      'js': 'text/javascript',
      'json': 'application/json',
      'xml': 'application/xml',
      'txt': 'text/plain',
      'pdf': 'application/pdf',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'svg': 'image/svg+xml',
      'ico': 'image/x-icon',
      'mp3': 'audio/mpeg',
      'mp4': 'video/mp4',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'webm': 'video/webm',
      'zip': 'application/zip',
      'rar': 'application/x-rar-compressed',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    };
    
    return mimeTypes[extension] || '';
  },
  
  /**
   * 获取URL的内容类型
   * @param {string} url - 要获取内容类型的URL
   * @returns {string} URL的内容类型
   */
  getContentType: function(url) {
    return this.getMimeType(url);
  },
  
  /**
   * 检查URL是否是图片链接
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是图片链接则返回true，否则返回false
   */
  isImage: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    const extension = this.getExtension(url).toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'];
    return imageExtensions.includes(extension);
  },
  
  /**
   * 检查URL是否是视频链接
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是视频链接则返回true，否则返回false
   */
  isVideo: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    const extension = this.getExtension(url).toLowerCase();
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'mkv'];
    return videoExtensions.includes(extension);
  },
  
  /**
   * 检查URL是否是音频链接
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是音频链接则返回true，否则返回false
   */
  isAudio: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    const extension = this.getExtension(url).toLowerCase();
    const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'wma'];
    return audioExtensions.includes(extension);
  },
  
  /**
   * 检查URL是否是文档链接
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是文档链接则返回true，否则返回false
   */
  isDocument: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    const extension = this.getExtension(url).toLowerCase();
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt', 'ods', 'odp'];
    return documentExtensions.includes(extension);
  },
  
  /**
   * 检查URL是否是压缩文件链接
   * @param {string} url - 要检查的URL
   * @returns {boolean} 如果是压缩文件链接则返回true，否则返回false
   */
  isArchive: function(url) {
    if (typeof url !== 'string') {
      return false;
    }
    
    const extension = this.getExtension(url).toLowerCase();
    const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'];
    return archiveExtensions.includes(extension);
  },
  
  /**
   * 获取URL的类型
   * @param {string} url - 要获取类型的URL
   * @returns {string} URL的类型
   */
  getType: function(url) {
    if (this.isImage(url)) {
      return 'image';
    } else if (this.isVideo(url)) {
      return 'video';
    } else if (this.isAudio(url)) {
      return 'audio';
    } else if (this.isDocument(url)) {
      return 'document';
    } else if (this.isArchive(url)) {
      return 'archive';
    } else if (this.isMailto(url)) {
      return 'mailto';
    } else if (this.isTel(url)) {
      return 'tel';
    } else if (this.isFile(url)) {
      return 'file';
    } else if (this.isHttp(url)) {
      return 'http';
    } else if (this.isFtp(url)) {
      return 'ftp';
    } else if (this.isDataUri(url)) {
      return 'data';
    } else if (this.isAnchor(url)) {
      return 'anchor';
    } else if (this.isJavaScript(url)) {
      return 'javascript';
    } else {
      return 'unknown';
    }
  }
};

module.exports = urlUtils;