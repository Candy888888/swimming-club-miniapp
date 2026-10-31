// dom.js - DOM工具

/**
 * DOM工具
 * 用于处理DOM相关的操作，包括元素的选择、创建、修改、事件处理等功能
 */
const domUtils = {
  /**
   * 根据选择器获取单个元素
   * @param {string} selector - CSS选择器
   * @param {Element} [context=document] - 上下文元素，默认为document
   * @returns {Element|null} 匹配的元素，如果没有匹配则返回null
   */
  get: function(selector, context = document) {
    if (typeof selector !== 'string') {
      return null;
    }
    
    try {
      return context.querySelector(selector);
    } catch (e) {
      console.error('DOM选择器错误:', e);
      return null;
    }
  },
  
  /**
   * 根据选择器获取多个元素
   * @param {string} selector - CSS选择器
   * @param {Element} [context=document] - 上下文元素，默认为document
   * @returns {Element[]} 匹配的元素数组，如果没有匹配则返回空数组
   */
  getAll: function(selector, context = document) {
    if (typeof selector !== 'string') {
      return [];
    }
    
    try {
      return Array.from(context.querySelectorAll(selector));
    } catch (e) {
      console.error('DOM选择器错误:', e);
      return [];
    }
  },
  
  /**
   * 根据ID获取元素
   * @param {string} id - 元素ID
   * @returns {Element|null} 匹配的元素，如果没有匹配则返回null
   */
  getById: function(id) {
    if (typeof id !== 'string') {
      return null;
    }
    
    return document.getElementById(id);
  },
  
  /**
   * 根据类名获取元素
   * @param {string} className - 类名
   * @param {Element} [context=document] - 上下文元素，默认为document
   * @returns {Element[]} 匹配的元素数组，如果没有匹配则返回空数组
   */
  getByClass: function(className, context = document) {
    if (typeof className !== 'string') {
      return [];
    }
    
    return Array.from(context.getElementsByClassName(className));
  },
  
  /**
   * 根据标签名获取元素
   * @param {string} tagName - 标签名
   * @param {Element} [context=document] - 上下文元素，默认为document
   * @returns {Element[]} 匹配的元素数组，如果没有匹配则返回空数组
   */
  getByTag: function(tagName, context = document) {
    if (typeof tagName !== 'string') {
      return [];
    }
    
    return Array.from(context.getElementsByTagName(tagName));
  },
  
  /**
   * 根据name属性获取元素
   * @param {string} name - name属性值
   * @returns {Element[]} 匹配的元素数组，如果没有匹配则返回空数组
   */
  getByName: function(name) {
    if (typeof name !== 'string') {
      return [];
    }
    
    return Array.from(document.getElementsByName(name));
  },
  
  /**
   * 创建元素
   * @param {string} tagName - 标签名
   * @param {Object} [attributes] - 属性对象
   * @param {string|Element|Array} [children] - 子元素或文本内容
   * @returns {Element} 创建的元素
   */
  create: function(tagName, attributes = {}, children) {
    if (typeof tagName !== 'string') {
      throw new Error('标签名必须是字符串');
    }
    
    const element = document.createElement(tagName);
    
    // 设置属性
    for (const key in attributes) {
      if (Object.prototype.hasOwnProperty.call(attributes, key)) {
        if (key === 'style' && typeof attributes[key] === 'object') {
          Object.assign(element.style, attributes[key]);
        } else if (key === 'dataset' && typeof attributes[key] === 'object') {
          for (const dataKey in attributes[key]) {
            if (Object.prototype.hasOwnProperty.call(attributes[key], dataKey)) {
              element.dataset[dataKey] = attributes[key][dataKey];
            }
          }
        } else if (key === 'className') {
          element.className = attributes[key];
        } else if (key === 'innerHTML') {
          element.innerHTML = attributes[key];
        } else {
          element.setAttribute(key, attributes[key]);
        }
      }
    }
    
    // 添加子元素或文本内容
    if (children !== undefined) {
      if (Array.isArray(children)) {
        children.forEach(child => {
          if (child instanceof Element) {
            element.appendChild(child);
          } else if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
          }
        });
      } else if (children instanceof Element) {
        element.appendChild(children);
      } else if (typeof children === 'string') {
        element.textContent = children;
      }
    }
    
    return element;
  },
  
  /**
   * 创建文档片段
   * @param {Element[]|string[]} [children] - 子元素或文本内容数组
   * @returns {DocumentFragment} 创建的文档片段
   */
  createFragment: function(children = []) {
    const fragment = document.createDocumentFragment();
    
    children.forEach(child => {
      if (child instanceof Element) {
        fragment.appendChild(child);
      } else if (typeof child === 'string') {
        const textNode = document.createTextNode(child);
        fragment.appendChild(textNode);
      }
    });
    
    return fragment;
  },
  
  /**
   * 将元素添加到父元素中
   * @param {Element} parent - 父元素
   * @param {Element|Element[]|string|string[]} children - 要添加的子元素或文本内容
   * @returns {Element} 父元素
   */
  append: function(parent, children) {
    if (!(parent instanceof Element)) {
      throw new Error('父元素必须是DOM元素');
    }
    
    if (Array.isArray(children)) {
      children.forEach(child => {
        if (child instanceof Element) {
          parent.appendChild(child);
        } else if (typeof child === 'string') {
          parent.appendChild(document.createTextNode(child));
        }
      });
    } else if (children instanceof Element) {
      parent.appendChild(children);
    } else if (typeof children === 'string') {
      parent.appendChild(document.createTextNode(children));
    }
    
    return parent;
  },
  
  /**
   * 将元素插入到参考元素之前
   * @param {Element} referenceElement - 参考元素
   * @param {Element|Element[]|string|string[]} newElement - 要插入的元素或文本内容
   * @returns {Element} 参考元素
   */
  insertBefore: function(referenceElement, newElement) {
    if (!(referenceElement instanceof Element)) {
      throw new Error('参考元素必须是DOM元素');
    }
    
    const parent = referenceElement.parentNode;
    if (!parent) {
      throw new Error('参考元素必须有父元素');
    }
    
    if (Array.isArray(newElement)) {
      newElement.forEach(element => {
        if (element instanceof Element) {
          parent.insertBefore(element, referenceElement);
        } else if (typeof element === 'string') {
          parent.insertBefore(document.createTextNode(element), referenceElement);
        }
      });
    } else if (newElement instanceof Element) {
      parent.insertBefore(newElement, referenceElement);
    } else if (typeof newElement === 'string') {
      parent.insertBefore(document.createTextNode(newElement), referenceElement);
    }
    
    return referenceElement;
  },
  
  /**
   * 将元素插入到参考元素之后
   * @param {Element} referenceElement - 参考元素
   * @param {Element|Element[]|string|string[]} newElement - 要插入的元素或文本内容
   * @returns {Element} 参考元素
   */
  insertAfter: function(referenceElement, newElement) {
    if (!(referenceElement instanceof Element)) {
      throw new Error('参考元素必须是DOM元素');
    }
    
    const parent = referenceElement.parentNode;
    if (!parent) {
      throw new Error('参考元素必须有父元素');
    }
    
    const nextSibling = referenceElement.nextSibling;
    
    if (Array.isArray(newElement)) {
      newElement.forEach(element => {
        if (element instanceof Element) {
          parent.insertBefore(element, nextSibling);
        } else if (typeof element === 'string') {
          parent.insertBefore(document.createTextNode(element), nextSibling);
        }
      });
    } else if (newElement instanceof Element) {
      parent.insertBefore(newElement, nextSibling);
    } else if (typeof newElement === 'string') {
      parent.insertBefore(document.createTextNode(newElement), nextSibling);
    }
    
    return referenceElement;
  },
  
  /**
   * 替换元素
   * @param {Element} oldElement - 要替换的元素
   * @param {Element|string} newElement - 新元素或文本内容
   * @returns {Element} 新元素
   */
  replace: function(oldElement, newElement) {
    if (!(oldElement instanceof Element)) {
      throw new Error('要替换的元素必须是DOM元素');
    }
    
    const parent = oldElement.parentNode;
    if (!parent) {
      throw new Error('要替换的元素必须有父元素');
    }
    
    if (newElement instanceof Element) {
      parent.replaceChild(newElement, oldElement);
      return newElement;
    } else if (typeof newElement === 'string') {
      const textNode = document.createTextNode(newElement);
      parent.replaceChild(textNode, oldElement);
      return textNode;
    }
    
    return null;
  },
  
  /**
   * 移除元素
   * @param {Element|Element[]} element - 要移除的元素或元素数组
   * @returns {boolean} 是否成功移除
   */
  remove: function(element) {
    if (Array.isArray(element)) {
      let success = true;
      element.forEach(el => {
        if (el instanceof Element && el.parentNode) {
          el.parentNode.removeChild(el);
        } else {
          success = false;
        }
      });
      return success;
    } else if (element instanceof Element && element.parentNode) {
      element.parentNode.removeChild(element);
      return true;
    }
    
    return false;
  },
  
  /**
   * 清空元素内容
   * @param {Element|Element[]} element - 要清空的元素或元素数组
   * @returns {Element|Element[]} 清空后的元素或元素数组
   */
  empty: function(element) {
    if (Array.isArray(element)) {
      element.forEach(el => {
        if (el instanceof Element) {
          while (el.firstChild) {
            el.removeChild(el.firstChild);
          }
        }
      });
      return element;
    } else if (element instanceof Element) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      return element;
    }
    
    return element;
  },
  
  /**
   * 克隆元素
   * @param {Element} element - 要克隆的元素
   * @param {boolean} [deep=true] - 是否深度克隆（包括子元素）
   * @returns {Element} 克隆的元素
   */
  clone: function(element, deep = true) {
    if (!(element instanceof Element)) {
      throw new Error('要克隆的元素必须是DOM元素');
    }
    
    return element.cloneNode(deep);
  },
  
  /**
   * 获取或设置元素的文本内容
   * @param {Element} element - 元素
   * @param {string} [text] - 要设置的文本内容，如果不提供则返回当前文本内容
   * @returns {string|Element} 文本内容或元素本身
   */
  text: function(element, text) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (text === undefined) {
      return element.textContent;
    }
    
    element.textContent = text;
    return element;
  },
  
  /**
   * 获取或设置元素的HTML内容
   * @param {Element} element - 元素
   * @param {string} [html] - 要设置的HTML内容，如果不提供则返回当前HTML内容
   * @returns {string|Element} HTML内容或元素本身
   */
  html: function(element, html) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (html === undefined) {
      return element.innerHTML;
    }
    
    element.innerHTML = html;
    return element;
  },
  
  /**
   * 获取或设置元素的属性
   * @param {Element} element - 元素
   * @param {string|Object} name - 属性名或属性对象
   * @param {string} [value] - 属性值，如果不提供则返回当前属性值
   * @returns {string|Element} 属性值或元素本身
   */
  attr: function(element, name, value) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (typeof name === 'object') {
      for (const key in name) {
        if (Object.prototype.hasOwnProperty.call(name, key)) {
          element.setAttribute(key, name[key]);
        }
      }
      return element;
    }
    
    if (value === undefined) {
      return element.getAttribute(name);
    }
    
    element.setAttribute(name, value);
    return element;
  },
  
  /**
   * 移除元素的属性
   * @param {Element} element - 元素
   * @param {string|string[]} name - 属性名或属性名数组
   * @returns {Element} 元素本身
   */
  removeAttr: function(element, name) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (Array.isArray(name)) {
      name.forEach(attr => {
        element.removeAttribute(attr);
      });
    } else {
      element.removeAttribute(name);
    }
    
    return element;
  },
  
  /**
   * 获取或设置元素的数据属性
   * @param {Element} element - 元素
   * @param {string|Object} key - 数据属性名或数据属性对象
   * @param {*} [value] - 数据属性值，如果不提供则返回当前数据属性值
   * @returns {*|Element} 数据属性值或元素本身
   */
  data: function(element, key, value) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (typeof key === 'object') {
      for (const k in key) {
        if (Object.prototype.hasOwnProperty.call(key, k)) {
          element.dataset[k] = key[k];
        }
      }
      return element;
    }
    
    if (value === undefined) {
      return element.dataset[key];
    }
    
    element.dataset[key] = value;
    return element;
  },
  
  /**
   * 移除元素的数据属性
   * @param {Element} element - 元素
   * @param {string|string[]} key - 数据属性名或数据属性名数组
   * @returns {Element} 元素本身
   */
  removeData: function(element, key) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (Array.isArray(key)) {
      key.forEach(k => {
        delete element.dataset[k];
      });
    } else {
      delete element.dataset[key];
    }
    
    return element;
  },
  
  /**
   * 获取或设置元素的样式
   * @param {Element} element - 元素
   * @param {string|Object} name - 样式名或样式对象
   * @param {string} [value] - 样式值，如果不提供则返回当前样式值
   * @returns {string|Element} 样式值或元素本身
   */
  css: function(element, name, value) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (typeof name === 'object') {
      for (const key in name) {
        if (Object.prototype.hasOwnProperty.call(name, key)) {
          element.style[key] = name[key];
        }
      }
      return element;
    }
    
    if (value === undefined) {
      return getComputedStyle(element)[name];
    }
    
    element.style[name] = value;
    return element;
  },
  
  /**
   * 获取元素的计算样式
   * @param {Element} element - 元素
   * @param {string} [name] - 样式名，如果不提供则返回所有计算样式
   * @returns {CSSStyleDeclaration|string} 计算样式对象或样式值
   */
  getComputedStyle: function(element, name) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    const computedStyle = getComputedStyle(element);
    
    if (name === undefined) {
      return computedStyle;
    }
    
    return computedStyle[name];
  },
  
  /**
   * 添加类名
   * @param {Element|Element[]} element - 元素或元素数组
   * @param {string|string[]} className - 类名或类名数组
   * @returns {Element|Element[]} 元素或元素数组
   */
  addClass: function(element, className) {
    if (Array.isArray(element)) {
      element.forEach(el => {
        if (el instanceof Element) {
          this._addClassToElement(el, className);
        }
      });
      return element;
    } else if (element instanceof Element) {
      this._addClassToElement(element, className);
      return element;
    }
    
    return element;
  },
  
  /**
   * 内部方法：为单个元素添加类名
   * @private
   * @param {Element} element - 元素
   * @param {string|string[]} className - 类名或类名数组
   */
  _addClassToElement: function(element, className) {
    if (Array.isArray(className)) {
      className.forEach(cls => {
        if (typeof cls === 'string') {
          element.classList.add(cls);
        }
      });
    } else if (typeof className === 'string') {
      element.classList.add(className);
    }
  },
  
  /**
   * 移除类名
   * @param {Element|Element[]} element - 元素或元素数组
   * @param {string|string[]} className - 类名或类名数组
   * @returns {Element|Element[]} 元素或元素数组
   */
  removeClass: function(element, className) {
    if (Array.isArray(element)) {
      element.forEach(el => {
        if (el instanceof Element) {
          this._removeClassFromElement(el, className);
        }
      });
      return element;
    } else if (element instanceof Element) {
      this._removeClassFromElement(element, className);
      return element;
    }
    
    return element;
  },
  
  /**
   * 内部方法：从单个元素移除类名
   * @private
   * @param {Element} element - 元素
   * @param {string|string[]} className - 类名或类名数组
   */
  _removeClassFromElement: function(element, className) {
    if (Array.isArray(className)) {
      className.forEach(cls => {
        if (typeof cls === 'string') {
          element.classList.remove(cls);
        }
      });
    } else if (typeof className === 'string') {
      element.classList.remove(className);
    }
  },
  
  /**
   * 切换类名
   * @param {Element|Element[]} element - 元素或元素数组
   * @param {string} className - 类名
   * @param {boolean} [force] - 强制添加或移除类名
   * @returns {Element|Element[]} 元素或元素数组
   */
  toggleClass: function(element, className, force) {
    if (Array.isArray(element)) {
      element.forEach(el => {
        if (el instanceof Element) {
          this._toggleClassForElement(el, className, force);
        }
      });
      return element;
    } else if (element instanceof Element) {
      this._toggleClassForElement(element, className, force);
      return element;
    }
    
    return element;
  },
  
  /**
   * 内部方法：为单个元素切换类名
   * @private
   * @param {Element} element - 元素
   * @param {string} className - 类名
   * @param {boolean} [force] - 强制添加或移除类名
   */
  _toggleClassForElement: function(element, className, force) {
    if (typeof className === 'string') {
      if (force !== undefined) {
        element.classList.toggle(className, force);
      } else {
        element.classList.toggle(className);
      }
    }
  },
  
  /**
   * 检查元素是否包含类名
   * @param {Element} element - 元素
   * @param {string} className - 类名
   * @returns {boolean} 是否包含类名
   */
  hasClass: function(element, className) {
    if (!(element instanceof Element) || typeof className !== 'string') {
      return false;
    }
    
    return element.classList.contains(className);
  },
  
  /**
   * 获取元素的类名列表
   * @param {Element} element - 元素
   * @returns {string[]} 类名列表
   */
  getClassList: function(element) {
    if (!(element instanceof Element)) {
      return [];
    }
    
    return Array.from(element.classList);
  },
  
  /**
   * 获取元素的尺寸和位置信息
   * @param {Element} element - 元素
   * @returns {Object} 尺寸和位置信息对象
   */
  getRect: function(element) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    return element.getBoundingClientRect();
  },
  
  /**
   * 获取元素相对于文档的位置
   * @param {Element} element - 元素
   * @returns {Object} 位置对象，包含top和left属性
   */
  getPosition: function(element) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    const rect = element.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
    };
  },
  
  /**
   * 获取元素的宽度
   * @param {Element} element - 元素
   * @param {boolean} [includeMargin=false] - 是否包含外边距
   * @returns {number} 宽度
   */
  getWidth: function(element, includeMargin = false) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    const styles = getComputedStyle(element);
    let width = element.offsetWidth;
    
    if (includeMargin) {
      width += parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
    }
    
    return width;
  },
  
  /**
   * 获取元素的高度
   * @param {Element} element - 元素
   * @param {boolean} [includeMargin=false] - 是否包含外边距
   * @returns {number} 高度
   */
  getHeight: function(element, includeMargin = false) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    const styles = getComputedStyle(element);
    let height = element.offsetHeight;
    
    if (includeMargin) {
      height += parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
    }
    
    return height;
  },
  
  /**
   * 获取元素的内部宽度（不包括边框和外边距）
   * @param {Element} element - 元素
   * @returns {number} 内部宽度
   */
  getInnerWidth: function(element) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    return element.clientWidth;
  },
  
  /**
   * 获取元素的内部高度（不包括边框和外边距）
   * @param {Element} element - 元素
   * @returns {number} 内部高度
   */
  getInnerHeight: function(element) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    return element.clientHeight;
  },
  
  /**
   * 获取元素的外部宽度（包括边框和外边距）
   * @param {Element} element - 元素
   * @returns {number} 外部宽度
   */
  getOuterWidth: function(element) {
    return this.getWidth(element, true);
  },
  
  /**
   * 获取元素的外部高度（包括边框和外边距）
   * @param {Element} element - 元素
   * @returns {number} 外部高度
   */
  getOuterHeight: function(element) {
    return this.getHeight(element, true);
  },
  
  /**
   * 获取或设置元素的滚动位置
   * @param {Element} element - 元素
   * @param {number} [x] - 水平滚动位置
   * @param {number} [y] - 垂直滚动位置
   * @returns {Object|Element} 滚动位置对象或元素本身
   */
  scroll: function(element, x, y) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (x === undefined && y === undefined) {
      return {
        left: element.scrollLeft,
        top: element.scrollTop
      };
    }
    
    if (x !== undefined) {
      element.scrollLeft = x;
    }
    
    if (y !== undefined) {
      element.scrollTop = y;
    }
    
    return element;
  },
  
  /**
   * 获取或设置元素的水平滚动位置
   * @param {Element} element - 元素
   * @param {number} [value] - 水平滚动位置
   * @returns {number|Element} 水平滚动位置或元素本身
   */
  scrollLeft: function(element, value) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (value === undefined) {
      return element.scrollLeft;
    }
    
    element.scrollLeft = value;
    return element;
  },
  
  /**
   * 获取或设置元素的垂直滚动位置
   * @param {Element} element - 元素
   * @param {number} [value] - 垂直滚动位置
   * @returns {number|Element} 垂直滚动位置或元素本身
   */
  scrollTop: function(element, value) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (value === undefined) {
      return element.scrollTop;
    }
    
    element.scrollTop = value;
    return element;
  },
  
  /**
   * 获取元素的滚动宽度
   * @param {Element} element - 元素
   * @returns {number} 滚动宽度
   */
  getScrollWidth: function(element) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    return element.scrollWidth;
  },
  
  /**
   * 获取元素的滚动高度
   * @param {Element} element - 元素
   * @returns {number} 滚动高度
   */
  getScrollHeight: function(element) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    return element.scrollHeight;
  },
  
  /**
   * 滚动到元素位置
   * @param {Element} element - 要滚动到的元素
   * @param {Object} [options] - 滚动选项
   * @param {boolean} [options.smooth=true] - 是否平滑滚动
   * @param {string} [options.block='start'] - 垂直对齐方式
   * @param {string} [options.inline='nearest'] - 水平对齐方式
   * @returns {Element} 元素本身
   */
  scrollIntoView: function(element, options = {}) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    const { smooth = true, block = 'start', inline = 'nearest' } = options;
    
    element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block,
      inline
    });
    
    return element;
  },
  
  /**
   * 获取元素的父元素
   * @param {Element} element - 元素
   * @returns {Element|null} 父元素
   */
  getParent: function(element) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    return element.parentElement;
  },
  
  /**
   * 获取元素的所有父元素
   * @param {Element} element - 元素
   * @param {string} [selector] - 选择器，用于筛选父元素
   * @returns {Element[]} 父元素数组
   */
  getParents: function(element, selector) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    const parents = [];
    let parent = element.parentElement;
    
    while (parent) {
      if (!selector || parent.matches(selector)) {
        parents.push(parent);
      }
      parent = parent.parentElement;
    }
    
    return parents;
  },
  
  /**
   * 获取元素的最近的匹配选择器的父元素
   * @param {Element} element - 元素
   * @param {string} selector - 选择器
   * @returns {Element|null} 最近的匹配选择器的父元素
   */
  closest: function(element, selector) {
    if (!(element instanceof Element) || typeof selector !== 'string') {
      return null;
    }
    
    return element.closest(selector);
  },
  
  /**
   * 获取元素的子元素
   * @param {Element} element - 元素
   * @param {string} [selector] - 选择器，用于筛选子元素
   * @returns {Element[]} 子元素数组
   */
  getChildren: function(element, selector) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    const children = Array.from(element.children);
    
    if (selector) {
      return children.filter(child => child.matches(selector));
    }
    
    return children;
  },
  
  /**
   * 获取元素的兄弟元素
   * @param {Element} element - 元素
   * @param {string} [selector] - 选择器，用于筛选兄弟元素
   * @returns {Element[]} 兄弟元素数组
   */
  getSiblings: function(element, selector) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (!element.parentElement) {
      return [];
    }
    
    const siblings = Array.from(element.parentElement.children).filter(child => child !== element);
    
    if (selector) {
      return siblings.filter(sibling => sibling.matches(selector));
    }
    
    return siblings;
  },
  
  /**
   * 获取元素的下一个兄弟元素
   * @param {Element} element - 元素
   * @param {string} [selector] - 选择器，用于筛选兄弟元素
   * @returns {Element|null} 下一个兄弟元素
   */
  getNextSibling: function(element, selector) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    let sibling = element.nextElementSibling;
    
    if (!sibling) {
      return null;
    }
    
    if (selector) {
      while (sibling && !sibling.matches(selector)) {
        sibling = sibling.nextElementSibling;
      }
    }
    
    return sibling;
  },
  
  /**
   * 获取元素的上一个兄弟元素
   * @param {Element} element - 元素
   * @param {string} [selector] - 选择器，用于筛选兄弟元素
   * @returns {Element|null} 上一个兄弟元素
   */
  getPrevSibling: function(element, selector) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    let sibling = element.previousElementSibling;
    
    if (!sibling) {
      return null;
    }
    
    if (selector) {
      while (sibling && !sibling.matches(selector)) {
        sibling = sibling.previousElementSibling;
      }
    }
    
    return sibling;
  },
  
  /**
   * 获取元素的所有下一个兄弟元素
   * @param {Element} element - 元素
   * @param {string} [selector] - 选择器，用于筛选兄弟元素
   * @returns {Element[]} 下一个兄弟元素数组
   */
  getNextSiblings: function(element, selector) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    const siblings = [];
    let sibling = element.nextElementSibling;
    
    while (sibling) {
      if (!selector || sibling.matches(selector)) {
        siblings.push(sibling);
      }
      sibling = sibling.nextElementSibling;
    }
    
    return siblings;
  },
  
  /**
   * 获取元素的所有上一个兄弟元素
   * @param {Element} element - 元素
   * @param {string} [selector] - 选择器，用于筛选兄弟元素
   * @returns {Element[]} 上一个兄弟元素数组
   */
  getPrevSiblings: function(element, selector) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    const siblings = [];
    let sibling = element.previousElementSibling;
    
    while (sibling) {
      if (!selector || sibling.matches(selector)) {
        siblings.push(sibling);
      }
      sibling = sibling.previousElementSibling;
    }
    
    return siblings.reverse(); // 反转数组，使其按照从近到远的顺序排列
  },
  
  /**
   * 获取元素的第一个子元素
   * @param {Element} element - 元素
   * @param {string} [selector] - 选择器，用于筛选子元素
   * @returns {Element|null} 第一个子元素
   */
  getFirstChild: function(element, selector) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (selector) {
      const children = this.getChildren(element, selector);
      return children.length > 0 ? children[0] : null;
    }
    
    return element.firstElementChild;
  },
  
  /**
   * 获取元素的最后一个子元素
   * @param {Element} element - 元素
   * @param {string} [selector] - 选择器，用于筛选子元素
   * @returns {Element|null} 最后一个子元素
   */
  getLastChild: function(element, selector) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (selector) {
      const children = this.getChildren(element, selector);
      return children.length > 0 ? children[children.length - 1] : null;
    }
    
    return element.lastElementChild;
  },
  
  /**
   * 检查元素是否匹配选择器
   * @param {Element} element - 元素
   * @param {string} selector - 选择器
   * @returns {boolean} 是否匹配选择器
   */
  matches: function(element, selector) {
    if (!(element instanceof Element) || typeof selector !== 'string') {
      return false;
    }
    
    return element.matches(selector);
  },
  
  /**
   * 检查元素是否包含另一个元素
   * @param {Element} parent - 父元素
   * @param {Element} child - 子元素
   * @returns {boolean} 是否包含
   */
  contains: function(parent, child) {
    if (!(parent instanceof Element) || !(child instanceof Element)) {
      return false;
    }
    
    return parent.contains(child);
  },
  
  /**
   * 检查元素是否可见
   * @param {Element} element - 元素
   * @returns {boolean} 是否可见
   */
  isVisible: function(element) {
    if (!(element instanceof Element)) {
      return false;
    }
    
    const style = getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden' && element.offsetWidth > 0 && element.offsetHeight > 0;
  },
  
  /**
   * 显示元素
   * @param {Element|Element[]} element - 元素或元素数组
   * @param {string} [display='block'] - 显示方式
   * @returns {Element|Element[]} 元素或元素数组
   */
  show: function(element, display = 'block') {
    if (Array.isArray(element)) {
      element.forEach(el => {
        if (el instanceof Element) {
          el.style.display = display;
        }
      });
      return element;
    } else if (element instanceof Element) {
      element.style.display = display;
      return element;
    }
    
    return element;
  },
  
  /**
   * 隐藏元素
   * @param {Element|Element[]} element - 元素或元素数组
   * @returns {Element|Element[]} 元素或元素数组
   */
  hide: function(element) {
    if (Array.isArray(element)) {
      element.forEach(el => {
        if (el instanceof Element) {
          el.style.display = 'none';
        }
      });
      return element;
    } else if (element instanceof Element) {
      element.style.display = 'none';
      return element;
    }
    
    return element;
  },
  
  /**
   * 切换元素的显示状态
   * @param {Element|Element[]} element - 元素或元素数组
   * @param {string} [display='block'] - 显示方式
   * @returns {Element|Element[]} 元素或元素数组
   */
  toggle: function(element, display = 'block') {
    if (Array.isArray(element)) {
      element.forEach(el => {
        if (el instanceof Element) {
          el.style.display = getComputedStyle(el).display === 'none' ? display : 'none';
        }
      });
      return element;
    } else if (element instanceof Element) {
      element.style.display = getComputedStyle(element).display === 'none' ? display : 'none';
      return element;
    }
    
    return element;
  },
  
  /**
   * 添加事件监听器
   * @param {Element|Element[]|Window|Document} element - 元素、元素数组、窗口或文档
   * @param {string} event - 事件类型
   * @param {Function} callback - 回调函数
   * @param {Object|boolean} [options] - 选项对象或捕获标志
   * @returns {Function} 移除事件监听器的函数
   */
  on: function(element, event, callback, options) {
    const elements = Array.isArray(element) ? element : [element];
    
    elements.forEach(el => {
      if (el && typeof el.addEventListener === 'function') {
        el.addEventListener(event, callback, options);
      }
    });
    
    return function off() {
      elements.forEach(el => {
        if (el && typeof el.removeEventListener === 'function') {
          el.removeEventListener(event, callback, options);
        }
      });
    };
  },
  
  /**
   * 移除事件监听器
   * @param {Element|Element[]|Window|Document} element - 元素、元素数组、窗口或文档
   * @param {string} event - 事件类型
   * @param {Function} callback - 回调函数
   * @param {Object|boolean} [options] - 选项对象或捕获标志
   */
  off: function(element, event, callback, options) {
    const elements = Array.isArray(element) ? element : [element];
    
    elements.forEach(el => {
      if (el && typeof el.removeEventListener === 'function') {
        el.removeEventListener(event, callback, options);
      }
    });
  },
  
  /**
   * 添加一次性事件监听器
   * @param {Element|Element[]|Window|Document} element - 元素、元素数组、窗口或文档
   * @param {string} event - 事件类型
   * @param {Function} callback - 回调函数
   * @param {Object|boolean} [options] - 选项对象或捕获标志
   * @returns {Function} 移除事件监听器的函数
   */
  once: function(element, event, callback, options) {
    const elements = Array.isArray(element) ? element : [element];
    
    const wrappedCallback = function(e) {
      callback.call(this, e);
      elements.forEach(el => {
        if (el && typeof el.removeEventListener === 'function') {
          el.removeEventListener(event, wrappedCallback, options);
        }
      });
    };
    
    elements.forEach(el => {
      if (el && typeof el.addEventListener === 'function') {
        el.addEventListener(event, wrappedCallback, options);
      }
    });
    
    return function off() {
      elements.forEach(el => {
        if (el && typeof el.removeEventListener === 'function') {
          el.removeEventListener(event, wrappedCallback, options);
        }
      });
    };
  },
  
  /**
   * 触发事件
   * @param {Element|Element[]|Window|Document} element - 元素、元素数组、窗口或文档
   * @param {string} event - 事件类型
   * @param {Object} [detail] - 事件详情
   * @returns {boolean} 是否成功触发事件
   */
  trigger: function(element, event, detail) {
    const elements = Array.isArray(element) ? element : [element];
    let success = true;
    
    elements.forEach(el => {
      if (el) {
        let evt;
        
        try {
          evt = new CustomEvent(event, {
            bubbles: true,
            cancelable: true,
            detail: detail
          });
        } catch (e) {
          // 如果CustomEvent不可用，则使用Event
          evt = document.createEvent('Event');
          evt.initEvent(event, true, true);
          evt.detail = detail;
        }
        
        const result = el.dispatchEvent(evt);
        if (!result) {
          success = false;
        }
      } else {
        success = false;
      }
    });
    
    return success;
  },
  
  /**
   * 委托事件处理
   * @param {Element|Document} element - 元素或文档
   * @param {string} selector - 选择器
   * @param {string} event - 事件类型
   * @param {Function} callback - 回调函数
   * @param {Object|boolean} [options] - 选项对象或捕获标志
   * @returns {Function} 移除事件监听器的函数
   */
  delegate: function(element, selector, event, callback, options) {
    if (!element || typeof element.addEventListener !== 'function') {
      throw new Error('元素必须是DOM元素或文档');
    }
    
    const wrappedCallback = function(e) {
      let target = e.target;
      
      while (target && target !== element) {
        if (target.matches(selector)) {
          callback.call(target, e);
          break;
        }
        target = target.parentElement;
      }
    };
    
    element.addEventListener(event, wrappedCallback, options);
    
    return function off() {
      element.removeEventListener(event, wrappedCallback, options);
    };
  },
  
  /**
   * 阻止事件默认行为
   * @param {Event} event - 事件对象
   */
  preventDefault: function(event) {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
    }
  },
  
  /**
   * 阻止事件冒泡
   * @param {Event} event - 事件对象
   */
  stopPropagation: function(event) {
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }
  },
  
  /**
   * 阻止事件默认行为和冒泡
   * @param {Event} event - 事件对象
   */
  stopEvent: function(event) {
    this.preventDefault(event);
    this.stopPropagation(event);
  },
  
  /**
   * 获取事件目标元素
   * @param {Event} event - 事件对象
   * @returns {Element|null} 目标元素
   */
  getEventTarget: function(event) {
    if (!event) {
      return null;
    }
    
    return event.target || event.srcElement;
  },
  
  /**
   * 获取事件当前目标元素
   * @param {Event} event - 事件对象
   * @returns {Element|null} 当前目标元素
   */
  getEventCurrentTarget: function(event) {
    if (!event) {
      return null;
    }
    
    return event.currentTarget;
  },
  
  /**
   * 获取事件相关目标元素
   * @param {Event} event - 事件对象
   * @returns {Element|null} 相关目标元素
   */
  getEventRelatedTarget: function(event) {
    if (!event) {
      return null;
    }
    
    return event.relatedTarget;
  },
  
  /**
   * 获取鼠标事件的坐标
   * @param {MouseEvent} event - 鼠标事件对象
   * @returns {Object} 坐标对象，包含clientX、clientY、pageX、pageY、screenX、screenY属性
   */
  getMousePosition: function(event) {
    if (!event) {
      return { clientX: 0, clientY: 0, pageX: 0, pageY: 0, screenX: 0, screenY: 0 };
    }
    
    const pageX = event.pageX !== undefined ? event.pageX : event.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
    const pageY = event.pageY !== undefined ? event.pageY : event.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
    
    return {
      clientX: event.clientX || 0,
      clientY: event.clientY || 0,
      pageX: pageX || 0,
      pageY: pageY || 0,
      screenX: event.screenX || 0,
      screenY: event.screenY || 0
    };
  },
  
  /**
   * 获取触摸事件的坐标
   * @param {TouchEvent} event - 触摸事件对象
   * @param {number} [index=0] - 触摸点索引
   * @returns {Object} 坐标对象，包含clientX、clientY、pageX、pageY、screenX、screenY属性
   */
  getTouchPosition: function(event, index = 0) {
    if (!event || !event.touches || !event.touches[index]) {
      return { clientX: 0, clientY: 0, pageX: 0, pageY: 0, screenX: 0, screenY: 0 };
    }
    
    const touch = event.touches[index];
    
    return {
      clientX: touch.clientX || 0,
      clientY: touch.clientY || 0,
      pageX: touch.pageX || 0,
      pageY: touch.pageY || 0,
      screenX: touch.screenX || 0,
      screenY: touch.screenY || 0
    };
  },
  
  /**
   * 获取键盘事件的按键代码
   * @param {KeyboardEvent} event - 键盘事件对象
   * @returns {number} 按键代码
   */
  getKeyCode: function(event) {
    if (!event) {
      return 0;
    }
    
    return event.keyCode || event.which || 0;
  },
  
  /**
   * 获取键盘事件的按键名称
   * @param {KeyboardEvent} event - 键盘事件对象
   * @returns {string} 按键名称
   */
  getKeyName: function(event) {
    if (!event) {
      return '';
    }
    
    return event.key || '';
  },
  
  /**
   * 检查元素是否在视口中可见
   * @param {Element} element - 元素
   * @param {Object} [options] - 选项对象
   * @param {boolean} [options.partially=false] - 是否允许部分可见
   * @param {number} [options.threshold=0] - 可见阈值，0到1之间的数值
   * @returns {boolean} 是否在视口中可见
   */
  isInViewport: function(element, options = {}) {
    if (!(element instanceof Element)) {
      return false;
    }
    
    const { partially = false, threshold = 0 } = options;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    if (partially) {
      return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= windowHeight &&
        rect.left <= windowWidth
      );
    } else {
      const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const visibleWidth = Math.min(rect.right, windowWidth) - Math.max(rect.left, 0);
      const visibleArea = visibleHeight * visibleWidth;
      const elementArea = rect.height * rect.width;
      
      return visibleArea >= elementArea * threshold;
    }
  },
  
  /**
   * 监听元素进入或离开视口
   * @param {Element|Element[]} element - 元素或元素数组
   * @param {Object} options - 选项对象
   * @param {Function} [options.onEnter] - 元素进入视口时的回调函数
   * @param {Function} [options.onExit] - 元素离开视口时的回调函数
   * @param {Object} [options.observerOptions] - IntersectionObserver选项
   * @returns {Object} 观察器对象，包含start和stop方法
   */
  observeViewport: function(element, options = {}) {
    const elements = Array.isArray(element) ? element : [element];
    const validElements = elements.filter(el => el instanceof Element);
    
    if (validElements.length === 0) {
      throw new Error('必须提供有效的DOM元素');
    }
    
    const { onEnter, onExit, observerOptions = {} } = options;
    const elementStates = new Map();
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const isIntersecting = entry.isIntersecting;
        const wasIntersecting = elementStates.get(entry.target) || false;
        
        elementStates.set(entry.target, isIntersecting);
        
        if (isIntersecting && !wasIntersecting && typeof onEnter === 'function') {
          onEnter(entry.target, entry);
        } else if (!isIntersecting && wasIntersecting && typeof onExit === 'function') {
          onExit(entry.target, entry);
        }
      });
    }, observerOptions);
    
    return {
      start: function() {
        validElements.forEach(el => {
          observer.observe(el);
        });
        return this;
      },
      stop: function() {
        observer.disconnect();
        return this;
      }
    };
  },
  
  /**
   * 懒加载图片
   * @param {string|Element|Element[]} selector - 选择器、元素或元素数组
   * @param {Object} [options] - 选项对象
   * @param {string} [options.dataSrc='data-src'] - 数据源属性名
   * @param {string} [options.dataSrcset='data-srcset'] - 数据源集合属性名
   * @param {string} [options.loadingClass='loading'] - 加载中类名
   * @param {string} [options.loadedClass='loaded'] - 加载完成类名
   * @param {string} [options.errorClass='error'] - 加载错误类名
   * @param {Function} [options.onLoad] - 加载完成回调函数
   * @param {Function} [options.onError] - 加载错误回调函数
   * @param {Object} [options.observerOptions] - IntersectionObserver选项
   * @returns {Object} 懒加载对象，包含start和stop方法
   */
  lazyLoad: function(selector, options = {}) {
    const elements = typeof selector === 'string' ? this.getAll(selector) : 
                     Array.isArray(selector) ? selector : 
                     selector instanceof Element ? [selector] : [];
    
    const validElements = elements.filter(el => el instanceof Element);
    
    if (validElements.length === 0) {
      return {
        start: () => this,
        stop: () => this
      };
    }
    
    const {
      dataSrc = 'data-src',
      dataSrcset = 'data-srcset',
      loadingClass = 'loading',
      loadedClass = 'loaded',
      errorClass = 'error',
      onLoad,
      onError,
      observerOptions = {}
    } = options;
    
    const loadImage = (element) => {
      const src = element.getAttribute(dataSrc);
      const srcset = element.getAttribute(dataSrcset);
      
      if (!src && !srcset) {
        return;
      }
      
      this.addClass(element, loadingClass);
      
      const img = new Image();
      
      img.onload = () => {
        if (src) {
          element.src = src;
        }
        
        if (srcset) {
          element.srcset = srcset;
        }
        
        this.removeClass(element, loadingClass);
        this.addClass(element, loadedClass);
        
        if (typeof onLoad === 'function') {
          onLoad(element);
        }
      };
      
      img.onerror = () => {
        this.removeClass(element, loadingClass);
        this.addClass(element, errorClass);
        
        if (typeof onError === 'function') {
          onError(element);
        }
      };
      
      if (src) {
        img.src = src;
      }
      
      if (srcset) {
        img.srcset = srcset;
      }
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    return {
      start: function() {
        validElements.forEach(el => {
          observer.observe(el);
        });
        return this;
      },
      stop: function() {
        observer.disconnect();
        return this;
      },
      loadAll: function() {
        validElements.forEach(el => {
          loadImage(el);
        });
        return this;
      }
    };
  },
  
  /**
   * 无限滚动加载
   * @param {Element} container - 容器元素
   * @param {Function} callback - 加载更多内容的回调函数
   * @param {Object} [options] - 选项对象
   * @param {number} [options.threshold=0.5] - 触发阈值，0到1之间的数值
   * @param {number} [options.distance=0] - 距离底部的距离，单位为像素
   * @param {boolean} [options.horizontal=false] - 是否为水平滚动
   * @param {Element} [options.sentinel] - 哨兵元素，用于检测滚动位置
   * @returns {Object} 无限滚动对象，包含start和stop方法
   */
  infiniteScroll: function(container, callback, options = {}) {
    if (!(container instanceof Element)) {
      throw new Error('容器必须是DOM元素');
    }
    
    if (typeof callback !== 'function') {
      throw new Error('回调必须是函数');
    }
    
    const {
      threshold = 0.5,
      distance = 0,
      horizontal = false,
      sentinel
    } = options;
    
    let loading = false;
    let observer;
    
    const checkScroll = () => {
      if (loading) {
        return;
      }
      
      const containerRect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      
      let shouldLoad = false;
      
      if (horizontal) {
        const scrollRight = containerRect.right;
        shouldLoad = scrollRight - windowWidth * threshold <= distance;
      } else {
        const scrollBottom = containerRect.bottom;
        shouldLoad = scrollBottom - windowHeight * threshold <= distance;
      }
      
      if (shouldLoad) {
        loading = true;
        
        Promise.resolve(callback()).finally(() => {
          loading = false;
        });
      }
    };
    
    if (sentinel && sentinel instanceof Element) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !loading) {
          loading = true;
          
          Promise.resolve(callback()).finally(() => {
            loading = false;
          });
        }
      }, {
        threshold,
        rootMargin: `${distance}px`
      });
    }
    
    return {
      start: function() {
        if (observer && sentinel) {
          observer.observe(sentinel);
        } else {
          container.addEventListener('scroll', checkScroll);
          window.addEventListener('resize', checkScroll);
          checkScroll();
        }
        return this;
      },
      stop: function() {
        if (observer && sentinel) {
          observer.disconnect();
        } else {
          container.removeEventListener('scroll', checkScroll);
          window.removeEventListener('resize', checkScroll);
        }
        return this;
      },
      check: checkScroll
    };
  },
  
  /**
   * 创建动画
   * @param {Element} element - 元素
   * @param {Object|Object[]} keyframes - 关键帧对象或关键帧对象数组
   * @param {Object} [options] - 选项对象
   * @returns {Animation} 动画对象
   */
  animate: function(element, keyframes, options = {}) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    if (!keyframes) {
      throw new Error('必须提供关键帧');
    }
    
    return element.animate(keyframes, options);
  },
  
  /**
   * 平滑滚动到指定位置
   * @param {Element} container - 容器元素
   * @param {Object} options - 选项对象
   * @param {number} [options.top] - 垂直滚动位置
   * @param {number} [options.left] - 水平滚动位置
   * @param {string} [options.behavior='smooth'] - 滚动行为
   * @returns {Element} 容器元素
   */
  smoothScroll: function(container, options = {}) {
    if (!(container instanceof Element) && container !== window && container !== document) {
      throw new Error('容器必须是DOM元素、窗口或文档');
    }
    
    const { top, left, behavior = 'smooth' } = options;
    const target = container === window || container === document ? document.scrollingElement || document.documentElement : container;
    
    target.scrollTo({
      top: top !== undefined ? top : target.scrollTop,
      left: left !== undefined ? left : target.scrollLeft,
      behavior
    });
    
    return container;
  },
  
  /**
   * 平滑滚动到元素位置
   * @param {Element} element - 目标元素
   * @param {Object} [options] - 选项对象
   * @param {Element|Window} [options.container=window] - 滚动容器
   * @param {string} [options.behavior='smooth'] - 滚动行为
   * @param {string} [options.block='start'] - 垂直对齐方式
   * @param {string} [options.inline='nearest'] - 水平对齐方式
   * @param {number} [options.offset=0] - 偏移量
   * @returns {Element} 目标元素
   */
  scrollToElement: function(element, options = {}) {
    if (!(element instanceof Element)) {
      throw new Error('元素必须是DOM元素');
    }
    
    const {
      container = window,
      behavior = 'smooth',
      block = 'start',
      inline = 'nearest',
      offset = 0
    } = options;
    
    if (container === window) {
      const originalScrollBehavior = document.documentElement.style.scrollBehavior;
      
      if (offset !== 0) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetTop = rect.top + scrollTop - offset;
        
        document.documentElement.style.scrollBehavior = behavior;
        window.scrollTo(0, targetTop);
        document.documentElement.style.scrollBehavior = originalScrollBehavior;
      } else {
        element.scrollIntoView({
          behavior,
          block,
          inline
        });
      }
    } else if (container instanceof Element) {
      const rect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const relativeTop = rect.top - containerRect.top;
      const targetTop = container.scrollTop + relativeTop - offset;
      
      container.scrollTo({
        top: targetTop,
        behavior
      });
    }
    
    return element;
  }
};

module.exports = domUtils;