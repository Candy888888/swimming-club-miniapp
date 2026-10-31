// form.js - 表单处理工具

const validator = require('./validator');
const wxUtils = require('./wxUtils');
const error = require('./error');

/**
 * 表单处理工具
 * 用于处理表单数据、验证和提交
 */
const form = {
  /**
   * 初始化表单
   * @param {object} page - 页面实例
   * @param {string} formName - 表单名称
   * @param {object} initialData - 初始表单数据
   * @param {object} rules - 验证规则
   * @returns {object} 表单处理对象
   */
  init: function(page, formName = 'form', initialData = {}, rules = {}) {
    if (!page) {
      throw error.createParameterError('页面实例不能为空');
    }
    
    // 创建表单处理对象
    const formHandler = {
      // 页面实例
      page,
      
      // 表单名称
      formName,
      
      // 表单数据
      data: { ...initialData },
      
      // 验证规则
      rules,
      
      // 表单错误信息
      errors: {},
      
      // 表单是否已修改
      isDirty: false,
      
      // 表单是否正在提交
      isSubmitting: false,
      
      /**
       * 设置表单数据
       * @param {object|string} keyOrData - 键名或数据对象
       * @param {any} [value] - 值
       * @returns {object} 表单处理对象
       */
      setData: function(keyOrData, value) {
        if (typeof keyOrData === 'object') {
          // 设置多个字段
          this.data = { ...this.data, ...keyOrData };
          
          // 更新页面数据
          const pageData = {};
          pageData[this.formName] = this.data;
          this.page.setData(pageData);
          
          // 标记表单已修改
          this.isDirty = true;
          
          return this;
        } else if (typeof keyOrData === 'string') {
          // 设置单个字段
          this.data[keyOrData] = value;
          
          // 更新页面数据
          const pageData = {};
          pageData[`${this.formName}.${keyOrData}`] = value;
          this.page.setData(pageData);
          
          // 标记表单已修改
          this.isDirty = true;
          
          return this;
        }
        
        return this;
      },
      
      /**
       * 获取表单数据
       * @param {string} [key] - 键名，不传则返回整个表单数据
       * @returns {any} 表单数据
       */
      getData: function(key) {
        if (key) {
          return this.data[key];
        }
        return this.data;
      },
      
      /**
       * 重置表单
       * @param {object} [newData] - 新的表单数据，不传则使用初始数据
       * @returns {object} 表单处理对象
       */
      reset: function(newData) {
        // 重置表单数据
        this.data = newData ? { ...newData } : { ...initialData };
        
        // 清空错误信息
        this.errors = {};
        
        // 重置表单状态
        this.isDirty = false;
        this.isSubmitting = false;
        
        // 更新页面数据
        const pageData = {};
        pageData[this.formName] = this.data;
        pageData[`${this.formName}Errors`] = this.errors;
        this.page.setData(pageData);
        
        return this;
      },
      
      /**
       * 验证表单
       * @param {object} [customRules] - 自定义验证规则，不传则使用初始规则
       * @returns {boolean} 是否验证通过
       */
      validate: function(customRules) {
        // 使用自定义规则或初始规则
        const validationRules = customRules || this.rules;
        
        // 如果没有规则，直接返回验证通过
        if (!validationRules || Object.keys(validationRules).length === 0) {
          this.errors = {};
          return true;
        }
        
        // 验证表单数据
        const result = validator.validateForm(this.data, validationRules);
        
        // 更新错误信息
        this.errors = result.errors;
        
        // 更新页面数据
        const pageData = {};
        pageData[`${this.formName}Errors`] = this.errors;
        this.page.setData(pageData);
        
        return result.valid;
      },
      
      /**
       * 设置字段错误信息
       * @param {string} field - 字段名
       * @param {string} message - 错误信息
       * @returns {object} 表单处理对象
       */
      setError: function(field, message) {
        // 设置错误信息
        this.errors[field] = message;
        
        // 更新页面数据
        const pageData = {};
        pageData[`${this.formName}Errors.${field}`] = message;
        this.page.setData(pageData);
        
        return this;
      },
      
      /**
       * 清除字段错误信息
       * @param {string} [field] - 字段名，不传则清除所有错误
       * @returns {object} 表单处理对象
       */
      clearError: function(field) {
        if (field) {
          // 清除指定字段的错误
          delete this.errors[field];
          
          // 更新页面数据
          const pageData = {};
          pageData[`${this.formName}Errors.${field}`] = '';
          this.page.setData(pageData);
        } else {
          // 清除所有错误
          this.errors = {};
          
          // 更新页面数据
          const pageData = {};
          pageData[`${this.formName}Errors`] = {};
          this.page.setData(pageData);
        }
        
        return this;
      },
      
      /**
       * 获取字段错误信息
       * @param {string} [field] - 字段名，不传则返回所有错误
       * @returns {string|object} 错误信息
       */
      getError: function(field) {
        if (field) {
          return this.errors[field] || '';
        }
        return this.errors;
      },
      
      /**
       * 检查表单是否有错误
       * @returns {boolean} 是否有错误
       */
      hasError: function() {
        return Object.keys(this.errors).length > 0;
      },
      
      /**
       * 处理表单输入事件
       * @param {object} e - 事件对象
       * @returns {object} 表单处理对象
       */
      handleInput: function(e) {
        const { field } = e.currentTarget.dataset;
        const value = e.detail.value;
        
        if (!field) {
          console.error('表单字段未指定');
          return this;
        }
        
        // 设置表单数据
        this.setData(field, value);
        
        // 如果有对应的验证规则，进行实时验证
        if (this.rules && this.rules[field]) {
          const fieldRule = {};
          fieldRule[field] = this.rules[field];
          
          const result = validator.validateForm(this.data, fieldRule);
          
          if (!result.valid) {
            this.setError(field, result.errors[field]);
          } else {
            this.clearError(field);
          }
        }
        
        return this;
      },
      
      /**
       * 处理表单提交
       * @param {function} submitCallback - 提交回调函数
       * @param {object} [options] - 提交选项
       * @returns {Promise} Promise对象
       */
      handleSubmit: function(submitCallback, options = {}) {
        // 默认选项
        const defaultOptions = {
          // 是否显示加载提示
          showLoading: true,
          
          // 加载提示文本
          loadingText: '提交中...',
          
          // 是否在提交前验证表单
          validateBeforeSubmit: true,
          
          // 是否在提交成功后重置表单
          resetAfterSubmit: false,
          
          // 是否在提交成功后显示成功提示
          showSuccessToast: false,
          
          // 成功提示文本
          successText: '提交成功'
        };
        
        // 合并选项
        const submitOptions = { ...defaultOptions, ...options };
        
        // 如果正在提交，直接返回
        if (this.isSubmitting) {
          return Promise.reject(new Error('表单正在提交中'));
        }
        
        // 如果需要验证表单
        if (submitOptions.validateBeforeSubmit) {
          const isValid = this.validate();
          
          if (!isValid) {
            // 显示第一个错误
            const firstError = Object.values(this.errors)[0];
            if (firstError) {
              wxUtils.showToast({
                title: firstError,
                icon: 'none'
              });
            }
            
            return Promise.reject(new Error('表单验证失败'));
          }
        }
        
        // 标记表单正在提交
        this.isSubmitting = true;
        
        // 显示加载提示
        if (submitOptions.showLoading) {
          wxUtils.showLoading({
            title: submitOptions.loadingText
          });
        }
        
        // 执行提交回调
        return Promise.resolve()
          .then(() => {
            return submitCallback(this.data);
          })
          .then(result => {
            // 隐藏加载提示
            if (submitOptions.showLoading) {
              wxUtils.hideLoading();
            }
            
            // 显示成功提示
            if (submitOptions.showSuccessToast) {
              wxUtils.showToast({
                title: submitOptions.successText,
                icon: 'success'
              });
            }
            
            // 重置表单
            if (submitOptions.resetAfterSubmit) {
              this.reset();
            }
            
            // 标记表单提交完成
            this.isSubmitting = false;
            
            return result;
          })
          .catch(err => {
            // 隐藏加载提示
            if (submitOptions.showLoading) {
              wxUtils.hideLoading();
            }
            
            // 显示错误提示
            wxUtils.showToast({
              title: err.message || '提交失败',
              icon: 'none'
            });
            
            // 标记表单提交完成
            this.isSubmitting = false;
            
            throw err;
          });
      },
      
      /**
       * 从事件中获取表单数据
       * @param {object} e - 事件对象
       * @returns {object} 表单处理对象
       */
      getDataFromEvent: function(e) {
        if (e && e.detail && e.detail.value) {
          // 更新表单数据
          this.data = { ...this.data, ...e.detail.value };
          
          // 标记表单已修改
          this.isDirty = true;
        }
        
        return this;
      },
      
      /**
       * 检查表单是否已修改
       * @returns {boolean} 是否已修改
       */
      checkDirty: function() {
        return this.isDirty;
      },
      
      /**
       * 设置表单验证规则
       * @param {object} newRules - 新的验证规则
       * @returns {object} 表单处理对象
       */
      setRules: function(newRules) {
        this.rules = { ...newRules };
        return this;
      },
      
      /**
       * 添加表单验证规则
       * @param {string} field - 字段名
       * @param {object} rule - 验证规则
       * @returns {object} 表单处理对象
       */
      addRule: function(field, rule) {
        if (!this.rules) {
          this.rules = {};
        }
        
        this.rules[field] = rule;
        return this;
      },
      
      /**
       * 移除表单验证规则
       * @param {string} field - 字段名
       * @returns {object} 表单处理对象
       */
      removeRule: function(field) {
        if (this.rules && this.rules[field]) {
          delete this.rules[field];
        }
        return this;
      },
      
      /**
       * 填充表单数据
       * @param {object} data - 要填充的数据
       * @returns {object} 表单处理对象
       */
      fill: function(data) {
        if (!data || typeof data !== 'object') {
          return this;
        }
        
        // 更新表单数据
        this.data = { ...this.data, ...data };
        
        // 更新页面数据
        const pageData = {};
        pageData[this.formName] = this.data;
        this.page.setData(pageData);
        
        return this;
      },
      
      /**
       * 序列化表单数据为查询字符串
       * @returns {string} 查询字符串
       */
      serialize: function() {
        return Object.keys(this.data)
          .map(key => {
            const value = this.data[key];
            const encodedValue = typeof value === 'string' ? encodeURIComponent(value) : encodeURIComponent(JSON.stringify(value));
            return `${encodeURIComponent(key)}=${encodedValue}`;
          })
          .join('&');
      },
      
      /**
       * 从查询字符串解析表单数据
       * @param {string} queryString - 查询字符串
       * @returns {object} 表单处理对象
       */
      deserialize: function(queryString) {
        if (!queryString) {
          return this;
        }
        
        const data = {};
        
        queryString.split('&').forEach(item => {
          const parts = item.split('=');
          if (parts.length === 2) {
            const key = decodeURIComponent(parts[0]);
            const value = decodeURIComponent(parts[1]);
            
            // 尝试解析JSON
            try {
              data[key] = JSON.parse(value);
            } catch (e) {
              data[key] = value;
            }
          }
        });
        
        // 更新表单数据
        this.fill(data);
        
        return this;
      }
    };
    
    // 初始化页面数据
    const pageData = {};
    pageData[formName] = formHandler.data;
    pageData[`${formName}Errors`] = formHandler.errors;
    page.setData(pageData);
    
    return formHandler;
  },
  
  /**
   * 创建表单验证规则
   * @param {string} type - 规则类型
   * @param {object} [options] - 规则选项
   * @returns {object} 验证规则对象
   */
  createRule: function(type, options = {}) {
    return {
      type,
      ...options
    };
  },
  
  /**
   * 创建必填规则
   * @param {string} [message] - 错误信息
   * @returns {object} 验证规则对象
   */
  required: function(message = '此字段不能为空') {
    return this.createRule('required', { message });
  },
  
  /**
   * 创建字符串长度规则
   * @param {number} min - 最小长度
   * @param {number} max - 最大长度
   * @param {string} [message] - 错误信息
   * @returns {object} 验证规则对象
   */
  length: function(min, max, message) {
    return this.createRule('length', {
      min,
      max,
      message: message || `长度必须在${min}到${max}之间`
    });
  },
  
  /**
   * 创建手机号规则
   * @param {string} [message] - 错误信息
   * @returns {object} 验证规则对象
   */
  phone: function(message = '请输入有效的手机号') {
    return this.createRule('phone', { message });
  },
  
  /**
   * 创建邮箱规则
   * @param {string} [message] - 错误信息
   * @returns {object} 验证规则对象
   */
  email: function(message = '请输入有效的邮箱地址') {
    return this.createRule('email', { message });
  },
  
  /**
   * 创建身份证规则
   * @param {string} [message] - 错误信息
   * @returns {object} 验证规则对象
   */
  idCard: function(message = '请输入有效的身份证号码') {
    return this.createRule('idCard', { message });
  },
  
  /**
   * 创建数字规则
   * @param {number} [min] - 最小值
   * @param {number} [max] - 最大值
   * @param {string} [message] - 错误信息
   * @returns {object} 验证规则对象
   */
  number: function(min, max, message) {
    const options = {};
    
    if (min !== undefined) {
      options.min = min;
    }
    
    if (max !== undefined) {
      options.max = max;
    }
    
    if (message) {
      options.message = message;
    } else if (min !== undefined && max !== undefined) {
      options.message = `数值必须在${min}到${max}之间`;
    } else if (min !== undefined) {
      options.message = `数值不能小于${min}`;
    } else if (max !== undefined) {
      options.message = `数值不能大于${max}`;
    } else {
      options.message = '请输入有效的数字';
    }
    
    return this.createRule('number', options);
  },
  
  /**
   * 创建自定义验证规则
   * @param {function} validator - 验证函数
   * @param {string} [message] - 错误信息
   * @returns {object} 验证规则对象
   */
  custom: function(validator, message = '验证失败') {
    return this.createRule('custom', {
      validator,
      message
    });
  },
  
  /**
   * 创建正则表达式验证规则
   * @param {RegExp} pattern - 正则表达式
   * @param {string} [message] - 错误信息
   * @returns {object} 验证规则对象
   */
  pattern: function(pattern, message = '格式不正确') {
    return this.createRule('pattern', {
      pattern,
      message
    });
  },
  
  /**
   * 创建日期验证规则
   * @param {string} [format] - 日期格式
   * @param {string} [message] - 错误信息
   * @returns {object} 验证规则对象
   */
  date: function(format, message) {
    return this.createRule('date', {
      format: format || 'YYYY-MM-DD',
      message: message || '请输入有效的日期'
    });
  },
  
  /**
   * 创建URL验证规则
   * @param {string} [message] - 错误信息
   * @returns {object} 验证规则对象
   */
  url: function(message = '请输入有效的URL') {
    return this.createRule('url', { message });
  },
  
  /**
   * 创建确认字段验证规则
   * @param {string} field - 要确认的字段名
   * @param {string} [message] - 错误信息
   * @returns {object} 验证规则对象
   */
  confirm: function(field, message) {
    return this.createRule('confirm', {
      field,
      message: message || `输入不匹配`
    });
  }
};

module.exports = form;