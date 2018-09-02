/*!
 * jQuery JavaScript Library v2.0.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:30Z
 */
(function(window, undefined) {

  // Can't do this because several apps including ASP.NET trace
  // the stack via arguments.caller.callee and Firefox dies if
  // you try to trace through "use strict" call chains. (#13335)
  // Support: Firefox 18+
  //"use strict";
  var
    // A central reference to the root jQuery(document)
    rootjQuery,

    // The deferred used on DOM ready
    readyList,

    // Support: IE9
    // For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
    core_strundefined = typeof undefined,

    // Use the correct document accordingly with window argument (sandbox)
    location = window.location,
    document = window.document,
    docElem = document.documentElement,

    // Map over jQuery in case of overwrite
    _jQuery = window.jQuery,

    // Map over the $ in case of overwrite
    _$ = window.$,

    // [[Class]] -> type pairs
    class2type = {},

    // List of deleted data cache ids, so we can reuse them
    core_deletedIds = [],

    core_version = "2.0.3",

    // Save a reference to some core methods
    core_concat = core_deletedIds.concat,
    core_push = core_deletedIds.push,
    core_slice = core_deletedIds.slice,
    core_indexOf = core_deletedIds.indexOf,
    core_toString = class2type.toString,
    core_hasOwn = class2type.hasOwnProperty,
    core_trim = core_version.trim,

    // Define a local copy of jQuery
    jQuery = function(selector, context) {
      // The jQuery object is actually just the init constructor 'enhanced'
      //让用户在创建构造函数的时候不再需要每次都要new函数了！
      return new jQuery.fn.init(selector, context, rootjQuery);
    },

    // Used for matching numbers
    core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

    // Used for splitting on whitespace
    core_rnotwhite = /\S+/g,

    // A simple way to check for HTML strings
    // Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    // Strict HTML recognition (#11290: must start with <)
    rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

    // Match a standalone tag
    rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

    // Matches dashed string for camelizing
    rmsPrefix = /^-ms-/,
    rdashAlpha = /-([\da-z])/gi,

    // Used by jQuery.camelCase as callback to replace()
    fcamelCase = function(all, letter) {
      return letter.toUpperCase();
    },

    // The ready event handler and self cleanup method
    completed = function() {
      document.removeEventListener("DOMContentLoaded", completed, false);
      window.removeEventListener("load", completed, false);
      jQuery.ready();
    };

  //fn存在的原因是我们在需要原型的时候不再需要每次输入prototype了
  jQuery.fn = jQuery.prototype = {
    // The current version of jQuery being used
    jquery: core_version,

    constructor: jQuery,
    init: function(selector, context, rootjQuery) {
      var match, elem;

      // HANDLE: $(""), $(null), $(undefined), $(false)
      if (!selector) {
        return this;
      }

      // Handle HTML strings
      if (typeof selector === "string") {
        if (selector.charAt(0) === "<" && selector.charAt(selector.length -
            1) === ">" && selector.length >= 3) {
          // Assume that strings that start and end with <> are HTML and skip the regex check
          match = [null, selector, null];

        } else {
          match = rquickExpr.exec(selector);
        }

        // Match html or make sure no context is specified for #id
        //创建标签或者选择ID
        if (match && (match[1] || !context)) {

          // HANDLE: $(html) -> $(array)
          //第一个if标签能进入
          if (match[1]) {
            context = context instanceof jQuery ? context[0] : context;

            // scripts is true for back-compat
            //把字符串编码成节点数组
            //var str = '<li>1</li><li>2</li><li>3</li>';
            //下面会输出['li','li','li'],他的第二个参数指定了根节点
            //var arr = jQuery.parseHTML(str,document);

            jQuery.merge(this, jQuery.parseHTML(
              match[1],
              context && context.nodeType ? context.ownerDocument ||
              context : document,
              true
            ));

            // HANDLE: $(html, props)
            //创建标签带属性,第一个判断单标签的正则,第二个判断对象
            if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
              //对对象进行for in循环
              for (match in context) {
                // Properties of context are called as methods if possible
                //例如$('<li></li>',{title: 'hi',html: 'abcd'}).appendTo('ul');
                //this[match]会遍历到title和html，当html的时候会进入第一个if，因为html是个函数
                if (jQuery.isFunction(this[match])) {
                  this[match](context[match]);

                  // ...and otherwise set as attributes
                  //对不是函数的属性，就直接加属性了比如上面的title
                } else {
                  this.attr(match, context[match]);
                }
              }
            }

            return this;

            // HANDLE: $(#id)
            //能进入else的是id选项
            //match返回的结果这个样子：match = ['#div1',null,'div1']
          } else {
            elem = document.getElementById(match[2]);

            // Check parentNode to catch when Blackberry 4.6 returns
            // nodes that are no longer in the document #6963
            //双重判断自身和父级元素
            if (elem && elem.parentNode) {
              // Inject the element directly into the jQuery object
              //jQuery选择元素的时候是存储成JSON，而不是数组，所以要手动添加长度
              this.length = 1;
              this[0] = elem;
            }

            this.context = document;
            this.selector = selector;
            return this;
          }

          // HANDLE: $(expr, $(...))
        } else if (!context || context.jquery) {
          //rootjQuery : $(document).find('ul li.box')
          //这个find方法是调用的sizzle库
          return (context || rootjQuery)
            .find(selector);

          // HANDLE: $(expr, context)
          // (which is just equivalent to: $(context).find(expr)
        } else {
          return this.constructor(context)
            .find(selector);
        }

        // HANDLE: $(DOMElement)
      } else if (selector.nodeType) {
        this.context = this[0] = selector;
        this.length = 1;
        return this;

        // HANDLE: $(function)
        // Shortcut for document ready
      } else if (jQuery.isFunction(selector)) {
        return rootjQuery.ready(selector);
      }

      if (selector.selector !== undefined) {
        this.selector = selector.selector;
        this.context = selector.context;
      }

      //把类数组转换成数组从而可以调用数组方法
      return jQuery.makeArray(selector, this);
    },

    // Start with an empty selector
    selector: "",

    // The default length of a jQuery object is 0
    length: 0,

    toArray: function() {
      return core_slice.call(this);
    },

    // Get the Nth element in the matched element set OR
    // Get the whole matched element set as a clean array
    get: function(num) {
      return num == null ?

        // Return a 'clean' array
        this.toArray() :

        // Return just the object
        (num < 0 ? this[this.length + num] : this[num]);
    },

    // Take an array of elements and push it onto the stack
    // (returning the new matched element set)
    //jQuery 对象的入栈处理
    //可以看下jQeury中slice方法
    //map中也有调用
    pushStack: function(elems) {

      //能变红的是span部分,this目前指向的是div，并通过prevObject存了下来
      //当你想控制下面语句中的div对象的时候，可以调用end()其实访问的就是prevObject
      //$('div').pushStack($('span')).css('background','red')
      // Build a new jQuery matched element set
      var ret = jQuery.merge(this.constructor(), elems);

      // Add the old object onto the stack (as a reference)
      ret.prevObject = this;
      ret.context = this.context;

      // Return the newly-formed element set
      return ret;
    },

    // Execute a callback for every element in the matched set.
    // (You can seed the arguments with an array of args, but this is
    // only used internally.)
    //加强版的for循环吧
    //这个是实例方法
    each: function(callback, args) {
      //返回的是jQuery的工具方法
      return jQuery.each(this, callback, args);
    },

    ready: function(fn) {
      // Add the callback
      jQuery.ready.promise()
        .done(fn);

      return this;
    },

    slice: function() {
      //参数是个集合就需要通过apply来改变this指向
      return this.pushStack(core_slice.apply(this, arguments));
    },

    first: function() {
      return this.eq(0);
    },

    last: function() {
      return this.eq(-1);
    },

    //比如有很多对象，选出来具体的某一个
    eq: function(i) {
      var len = this.length,
        j = +i + (i < 0 ? len : 0);
      return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
    },

    map: function(callback) {
      return this.pushStack(jQuery.map(this, function(elem, i) {
        return callback.call(elem, i, elem);
      }));
    },

    end: function() {
      return this.prevObject || this.constructor(null);
    },

    // For internal use only.
    // Behaves like an Array's method, not like a jQuery method.
    push: core_push,
    sort: [].sort,
    splice: [].splice
  };

  // Give the init function the jQuery prototype for later instantiation
  jQuery.fn.init.prototype = jQuery.fn;

  //把一个对象复制到另一个对象里面，深浅复制
  //扩展静态方法, jQuery.fn.extend是扩展实例方法它指向jQuery原型
  //当只写一个对象自变量的时候，JQ中扩展插件的形式
  //$.extend({
  //	//扩展工具方法
  //	aaa:function(){
  //		alert(1);
  //	},
  //	bbb:function(){
  //		alert(2);
  //	}
  //});
  //
  //$.aaa();
  //$.bbb();
  //
  //
  //$.fn.extend({
  //	//扩展JQ实例方法
  //	aaa:function(){
  //		alert(3);
  //	},
  //	bbb:function(){
  //		alert(4);
  //	}
  //});
  //$().aaa();
  //$().bbb();
  //$.extend(); -> this -> $ this.aaa -> $.aaa()
  //$.fn.extend(); -> this -> $.fn -> this.aaa -> $().aaa() 实际上是通过创建对象来调用

  //当写多个对象自变量的时候，后面的对象都扩展到第一个对象身上
  //var a = {};
  //$.extend(a, {name: 'hello'},{age: 30});
  //console.log(a);

  //下面是深拷贝浅拷贝，默认是浅拷贝

  //var a = {}
  //var b ={name: {age:30}};
  //$.extend(a, b);//$.extend(trur, a, b);
  //a.name ='hi';
  //a.name.age = 20;
  //alert(b.name.age);
  //如果要进行深拷贝需要第一个参数为true

  jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
      target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      //deep深拷贝默认是false
      deep = false;

    // Handle a deep copy situation
    //看是不是深拷贝
    if (typeof target === "boolean") {
      //把第一个参数赋值给deep
      deep = target;
      //把第二个参数重新赋值给目标对象
      target = arguments[1] || {};
      // skip the boolean and the target
      i = 2;
    }

    // Handle case when target is a string or something (possible in deep copy)
    //看看参数是否是对象和函数！如果不是则返回空对象
    if (typeof target !== "object" && !jQuery.isFunction(target)) {
      target = {};
    }

    //如果只有一个参数则把对象加载到$对象上！小技巧！
    // extend jQuery itself if only one argument is passed
    if (length === i) {
      target = this;
      --i;
    }

    for (; i < length; i++) {
      // Only deal with non-null/undefined values
      if ((options = arguments[i]) != null) {
        // Extend the base object
        for (name in options) {
          src = target[name];
          copy = options[name];

          // Prevent never-ending loop
          //防止循环引用
          if (target === copy) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          //深拷贝
          if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray =
              jQuery.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              //和下面clone的功能类似
              clone = src && jQuery.isArray(src) ? src : [];

            } else {
              //这句话很关键看下面的代码：
              //var a = {name: {job: 'it'}}:
              //var b = {name: {age: 30}};
              //$.extend(true, a, b);
              //console.log(a);
              //a 并不会被覆盖的原因就是，clone等于src而不是空对象
              clone = src && jQuery.isPlainObject(src) ? src : {};
            }

            // Never move original objects, clone them
            target[name] = jQuery.extend(deep, clone, copy);

            // Don't bring in undefined values
            //浅拷贝
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  };

  //jQuery的工具方法
  jQuery.extend({
    // Unique for each copy of jQuery on the page
    //生成唯一JQ字符串(内部使用),把不是数字的换成空字符
    expando: "jQuery" + (core_version + Math.random())
      .replace(/\D/g, ""),

    //防止冲突
    //var Daiti = $.noConflict()//这句话是释放$;
    //var $ = 123;
    //Daiti(function(){
    //	alert($);
    //});
    noConflict: function(deep) {
      if (window.$ === jQuery) {
        window.$ = _$;
      }

      if (deep && window.jQuery === jQuery) {
        window.jQuery = _jQuery;
      }

      return jQuery;
    },

    //调用的顺序如下
    //$(function(){})-> $(document).ready(function(){}) -> $().ready() -> jQuery.ready.promise().done(fn) 返回的是一个延迟对象;
    // Is the DOM ready to be used? Set to true once it occurs.
    isReady: false,

    // A counter to track how many items to wait for before
    // the ready event fires. See #6781
    readyWait: 1,

    // Hold (or release) the ready event
    //推迟DOM触发
    // $.holdReady(true);

    //$.getScript('a.js',function({
    //$.holdReady(false);
    //}));
    //   $(function(){
    //     alert(2);
    //   });
    //
    holdReady: function(hold) {
      if (hold) {
        jQuery.readyWait++;
      } else {
        jQuery.ready(true);
      }
    },

    // Handle when the DOM is ready
    ready: function(wait) {

      // Abort if there are pending holds or we're already ready
      if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
        return;
      }

      // Remember that the DOM is ready
      jQuery.isReady = true;

      // If a normal DOM Ready event fired, decrement, and wait if need be
      if (wait !== true && --jQuery.readyWait > 0) {
        return;
      }
      //            $(document).ready(function(){
      //
      //		})

      // If there are functions bound, to execute
      //这个arg返回的就是jQuery
      //$(function(arg){
      //	alert(arg);
      //这个this指向的就是document
      // alert(this);
      //});
      readyList.resolveWith(document, [jQuery]);

      // Trigger any bound ready events
      //		$(document).on('ready', function(){
      //
      //		})
      if (jQuery.fn.trigger) {
        jQuery(document)
          .trigger("ready")
          .off("ready");
      }
    },

    // See test/unit/core.js for details concerning isFunction.
    // Since version 1.3, DOM methods and functions like alert
    // aren't supported. They return false on IE (#2968).
    //判断是否是函数，
    isFunction: function(obj) {
      return jQuery.type(obj) === "function";
    },

    isArray: Array.isArray,

    //windwo在js可以充当全局对象，还可以当浏览器窗口
    isWindow: function(obj) {
      return obj != null && obj === obj.window;
    },

    //typeof NaN会返回number，同时也会判断数字是否有限Number.MAX_VALUE
    isNumeric: function(obj) {
      return !isNaN(parseFloat(obj)) && isFinite(obj);
    },

    //判断数据类型
    type: function(obj) {
      if (obj == null) {
        return String(obj);
      }
      // Support: Safari <= 5.1 (functionish RegExp)
      return typeof obj === "object" || typeof obj === "function" ?
        //可以看到引用的是原生的.toString方法,然后通过jQuery.each来提取属性
        class2type[core_toString.call(obj)] || "object" :
        typeof obj;
    },

    isPlainObject: function(obj) {
      // Not plain objects:
      // - Any object or value whose internal [[Class]] property is not "[object Object]"
      // - DOM nodes
      // - window
      //节点的nodeType存在或者是window
      if (jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(
          obj)) {
        return false;
      }

      // Support: Firefox <20
      // The try/catch suppresses exceptions thrown when attempting to access
      // the "constructor" property of certain host objects, ie. |window.location|
      // https://bugzilla.mozilla.org/show_bug.cgi?id=814622
      try {
        if (obj.constructor &&
          //在最顶层的object原型里有个属性是isPrototypeof，这里用hasOwnproperty来检测是不是对象原型下的属性！
          !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")
        ) {
          return false;
        }
      } catch (e) {
        return false;
      }

      // If the function hasn't returned already, we're confident that
      // |obj| is a plain object, created by {} or constructed with new Object
      return true;
    },

    //判断对象下面是否有属性和方法，for in 不是自身属性和方法则不进行遍历
    isEmptyObject: function(obj) {
      var name;
      for (name in obj) {
        return false;
      }
      return true;
    },

    error: function(msg) {
      throw new Error(msg);
    },

    // data: string of html
    // context (optional): If specified, the fragment will be created in this context, defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    //解析HTML，把字符串翻译成HTML
    //var str = '<li></li><li></li><script></script>';
    //第三个布尔值的作用是是否解析script标签，如果true则解析
    //console.log($.parseHTML(str, document, true))
    parseHTML: function(data, context, keepScripts) {
      //data必须是字符串
      if (!data || typeof data !== "string") {
        return null;
      }
      //执行上下文的选择
      if (typeof context === "boolean") {
        keepScripts = context;
        context = false;
      }
      context = context || document;

      //用正则来判断html单标签比如<li></li>
      var parsed = rsingleTag.exec(data),
        scripts = !keepScripts && [];

      // Single tag 但标签
      if (parsed) {
        return [context.createElement(parsed[1])];
      }

      //创建多标签
      parsed = jQuery.buildFragment([data], context, scripts);

      if (scripts) {
        jQuery(scripts)
          .remove();
      }

      //节点我们都知道不是数组，最后通过merge把它转换成数组。。虽然我不是很懂
      return jQuery.merge([], parsed.childNodes);
    },

    //把字符串解析成JSON
    parseJSON: JSON.parse,

    // Cross-browser xml parsing
    parseXML: function(data) {
      var xml, tmp;
      //首先判断数据是否存在和字符串
      if (!data || typeof data !== "string") {
        return null;
      }

      // Support: IE9
      try {
        //创建实例对象
        tmp = new DOMParser();
        xml = tmp.parseFromString(data, "text/xml");
      } catch (e) {
        xml = undefined;
      }

      //其他浏览器如果出错会形成一个parsererror的标签，标签的内容是错误
      if (!xml || xml.getElementsByTagName("parsererror")
        .length) {
        jQuery.error("Invalid XML: " + data);
      }
      return xml;
    },

    noop: function() {},

    // Evaluates a script in a global context
    //全局解析JS
    //  function test(){
    //    jQuery.globalEval("var newVar = true;")
    //    var newVar = true;
    //  }
    //  test():
    // alert(newVar)
    globalEval: function(code) {
      var script,
        //需要把eval存成一个局部变量，而不是直接引用
        indirect = eval;

      code = jQuery.trim(code);

      if (code) {
        // If the code includes a valid, prologue position
        // strict mode pragma, execute code by injecting a
        // script tag into the document.
        //严格模式下创建script标签添加code再删除标签
        if (code.indexOf("use strict") === 1) {
          script = document.createElement("script");
          script.text = code;
          document.head.appendChild(script)
            .parentNode.removeChild(script);
        } else {
          // Otherwise, avoid the DOM node creation, insertion
          // and removal by using an indirect global eval
          indirect(code);
        }
      }
    },

    // Convert dashed to camelCase; used by the css and data modules
    // Microsoft forgot to hump their vendor prefix (#9572)
    camelCase: function(string) {
      return string.replace(rmsPrefix, "ms-")
        .replace(rdashAlpha, fcamelCase);
    },

    nodeName: function(elem, name) {
      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
    },

    // args is for internal usage only
    //遍历集合，第一个参数是对象，第二个参数是回调
    each: function(obj, callback, args) {
      var value,
        i = 0,
        length = obj.length,
        //类数组 {0:, 1:,2:, length:3}
        isArray = isArraylike(obj);

      //args一般是内部使用
      if (args) {
        if (isArray) {
          for (; i < length; i++) {
            value = callback.apply(obj[i], args);

            if (value === false) {
              break;
            }
          }
        } else {
          for (i in obj) {
            value = callback.apply(obj[i], args);

            if (value === false) {
              break;
            }
          }
        }

        // A special, fast, case for the most common use of each
      } else {
        if (isArray) {
          for (; i < length; i++) {
            value = callback.call(obj[i], i, obj[i]);

            if (value === false) {
              break;
            }
          }
        } else {
          for (i in obj) {
            value = callback.call(obj[i], i, obj[i]);

            if (value === false) {
              break;
            }
          }
        }
      }

      return obj;
    },

    //去前后空格
    //var str = ' hello ';
    //alert('('+$.trim(str)+')');
    trim: function(text) {
      return text == null ? "" : core_trim.call(text);
    },

    // results is for internal usage only
    //把类数组或字符串JSON 转换成数组
    makeArray: function(arr, results) {
      //判断第二个参数
      var ret = results || [];

      if (arr != null) {
        //用Object的原因是isArraylike只能接受对象
        if (isArraylike(Object(arr))) {
          jQuery.merge(ret,
            typeof arr === "string" ? [arr] : arr
          );
        } else {
          core_push.call(ret, arr);
        }
      }

      return ret;
    },

    //数组版的indexOf
    //   var arr = ['a','b','c','d'];
    //   alert($.inArray('b',arr));
    inArray: function(elem, arr, i) {
      return arr == null ? -1 : core_indexOf.call(arr, elem, i);
    },

    //合并数组
    //对内是合并JSON
    //if: $.merge(['a','b'],['c','d'])
    //else: $.merge(['a','b'], {0:'c',1:'d'})
    merge: function(first, second) {
      var l = second.length,
        i = first.length,
        j = 0;

      if (typeof l === "number") {
        for (; j < l; j++) {
          first[i++] = second[j];
        }
      }
      //JSON肯定走else
      else {
        while (second[j] !== undefined) {
          first[i++] = second[j++];
        }
      }

      first.length = i;

      return first;
    },

    //过滤新数组,用法如下
    //var arr = [1,2,3,4];
    //arr = $.grep(arr, function(n, i){
    //  return n > 2;
    //})
    //console.log(arr);
    grep: function(elems, callback, inv) {
      var retVal,
        ret = [],
        i = 0,
        length = elems.length;
      //不写参数，！！inv就是false
      inv = !!inv;

      // Go through the array, only saving the items
      // that pass the validator function
      for (; i < length; i++) {
        //比如上面的callback没有参数，那么inv是false， return n >2  在3，和4情况下是真，
        //那么经过两个！！ retVal就是真。。。所以inv ！== retVal 
        retVal = !!callback(elems[i], i);
        if (inv !== retVal) {
          ret.push(elems[i]);
        }
      }

      return ret;
    },

    // arg is for internal usage only
    //映射数组, 使用方法如下
    //var arr = [1,2,3,4];
    //arr = $.map(arr, function(){
    //  return n+1;
    //})
    map: function(elems, callback, arg) {
      var value,
        i = 0,
        length = elems.length,
        isArray = isArraylike(elems),
        ret = [];

      // Go through the array, translating each of the items to their
      if (isArray) {
        for (; i < length; i++) {
          value = callback(elems[i], i, arg);

          if (value != null) {
            ret[ret.length] = value;
          }
        }

        // Go through every key on the object,
      } else {
        for (i in elems) {
          value = callback(elems[i], i, arg);

          if (value != null) {
            ret[ret.length] = value;
          }
        }
      }

      // Flatten any nested arrays
      //展开内嵌数组
      return core_concat.apply([], ret);
    },

    // A global GUID counter for objects
    guid: 1,

    // Bind a function to a context, optionally partially applying any
    // arguments.
    //更改this指向
    proxy: function(fn, context) {
      var tmp, args, proxy;

      //这个地方的判断分析如下
      //var obj = {
      //  show: function(){
      //    alert(this);
      //  }
      //};
      //$(document).click($.prox(obj,'show'));这句话就相当于
      //$.proxy(obj,'show') -> $.proxy(obj.show,obj);

      if (typeof context === "string") {
        tmp = fn[context];
        context = fn;
        fn = tmp;
      }

      // Quick check to determine if target is callable, in the spec
      // this throws a TypeError, but we will just return undefined.
      if (!jQuery.isFunction(fn)) {
        return undefined;
      }

      // Simulated bind
      //前两个参数去除
      args = core_slice.call(arguments, 2);
      proxy = function() {
        return fn.apply(context || this, args.concat(core_slice.call(
          arguments)));
      };

      // Set the guid of unique handler to the same of original handler, so it can be removed
      proxy.guid = fn.guid = fn.guid || jQuery.guid++;

      return proxy;
    },

    //内部使用，多功能值操作
    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    access: function(elems, fn, key, value, chainable, emptyGet, raw) {
      var i = 0,
        length = elems.length,
        //如果key有值，则bulk是false
        bulk = key == null;

      // Sets many values
      //多个参数设置要判断是否是对象$('#div1').css({background: 'yellow',width: '300px'})
      if (jQuery.type(key) === "object") {
        chainable = true;
        for (i in key) {
          //递归调用access来设置每一个键里的单个值
          jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
        }

        // Sets one value
        //单个参数设置$('#div1').css('background','yellow');
      } else if (value !== undefined) {
        //手动设置一下，因为如果这个参数不写会是undefined
        chainable = true;

        if (!jQuery.isFunction(value)) {
          raw = true;
        }

        if (bulk) {
          // Bulk operations run against the entire set
          //如果是字符串就走if
          if (raw) {
            fn.call(elems, value);
            fn = null;

            // ...except when executing function values
            //如果是function就走else逻辑
          } else {
            bulk = fn;
            fn = function(elem, key, value) {
              return bulk.call(jQuery(elem), value);
            };
          }
        }

        if (fn) {
          for (; i < length; i++) {
            fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(
              elems[i], key)));
          }
        }
      }

      return chainable ?
        elems :

        // Gets
        bulk ?
        fn.call(elems) :
        length ? fn(elems[0], key) : emptyGet;
    },

    //alert($.now());
    now: Date.now,

    // A method for quickly swapping in/out CSS properties to get correct calculations.
    // Note: this method belongs to the css module but it's needed here for the support module.
    // If support gets modularized, this method should be moved back to the css module.
    //里面的display：none可以用display：block；visibility：hidden；position：absolute来代替然后内部swap再换回display：none
    //<div id="div1" style="width:100px; height:100px;background:red;display:none"></div>
    //$(function(){
    //  //jQuery 方法,可以获取隐藏元素的方法
    //  alert($('#diva').width());
    //  //原生的获取宽度方法,隐藏元素的值无法获取
    //  alert($('#div1').get(0).offsetWidth);
    //})
    swap: function(elem, options, callback, args) {
      var ret, name,
        old = {};

      // Remember the old values, and insert the new ones
      //保存现有值
      for (name in options) {
        old[name] = elem.style[name];
        elem.style[name] = options[name];
      }

      ret = callback.apply(elem, args || []);

      // Revert the old values
      //还原值
      for (name in options) {
        elem.style[name] = old[name];
      }

      return ret;
    }
  });

  jQuery.ready.promise = function(obj) {
    if (!readyList) {

      readyList = jQuery.Deferred();

      // Catch cases where $(document).ready() is called after the browser event has already occurred.
      // we once tried to use readyState "interactive" here, but it caused issues like the one
      // discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
      //给document一个旗子来表示DOM加载完成
      if (document.readyState === "complete") {
        // Handle it asynchronously to allow scripts the opportunity to delay ready
        setTimeout(jQuery.ready);

      } else {

        // Use the handy event callback
        document.addEventListener("DOMContentLoaded", completed, false);

        // A fallback to window.onload, that will always work
        window.addEventListener("load", completed, false);
      }
    }
    return readyList.promise(obj);
  };

  // Populate the class2type map
  jQuery.each("Boolean Number String Function Array Date RegExp Object Error"
    .split(" "),
    function(i, name) {
      class2type["[object " + name + "]"] = name.toLowerCase();
    });

  //判断是否数组，类数组
  function isArraylike(obj) {
    var length = obj.length,
      type = jQuery.type(obj);

    ///首先判断是否是window，因为不确定window下面是否会挂载array，function属性什么的，在下面会单独判断
    if (jQuery.isWindow(obj)) {
      return false;
    }

    //nodeType肯定是元素节点，如果有长度，那么肯定是类数组
    if (obj.nodeType === 1 && length) {
      return true;
    }

    //最后判断数组和函数
    return type === "array" || type !== "function" &&
      (length === 0 ||
        typeof length === "number" && length > 0 && (length - 1) in obj);
  }

  // All jQuery objects should point back to these
  rootjQuery = jQuery(document);
  /*!
   * Sizzle CSS Selector Engine v1.9.4-pre
   * http://sizzlejs.com/
   *
   * Copyright 2013 jQuery Foundation, Inc. and other contributors
   * Released under the MIT license
   * http://jquery.org/license
   *
   * Date: 2013-06-03
   */
  (function(window, undefined) {

    var i,
      support,
      cachedruns,
      Expr,
      getText,
      isXML,
      compile,
      outermostContext,
      sortInput,

      // Local document vars
      setDocument,
      document,
      docElem,
      documentIsHTML,
      rbuggyQSA,
      rbuggyMatches,
      matches,
      contains,

      // Instance-specific data
      expando = "sizzle" + -(new Date()),
      preferredDoc = window.document,
      dirruns = 0,
      done = 0,
      classCache = createCache(),
      tokenCache = createCache(),
      compilerCache = createCache(),
      hasDuplicate = false,
      sortOrder = function(a, b) {
        if (a === b) {
          hasDuplicate = true;
          return 0;
        }
        return 0;
      },

      // General-purpose constants
      strundefined = typeof undefined,
      MAX_NEGATIVE = 1 << 31,

      // Instance methods
      hasOwn = ({})
      .hasOwnProperty,
      arr = [],
      pop = arr.pop,
      push_native = arr.push,
      push = arr.push,
      slice = arr.slice,
      // Use a stripped-down indexOf if we can't use a native one
      indexOf = arr.indexOf || function(elem) {
        var i = 0,
          len = this.length;
        for (; i < len; i++) {
          if (this[i] === elem) {
            return i;
          }
        }
        return -1;
      },

      booleans =
      "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

      // Regular expressions

      // Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
      whitespace = "[\\x20\\t\\r\\n\\f]",
      // http://www.w3.org/TR/css3-syntax/#characters
      characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

      // Loosely modeled on CSS identifier characters
      // An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
      // Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
      identifier = characterEncoding.replace("w", "w#"),

      // Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
      attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" +
      whitespace +
      "*(?:([*^$|!~]?=)" + whitespace +
      "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" +
      whitespace + "*\\]",

      // Prefer arguments quoted,
      //   then not containing pseudos/brackets,
      //   then attribute selectors/non-parenthetical expressions,
      //   then anything else
      // These preferences are here to reduce the number of selectors
      //   needing tokenize in the PSEUDO preFilter
      pseudos = ":(" + characterEncoding +
      ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" +
      attributes.replace(3, 8) + ")*)|.*)\\)|)",

      // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
      rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
        whitespace + "+$", "g"),

      rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"),
      rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace +
        ")" + whitespace + "*"),

      rsibling = new RegExp(whitespace + "*[+~]"),
      rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*)" +
        whitespace + "*\\]", "g"),

      rpseudo = new RegExp(pseudos),
      ridentifier = new RegExp("^" + identifier + "$"),

      matchExpr = {
        "ID": new RegExp("^#(" + characterEncoding + ")"),
        "CLASS": new RegExp("^\\.(" + characterEncoding + ")"),
        "TAG": new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
        "ATTR": new RegExp("^" + attributes),
        "PSEUDO": new RegExp("^" + pseudos),
        "CHILD": new RegExp(
          "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
          whitespace +
          "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
          whitespace +
          "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
        "bool": new RegExp("^(?:" + booleans + ")$", "i"),
        // For use in libraries implementing .is()
        // We use this for POS matching in `select`
        "needsContext": new RegExp("^" + whitespace +
          "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
          whitespace + "*((?:-\\d)?\\d*)" + whitespace +
          "*\\)|)(?=[^-]|$)", "i")
      },

      rnative = /^[^{]+\{\s*\[native \w/,

      // Easily-parseable/retrievable ID or TAG or CLASS selectors
      rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

      rinputs = /^(?:input|select|textarea|button)$/i,
      rheader = /^h\d$/i,

      rescape = /'|\\/g,

      // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
      runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" +
        whitespace + ")|.)", "ig"),
      funescape = function(_, escaped, escapedWhitespace) {
        var high = "0x" + escaped - 0x10000;
        // NaN means non-codepoint
        // Support: Firefox
        // Workaround erroneous numeric interpretation of +"0x"
        return high !== high || escapedWhitespace ?
          escaped :
          // BMP codepoint
          high < 0 ?
          String.fromCharCode(high + 0x10000) :
          // Supplemental Plane codepoint (surrogate pair)
          String.fromCharCode(high >> 10 | 0xD800, high & 0x3FF | 0xDC00);
      };

    // Optimize for push.apply( _, NodeList )
    try {
      push.apply(
        (arr = slice.call(preferredDoc.childNodes)),
        preferredDoc.childNodes
      );
      // Support: Android<4.0
      // Detect silently failing push.apply
      arr[preferredDoc.childNodes.length].nodeType;
    } catch (e) {
      push = {
        apply: arr.length ?

          // Leverage slice if possible
          function(target, els) {
            push_native.apply(target, slice.call(els));
          } :

          // Support: IE<9
          // Otherwise append directly
          function(target, els) {
            var j = target.length,
              i = 0;
            // Can't trust NodeList.length
            while ((target[j++] = els[i++])) {}
            target.length = j - 1;
          }
      };
    }

    function Sizzle(selector, context, results, seed) {
      var match, elem, m, nodeType,
        // QSA vars
        i, groups, old, nid, newContext, newSelector;

      if ((context ? context.ownerDocument || context : preferredDoc) !==
        document) {
        setDocument(context);
      }

      context = context || document;
      results = results || [];

      if (!selector || typeof selector !== "string") {
        return results;
      }

      if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
        return [];
      }

      if (documentIsHTML && !seed) {

        // Shortcuts
        if ((match = rquickExpr.exec(selector))) {
          // Speed-up: Sizzle("#ID")
          if ((m = match[1])) {
            if (nodeType === 9) {
              elem = context.getElementById(m);
              // Check parentNode to catch when Blackberry 4.6 returns
              // nodes that are no longer in the document #6963
              if (elem && elem.parentNode) {
                // Handle the case where IE, Opera, and Webkit return items
                // by name instead of ID
                if (elem.id === m) {
                  results.push(elem);
                  return results;
                }
              } else {
                return results;
              }
            } else {
              // Context is not a document
              if (context.ownerDocument && (elem = context.ownerDocument.getElementById(
                  m)) &&
                contains(context, elem) && elem.id === m) {
                results.push(elem);
                return results;
              }
            }

            // Speed-up: Sizzle("TAG")
          } else if (match[2]) {
            push.apply(results, context.getElementsByTagName(selector));
            return results;

            // Speed-up: Sizzle(".CLASS")
          } else if ((m = match[3]) && support.getElementsByClassName &&
            context.getElementsByClassName) {
            push.apply(results, context.getElementsByClassName(m));
            return results;
          }
        }

        // QSA path
        if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
          nid = old = expando;
          newContext = context;
          newSelector = nodeType === 9 && selector;

          // qSA works strangely on Element-rooted queries
          // We can work around this by specifying an extra ID on the root
          // and working up from there (Thanks to Andrew Dupont for the technique)
          // IE 8 doesn't work on object elements
          if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
            groups = tokenize(selector);

            if ((old = context.getAttribute("id"))) {
              nid = old.replace(rescape, "\\$&");
            } else {
              context.setAttribute("id", nid);
            }
            nid = "[id='" + nid + "'] ";

            i = groups.length;
            while (i--) {
              groups[i] = nid + toSelector(groups[i]);
            }
            newContext = rsibling.test(selector) && context.parentNode ||
              context;
            newSelector = groups.join(",");
          }

          if (newSelector) {
            try {
              push.apply(results,
                newContext.querySelectorAll(newSelector)
              );
              return results;
            } catch (qsaError) {} finally {
              if (!old) {
                context.removeAttribute("id");
              }
            }
          }
        }
      }

      // All others
      return select(selector.replace(rtrim, "$1"), context, results, seed);
    }

    /**
     * Create key-value caches of limited size
     * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
     *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *	deleting the oldest entry
     */
    function createCache() {
      var keys = [];

      function cache(key, value) {
        // Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
        if (keys.push(key += " ") > Expr.cacheLength) {
          // Only keep the most recent entries
          delete cache[keys.shift()];
        }
        return (cache[key] = value);
      }
      return cache;
    }

    /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */
    function markFunction(fn) {
      fn[expando] = true;
      return fn;
    }

    /**
     * Support testing using an element
     * @param {Function} fn Passed the created div and expects a boolean result
     */
    function assert(fn) {
      var div = document.createElement("div");

      try {
        return !!fn(div);
      } catch (e) {
        return false;
      } finally {
        // Remove from its parent by default
        if (div.parentNode) {
          div.parentNode.removeChild(div);
        }
        // release memory in IE
        div = null;
      }
    }

    /**
     * Adds the same handler for all of the specified attrs
     * @param {String} attrs Pipe-separated list of attributes
     * @param {Function} handler The method that will be applied
     */
    function addHandle(attrs, handler) {
      var arr = attrs.split("|"),
        i = attrs.length;

      while (i--) {
        Expr.attrHandle[arr[i]] = handler;
      }
    }

    /**
     * Checks document order of two siblings
     * @param {Element} a
     * @param {Element} b
     * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
     */
    function siblingCheck(a, b) {
      var cur = b && a,
        diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
        (~b.sourceIndex || MAX_NEGATIVE) -
        (~a.sourceIndex || MAX_NEGATIVE);

      // Use IE sourceIndex if available on both nodes
      if (diff) {
        return diff;
      }

      // Check if b follows a
      if (cur) {
        while ((cur = cur.nextSibling)) {
          if (cur === b) {
            return -1;
          }
        }
      }

      return a ? 1 : -1;
    }

    /**
     * Returns a function to use in pseudos for input types
     * @param {String} type
     */
    function createInputPseudo(type) {
      return function(elem) {
        var name = elem.nodeName.toLowerCase();
        return name === "input" && elem.type === type;
      };
    }

    /**
     * Returns a function to use in pseudos for buttons
     * @param {String} type
     */
    function createButtonPseudo(type) {
      return function(elem) {
        var name = elem.nodeName.toLowerCase();
        return (name === "input" || name === "button") && elem.type ===
          type;
      };
    }

    /**
     * Returns a function to use in pseudos for positionals
     * @param {Function} fn
     */
    function createPositionalPseudo(fn) {
      return markFunction(function(argument) {
        argument = +argument;
        return markFunction(function(seed, matches) {
          var j,
            matchIndexes = fn([], seed.length, argument),
            i = matchIndexes.length;

          // Match elements found at the specified indexes
          while (i--) {
            if (seed[(j = matchIndexes[i])]) {
              seed[j] = !(matches[j] = seed[j]);
            }
          }
        });
      });
    }

    /**
     * Detect xml
     * @param {Element|Object} elem An element or a document
     */
    isXML = Sizzle.isXML = function(elem) {
      // documentElement is verified for cases where it doesn't yet exist
      // (such as loading iframes in IE - #4833)
      var documentElement = elem && (elem.ownerDocument || elem)
        .documentElement;
      return documentElement ? documentElement.nodeName !== "HTML" :
        false;
    };

    // Expose support vars for convenience
    support = Sizzle.support = {};

    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */
    setDocument = Sizzle.setDocument = function(node) {
      var doc = node ? node.ownerDocument || node : preferredDoc,
        parent = doc.defaultView;

      // If no document and documentElement is available, return
      if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
        return document;
      }

      // Set our document
      document = doc;
      docElem = doc.documentElement;

      // Support tests
      documentIsHTML = !isXML(doc);

      // Support: IE>8
      // If iframe document is assigned to "document" variable and if iframe has been reloaded,
      // IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
      // IE6-8 do not support the defaultView property so parent will be undefined
      if (parent && parent.attachEvent && parent !== parent.top) {
        parent.attachEvent("onbeforeunload", function() {
          setDocument();
        });
      }

      /* Attributes
      ---------------------------------------------------------------------- */

      // Support: IE<8
      // Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
      support.attributes = assert(function(div) {
        div.className = "i";
        return !div.getAttribute("className");
      });

      /* getElement(s)By*
      ---------------------------------------------------------------------- */

      // Check if getElementsByTagName("*") returns only elements
      support.getElementsByTagName = assert(function(div) {
        div.appendChild(doc.createComment(""));
        return !div.getElementsByTagName("*")
          .length;
      });

      // Check if getElementsByClassName can be trusted
      support.getElementsByClassName = assert(function(div) {
        div.innerHTML =
          "<div class='a'></div><div class='a i'></div>";

        // Support: Safari<4
        // Catch class over-caching
        div.firstChild.className = "i";
        // Support: Opera<10
        // Catch gEBCN failure to find non-leading classes
        return div.getElementsByClassName("i")
          .length === 2;
      });

      // Support: IE<10
      // Check if getElementById returns elements by name
      // The broken getElementById methods don't pick up programatically-set names,
      // so use a roundabout getElementsByName test
      support.getById = assert(function(div) {
        docElem.appendChild(div)
          .id = expando;
        return !doc.getElementsByName || !doc.getElementsByName(
            expando)
          .length;
      });

      // ID find and filter
      if (support.getById) {
        Expr.find["ID"] = function(id, context) {
          if (typeof context.getElementById !== strundefined &&
            documentIsHTML) {
            var m = context.getElementById(id);
            // Check parentNode to catch when Blackberry 4.6 returns
            // nodes that are no longer in the document #6963
            return m && m.parentNode ? [m] : [];
          }
        };
        Expr.filter["ID"] = function(id) {
          var attrId = id.replace(runescape, funescape);
          return function(elem) {
            return elem.getAttribute("id") === attrId;
          };
        };
      } else {
        // Support: IE6/7
        // getElementById is not reliable as a find shortcut
        delete Expr.find["ID"];

        Expr.filter["ID"] = function(id) {
          var attrId = id.replace(runescape, funescape);
          return function(elem) {
            var node = typeof elem.getAttributeNode !== strundefined &&
              elem.getAttributeNode("id");
            return node && node.value === attrId;
          };
        };
      }

      // Tag
      Expr.find["TAG"] = support.getElementsByTagName ?
        function(tag, context) {
          if (typeof context.getElementsByTagName !== strundefined) {
            return context.getElementsByTagName(tag);
          }
        } :
        function(tag, context) {
          var elem,
            tmp = [],
            i = 0,
            results = context.getElementsByTagName(tag);

          // Filter out possible comments
          if (tag === "*") {
            while ((elem = results[i++])) {
              if (elem.nodeType === 1) {
                tmp.push(elem);
              }
            }

            return tmp;
          }
          return results;
        };

      // Class
      Expr.find["CLASS"] = support.getElementsByClassName && function(
        className, context) {
        if (typeof context.getElementsByClassName !== strundefined &&
          documentIsHTML) {
          return context.getElementsByClassName(className);
        }
      };

      /* QSA/matchesSelector
      ---------------------------------------------------------------------- */

      // QSA and matchesSelector support

      // matchesSelector(:active) reports false when true (IE9/Opera 11.5)
      rbuggyMatches = [];

      // qSa(:focus) reports false when true (Chrome 21)
      // We allow this because of a bug in IE8/9 that throws an error
      // whenever `document.activeElement` is accessed on an iframe
      // So, we allow :focus to pass through QSA all the time to avoid the IE error
      // See http://bugs.jquery.com/ticket/13378
      rbuggyQSA = [];

      if ((support.qsa = rnative.test(doc.querySelectorAll))) {
        // Build QSA regex
        // Regex strategy adopted from Diego Perini
        assert(function(div) {
          // Select is set to empty string on purpose
          // This is to test IE's treatment of not explicitly
          // setting a boolean content attribute,
          // since its presence should be enough
          // http://bugs.jquery.com/ticket/12359
          div.innerHTML =
            "<select><option selected=''></option></select>";

          // Support: IE8
          // Boolean attributes and "value" are not treated correctly
          if (!div.querySelectorAll("[selected]")
            .length) {
            rbuggyQSA.push("\\[" + whitespace + "*(?:value|" +
              booleans + ")");
          }

          // Webkit/Opera - :checked should return selected option elements
          // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
          // IE8 throws error here and will not see later tests
          if (!div.querySelectorAll(":checked")
            .length) {
            rbuggyQSA.push(":checked");
          }
        });

        assert(function(div) {

          // Support: Opera 10-12/IE8
          // ^= $= *= and empty values
          // Should not select anything
          // Support: Windows 8 Native Apps
          // The type attribute is restricted during .innerHTML assignment
          var input = doc.createElement("input");
          input.setAttribute("type", "hidden");
          div.appendChild(input)
            .setAttribute("t", "");

          if (div.querySelectorAll("[t^='']")
            .length) {
            rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
          }

          // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
          // IE8 throws error here and will not see later tests
          if (!div.querySelectorAll(":enabled")
            .length) {
            rbuggyQSA.push(":enabled", ":disabled");
          }

          // Opera 10-11 does not throw on post-comma invalid pseudos
          div.querySelectorAll("*,:x");
          rbuggyQSA.push(",.*:");
        });
      }

      if ((support.matchesSelector = rnative.test((matches = docElem.webkitMatchesSelector ||
          docElem.mozMatchesSelector ||
          docElem.oMatchesSelector ||
          docElem.msMatchesSelector)))) {

        assert(function(div) {
          // Check to see if it's possible to do matchesSelector
          // on a disconnected node (IE 9)
          support.disconnectedMatch = matches.call(div, "div");

          // This should fail with an exception
          // Gecko does not error, returns false instead
          matches.call(div, "[s!='']:x");
          rbuggyMatches.push("!=", pseudos);
        });
      }

      rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
      rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join(
        "|"));

      /* Contains
      ---------------------------------------------------------------------- */

      // Element contains another
      // Purposefully does not implement inclusive descendent
      // As in, an element does not contain itself
      contains = rnative.test(docElem.contains) || docElem.compareDocumentPosition ?
        function(a, b) {
          var adown = a.nodeType === 9 ? a.documentElement : a,
            bup = b && b.parentNode;
          return a === bup || !!(bup && bup.nodeType === 1 && (
            adown.contains ?
            adown.contains(bup) :
            a.compareDocumentPosition && a.compareDocumentPosition(
              bup) & 16
          ));
        } :
        function(a, b) {
          if (b) {
            while ((b = b.parentNode)) {
              if (b === a) {
                return true;
              }
            }
          }
          return false;
        };

      /* Sorting
      ---------------------------------------------------------------------- */

      // Document order sorting
      sortOrder = docElem.compareDocumentPosition ?
        function(a, b) {

          // Flag for duplicate removal
          if (a === b) {
            hasDuplicate = true;
            return 0;
          }

          var compare = b.compareDocumentPosition && a.compareDocumentPosition &&
            a.compareDocumentPosition(b);

          if (compare) {
            // Disconnected nodes
            if (compare & 1 ||
              (!support.sortDetached && b.compareDocumentPosition(a) ===
                compare)) {

              // Choose the first element that is related to our preferred document
              if (a === doc || contains(preferredDoc, a)) {
                return -1;
              }
              if (b === doc || contains(preferredDoc, b)) {
                return 1;
              }

              // Maintain original order
              return sortInput ?
                (indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) :
                0;
            }

            return compare & 4 ? -1 : 1;
          }

          // Not directly comparable, sort on existence of method
          return a.compareDocumentPosition ? -1 : 1;
        } :
        function(a, b) {
          var cur,
            i = 0,
            aup = a.parentNode,
            bup = b.parentNode,
            ap = [a],
            bp = [b];

          // Exit early if the nodes are identical
          if (a === b) {
            hasDuplicate = true;
            return 0;

            // Parentless nodes are either documents or disconnected
          } else if (!aup || !bup) {
            return a === doc ? -1 :
              b === doc ? 1 :
              aup ? -1 :
              bup ? 1 :
              sortInput ?
              (indexOf.call(sortInput, a) - indexOf.call(sortInput, b)) :
              0;

            // If the nodes are siblings, we can do a quick check
          } else if (aup === bup) {
            return siblingCheck(a, b);
          }

          // Otherwise we need full lists of their ancestors for comparison
          cur = a;
          while ((cur = cur.parentNode)) {
            ap.unshift(cur);
          }
          cur = b;
          while ((cur = cur.parentNode)) {
            bp.unshift(cur);
          }

          // Walk down the tree looking for a discrepancy
          while (ap[i] === bp[i]) {
            i++;
          }

          return i ?
            // Do a sibling check if the nodes have a common ancestor
            siblingCheck(ap[i], bp[i]) :

            // Otherwise nodes in our document sort first
            ap[i] === preferredDoc ? -1 :
            bp[i] === preferredDoc ? 1 :
            0;
        };

      return doc;
    };

    Sizzle.matches = function(expr, elements) {
      return Sizzle(expr, null, null, elements);
    };

    Sizzle.matchesSelector = function(elem, expr) {
      // Set document vars if needed
      if ((elem.ownerDocument || elem) !== document) {
        setDocument(elem);
      }

      // Make sure that attribute selectors are quoted
      expr = expr.replace(rattributeQuotes, "='$1']");

      if (support.matchesSelector && documentIsHTML &&
        (!rbuggyMatches || !rbuggyMatches.test(expr)) &&
        (!rbuggyQSA || !rbuggyQSA.test(expr))) {

        try {
          var ret = matches.call(elem, expr);

          // IE 9's matchesSelector returns false on disconnected nodes
          if (ret || support.disconnectedMatch ||
            // As well, disconnected nodes are said to be in a document
            // fragment in IE 9
            elem.document && elem.document.nodeType !== 11) {
            return ret;
          }
        } catch (e) {}
      }

      return Sizzle(expr, document, null, [elem])
        .length > 0;
    };

    Sizzle.contains = function(context, elem) {
      // Set document vars if needed
      if ((context.ownerDocument || context) !== document) {
        setDocument(context);
      }
      return contains(context, elem);
    };

    Sizzle.attr = function(elem, name) {
      // Set document vars if needed
      if ((elem.ownerDocument || elem) !== document) {
        setDocument(elem);
      }

      var fn = Expr.attrHandle[name.toLowerCase()],
        // Don't get fooled by Object.prototype properties (jQuery #13807)
        val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ?
        fn(elem, name, !documentIsHTML) :
        undefined;

      return val === undefined ?
        support.attributes || !documentIsHTML ?
        elem.getAttribute(name) :
        (val = elem.getAttributeNode(name)) && val.specified ?
        val.value :
        null :
        val;
    };

    Sizzle.error = function(msg) {
      throw new Error("Syntax error, unrecognized expression: " + msg);
    };

    /**
     * Document sorting and removing duplicates
     * @param {ArrayLike} results
     */
    Sizzle.uniqueSort = function(results) {
      var elem,
        duplicates = [],
        j = 0,
        i = 0;

      // Unless we *know* we can detect duplicates, assume their presence
      hasDuplicate = !support.detectDuplicates;
      sortInput = !support.sortStable && results.slice(0);
      results.sort(sortOrder);

      if (hasDuplicate) {
        while ((elem = results[i++])) {
          if (elem === results[i]) {
            j = duplicates.push(i);
          }
        }
        while (j--) {
          results.splice(duplicates[j], 1);
        }
      }

      return results;
    };

    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
    getText = Sizzle.getText = function(elem) {
      var node,
        ret = "",
        i = 0,
        nodeType = elem.nodeType;

      if (!nodeType) {
        // If no nodeType, this is expected to be an array
        for (;
          (node = elem[i]); i++) {
          // Do not traverse comment nodes
          ret += getText(node);
        }
      } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
        // Use textContent for elements
        // innerText usage removed for consistency of new lines (see #11153)
        if (typeof elem.textContent === "string") {
          return elem.textContent;
        } else {
          // Traverse its children
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            ret += getText(elem);
          }
        }
      } else if (nodeType === 3 || nodeType === 4) {
        return elem.nodeValue;
      }
      // Do not include comment or processing instruction nodes

      return ret;
    };

    Expr = Sizzle.selectors = {

      // Can be adjusted by the user
      cacheLength: 50,

      createPseudo: markFunction,

      match: matchExpr,

      attrHandle: {},

      find: {},

      relative: {
        ">": {
          dir: "parentNode",
          first: true
        },
        " ": {
          dir: "parentNode"
        },
        "+": {
          dir: "previousSibling",
          first: true
        },
        "~": {
          dir: "previousSibling"
        }
      },

      preFilter: {
        "ATTR": function(match) {
          match[1] = match[1].replace(runescape, funescape);

          // Move the given value to match[3] whether quoted or unquoted
          match[3] = (match[4] || match[5] || "")
            .replace(runescape, funescape);

          if (match[2] === "~=") {
            match[3] = " " + match[3] + " ";
          }

          return match.slice(0, 4);
        },

        "CHILD": function(match) {
          /* matches from matchExpr["CHILD"]
          	1 type (only|nth|...)
          	2 what (child|of-type)
          	3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
          	4 xn-component of xn+y argument ([+-]?\d*n|)
          	5 sign of xn-component
          	6 x of xn-component
          	7 sign of y-component
          	8 y of y-component
          */
          match[1] = match[1].toLowerCase();

          if (match[1].slice(0, 3) === "nth") {
            // nth-* requires argument
            if (!match[3]) {
              Sizzle.error(match[0]);
            }

            // numeric x and y parameters for Expr.filter.CHILD
            // remember that false/true cast respectively to 0/1
            match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (
              match[3] === "even" || match[3] === "odd"));
            match[5] = +((match[7] + match[8]) || match[3] === "odd");

            // other types prohibit arguments
          } else if (match[3]) {
            Sizzle.error(match[0]);
          }

          return match;
        },

        "PSEUDO": function(match) {
          var excess,
            unquoted = !match[5] && match[2];

          if (matchExpr["CHILD"].test(match[0])) {
            return null;
          }

          // Accept quoted arguments as-is
          if (match[3] && match[4] !== undefined) {
            match[2] = match[4];

            // Strip excess characters from unquoted arguments
          } else if (unquoted && rpseudo.test(unquoted) &&
            // Get excess from tokenize (recursively)
            (excess = tokenize(unquoted, true)) &&
            // advance to the next closing parenthesis
            (excess = unquoted.indexOf(")", unquoted.length - excess) -
              unquoted.length)) {

            // excess is a negative index
            match[0] = match[0].slice(0, excess);
            match[2] = unquoted.slice(0, excess);
          }

          // Return only captures needed by the pseudo filter method (type and argument)
          return match.slice(0, 3);
        }
      },

      filter: {

        "TAG": function(nodeNameSelector) {
          var nodeName = nodeNameSelector.replace(runescape, funescape)
            .toLowerCase();
          return nodeNameSelector === "*" ?
            function() {
              return true;
            } :
            function(elem) {
              return elem.nodeName && elem.nodeName.toLowerCase() ===
                nodeName;
            };
        },

        "CLASS": function(className) {
          var pattern = classCache[className + " "];

          return pattern ||
            (pattern = new RegExp("(^|" + whitespace + ")" + className +
              "(" + whitespace + "|$)")) &&
            classCache(className, function(elem) {
              return pattern.test(typeof elem.className === "string" &&
                elem.className || typeof elem.getAttribute !==
                strundefined && elem.getAttribute("class") || "");
            });
        },

        "ATTR": function(name, operator, check) {
          return function(elem) {
            var result = Sizzle.attr(elem, name);

            if (result == null) {
              return operator === "!=";
            }
            if (!operator) {
              return true;
            }

            result += "";

            return operator === "=" ? result === check :
              operator === "!=" ? result !== check :
              operator === "^=" ? check && result.indexOf(check) ===
              0 :
              operator === "*=" ? check && result.indexOf(check) > -1 :
              operator === "$=" ? check && result.slice(-check.length) ===
              check :
              operator === "~=" ? (" " + result + " ")
              .indexOf(check) > -1 :
              operator === "|=" ? result === check || result.slice(0,
                check.length + 1) === check + "-" :
              false;
          };
        },

        "CHILD": function(type, what, argument, first, last) {
          var simple = type.slice(0, 3) !== "nth",
            forward = type.slice(-4) !== "last",
            ofType = what === "of-type";

          return first === 1 && last === 0 ?

            // Shortcut for :nth-*(n)
            function(elem) {
              return !!elem.parentNode;
            } :

            function(elem, context, xml) {
              var cache, outerCache, node, diff, nodeIndex, start,
                dir = simple !== forward ? "nextSibling" :
                "previousSibling",
                parent = elem.parentNode,
                name = ofType && elem.nodeName.toLowerCase(),
                useCache = !xml && !ofType;

              if (parent) {

                // :(first|last|only)-(child|of-type)
                if (simple) {
                  while (dir) {
                    node = elem;
                    while ((node = node[dir])) {
                      if (ofType ? node.nodeName.toLowerCase() === name :
                        node.nodeType === 1) {
                        return false;
                      }
                    }
                    // Reverse direction for :only-* (if we haven't yet done so)
                    start = dir = type === "only" && !start &&
                      "nextSibling";
                  }
                  return true;
                }

                start = [forward ? parent.firstChild : parent.lastChild];

                // non-xml :nth-child(...) stores cache data on `parent`
                if (forward && useCache) {
                  // Seek `elem` from a previously-cached index
                  outerCache = parent[expando] || (parent[expando] = {});
                  cache = outerCache[type] || [];
                  nodeIndex = cache[0] === dirruns && cache[1];
                  diff = cache[0] === dirruns && cache[2];
                  node = nodeIndex && parent.childNodes[nodeIndex];

                  while ((node = ++nodeIndex && node && node[dir] ||

                      // Fallback to seeking `elem` from the start
                      (diff = nodeIndex = 0) || start.pop())) {

                    // When found, cache indexes on `parent` and break
                    if (node.nodeType === 1 && ++diff && node === elem) {
                      outerCache[type] = [dirruns, nodeIndex, diff];
                      break;
                    }
                  }

                  // Use previously-cached element index if available
                } else if (useCache && (cache = (elem[expando] || (elem[
                    expando] = {}))[type]) && cache[0] === dirruns) {
                  diff = cache[1];

                  // xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
                } else {
                  // Use the same loop as above to seek `elem` from the start
                  while ((node = ++nodeIndex && node && node[dir] ||
                      (diff = nodeIndex = 0) || start.pop())) {

                    if ((ofType ? node.nodeName.toLowerCase() === name :
                        node.nodeType === 1) && ++diff) {
                      // Cache the index of each encountered element
                      if (useCache) {
                        (node[expando] || (node[expando] = {}))[type] = [
                          dirruns, diff
                        ];
                      }

                      if (node === elem) {
                        break;
                      }
                    }
                  }
                }

                // Incorporate the offset, then check against cycle size
                diff -= last;
                return diff === first || (diff % first === 0 && diff /
                  first >= 0);
              }
            };
        },

        "PSEUDO": function(pseudo, argument) {
          // pseudo-class names are case-insensitive
          // http://www.w3.org/TR/selectors/#pseudo-classes
          // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
          // Remember that setFilters inherits from pseudos
          var args,
            fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] ||
            Sizzle.error("unsupported pseudo: " + pseudo);

          // The user may use createPseudo to indicate that
          // arguments are needed to create the filter function
          // just as Sizzle does
          if (fn[expando]) {
            return fn(argument);
          }

          // But maintain support for old signatures
          if (fn.length > 1) {
            args = [pseudo, pseudo, "", argument];
            return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ?
              markFunction(function(seed, matches) {
                var idx,
                  matched = fn(seed, argument),
                  i = matched.length;
                while (i--) {
                  idx = indexOf.call(seed, matched[i]);
                  seed[idx] = !(matches[idx] = matched[i]);
                }
              }) :
              function(elem) {
                return fn(elem, 0, args);
              };
          }

          return fn;
        }
      },

      pseudos: {
        // Potentially complex pseudos
        "not": markFunction(function(selector) {
          // Trim the selector passed to compile
          // to avoid treating leading and trailing
          // spaces as combinators
          var input = [],
            results = [],
            matcher = compile(selector.replace(rtrim, "$1"));

          return matcher[expando] ?
            markFunction(function(seed, matches, context, xml) {
              var elem,
                unmatched = matcher(seed, null, xml, []),
                i = seed.length;

              // Match elements unmatched by `matcher`
              while (i--) {
                if ((elem = unmatched[i])) {
                  seed[i] = !(matches[i] = elem);
                }
              }
            }) :
            function(elem, context, xml) {
              input[0] = elem;
              matcher(input, null, xml, results);
              return !results.pop();
            };
        }),

        "has": markFunction(function(selector) {
          return function(elem) {
            return Sizzle(selector, elem)
              .length > 0;
          };
        }),

        "contains": markFunction(function(text) {
          return function(elem) {
            return (elem.textContent || elem.innerText || getText(
                elem))
              .indexOf(text) > -1;
          };
        }),

        // "Whether an element is represented by a :lang() selector
        // is based solely on the element's language value
        // being equal to the identifier C,
        // or beginning with the identifier C immediately followed by "-".
        // The matching of C against the element's language value is performed case-insensitively.
        // The identifier C does not have to be a valid language name."
        // http://www.w3.org/TR/selectors/#lang-pseudo
        "lang": markFunction(function(lang) {
          // lang value must be a valid identifier
          if (!ridentifier.test(lang || "")) {
            Sizzle.error("unsupported lang: " + lang);
          }
          lang = lang.replace(runescape, funescape)
            .toLowerCase();
          return function(elem) {
            var elemLang;
            do {
              if ((elemLang = documentIsHTML ?
                  elem.lang :
                  elem.getAttribute("xml:lang") || elem.getAttribute(
                    "lang"))) {

                elemLang = elemLang.toLowerCase();
                return elemLang === lang || elemLang.indexOf(lang +
                  "-") === 0;
              }
            } while ((elem = elem.parentNode) && elem.nodeType ===
              1);
            return false;
          };
        }),

        // Miscellaneous
        "target": function(elem) {
          var hash = window.location && window.location.hash;
          return hash && hash.slice(1) === elem.id;
        },

        "root": function(elem) {
          return elem === docElem;
        },

        "focus": function(elem) {
          return elem === document.activeElement && (!document.hasFocus ||
            document.hasFocus()) && !!(elem.type || elem.href || ~
            elem.tabIndex);
        },

        // Boolean properties
        "enabled": function(elem) {
          return elem.disabled === false;
        },

        "disabled": function(elem) {
          return elem.disabled === true;
        },

        "checked": function(elem) {
          // In CSS3, :checked should return both checked and selected elements
          // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
          var nodeName = elem.nodeName.toLowerCase();
          return (nodeName === "input" && !!elem.checked) || (nodeName ===
            "option" && !!elem.selected);
        },

        "selected": function(elem) {
          // Accessing this property makes selected-by-default
          // options in Safari work properly
          if (elem.parentNode) {
            elem.parentNode.selectedIndex;
          }

          return elem.selected === true;
        },

        // Contents
        "empty": function(elem) {
          // http://www.w3.org/TR/selectors/#empty-pseudo
          // :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
          //   not comment, processing instructions, or others
          // Thanks to Diego Perini for the nodeName shortcut
          //   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
          for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
            if (elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType ===
              4) {
              return false;
            }
          }
          return true;
        },

        "parent": function(elem) {
          return !Expr.pseudos["empty"](elem);
        },

        // Element/input types
        "header": function(elem) {
          return rheader.test(elem.nodeName);
        },

        "input": function(elem) {
          return rinputs.test(elem.nodeName);
        },

        "button": function(elem) {
          var name = elem.nodeName.toLowerCase();
          return name === "input" && elem.type === "button" || name ===
            "button";
        },

        "text": function(elem) {
          var attr;
          // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
          // use getAttribute instead to test this case
          return elem.nodeName.toLowerCase() === "input" &&
            elem.type === "text" &&
            ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() ===
              elem.type);
        },

        // Position-in-collection
        "first": createPositionalPseudo(function() {
          return [0];
        }),

        "last": createPositionalPseudo(function(matchIndexes, length) {
          return [length - 1];
        }),

        "eq": createPositionalPseudo(function(matchIndexes, length,
          argument) {
          return [argument < 0 ? argument + length : argument];
        }),

        "even": createPositionalPseudo(function(matchIndexes, length) {
          var i = 0;
          for (; i < length; i += 2) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),

        "odd": createPositionalPseudo(function(matchIndexes, length) {
          var i = 1;
          for (; i < length; i += 2) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),

        "lt": createPositionalPseudo(function(matchIndexes, length,
          argument) {
          var i = argument < 0 ? argument + length : argument;
          for (; --i >= 0;) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        }),

        "gt": createPositionalPseudo(function(matchIndexes, length,
          argument) {
          var i = argument < 0 ? argument + length : argument;
          for (; ++i < length;) {
            matchIndexes.push(i);
          }
          return matchIndexes;
        })
      }
    };

    Expr.pseudos["nth"] = Expr.pseudos["eq"];

    // Add button/input type pseudos
    for (i in {
        radio: true,
        checkbox: true,
        file: true,
        password: true,
        image: true
      }) {
      Expr.pseudos[i] = createInputPseudo(i);
    }
    for (i in {
        submit: true,
        reset: true
      }) {
      Expr.pseudos[i] = createButtonPseudo(i);
    }

    // Easy API for creating new setFilters
    function setFilters() {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();

    function tokenize(selector, parseOnly) {
      var matched, match, tokens, type,
        soFar, groups, preFilters,
        cached = tokenCache[selector + " "];

      if (cached) {
        return parseOnly ? 0 : cached.slice(0);
      }

      soFar = selector;
      groups = [];
      preFilters = Expr.preFilter;

      while (soFar) {

        // Comma and first run
        if (!matched || (match = rcomma.exec(soFar))) {
          if (match) {
            // Don't consume trailing commas as valid
            soFar = soFar.slice(match[0].length) || soFar;
          }
          groups.push(tokens = []);
        }

        matched = false;

        // Combinators
        if ((match = rcombinators.exec(soFar))) {
          matched = match.shift();
          tokens.push({
            value: matched,
            // Cast descendant combinators to space
            type: match[0].replace(rtrim, " ")
          });
          soFar = soFar.slice(matched.length);
        }

        // Filters
        for (type in Expr.filter) {
          if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] ||
              (match = preFilters[type](match)))) {
            matched = match.shift();
            tokens.push({
              value: matched,
              type: type,
              matches: match
            });
            soFar = soFar.slice(matched.length);
          }
        }

        if (!matched) {
          break;
        }
      }

      // Return the length of the invalid excess
      // if we're just parsing
      // Otherwise, throw an error or return tokens
      return parseOnly ?
        soFar.length :
        soFar ?
        Sizzle.error(selector) :
        // Cache the tokens
        tokenCache(selector, groups)
        .slice(0);
    }

    function toSelector(tokens) {
      var i = 0,
        len = tokens.length,
        selector = "";
      for (; i < len; i++) {
        selector += tokens[i].value;
      }
      return selector;
    }

    function addCombinator(matcher, combinator, base) {
      var dir = combinator.dir,
        checkNonElements = base && dir === "parentNode",
        doneName = done++;

      return combinator.first ?
        // Check against closest ancestor/preceding element
        function(elem, context, xml) {
          while ((elem = elem[dir])) {
            if (elem.nodeType === 1 || checkNonElements) {
              return matcher(elem, context, xml);
            }
          }
        } :

        // Check against all ancestor/preceding elements
        function(elem, context, xml) {
          var data, cache, outerCache,
            dirkey = dirruns + " " + doneName;

          // We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
          if (xml) {
            while ((elem = elem[dir])) {
              if (elem.nodeType === 1 || checkNonElements) {
                if (matcher(elem, context, xml)) {
                  return true;
                }
              }
            }
          } else {
            while ((elem = elem[dir])) {
              if (elem.nodeType === 1 || checkNonElements) {
                outerCache = elem[expando] || (elem[expando] = {});
                if ((cache = outerCache[dir]) && cache[0] === dirkey) {
                  if ((data = cache[1]) === true || data === cachedruns) {
                    return data === true;
                  }
                } else {
                  cache = outerCache[dir] = [dirkey];
                  cache[1] = matcher(elem, context, xml) || cachedruns;
                  if (cache[1] === true) {
                    return true;
                  }
                }
              }
            }
          }
        };
    }

    function elementMatcher(matchers) {
      return matchers.length > 1 ?
        function(elem, context, xml) {
          var i = matchers.length;
          while (i--) {
            if (!matchers[i](elem, context, xml)) {
              return false;
            }
          }
          return true;
        } :
        matchers[0];
    }

    function condense(unmatched, map, filter, context, xml) {
      var elem,
        newUnmatched = [],
        i = 0,
        len = unmatched.length,
        mapped = map != null;

      for (; i < len; i++) {
        if ((elem = unmatched[i])) {
          if (!filter || filter(elem, context, xml)) {
            newUnmatched.push(elem);
            if (mapped) {
              map.push(i);
            }
          }
        }
      }

      return newUnmatched;
    }

    function setMatcher(preFilter, selector, matcher, postFilter,
      postFinder, postSelector) {
      if (postFilter && !postFilter[expando]) {
        postFilter = setMatcher(postFilter);
      }
      if (postFinder && !postFinder[expando]) {
        postFinder = setMatcher(postFinder, postSelector);
      }
      return markFunction(function(seed, results, context, xml) {
        var temp, i, elem,
          preMap = [],
          postMap = [],
          preexisting = results.length,

          // Get initial elements from seed or context
          elems = seed || multipleContexts(selector || "*", context.nodeType ?
            [context] : context, []),

          // Prefilter to get matcher input, preserving a map for seed-results synchronization
          matcherIn = preFilter && (seed || !selector) ?
          condense(elems, preMap, preFilter, context, xml) :
          elems,

          matcherOut = matcher ?
          // If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
          postFinder || (seed ? preFilter : preexisting || postFilter) ?

          // ...intermediate processing is necessary
          [] :

          // ...otherwise use results directly
          results :
          matcherIn;

        // Find primary matches
        if (matcher) {
          matcher(matcherIn, matcherOut, context, xml);
        }

        // Apply postFilter
        if (postFilter) {
          temp = condense(matcherOut, postMap);
          postFilter(temp, [], context, xml);

          // Un-match failing elements by moving them back to matcherIn
          i = temp.length;
          while (i--) {
            if ((elem = temp[i])) {
              matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
            }
          }
        }

        if (seed) {
          if (postFinder || preFilter) {
            if (postFinder) {
              // Get the final matcherOut by condensing this intermediate into postFinder contexts
              temp = [];
              i = matcherOut.length;
              while (i--) {
                if ((elem = matcherOut[i])) {
                  // Restore matcherIn since elem is not yet a final match
                  temp.push((matcherIn[i] = elem));
                }
              }
              postFinder(null, (matcherOut = []), temp, xml);
            }

            // Move matched elements from seed to results to keep them synchronized
            i = matcherOut.length;
            while (i--) {
              if ((elem = matcherOut[i]) &&
                (temp = postFinder ? indexOf.call(seed, elem) : preMap[
                  i]) > -1) {

                seed[temp] = !(results[temp] = elem);
              }
            }
          }

          // Add elements to results, through postFinder if defined
        } else {
          matcherOut = condense(
            matcherOut === results ?
            matcherOut.splice(preexisting, matcherOut.length) :
            matcherOut
          );
          if (postFinder) {
            postFinder(null, results, matcherOut, xml);
          } else {
            push.apply(results, matcherOut);
          }
        }
      });
    }

    function matcherFromTokens(tokens) {
      var checkContext, matcher, j,
        len = tokens.length,
        leadingRelative = Expr.relative[tokens[0].type],
        implicitRelative = leadingRelative || Expr.relative[" "],
        i = leadingRelative ? 1 : 0,

        // The foundational matcher ensures that elements are reachable from top-level context(s)
        matchContext = addCombinator(function(elem) {
          return elem === checkContext;
        }, implicitRelative, true),
        matchAnyContext = addCombinator(function(elem) {
          return indexOf.call(checkContext, elem) > -1;
        }, implicitRelative, true),
        matchers = [function(elem, context, xml) {
          return (!leadingRelative && (xml || context !==
            outermostContext)) || (
            (checkContext = context)
            .nodeType ?
            matchContext(elem, context, xml) :
            matchAnyContext(elem, context, xml));
        }];

      for (; i < len; i++) {
        if ((matcher = Expr.relative[tokens[i].type])) {
          matchers = [addCombinator(elementMatcher(matchers), matcher)];
        } else {
          matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);

          // Return special upon seeing a positional matcher
          if (matcher[expando]) {
            // Find the next relative operator (if any) for proper handling
            j = ++i;
            for (; j < len; j++) {
              if (Expr.relative[tokens[j].type]) {
                break;
              }
            }
            return setMatcher(
              i > 1 && elementMatcher(matchers),
              i > 1 && toSelector(
                // If the preceding token was a descendant combinator, insert an implicit any-element `*`
                tokens.slice(0, i - 1)
                .concat({
                  value: tokens[i - 2].type === " " ? "*" : ""
                })
              )
              .replace(rtrim, "$1"),
              matcher,
              i < j && matcherFromTokens(tokens.slice(i, j)),
              j < len && matcherFromTokens((tokens = tokens.slice(j))),
              j < len && toSelector(tokens)
            );
          }
          matchers.push(matcher);
        }
      }

      return elementMatcher(matchers);
    }

    function matcherFromGroupMatchers(elementMatchers, setMatchers) {
      // A counter to specify which element is currently being matched
      var matcherCachedRuns = 0,
        bySet = setMatchers.length > 0,
        byElement = elementMatchers.length > 0,
        superMatcher = function(seed, context, xml, results, expandContext) {
          var elem, j, matcher,
            setMatched = [],
            matchedCount = 0,
            i = "0",
            unmatched = seed && [],
            outermost = expandContext != null,
            contextBackup = outermostContext,
            // We must always have either seed elements or context
            elems = seed || byElement && Expr.find["TAG"]("*",
              expandContext && context.parentNode || context),
            // Use integer dirruns iff this is the outermost matcher
            dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() ||
              0.1);

          if (outermost) {
            outermostContext = context !== document && context;
            cachedruns = matcherCachedRuns;
          }

          // Add elements passing elementMatchers directly to results
          // Keep `i` a string if there are no elements so `matchedCount` will be "00" below
          for (;
            (elem = elems[i]) != null; i++) {
            if (byElement && elem) {
              j = 0;
              while ((matcher = elementMatchers[j++])) {
                if (matcher(elem, context, xml)) {
                  results.push(elem);
                  break;
                }
              }
              if (outermost) {
                dirruns = dirrunsUnique;
                cachedruns = ++matcherCachedRuns;
              }
            }

            // Track unmatched elements for set filters
            if (bySet) {
              // They will have gone through all possible matchers
              if ((elem = !matcher && elem)) {
                matchedCount--;
              }

              // Lengthen the array for every element, matched or not
              if (seed) {
                unmatched.push(elem);
              }
            }
          }

          // Apply set filters to unmatched elements
          matchedCount += i;
          if (bySet && i !== matchedCount) {
            j = 0;
            while ((matcher = setMatchers[j++])) {
              matcher(unmatched, setMatched, context, xml);
            }

            if (seed) {
              // Reintegrate element matches to eliminate the need for sorting
              if (matchedCount > 0) {
                while (i--) {
                  if (!(unmatched[i] || setMatched[i])) {
                    setMatched[i] = pop.call(results);
                  }
                }
              }

              // Discard index placeholder values to get only actual matches
              setMatched = condense(setMatched);
            }

            // Add matches to results
            push.apply(results, setMatched);

            // Seedless set matches succeeding multiple successful matchers stipulate sorting
            if (outermost && !seed && setMatched.length > 0 &&
              (matchedCount + setMatchers.length) > 1) {

              Sizzle.uniqueSort(results);
            }
          }

          // Override manipulation of globals by nested matchers
          if (outermost) {
            dirruns = dirrunsUnique;
            outermostContext = contextBackup;
          }

          return unmatched;
        };

      return bySet ?
        markFunction(superMatcher) :
        superMatcher;
    }

    compile = Sizzle.compile = function(selector, group /* Internal Use Only */ ) {
      var i,
        setMatchers = [],
        elementMatchers = [],
        cached = compilerCache[selector + " "];

      if (!cached) {
        // Generate a function of recursive functions that can be used to check each element
        if (!group) {
          group = tokenize(selector);
        }
        i = group.length;
        while (i--) {
          cached = matcherFromTokens(group[i]);
          if (cached[expando]) {
            setMatchers.push(cached);
          } else {
            elementMatchers.push(cached);
          }
        }

        // Cache the compiled function
        cached = compilerCache(selector, matcherFromGroupMatchers(
          elementMatchers, setMatchers));
      }
      return cached;
    };

    function multipleContexts(selector, contexts, results) {
      var i = 0,
        len = contexts.length;
      for (; i < len; i++) {
        Sizzle(selector, contexts[i], results);
      }
      return results;
    }

    function select(selector, context, results, seed) {
      var i, tokens, token, type, find,
        match = tokenize(selector);

      if (!seed) {
        // Try to minimize operations if there is only one group
        if (match.length === 1) {

          // Take a shortcut and set the context if the root selector is an ID
          tokens = match[0] = match[0].slice(0);
          if (tokens.length > 2 && (token = tokens[0])
            .type === "ID" &&
            support.getById && context.nodeType === 9 && documentIsHTML &&
            Expr.relative[tokens[1].type]) {

            context = (Expr.find["ID"](token.matches[0].replace(runescape,
              funescape), context) || [])[0];
            if (!context) {
              return results;
            }
            selector = selector.slice(tokens.shift()
              .value.length);
          }

          // Fetch a seed set for right-to-left matching
          i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
          while (i--) {
            token = tokens[i];

            // Abort if we hit a combinator
            if (Expr.relative[(type = token.type)]) {
              break;
            }
            if ((find = Expr.find[type])) {
              // Search, expanding context for leading sibling combinators
              if ((seed = find(
                  token.matches[0].replace(runescape, funescape),
                  rsibling.test(tokens[0].type) && context.parentNode ||
                  context
                ))) {

                // If seed is empty or no tokens remain, we can return early
                tokens.splice(i, 1);
                selector = seed.length && toSelector(tokens);
                if (!selector) {
                  push.apply(results, seed);
                  return results;
                }

                break;
              }
            }
          }
        }
      }

      // Compile and execute a filtering function
      // Provide `match` to avoid retokenization if we modified the selector above
      compile(selector, match)(
        seed,
        context, !documentIsHTML,
        results,
        rsibling.test(selector)
      );
      return results;
    }

    // One-time assignments

    // Sort stability
    support.sortStable = expando.split("")
      .sort(sortOrder)
      .join("") === expando;

    // Support: Chrome<14
    // Always assume duplicates if they aren't passed to the comparison function
    support.detectDuplicates = hasDuplicate;

    // Initialize against the default document
    setDocument();

    // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
    // Detached nodes confoundingly follow *each other*
    support.sortDetached = assert(function(div1) {
      // Should return 1, but returns 4 (following)
      return div1.compareDocumentPosition(document.createElement("div")) &
        1;
    });

    // Support: IE<8
    // Prevent attribute/property "interpolation"
    // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    if (!assert(function(div) {
        div.innerHTML = "<a href='#'></a>";
        return div.firstChild.getAttribute("href") === "#";
      })) {
      addHandle("type|href|height|width", function(elem, name, isXML) {
        if (!isXML) {
          return elem.getAttribute(name, name.toLowerCase() === "type" ?
            1 : 2);
        }
      });
    }

    // Support: IE<9
    // Use defaultValue in place of getAttribute("value")
    if (!support.attributes || !assert(function(div) {
        div.innerHTML = "<input/>";
        div.firstChild.setAttribute("value", "");
        return div.firstChild.getAttribute("value") === "";
      })) {
      addHandle("value", function(elem, name, isXML) {
        if (!isXML && elem.nodeName.toLowerCase() === "input") {
          return elem.defaultValue;
        }
      });
    }

    // Support: IE<9
    // Use getAttributeNode to fetch booleans when getAttribute lies
    if (!assert(function(div) {
        return div.getAttribute("disabled") == null;
      })) {
      addHandle(booleans, function(elem, name, isXML) {
        var val;
        if (!isXML) {
          return (val = elem.getAttributeNode(name)) && val.specified ?
            val.value :
            elem[name] === true ? name.toLowerCase() : null;
        }
      });
    }

    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[":"] = jQuery.expr.pseudos;
    jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;

  })(window);
  // String to Object options format cache
  var optionsCache = {};

  // Convert String-formatted options into Object-formatted ones and store in cache
  function createOptions(options) {
    var object = optionsCache[options] = {};
    jQuery.each(options.match(core_rnotwhite) || [], function(_, flag) {
      object[flag] = true;
    });
    return object;
  }

  /*
   * Create a callback list using the following parameters:
   *
   *	options: an optional list of space-separated options that will change how
   *			the callback list behaves or a more traditional option object
   *
   * By default a callback list will act like an event callback list and can be
   * "fired" multiple times.
   *
   * Possible options:
   *
   *	once:			will ensure the callback list can only be fired once (like a Deferred)
   *
   *	memory:			will keep track of previous values and will call any callback added
   *					after the list has been fired right away with the latest "memorized"
   *					values (like a Deferred)
   *
   *	unique:			will ensure a callback can only be added once (no duplicate in the list)
   *
   *	stopOnFalse:	interrupt callings when a callback returns false
   *
   */
  //回调函数应用例子
//  function aaa (){
//    alert(1);
//  }
//  function bbb(){
//    alert(2);
//  }
//  function ccc(){
//    alert(3);
//  }
//  var cb = $.Callbacks();
//  cb.add(aaa);
//  cb.add(bbb);
//
//  cb.fire();
//

//callback的实际用途,只要回调是全局的，我们就不用担心函数具体的作用域
//比如我们想要对aaa和bbb统一的管理
//var cb = $.Callbacks();
//function aaa(){
//  alert(1);
//}
//cb.add(aaa);
//(function(){
//  function bbb(){
//    alert(2);
//  }
//cb.add(bbb);
//})();
//
  jQuery.Callbacks = function(options) {

    // Convert options from String-formatted to Object-formatted if needed
    // (we check in cache first)
    //对Options进行判断，如果是字符串则，如果不是字符串则空对象,防止underfined出现
    //无参数的执行细节，先看ADD
//    var cb = $.Callbacks();
//    cb.add(aaa);
//    cb.add(bbb);
//    cb.add(aaa,bbb)
//    cb.add([aaa,bbb])
//    cb.fire();

    options = typeof options === "string" ?
      (optionsCache[options] || createOptions(options)) :
      jQuery.extend({}, options);

    var // Last fire value (for non-forgettable lists)
      memory,
      // Flag to know if list was already fired
      fired,
      // Flag to know if list is currently firing
      //看看flag的具体作用哈
      //var bBtn = true;
      //function aaa(){
      //  alert(1);
      //  if(bBtn){
      //    cb.fire();
      //    bBtn = false:
      //  }
      //}
      //function bbb(){
      //  alert(2);
      //}
      //var cb = $.Callbacks();
      //cb.add(aaa);
      //cb.add(bbb);
      //cb.fire();
      //防止进入死循环


      firing,
      // First callback to fire (used internally by add and fireWith)
      firingStart,
      // End of the loop when firing
      firingLength,
      // Index of currently firing callback (modified by remove if needed)
      firingIndex,
      // Actual callback list
      //回调数组
      list = [],
      // Stack of fire calls for repeatable lists
      stack = !options.once && [],
      // Fire callbacks
      fire = function(data) {
        memory = options.memory && data;
        fired = true;
        firingIndex = firingStart || 0;
        firingStart = 0;
        firingLength = list.length;
        firing = true;
        //
        for (; list && firingIndex < firingLength; firingIndex++) {
          if (list[firingIndex].apply(data[0], data[1]) === false &&
            options.stopOnFalse) {
            memory = false; // To prevent further calls using add
            break;
          }
        }
        //触发结束
        //用来解释下面的else if(memory)
        //function aaa(){
        //  alert(1);
        //}
        //function bbb(){
        //  alert(2);
        //}
        //var cb = $.Callbacks('once');
        //cb.add(aaa)
        //cb.fire();
        //cb.add(bbb);
        //cb.fire();
        firing = false;
        if (list) {
          if (stack) {
            if (stack.length) {
              fire(stack.shift());
            }
          } else if (memory) {
            list = [];
          } else {
            self.disable();
          }
        }
      },
      // Actual Callbacks object
      self = {
        // Add a callback or a collection of callbacks to the list
        add: function() {
          //先判断list，默认是[]
          if (list) {
            // First, we save the current length
            //存储起始位置
            var start = list.length;
            //匿名函数自执行
            (function add(args) {
              //遍历参数
              jQuery.each(args, function(_, arg) {
                var type = jQuery.type(arg);
                //如果是函数类型
                if (type === "function") {
                  //检测是否唯一
                  if (!options.unique || !self.has(arg)) {
                    list.push(arg);
                  }
                  //判断不是函数的情况
                } else if (arg && arg.length && type !== "string") {

                  // Inspect recursively
                  add(arg);
                }
              });
            })(arguments);
            // Do we need to add the callbacks to the
            // current firing batch?
            if (firing) {
              firingLength = list.length;
              // With memory, if we're not firing then
              // we should call right away
            } else if (memory) {
              firingStart = start;
              fire(memory);
            }
          }
          return this;
        },
        // Remove a callback from the list
        remove: function() {
          if (list) {
            jQuery.each(arguments, function(_, arg) {
              var index;
              //在数组中进行剪切
              while ((index = jQuery.inArray(arg, list, index)) > -1) {
                list.splice(index, 1);
                // Handle firing indexes
                if (firing) {
                  if (index <= firingLength) {
                    firingLength--;
                  }
                  if (index <= firingIndex) {
                    firingIndex--;
                  }
                }
              }
            });
          }
          return this;
        },
        // Check if a given callback is in the list.
        // If no argument is given, return whether or not list has callbacks attached.
        has: function(fn) {
          return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
        },
        // Remove all callbacks from the list
        empty: function() {
          list = [];
          firingLength = 0;
          return this;
        },
        // Have the list do nothing anymore
        disable: function() {
          list = stack = memory = undefined;
          return this;
        },
        // Is it disabled?
        disabled: function() {
          return !list;
        },
        // Lock the list in its current state
        lock: function() {
          stack = undefined;
          if (!memory) {
            self.disable();
          }
          return this;
        },
        // Is it locked?
        locked: function() {
          return !stack;
        },
        // Call all callbacks with the given context and arguments
        //调用firewith会调用fire函数，然后再进行for循环遍历list
        fireWith: function(context, args) {
          if (list && (!fired || stack)) {
            args = args || [];
            args = [context, args.slice ? args.slice() : args];
            if (firing) {
              stack.push(args);
            } else {
              fire(args);
            }
          }
          return this;
        },
        // Call all the callbacks with the given arguments
        fire: function() {
          self.fireWith(this, arguments);
          return this;
        },
        // To know if the callbacks have already been called at least once
        fired: function() {
          return !!fired;
        }
      };

    return self;
  };
  
  //扩展工具方法！
  jQuery.extend({

    //$.Deferred()是基于$.Callbacks()开发的
    //简单复习下callbacks
    //var cb = $.Callbacks():
    //setTimeout(function(){
    //  alert(11);
    //  cb.fire():

    //},1000);

    //cb.add(function(){
    //  alert(333);
    //})
    //通过调用延时对象
    //var dfb 8= $.Deferred();
    //setTimeout(function(){
    //  alert(111);
    //这个rosolve相当于fire
    //  dfb.resolve();
    //},1000);
    //这个done相当于callbacks的add
    //dfd.done(function(){
    //  alert(222);
    //});
    //

    //测试代码
    //可以看到成功和失败只会触发一次
    //setInterval(function(){
    //  alert(111);
    //  dfd.resolve();
    //},1000);
    //dfd.done(function(){
    //  alert('成功');
    //}).fail(function(){
    //  alert('失败');
    //}).progress(fucntion(){
    //  alert('进度中')
    //})


    //memory的作用如下：
    //如果不加memory那么只会触发1,加上之后
    //1和2都会弹出来
    //var cb = $.Callbacks('memory');
    //cb.add(function(){
    //  alert(1);
    //});

    //cb.fire();
    //cb.add(function(){
    //  alert(2);
    //});

    //第二个bbb在点击input后会立即触发，而前面的aaa不再触发
    //setTimeout(fucntion(){
    //  alert(111);
    //  dif.resolve();
    //},1000);
    //dif.done(function(){
    //  alert('aaa');
    //});

    //$('input').click(fucntion(){
    //  dif.done(fucntion(){
    //    alert('bbb');
    //  });
    //});


    Deferred: function(func) {
      var tuples = [
          // action, add listener, listener list, final state
          //done和fail,progerss映射的是Calbacks里面的add
          //resolve和reject,notiy是fire
          ["resolve", "done", jQuery.Callbacks("once memory"),
            "resolved"
          ],
          ["reject", "fail", jQuery.Callbacks("once memory"),
            "rejected"
          ],
          ["notify", "progress", jQuery.Callbacks("memory")]
        ],
        state = "pending",
        //刚一进来就出现了promise对象，里面有很多方法
        promise = {
          state: function() {
            return state;
          },
          //不论任何状态都走这个always
          always: function() {
            deferred.done(arguments)
              .fail(arguments);
              //返回this进行链式操作
            return this;
          },
          //then函数接受3个函数参数，第一个是完成，第二个是未完成，第三个是进度中
          then: function( /* fnDone, fnFail, fnProgress */ ) {
            var fns = arguments;
            
            return jQuery.Deferred(function(newDefer) {
                jQuery.each(tuples, function(i, tuple) {
                  var action = tuple[0],
                    fn = jQuery.isFunction(fns[i]) && fns[i];
                  // deferred[ done | fail | progress ] for forwarding actions to newDefer
                  deferred[tuple[1]](function() {
                    var returned = fn && fn.apply(this,
                      arguments);
                    if (returned && jQuery.isFunction(
                        returned.promise)) {
                      returned.promise()
                        .done(newDefer.resolve)
                        .fail(newDefer.reject)
                        .progress(newDefer.notify);
                    } else {
                      newDefer[action + "With"](this ===
                        promise ? newDefer.promise() :
                        this, fn ? [returned] : arguments
                      );
                    }
                  });
                });
                fns = null;
              })
              .promise();
          },
          // Get a promise for this deferred
          // If obj is provided, the promise aspect is added to the object
          //有参数走前面，deferred继承到promise上面
          //没参数走后门的promise
          //function aaa(){
          //  var dfd = $.Deferred();
          //  setTimeout(function(){
          //    dfd.resolve();
          //  },1000);
          //  return dfd.promise();
          //};
          //var newDfd = aaa();
          //newDfd.done(function(){
          //  alert('Successed');
          //}).fail(function(){
          //  alert('Failed');
          //});
          ////因为上面返回的是promise，promise对象并没有reject所以这个地方会报错
          //newDfd.reject();
          promise: function(obj) {
            return obj != null ? jQuery.extend(obj, promise) :
              promise;
          }
        },
        deferred = {};

      // Keep pipe for back-compat
      promise.pipe = promise.then;

      // Add list-specific methods
      jQuery.each(tuples, function(i, tuple) {
        //进行数组遍历，数组的第二项是Callbacks
        //数组的第三项是那个字符串
        var list = tuple[2],
          stateString = tuple[3];

        // promise[ done | fail | progress ] = list.add
        //把Callbacks.add()赋值给数组的第一项
        promise[tuple[1]] = list.add;

        // Handle state
        if (stateString) {
          list.add(function() {
            // state = [ resolved | rejected ]
            state = stateString;

            // [ reject_list | resolve_list ].disable; progress_list.lock
            //^位运算符1^1代表了0，也就是done进行disable
          }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
        }

        // deferred[ resolve | reject | notify ]
        deferred[tuple[0]] = function() {
          deferred[tuple[0] + "With"](this === deferred ? promise :
            this, arguments);
          return this;
        };
        //把firewith赋值给数组第一项
        deferred[tuple[0] + "With"] = list.fireWith;
      });

      // Make the deferred a promise
      promise.promise(deferred);

      // Call given func if any
      if (func) {
        func.call(deferred, deferred);
      }

      // All done!
      return deferred;
    },

    // Deferred helper
    //var dfd = $.Deferred();
    //下面这个方法只能对一个延时对象判断成功或者失败
    //dfd.done()
    //举个例子来说
    //function aaa(){
    //  var dfd - $.Deferred();
    //  dfd.resolve();
    //  return dfd;
    //};

    //aaa().done(function(){
    //  alert('成功A');
    //});
    //上面的代码只能对aaa进行判断
    //让我们再添加一个延迟对象
    //function bbb(){
    //  var dfd = $.Deferred();
    //  dfd.resolve();
    //  return dfd;
    //};

    //aaa().done(function(){
    //  alert('成功');
    //});
    //假如我想让aaa和bbb都完成后再触发 成功~~~~~
    //when可以对多个延迟对象进行判断
    //$.when(aaa(),bbb()).done(function(){
    //  alert('成功');
    //});



    //再来看个when的详细应用
    //function aaa(){
    //  var dfd = $.Deferred();
    //  dfd.resolve();
    //  return dfd;
    //}

    //function bbb(){
    //  var dfd = $.Deferred();
    //  dfd.reject();
    //  //return dfd;
    //}

    ////要注意的是aaa和bbb必须返回一个延迟对象，否则是没有done或者fail方法的
    //$.when(aaa(),bbb()).done(function(){
    //  alert('chenggong')
    //}).fail(function(){
    //  alert('失败');
    //});
    when: function(subordinate /* , ..., subordinateN */ ) {
      //参数的下标，类数组
      var i = 0,
      //转换成数组并把长度存起来
        resolveValues = core_slice.call(arguments),
        length = resolveValues.length,

        // the count of uncompleted subordinates
        remaining = length !== 1 || (subordinate && jQuery.isFunction(
          subordinate.promise)) ? length : 0,

        // the master Deferred. If resolveValues consist of only a single Deferred, just use that.
        deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

        // Update function for both resolve and progress values
        updateFunc = function(i, contexts, values) {
          return function(value) {
            contexts[i] = this;
            values[i] = arguments.length > 1 ? core_slice.call(
              arguments) : value;
            if (values === progressValues) {
              deferred.notifyWith(contexts, values);
            } else if (!(--remaining)) {
              deferred.resolveWith(contexts, values);
            }
          };
        },

        progressValues, progressContexts, resolveContexts;

      // add listeners to Deferred subordinates; treat others as resolved
      if (length > 1) {
        progressValues = new Array(length);
        progressContexts = new Array(length);
        resolveContexts = new Array(length);
        //判断参数是否是延迟对象，如果是就进入if，否则进入else
        for (; i < length; i++) {
          if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
            resolveValues[i].promise()
              .done(updateFunc(i, resolveContexts, resolveValues))
              .fail(deferred.reject)
              .progress(updateFunc(i, progressContexts, progressValues));
          } else {
            --remaining;
          }
        }
      }

      // if we're not waiting on anything, resolve the master
      if (!remaining) {
        deferred.resolveWith(resolveContexts, resolveValues);
      }

      //在这可以看到when返回的是个promise,所以在他下面有promise的所有方法
      return deferred.promise();
    }
  });
  //

  //功能检测
  //匿名函数自执行并返回一个JSON对象
  jQuery.support = (function(support) {
    var input = document.createElement("input"),
      fragment = document.createDocumentFragment(),
      div = document.createElement("div"),
      select = document.createElement("select"),
      //下拉菜单的子项
      opt = select.appendChild(document.createElement("option"));

    // Finish early in limited environments
    if (!input.type) {
      return support;
    }

    input.type = "checkbox";

    // Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
    // Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
    //checkOn值默认是on，如果不是on则是false
    support.checkOn = input.value !== "";

    // Must access the parent to make an option select properly
    // Support: IE9, IE10
    //IE下面的下拉菜单第一个子项默认补选中
    support.optSelected = opt.selected;

    // Will be defined later
    //赋初始值的原因是需要等待页面加载完再做判断
    support.reliableMarginRight = true;
    support.boxSizingReliable = true;
    support.pixelPosition = false;

    // Make sure checked status is properly cloned
    // Support: IE9, IE10
    input.checked = true;
    support.noCloneChecked = input.cloneNode(true)
      .checked;

    // Make sure that the options inside disabled selects aren't marked as disabled
    // (WebKit marks them as disabled)
    select.disabled = true;
    support.optDisabled = !opt.disabled;

    // Check if an input maintains its value after becoming a radio
    // Support: IE9, IE10
    input = document.createElement("input");
    input.value = "t";
    input.type = "radio";
    support.radioValue = input.value === "t";

    // #11217 - WebKit loses check when the name is after the checked attribute
    input.setAttribute("checked", "t");
    input.setAttribute("name", "t");

    fragment.appendChild(input);

    // Support: Safari 5.1, Android 4.x, Android 2.3
    // old WebKit doesn't clone checked state correctly in fragments
    support.checkClone = fragment.cloneNode(true)
      .cloneNode(true)
      .lastChild.checked;

    // Support: Firefox, Chrome, Safari
    // Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
    //onfocusin是支持冒泡事件的，子项会触发到父级
    support.focusinBubbles = "onfocusin" in window;

    div.style.backgroundClip = "content-box";
    div.cloneNode(true)
      .style.backgroundClip = "";
    support.clearCloneStyle = div.style.backgroundClip === "content-box";

    // Run tests that need a body at doc ready
    //有些功能需要DOM加载完才能进行检测！下面的就是喽
    jQuery(function() {
      var container, marginDiv,
        // Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
        //content-box是标准模式，意思是盒模型下遵循标准的行为
        divReset =
        "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
        body = document.getElementsByTagName("body")[0];

      if (!body) {
        // Return for frameset docs that don't have a body
        return;
      }

      container = document.createElement("div");
      //cssText可以设置一套样式
      //因为只是做测试，所以把页面移动到可视范围之外left：-9999px
      container.style.cssText =
        "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

      // Check box-sizing and margin behavior.
      body.appendChild(container)
        .appendChild(div);
      div.innerHTML = "";
      // Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
      div.style.cssText =
        "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

      // Workaround failing boxSizing test due to offsetWidth returning wrong value
      // with some non-1 values of body zoom, ticket #13543
      //设置一个CSS样式，用完之后再还原回来
      //style.zoom页面放大缩小
      jQuery.swap(body, body.style.zoom != null ? {
        zoom: 1
      } : {}, function() {
        support.boxSizing = div.offsetWidth === 4;
      });

      // Use window.getComputedStyle because jsdom on node.js will break without it.
      if (window.getComputedStyle) {
        //检测浏览器是否会把像素位置转换成像素值
        support.pixelPosition = (window.getComputedStyle(div, null) ||
            {})
          .top !== "1%";
        support.boxSizingReliable = (window.getComputedStyle(div,
            null) || {
            width: "4px"
          })
          .width === "4px";

        // Support: Android 2.3
        // Check if div with explicit width and no margin-right incorrectly
        // gets computed margin-right based on width of container. (#3333)
        // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
        marginDiv = div.appendChild(document.createElement("div"));
        marginDiv.style.cssText = div.style.cssText = divReset;
        marginDiv.style.marginRight = marginDiv.style.width = "0";
        div.style.width = "1px";

        //看改变父级宽度是否影响子集的0宽度
        support.reliableMarginRight = !parseFloat((window.getComputedStyle(
            marginDiv, null) || {})
          .marginRight);
      }

      //检测完再删掉
      body.removeChild(container);
    });

    return support;
  })({});

  /*
  	Implementation Summary

  	1. Enforce API surface and semantic compatibility with 1.9.x branch
  	2. Improve the module's maintainability by reducing the storage
  		paths to a single mechanism.
  	3. Use the same single mechanism to support "private" and "user" data.
  	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
  	5. Avoid exposing implementation details on user objects (eg. expando properties)
  	6. Provide a clear path for implementation upgrade to WeakMap in 2014
  */
  //数据缓存
  //基本使用方法
//  $(function(){
//    $('#div1').attr('name','hello');
//    alert($('#div1').attr('name'));
//  });
//<div id="div1"></div>
//上面的attr方法可以换成prop和data方法。具体的不同来听听我的讲解
//attr方法是通过原生对象下面的getAttribute方法来实现的
//prop是直接在对象上添加.name属性
//data方法更适合大量数据挂载到对象上面，要注意一个非常重要的问题：
//DOM元素和对象之间的互相引用，大部分浏览器会出现内存泄漏！
//var oDiv = document.getElementById('div1');
//var obj = {}
//oDiv.name = obj;
//obj.age = oDiv;
//通过一个cache中介对象来避免互相引用


$('#div1').data('name',obj);
  var data_user, data_priv,
    rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
    rmultiDash = /([A-Z])/g;

    //构造函数
  function Data() {
    // Support: Android < 4,
    // Old WebKit does not have Object.preventExtensions/freeze method,
    // return new empty object instead with no [[set]] accessor
    //只能获取不能设置
    //0这个参数的作用相当于0：{}
    Object.defineProperty(this.cache = {}, 0, {
      get: function() {
        return {};
      }
    });

    //生成唯一的标识
    this.expando = jQuery.expando + Math.random();
  }

  Data.uid = 1;

  //判断节点类型
  Data.accepts = function(owner) {
    // Accepts only:
    //  - Node
    //    - Node.ELEMENT_NODE
    //    - Node.DOCUMENT_NODE
    //  - Object
    //    - Any
    return owner.nodeType ?
      owner.nodeType === 1 || owner.nodeType === 9 : true;
  };

  //构造函数 原型
  //比如下面的这个语句如何分配
  //$.data(document.body,'age',30);
  //如果我们再次添加另一个属性在同一个对象上面如：
  //$.data(document.body,'job','it');
  //可以看到的是return的unlock是1，在1下面有age和job两个属性
  Data.prototype = {
    key: function(owner) {
      // We can accept data for non-element nodes in modern browsers,
      // but we should not, see #8335.
      // Always return the key for a frozen object.
      //当不是元素节点的时候返回0,就会找到上面空的json
      if (!Data.accepts(owner)) {
        return 0;
      }

      var descriptor = {},
        // Check if the owner object already has a cache key
        unlock = owner[this.expando];

      // If not, create one
      if (!unlock) {
        unlock = Data.uid++;

        //让唯一标识无法修改
        // Secure it in a non-enumerable, non-writable property
        try {
          descriptor[this.expando] = {
            value: unlock
          };
          Object.defineProperties(owner, descriptor);

          // Support: Android < 4
          // Fallback to a less secure definition
          //使用传统方法来添加
        } catch (e) {
          descriptor[this.expando] = unlock;
          jQuery.extend(owner, descriptor);
        }
      }

      // Ensure the cache object
      if (!this.cache[unlock]) {
        this.cache[unlock] = {};
      }

      return unlock;
    },
    set: function(owner, data, value) {
      var prop,
        // There may be an unlock assigned to this node,
        // if there is no entry for this "owner", create one inline
        // and set the unlock as though an owner entry had always existed
        //var cache = {
        //  1: {
        //    name: obj
        //  },
        //  2:{
        //    age: obj
        //  }
        //}
        //先找到ID也就是元素的标识
        unlock = this.key(owner),
        //然后再通过ID找到对应的JSON
        cache = this.cache[unlock];

      // Handle: [ owner, key, value ] args
      //字符串进入if
      if (typeof data === "string") {
        cache[data] = value;

        // Handle: [ owner, { properties } ] args
        //else 处理的是其他类型比如

        //$.data(document.body, {'agel': 30, 'job': 'it'});

      } else {
        // Fresh assignments by object are shallow copied
        if (jQuery.isEmptyObject(cache)) {
          jQuery.extend(this.cache[unlock], data);
          // Otherwise, copy the properties one-by-one to the cache object
        } else {
          for (prop in data) {
            cache[prop] = data[prop];
          }
        }
      }
      return cache;
    },
    //获取属性值拉
    get: function(owner, key) {
      // Either a valid cache is found, or will be created.
      // New caches will be created and the unlock returned,
      // allowing direct access to the newly created
      // empty data object. A valid owner object must be provided.
      var cache = this.cache[this.key(owner)];

      return key === undefined ?
        cache : cache[key];
    },
    //
    access: function(owner, key, value) {
      var stored;
      // In cases where either:
      //
      //   1. No key was specified
      //   2. A string key was specified, but no value provided
      //
      // Take the "read" path and allow the get method to determine
      // which value to return, respectively either:
      //
      //   1. The entire cache object
      //   2. The data stored at the key
      //
      if (key === undefined ||
        ((key && typeof key === "string") && value === undefined)) {

        stored = this.get(owner, key);

        return stored !== undefined ?
          stored : this.get(owner, jQuery.camelCase(key));
      }

      // [*]When the key is not a string, or both a key and value
      // are specified, set or extend (existing objects) with either:
      //
      //   1. An object of properties
      //   2. A key and value
      //
      this.set(owner, key, value);

      // Since the "set" path can have two possible entry points
      // return the expected data based on which path was taken[*]
      return value !== undefined ? value : key;
    },
    remove: function(owner, key) {
      var i, name, camel,
        unlock = this.key(owner),
        cache = this.cache[unlock];

      if (key === undefined) {
        this.cache[unlock] = {};

      } else {
        // Support array or space separated string of keys
        if (jQuery.isArray(key)) {
          // If "name" is an array of keys...
          // When data is initially created, via ("key", "val") signature,
          // keys will be converted to camelCase.
          // Since there is no way to tell _how_ a key was added, remove
          // both plain key and camelCase key. #12786
          // This will only penalize the array argument path.
          name = key.concat(key.map(jQuery.camelCase));
        } else {
          camel = jQuery.camelCase(key);
          // Try the string as a key before any manipulation
          if (key in cache) {
            name = [key, camel];
          } else {
            // If a key with the spaces exists, use it.
            // Otherwise, create an array by matching non-whitespace
            name = camel;
            name = name in cache ? [name] : (name.match(core_rnotwhite) ||
              []);
          }
        }

        i = name.length;
        while (i--) {
          delete cache[name[i]];
        }
      }
    },
    hasData: function(owner) {
      return !jQuery.isEmptyObject(
        this.cache[owner[this.expando]] || {}
      );
    },
    //删除的是key等于1或者2这个整体
    discard: function(owner) {
      if (owner[this.expando]) {
        delete this.cache[owner[this.expando]];
      }
    }
  };

  // These may be used throughout the jQuery core codebase
  data_user = new Data();
  data_priv = new Data();

  jQuery.extend({
    acceptData: Data.accepts,

    hasData: function(elem) {
      return data_user.hasData(elem) || data_priv.hasData(elem);
    },

    data: function(elem, name, data) {
      return data_user.access(elem, name, data);
    },

    removeData: function(elem, name) {
      data_user.remove(elem, name);
    },

    // TODO: Now that all calls to _data and _removeData have been replaced
    // with direct calls to data_priv methods, these can be deprecated.
    _data: function(elem, name, data) {
      return data_priv.access(elem, name, data);
    },

    _removeData: function(elem, name) {
      data_priv.remove(elem, name);
    }
  });

  //在jquery对象上扩展方法
  jQuery.fn.extend({
    data: function(key, value) {
      var attrs, name,
      //如果是一组，只寻找这一组中的第一个元素
        elem = this[0],
        i = 0,
        data = null;

      // Gets all values
      //当key是空的时候，默认返回所有的值
      //比如
      //$('#div1').data('name','hello');
      //$('#div1').data('age','30');
      //console.log($('#div1').data())
      if (key === undefined) {
        if (this.length) {
          data = data_user.get(elem);

          //H5里面的自定义属性比如

          //<div id="div1" data-zhen-all="wocao" class="box">aaa<div>
          if (elem.nodeType === 1 && !data_priv.get(elem,
              "hasDataAttrs")) {
                //获取属性名字
            attrs = elem.attributes;
            for (; i < attrs.length; i++) {
              name = attrs[i].name;

              if (name.indexOf("data-") === 0) {
                //转成驼峰名字
                name = jQuery.camelCase(name.slice(5));
                dataAttr(elem, name, data[name]);
              }
            }
            data_priv.set(elem, "hasDataAttrs", true);
          }
        }

        return data;
      }

      // Sets multiple values
      if (typeof key === "object") {
        return this.each(function() {
          data_user.set(this, key);
        });
      }

      return jQuery.access(this, function(value) {
        var data,
          camelKey = jQuery.camelCase(key);

        // The calling jQuery object (element matches) is not empty
        // (and therefore has an element appears at this[ 0 ]) and the
        // `value` parameter was not undefined. An empty jQuery object
        // will result in `undefined` for elem = this[ 0 ] which will
        // throw an exception if an attempt to read a data cache is made.
        if (elem && value === undefined) {
          // Attempt to get data from the cache
          // with the key as-is
          //是什么名字就获取什么名字
          data = data_user.get(elem, key);
          if (data !== undefined) {
            return data;
          }

          //把名字转换成驼峰形式来寻找
          // Attempt to get data from the cache
          // with the key camelized
          data = data_user.get(elem, camelKey);
          if (data !== undefined) {
            return data;
          }

          // Attempt to "discover" the data in
          // HTML5 custom data-* attrs
          data = dataAttr(elem, camelKey, undefined);
          if (data !== undefined) {
            return data;
          }

          // We tried really hard, but the data doesn't exist.
          return;
        }

        // Set the data...
        this.each(function() {
          // First, attempt to store a copy or reference of any
          // data that might've been store with a camelCased key.
          //处理的情况如下：
          //$('#div1').data('nameAge','hello');
          //$('#div1').data('name-age','hello');
          ////在缓存下按下面方式储存
          //this.cache ={
          //  1: {
          //    'nameAge' : 'hello',
          //    'name-age' : 'hello'
          //  }
          //}
          var data = data_user.get(this, camelKey);

          // For HTML5 data-* attribute interop, we have to
          // store property names with dashes in a camelCase form.
          // This might not apply to all properties...*
          data_user.set(this, camelKey, value);

          // *... In the case of properties that might _actually_
          // have dashes, we need to also store a copy of that
          // unchanged property.
          if (key.indexOf("-") !== -1 && data !== undefined) {
            data_user.set(this, key, value);
          }
        });
        //arguments.length>1如果一个参数是获取操作，否则是设置操作
      }, null, value, arguments.length > 1, null, true);
    },

    removeData: function(key) {
      return this.each(function() {
        data_user.remove(this, key);
      });
    }
  });

  function dataAttr(elem, key, data) {
    var name;

    // If nothing was found internally, try to fetch any
    // data from the HTML5 data-* attribute
    if (data === undefined && elem.nodeType === 1) {
      name = "data-" + key.replace(rmultiDash, "-$1")
        .toLowerCase();
      data = elem.getAttribute(name);

      if (typeof data === "string") {
        try {
          data = data === "true" ? true :
            data === "false" ? false :
            data === "null" ? null :
            // Only convert to a number if it doesn't change the string
            +data + "" === data ? +data :
            rbrace.test(data) ? JSON.parse(data) :
            data;
        } catch (e) {}

        // Make sure we set the data so it isn't changed later
        data_user.set(elem, key, data);
      } else {
        data = undefined;
      }
    }
    return data;
  }
  //工具方法的扩展
  jQuery.extend({
    //使用例子
    //$(function(){
    //  function aaa(){
    //    alert(1);
    //  }
    //  function bbb(){
    //    alert(222);
    //  }


    //  $.queue(document,'q1',aaa);
    //  $.queue(document,'q1',bbb);
    //或者是整体添加队列
    //$.queue(document,'q1',[aaa,bbb])
    //  console.log($.queue(document, 'q1'));
    //});

    //queue里面传的必须是函数


    queue: function(elem, type, data) {
      var queue;

      //当元素存在进入if
      if (elem) {
        //队列名字默认fx，且所有队列有一个queue结尾
        type = (type || "fx") + "queue";
        queue = data_priv.get(elem, type);

        // Speed up dequeue by getting out quickly if this is just a lookup
        if (data) {
          //第一次没有队列的时候创建一个新的队列,如果是数组也重新进行设置！
          if (!queue || jQuery.isArray(data)) {
            queue = data_priv.access(elem, type, jQuery.makeArray(data));
            //有的话就直接push到存在的队列里面！
          } else {
            queue.push(data);
          }
        }
        return queue || [];
      }
    },

    //取出队列里面的函数并且还调用了！
    //实际情况下为什么要使用queue
   // $(fucntion(){
   //   $('#div1').click(fucntion(){
   //     //如果是js源码的话会使用setInterval异步调用，也就是说会同时执行
   //     $(this).animate({width: 400},2000);
   //     $(this).animate({height: 400},2000);
   //     $(this).animate({left: 400},2000);
   //   })
   // })
   //$(this).animate({width: 300},2000).queue(fucntion(next){
   //  //必须有出队才能继续执行后续的animate
   //  //$(this).dequeue();
   //  //next()这个next就等于上面的语句;
   //}).animate({left: 300},2000);



   //另一个例子回调和queue的区别
   //$(this).animate({width:300},2000,function(){
   //  var This = this;
   //  var timer = setInterval(function(){
   //    This.style.height = This.offsetHeight + 1 + 'px';
   //    if(This.offsetHeight == 200){
   //      clearInterval(timer);
   //    }
   //  },30);
   //}).animate({left: 300},2000);
   //高度和左移动会同时发生，我们没法控制
   //而通过queue可以随时控制高度发生在哪个地方！！
    dequeue: function(elem, type) {
      type = type || "fx";

      //先获取队列长度
      var queue = jQuery.queue(elem, type),
        startLength = queue.length,
        fn = queue.shift(),
        hooks = jQuery._queueHooks(elem, type),
        //可以看到next正是dequeue
        next = function() {
          jQuery.dequeue(elem, type);
        };

      // If the fx queue is dequeued, always remove the progress sentinel
      if (fn === "inprogress") {
        fn = queue.shift();
        startLength--;
      }

      if (fn) {

        // Add a progress sentinel to prevent the fx queue from being
        // automatically dequeued
        if (type === "fx") {
          queue.unshift("inprogress");
        }

        // clear up the last queue stop function
        delete hooks.stop;
        fn.call(elem, next, hooks);
      }

      if (!startLength && hooks) {
        hooks.empty.fire();
      }
    },

    // not intended for public consumption - generates a queueHooks object, or returns the current one
    _queueHooks: function(elem, type) {
      var key = type + "queueHooks";
      return data_priv.get(elem, key) || data_priv.access(elem, key, {
        empty: jQuery.Callbacks("once memory")
          .add(function() {
            data_priv.remove(elem, [type + "queue", key]);
          })
      });
    }
  });

  jQuery.fn.extend({
    queue: function(type, data) {
      var setter = 2;

      if (typeof type !== "string") {
        data = type;
        type = "fx";
        setter--;
      }

      //根据参数长度判断是否获取还是设置！小于setter是获取操作
      if (arguments.length < setter) {
        //可以看到它获取的是一组当中的第一个元素
        return jQuery.queue(this[0], type);
      }

      return data === undefined ?
        this :
        this.each(function() {
          var queue = jQuery.queue(this, type, data);

          // ensure a hooks for this queue
          jQuery._queueHooks(this, type);

          //入队后立即出队运行！
          if (type === "fx" && queue[0] !== "inprogress") {
            jQuery.dequeue(this, type);
          }
        });
    },
    dequeue: function(type) {
      return this.each(function() {
        jQuery.dequeue(this, type);
      });
    },
    // Based off of the plugin by Clint Helfers, with permission.
    // http://blindsignals.com/index.php/2009/07/jquery-delay/
    //使用方法介绍：
    //$(fucntion(){
    //  $('#div1').click(fucntion(){
    //    $(this).animate({width: 300},2000).delay(2000).animate({left: 300},2000);
    //  })
    //})
    delay: function(time, type) {
      time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
      type = type || "fx";

      //next是出队，time是延迟时间
      return this.queue(type, function(next, hooks) {
        var timeout = setTimeout(next, time);
        hooks.stop = function() {
          clearTimeout(timeout);
        };
      });
    },
    clearQueue: function(type) {
      return this.queue(type || "fx", []);
    },
    // Get a promise resolved when queues of a certain type
    // are emptied (fx is the type by default)
    //使用方法介绍：
    //全部队列执行之后再调用的一个方法
    //$(this).promise().done(fucntion(){
    //  alert(3);
    //});
    promise: function(type, obj) {
      var tmp,
        count = 1,
        //建立defer对象
        defer = jQuery.Deferred(),
        elements = this,
        //计数共有多少个需要执行的队列
        i = this.length,
        resolve = function() {
          if (!(--count)) {
            defer.resolveWith(elements, [elements]);
          }
        };

      if (typeof type !== "string") {
        obj = type;
        type = undefined;
      }
      type = type || "fx";

      while (i--) {
        tmp = data_priv.get(elements[i], type + "queueHooks");
        if (tmp && tmp.empty) {
          count++;
          tmp.empty.add(resolve);
        }
      }
      resolve();
      //返回对象
      return defer.promise(obj);
    }
  });
  var nodeHook, boolHook,
    rclass = /[\t\r\n\f]/g,
    rreturn = /\r/g,
    rfocusable = /^(?:input|select|textarea|button)$/i;

    //总共有以下几种实例方法
    //attr
    //removeAttr
    //prop
    //removeProp
    //addClass
    //removeClass
    //toggleClass
    //hasClass
    //val

    //基本使用
    //$(function(){
    //  $('#div1').attr('title','hello');
    //  //一个参数是获取属性
    //  alert($('#div1').attr('id'));
    //});
    

    //prop和attr的区别主要是要理解原生代码中的
    //setAttribute和. | []
    //attr用的是setAttribute 而prop用的是.和[]来设置属性
    //他们两者的主要区别是自定义属性的设置，setAttribute可以方便的设置自定义属性

  jQuery.fn.extend({
    attr: function(name, value) {
      //可以看到jQuery.attr作为回调函数被调用了
      return jQuery.access(this, jQuery.attr, name, value, arguments.length >
        1);
    },

    removeAttr: function(name) {
      return this.each(function() {
        //调用工具中的removeAttr
        jQuery.removeAttr(this, name);
      });
    },

    prop: function(name, value) {
      return jQuery.access(this, jQuery.prop, name, value, arguments.length >
        1);
    },

    removeProp: function(name) {
      return this.each(function() {
        delete this[jQuery.propFix[name] || name];
      });
    },

    //基本使用
    //$(fucntion(){
    //  $('#div1').addClass('box2 box4');
    //  $('#div1').removeClass('box3');
    //  //如果原先没有那个属性，则先调用addClass
    //  $('#div1').toggleClass('box2');
    //alert($('#div1').hasClass('box2'));
    //})
    addClass: function(value) {
      var classes, elem, cur, clazz, j,
        i = 0,
        len = this.length,
        //判断参数类型是否是字符串
        proceed = typeof value === "string" && value;

        //判断是否是函数,如果是函数则对每个对象调用
      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this)
            .addClass(value.call(this, j, this.className));
        });
      }

      //字符串类型进入if
      if (proceed) {
        // The disjunction here is for better compressibility (see removeClass)
        //通过正则根据空格分成数组
        classes = (value || "")
          .match(core_rnotwhite) || [];

          //对数组进行循环
        for (; i < len; i++) {
          elem = this[i];
          cur = elem.nodeType === 1 && (elem.className ?
            (" " + elem.className + " ")
            //把制表符 换行符 通过正则变成空格！可以查看rclass这个正则对象
            .replace(rclass, " ") :
            " "
          );

          if (cur) {
            j = 0;
            while ((clazz = classes[j++])) {
              //判断是否添加属性！
              if (cur.indexOf(" " + clazz + " ") < 0) {
                cur += clazz + " ";
              }
            }
            elem.className = jQuery.trim(cur);

          }
        }
      }

      //方便链式操作
      //$('#div1').addClass('box3').html('bbbb').click(function(){alert(123)});
      return this;
    },

    removeClass: function(value) {
      var classes, elem, cur, clazz, j,
        i = 0,
        len = this.length,
        //优先级,先&&后||，如果参数为空则删除所有属性
        proceed = arguments.length === 0 || typeof value === "string" &&
        value;

      if (jQuery.isFunction(value)) {
        return this.each(function(j) {
          jQuery(this)
            .removeClass(value.call(this, j, this.className));
        });
      }
      if (proceed) {
        classes = (value || "")
          .match(core_rnotwhite) || [];

        for (; i < len; i++) {
          elem = this[i];
          // This expression is here for better compressibility (see addClass)
          cur = elem.nodeType === 1 && (elem.className ?
            (" " + elem.className + " ")
            .replace(rclass, " ") :
            ""
          );

          if (cur) {
            j = 0;
            while ((clazz = classes[j++])) {
              // Remove *all* instances
              while (cur.indexOf(" " + clazz + " ") >= 0) {
                cur = cur.replace(" " + clazz + " ", " ");
              }
            }
            elem.className = value ? jQuery.trim(cur) : "";
          }
        }
      }

      return this;
    },

    //如果一个参数就在元素里面查找如果有！就删除，没有就添加~，如果有第二个参数true，则其作用
    //相当于addClass
    //$('#div1').toggleClass('box2 box3 ', true);
    toggleClass: function(value, stateVal) {
      var type = typeof value;

      if (typeof stateVal === "boolean" && type === "string") {
        return stateVal ? this.addClass(value) : this.removeClass(value);
      }

      if (jQuery.isFunction(value)) {
        return this.each(function(i) {
          jQuery(this)
            .toggleClass(value.call(this, i, this.className,
              stateVal), stateVal);
        });
      }

      return this.each(function() {
        if (type === "string") {
          // toggle individual class names
          var className,
            i = 0,
            self = jQuery(this),
            classNames = value.match(core_rnotwhite) || [];

          while ((className = classNames[i++])) {
            // check each className given, space separated list
            if (self.hasClass(className)) {
              self.removeClass(className);
            } else {
              self.addClass(className);
            }
          }

          // Toggle whole class name
        } else if (type === core_strundefined || type === "boolean") {
          if (this.className) {
            // store className if set
            data_priv.set(this, "__className__", this.className);
          }

          // If the element has a class name or if we're passed "false",
          // then remove the whole classname (if there was one, the above saved it).
          // Otherwise bring back whatever was previously saved (if anything),
          // falling back to the empty string if nothing was stored.
          this.className = this.className || value === false ? "" :
            data_priv.get(this, "__className__") || "";
        }
      });
    },

    hasClass: function(selector) {
      var className = " " + selector + " ",
        i = 0,
        l = this.length;
      for (; i < l; i++) {
        if (this[i].nodeType === 1 && (" " + this[i].className + " ")
          .replace(rclass, " ")
          .indexOf(className) >= 0) {
          return true;
        }
      }

      return false;
    },

    //操作元素的值
    //使用方法
    //不写参数就是获取，带有参数就是修改
    //$(function(){
    //  alert($('#input1').val());
    //})
    //<input type="text" id="input1" value="hello">

    val: function(value) {
      var hooks, ret, isFunction,
        elem = this[0];

        //参数等于0的操作
      if (!arguments.length) {
        if (elem) {
          //先找元素类型，再找元素节点类型
//          <select>
//            <option>111</option>
//            <option>222</option>
//            <option>333</option>
//          </select>
//
//          <input type="checkbox" id="input2">

          //select一种是多选一种是单选，它会返回select-1
          //可以通过在select里面设置multiple成为多选
          //alert($('select').get(0).type);
          //option不具备type的操作，但它有节点名字


          hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName
            .toLowerCase()];

          if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !==
            undefined) {
            return ret;
          }

          ret = elem.value;

          return typeof ret === "string" ?
            // handle most common string cases
            ret.replace(rreturn, "") :
            // handle cases where value is null/undef or number
            ret == null ? "" : ret;
        }

        return;
      }

      //判断参数是否是回调函数，如果是则对每一个元素执行
      isFunction = jQuery.isFunction(value);

      return this.each(function(i) {
        var val;

        if (this.nodeType !== 1) {
          return;
        }

        //执行回调函数
        if (isFunction) {
          val = value.call(this, i, jQuery(this)
            .val());
        } else {
          val = value;
        }

        // Treat null/undefined as ""; convert numbers to string
        if (val == null) {
          val = "";
        } else if (typeof val === "number") {
          val += "";
        } else if (jQuery.isArray(val)) {
          val = jQuery.map(val, function(value) {
            return value == null ? "" : value + "";
          });
        }

        hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName
          .toLowerCase()];

        // If set returns undefined, fall back to normal setting
        if (!hooks || !("set" in hooks) || hooks.set(this, val,
            "value") === undefined) {
          this.value = val;
        }
      });
    }
  });

  jQuery.extend({
    valHooks: {
      //下拉菜单子选项
      option: {
        get: function(elem) {
          // attributes.value is undefined in Blackberry 4.7 but
          // uses .value. See #6932
          
          var val = elem.attributes.value;
          return !val || val.specified ? elem.value : elem.text;
        }
      },
      //下拉菜单
      select: {
        get: function(elem) {
          var value, option,
            options = elem.options,
            index = elem.selectedIndex,
            one = elem.type === "select-one" || index < 0,
            values = one ? null : [],
            max = one ? index + 1 : options.length,
            i = index < 0 ?
            max :
            one ? index : 0;

          // Loop through all the selected options
          for (; i < max; i++) {
            option = options[i];

            // IE6-9 doesn't update selected after form reset (#2551)
            if ((option.selected || i === index) &&
              // Don't return options that are disabled or in a disabled optgroup
              (jQuery.support.optDisabled ? !option.disabled : option.getAttribute(
                "disabled") === null) &&
              (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode,
                "optgroup"))) {

              // Get the specific value for the option
              value = jQuery(option)
                .val();

              // We don't need an array for one selects
              //单选
              if (one) {
                return value;
              }

              // Multi-Selects return an array
              //多选PUSH到数组里面
              values.push(value);
            }
          }

          return values;
        },

        //设置的操作
        set: function(elem, value) {
          var optionSet, option,
            options = elem.options,
            values = jQuery.makeArray(value),
            i = options.length;

          while (i--) {
            option = options[i];
            if ((option.selected = jQuery.inArray(jQuery(option)
                .val(), values) >= 0)) {
              optionSet = true;
            }
          }

          // force browsers to behave consistently when non-matching value is set
          if (!optionSet) {
            elem.selectedIndex = -1;
          }
          return values;
        }
      }
    },

    attr: function(elem, name, value) {
      var hooks, ret,
        nType = elem.nodeType;

      // don't get/set attributes on text, comment and attribute nodes
      //无法设置属性的对象
      if (!elem || nType === 3 || nType === 8 || nType === 2) {
        return;
      }

      // Fallback to prop when attributes are not supported
      //举例子$(document).attr('title','hello')
      if (typeof elem.getAttribute === core_strundefined) {
        return jQuery.prop(elem, name, value);
      }

      // All attributes are lowercase
      // Grab necessary hook if one is defined
      //元素节点或者sizzle里面的isXML，是不是XML下的结点
      if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
        name = name.toLowerCase();
        hooks = jQuery.attrHooks[name] ||
        //调用sizzle下的方法
        
        //<input type="checkbox" checked="checked">
        //alert($('input').attr('checked'));
        //prop会弹出true
        //alert($('input').prop('checked'));
        //对下面的情况做兼容
        //$('input').attr('checked','checked')
        //$('input').attr('checked',true)
          (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook);
      }

      if (value !== undefined) {

        //$('#div1').attr('title',null)调用的是删除属性
        if (value === null) {
          jQuery.removeAttr(elem, name);

          //hooks存在并且有set
        } else if (hooks && "set" in hooks && (ret = hooks.set(elem,
            value, name)) !== undefined) {
          return ret;

        } else {
          elem.setAttribute(name, value + "");
          return value;
        }

      } else if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !==
        null) {
        return ret;

      } else {
        //调用是sizzle下的attr方法
        ret = jQuery.find.attr(elem, name);

        // Non-existent attributes return null, we normalize to undefined
        return ret == null ?
          undefined :
          ret;
      }
    },

    removeAttr: function(elem, value) {
      var name, propName,
        i = 0,
        //搜索非空格元素
        attrNames = value && value.match(core_rnotwhite);

      if (attrNames && elem.nodeType === 1) {
        while ((name = attrNames[i++])) {
          //把class关键字变成className
          propName = jQuery.propFix[name] || name;

          // Boolean attributes get special treatment (#10870)
          if (jQuery.expr.match.bool.test(name)) {
            // Set corresponding property to false
            elem[propName] = false;
          }

          elem.removeAttribute(name);
        }
      }
    },

    attrHooks: {
      //只有一个set，get不存在兼容
      type: {
        set: function(elem, value) {
          //必须是单选框才能进入if
          if (!jQuery.support.radioValue && value === "radio" && jQuery
            .nodeName(elem, "input")) {
            // Setting the type on a radio button after the value resets the value in IE6-9
            // Reset value to default in case type is set after value during creation
            var val = elem.value;
            elem.setAttribute("type", value);
            if (val) {
              elem.value = val;
            }
            return value;
          }
        }
      }
    },

    propFix: {
      "for": "htmlFor",
      "class": "className"
    },

    //实例中的prop就是工具中的prop
    prop: function(elem, name, value) {
      var ret, hooks, notxml,
        nType = elem.nodeType;

      // don't get/set properties on text, comment and attribute nodes
      if (!elem || nType === 3 || nType === 8 || nType === 2) {
        return;
      }

      notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

      if (notxml) {
        // Fix name and attach hooks
        name = jQuery.propFix[name] || name;
        hooks = jQuery.propHooks[name];
      }

      if (value !== undefined) {
        return hooks && "set" in hooks && (ret = hooks.set(elem, value,
            name)) !== undefined ?
          ret :
          (elem[name] = value);

      } else {
        return hooks && "get" in hooks && (ret = hooks.get(elem, name)) !==
          null ?
          ret :
          elem[name];
      }
    },

    propHooks: {
      //改变tab键光标的移动顺序
      tabIndex: {
        get: function(elem) {
          return elem.hasAttribute("tabindex") || rfocusable.test(elem.nodeName) ||
            elem.href ?
            elem.tabIndex :
            -1;
        }
      }
    }
  });

  // Hooks for boolean attributes
  boolHook = {
    set: function(elem, value, name) {
      if (value === false) {
        // Remove boolean attributes when set to false
        jQuery.removeAttr(elem, name);
      } else {
        elem.setAttribute(name, name);
      }
      return name;
    }
  };
  jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(i, name) {
    var getter = jQuery.expr.attrHandle[name] || jQuery.find.attr;

    jQuery.expr.attrHandle[name] = function(elem, name, isXML) {
      var fn = jQuery.expr.attrHandle[name],
        ret = isXML ?
        undefined :
        /* jshint eqeqeq: false */
        // Temporarily disable this handler to check existence
        (jQuery.expr.attrHandle[name] = undefined) !=
        getter(elem, name, isXML) ?

        name.toLowerCase() :
        null;

      // Restore handler
      jQuery.expr.attrHandle[name] = fn;

      return ret;
    };
  });

  // Support: IE9+
  // Selectedness for an option in an optgroup can be inaccurate
  if (!jQuery.support.optSelected) {
    jQuery.propHooks.selected = {
      get: function(elem) {
        var parent = elem.parentNode;
        if (parent && parent.parentNode) {
          parent.parentNode.selectedIndex;
        }
        return null;
      }
    };
  }

  jQuery.each([
    "tabIndex",
    "readOnly",
    "maxLength",
    "cellSpacing",
    "cellPadding",
    "rowSpan",
    "colSpan",
    "useMap",
    "frameBorder",
    "contentEditable"
  ], function() {
    jQuery.propFix[this.toLowerCase()] = this;
  });

  // Radios and checkboxes getter/setter
  jQuery.each(["radio", "checkbox"], function() {
    jQuery.valHooks[this] = {
      set: function(elem, value) {
        //检测是否是数组，如果是数组则进行对比，
        //然后如果存在则把radio和checkbox设置为选中状态
        if (jQuery.isArray(value)) {
          return (elem.checked = jQuery.inArray(jQuery(elem)
            .val(), value) >= 0);
        }
      }
    };
    if (!jQuery.support.checkOn) {
      jQuery.valHooks[this].get = function(elem) {
        // Support: Webkit
        // "" is returned instead of "on" if a value isn't specified
        //设置value的默认值，做兼容处理
        return elem.getAttribute("value") === null ? "on" : elem.value;
      };
    }
  });
  var rkeyEvent = /^key/,
    rmouseEvent = /^(?:mouse|contextmenu)|click/,
    rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

  function returnTrue() {
    return true;
  }

  function returnFalse() {
    return false;
  }

  function safeActiveElement() {
    try {
      return document.activeElement;
    } catch (err) {}
  }

  //事件操作，一个非常重要的一部分！
  /*
   * Helper functions for managing events -- not part of the public interface.
   * Props to Dean Edwards' addEvent library for many of the ideas.
   */
  //先整体框架，大架子
  //jQuery.event = {
  //  global,
  //  add,   绑定事件
  //  remove, 取消事件
  //  trigger, 主动触发事件
  //  dispatch, 配发事件的具体操作
  //  handlers, 函数执行顺序的操作
  //  props,       JQ中共享原生JS的event属性
  //  fixHooks,   具体的event兼容
  //  keyHooks,    键盘的event兼容
  //  mouseHooks,  鼠标的event兼容
  //  fix,         event对象的兼容处理
  //  special,    特殊事件的处理
  //  simulate
  //}
  //jQuery.Event = function(){
  //  isDefaultPrevented,
  //  isPropagationStopped,
  //  isImmediatePropagationStopped,
  //  preventDefault,
  //  stopPropagation,
  //  stopImmediatePropagation
  //}
  //jQuery.fn.extend({
  //  on,
  //  one,
  //  off,
  //  trigger,
  //  triggerHandler
  //})
  //on指向event下面的add
  //上面的one也是指向on,trigger和triggerHandler都指向内部event的trigger，根据参数不同调用不同
  //off调用event下的remove
  //所以说内部事件方法最重要的三个是add，remove和trigger
  //以上就是简化的结构
  //大约在源代码的6720行，有额外的实例方法的扩展可以看到：
  //jQuery.fn.extend({
  //  hover,
  //  bind,
  //  unbind,
  //  delegate,
  //  undelegate
  //})
  //上面的hover指向on，bind指向on，unbind指向off，delegate指向on，undelegate指向on
  //on是非常重要的
  //首先是使用方法

  //$(function(){
  //  $('#div1').on('click',function(){
  //    alert(123);
  //  });
  //});
  jQuery.event = {

    global: {},

    //add 使用例子：
    //$(function(){
    //  $('#div1').on('click',function(){
    //    alert(1);
    //  });
    //   $('#div1').on('click',function(){
    //    alert(2);
    //  });

    //  //主动触发,会把绑定到click事件上所有的操作都会触发！
    //  $('#div1').trigger('click')
    //自定义事件，只能通过trigger来触发
    //$('#div1').on('show',function(){
    //  alert(1);
    //});
    //自定义事件看起来非常像函数，但最大的不同是，相同名字的事件不会覆盖！
    //$('#div1').trigger('show');
    //  
    //});
    //下面通过原生JS来实现：
   // window.onload = function(){
   //   var oDiv = document.getElementById('div1');
   //   var oSpan = document.getElementById('span1');

   //   var aaa = function() {
   //     alert(1);
   //   }

   //   var bbb = function() {
   //     alert(2);
   //   }

   //   add(oDiv, 'click', aaa);
   //   remove(oDiv, 'click',aaa);
   //   add(oSpan,'show',aaa);
   //   add(oSpan,'show',bbb);

   //   trigger(oSpan,'show')
   // }

   // function add(obj,types,fn){
   //   obj.listeners = obj.listeners || {};
   //   obj.listeners[types] = obj.listeners[types] || [];
   //   obj.listeners[types].push(fn);
   //   obj.addEventListener(types,fn,false);
   // };

   // function remove(obj,types,fn){
   //   obj.removeEventListener(types,fn,false);
   //delete obj.listeners[types]
   // }

   // function trigger(obj,types){
   //   var arr =  obj.listeners[types];
   //   for(var i = 0; i < arr.length; i++){
   //     arr[i]()
   //   }
   // }


    add: function(elem, types, handler, data, selector) {

      var handleObjIn, eventHandle, tmp,
        events, t, handleObj,
        special, handlers, type, namespaces, origType,
        //上面原生js我们把数据都挂载到我们当前操作的 元素了，如果操作的元素非常多
        //那么必定会占用很多内存空间，
        //所有更好的方法就是都存到数据缓存对象中
        elemData = data_priv.get(elem);

      // Don't attach events to noData or text/comment nodes (but allow plain objects)
      if (!elemData) {
        return;
      }

      // Caller can pass in an object of custom data in lieu of the handler
      if (handler.handler) {
        handleObjIn = handler;
        handler = handleObjIn.handler;
        selector = handleObjIn.selector;
      }

      // Make sure that the handler has a unique ID, used to find/remove it later
      if (!handler.guid) {
        handler.guid = jQuery.guid++;
      }

      // Init the element's event structure and main handler, if this is the first
      //这句相当于上面的原生的obj.listenner = {}
      //添加一个对象
      if (!(events = elemData.events)) {
        events = elemData.events = {};
      }
      //检测是否有handler
      if (!(eventHandle = elemData.handle)) {
        eventHandle = elemData.handle = function(e) {
          // Discard the second event of a jQuery.event.trigger() and
          // when an event is called after a page has unloaded
          return typeof jQuery !== core_strundefined && (!e || jQuery.event
              .triggered !== e.type) ?
            jQuery.event.dispatch.apply(eventHandle.elem, arguments) :
            undefined;
        };
        // Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
        eventHandle.elem = elem;
      }

      //处理的是这种情况：
      //$('#div1').on('click mouseover mousedown',function(){
      //  alert(2);
      //});
      // Handle multiple events separated by a space
      types = (types || "")
        .match(core_rnotwhite) || [""];
      t = types.length;
      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || "")
          .split(".")
          .sort();

        // There *must* be a type, no attaching namespace-only handlers
        if (!type) {
          continue;
        }

        // If event changes its type, use the special event handlers for the changed type
        // 
        special = jQuery.event.special[type] || {};

        // If selector defined, determine special event api type, otherwise given type
        type = (selector ? special.delegateType : special.bindType) ||
          type;

        // Update special based on newly reset type
        special = jQuery.event.special[type] || {};

        // handleObj is passed to all event handlers
        handleObj = jQuery.extend({
          //现在的类型
          type: type,
          //原来的类型
          origType: origType,
          data: data,
          //handler绑定的是事件函数
          handler: handler,
          guid: handler.guid,
          selector: selector,
          //有委托就false,没有的话就是undefined
          needsContext: selector && jQuery.expr.match.needsContext.test(
            selector),
            //命名空间
            //下面的有命名空间
         // $('#div1').on('click.aaa',function(){
         //   alert(1);
         // })
         // $('#div1').on('click',function(){
         //   alert(2);
         // })
         // //这样的话只会调用clcik.aaa
         // $('#div1').trigger('click.aaa');
          namespace: namespaces.join(".")
        }, handleObjIn);

        // Init the event handler queue if we're the first
        //这句相当于原生的obj.listener[types] = []
        if (!(handlers = events[type])) {
          handlers = events[type] = [];
          handlers.delegateCount = 0;

          // Only use addEventListener if the special events handler returns false
          if (!special.setup || special.setup.call(elem, data, namespaces,
              eventHandle) === false) {
            if (elem.addEventListener) {
              //绑定事件
              elem.addEventListener(type, eventHandle, false);
            }
          }
        }

        if (special.add) {
          special.add.call(elem, handleObj);

          if (!handleObj.handler.guid) {
            handleObj.handler.guid = handler.guid;
          }
        }

        // Add to the element's handler list, delegates in front
        if (selector) {
          handlers.splice(handlers.delegateCount++, 0, handleObj);
        } else {
          //这句相当于原生的obj.listener[types].push(fn)
          handlers.push(handleObj);
        }

        // Keep track of which events have ever been used, for event optimization
        jQuery.event.global[type] = true;
      }

      // Nullify elem to prevent memory leaks in IE
      elem = null;
    },

    // Detach an event or set of events from an element
    remove: function(elem, types, handler, selector, mappedTypes) {

      var j, origCount, tmp,
        events, t, handleObj,
        special, handlers, type, namespaces, origType,
        elemData = data_priv.hasData(elem) && data_priv.get(elem);

        //找到所有绑定的事件
      if (!elemData || !(events = elemData.events)) {
        return;
      }

      // Once for each type.namespace in types; type may be omitted
      //是个事件集合
      types = (types || "")
        .match(core_rnotwhite) || [""];
      t = types.length;
      while (t--) {
        tmp = rtypenamespace.exec(types[t]) || [];
        type = origType = tmp[1];
        namespaces = (tmp[2] || "")
          .split(".")
          .sort();

        // Unbind all events (on this namespace, if provided) for the element
        //如果off('.aaa')传递的参数不存在，则进入if继续寻找有aaa属性的事件
        if (!type) {
          for (type in events) {
            jQuery.event.remove(elem, type + types[t], handler, selector,
              true);
          }
          continue;
        }

        special = jQuery.event.special[type] || {};
        type = (selector ? special.delegateType : special.bindType) ||
          type;
        handlers = events[type] || [];
        tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join(
          "\\.(?:.*\\.|)") + "(\\.|$)");

        // Remove matching events
        origCount = j = handlers.length;
        while (j--) {
          handleObj = handlers[j];

          if ((mappedTypes || origType === handleObj.origType) &&
            (!handler || handler.guid === handleObj.guid) &&
            (!tmp || tmp.test(handleObj.namespace)) &&
            (!selector || selector === handleObj.selector || selector ===
              "**" && handleObj.selector)) {
            handlers.splice(j, 1);

            if (handleObj.selector) {
              handlers.delegateCount--;
            }
            if (special.remove) {
              special.remove.call(elem, handleObj);
            }
          }
        }

        // Remove generic event handler if we removed something and no more handlers exist
        // (avoids potential for endless recursion during removal of special event handlers)
        if (origCount && !handlers.length) {
          if (!special.teardown || special.teardown.call(elem, namespaces,
              elemData.handle) === false) {
                //和原生的相对应
            jQuery.removeEvent(elem, type, elemData.handle);
          }

          delete events[type];
        }
      }

      // Remove the expando if it's no longer used
      if (jQuery.isEmptyObject(events)) {
        delete elemData.handle;
        data_priv.remove(elem, "events");
      }
    },

    trigger: function(event, data, elem, onlyHandlers) {

      var i, cur, tmp, bubbleType, ontype, handle, special,
        eventPath = [elem || document],
        type = core_hasOwn.call(event, "type") ? event.type : event,
        namespaces = core_hasOwn.call(event, "namespace") ? event.namespace
        .split(".") : [];

      cur = tmp = elem = elem || document;

      // Don't do events on text and comment nodes
      if (elem.nodeType === 3 || elem.nodeType === 8) {
        return;
      }

      // focus/blur morphs to focusin/out; ensure we're not firing them right now
      if (rfocusMorph.test(type + jQuery.event.triggered)) {
        return;
      }

      if (type.indexOf(".") >= 0) {
        // Namespaced trigger; create a regexp to match event type in handle()
        namespaces = type.split(".");
        type = namespaces.shift();
        namespaces.sort();
      }
      ontype = type.indexOf(":") < 0 && "on" + type;

      // Caller can pass in a jQuery.Event object, Object, or just an event type string
      event = event[jQuery.expando] ?
        event :
        new jQuery.Event(type, typeof event === "object" && event);

      // Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
      event.isTrigger = onlyHandlers ? 2 : 3;
      event.namespace = namespaces.join(".");
      event.namespace_re = event.namespace ?
        new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") +
          "(\\.|$)") :
        null;

      // Clean up the event in case it is being reused
      event.result = undefined;
      if (!event.target) {
        event.target = elem;
      }

      // Clone any incoming data and prepend the event, creating the handler arg list
      data = data == null ? [event] :
        jQuery.makeArray(data, [event]);

      // Allow special events to draw outside the lines
      special = jQuery.event.special[type] || {};
      if (!onlyHandlers && special.trigger && special.trigger.apply(elem,
          data) === false) {
        return;
      }

      // Determine event propagation path in advance, per W3C events spec (#9951)
      // Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
      if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

        //一层层的寻找，并把每一层push到eventPath下面
        bubbleType = special.delegateType || type;
        if (!rfocusMorph.test(bubbleType + type)) {
          cur = cur.parentNode;
        }
        for (; cur; cur = cur.parentNode) {
          eventPath.push(cur);
          tmp = cur;
        }

        // Only add window if we got to document (e.g., not plain obj or detached DOM)
        if (tmp === (elem.ownerDocument || document)) {
          eventPath.push(tmp.defaultView || tmp.parentWindow || window);
        }
      }

      // Fire handlers on the event path
      i = 0;
      //上面原生我们用for in循环，这里用的是while
      while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {

        event.type = i > 1 ?
          bubbleType :
          special.bindType || type;

        // jQuery handler
        handle = (data_priv.get(cur, "events") || {})[event.type] &&
          data_priv.get(cur, "handle");
          //当函数存在则执行
        if (handle) {
          handle.apply(cur, data);
        }

        // Native handler
        handle = ontype && cur[ontype];
        if (handle && jQuery.acceptData(cur) && handle.apply && handle.apply(
            cur, data) === false) {
          event.preventDefault();
        }
      }
      event.type = type;

      // If nobody prevented the default action, do it now
      if (!onlyHandlers && !event.isDefaultPrevented()) {

        if ((!special._default || special._default.apply(eventPath.pop(),
            data) === false) &&
          jQuery.acceptData(elem)) {

          // Call a native DOM method on the target with the same name name as the event.
          // Don't do default actions on window, that's where global variables be (#6170)
          if (ontype && jQuery.isFunction(elem[type]) && !jQuery.isWindow(
              elem)) {

            // Don't re-trigger an onFOO event when we call its FOO() method
            tmp = elem[ontype];

            if (tmp) {
              elem[ontype] = null;
            }

            // Prevent re-triggering of the same event, since we already bubbled it above
            jQuery.event.triggered = type;
            elem[type]();
            jQuery.event.triggered = undefined;

            if (tmp) {
              elem[ontype] = tmp;
            }
          }
        }
      }

      return event.result;
    },

    dispatch: function(event) {

      // Make a writable jQuery.Event from the native event object
      //兼容性处理
      event = jQuery.event.fix(event);

      var i, j, ret, matched, handleObj,
        handlerQueue = [],
        args = core_slice.call(arguments),
        handlers = (data_priv.get(this, "events") || {})[event.type] || [],
        special = jQuery.event.special[event.type] || {};

      // Use the fix-ed jQuery.Event rather than the (read-only) native event
      args[0] = event;
      event.delegateTarget = this;

      // Call the preDispatch hook for the mapped type, and let it bail if desired
      if (special.preDispatch && special.preDispatch.call(this, event) ===
        false) {
        return;
      }

      // Determine handlers
      handlerQueue = jQuery.event.handlers.call(this, event, handlers);

      // Run delegates first; they may want to stop propagation beneath us
      i = 0;

      //判断是否冒泡事件
      while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
        event.currentTarget = matched.elem;

        j = 0;
        while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {

          // Triggered event must either 1) have no namespace, or
          // 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
          if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {

            event.handleObj = handleObj;
            event.data = handleObj.data;

            ret = ((jQuery.event.special[handleObj.origType] || {})
                .handle || handleObj.handler)
              .apply(matched.elem, args);

              //判断结果来进行是否阻止冒泡和默认事件
              //$('#div1').on('click', function(){
              //  alert(1);
              //  return false;//阻止冒泡和默认事件
              //})
            if (ret !== undefined) {
              if ((event.result = ret) === false) {
                event.preventDefault();
                event.stopPropagation();
              }
            }
          }
        }
      }

      // Call the postDispatch hook for the mapped type
      if (special.postDispatch) {
        special.postDispatch.call(this, event);
      }

      return event.result;
    },

    //真正的事件函数
    handlers: function(event, handlers) {
      var i, matches, sel, handleObj,
        handlerQueue = [],
        delegateCount = handlers.delegateCount,
        cur = event.target;

      // Find delegate handlers
      // Black-hole SVG <use> instance trees (#13180)
      // Avoid non-left-click bubbling in Firefox (#3861)
      if (delegateCount && cur.nodeType && (!event.button || event.type !==
          "click")) {

        for (; cur !== this; cur = cur.parentNode || this) {

          // Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
          if (cur.disabled !== true || event.type !== "click") {
            matches = [];
            for (i = 0; i < delegateCount; i++) {
              handleObj = handlers[i];

              // Don't conflict with Object.prototype properties (#13203)
              sel = handleObj.selector + " ";

              if (matches[sel] === undefined) {
                matches[sel] = handleObj.needsContext ?
                  jQuery(sel, this)
                  .index(cur) >= 0 :
                  jQuery.find(sel, this, null, [cur])
                  .length;
              }
              if (matches[sel]) {
                matches.push(handleObj);
              }
            }
            if (matches.length) {
              handlerQueue.push({
                elem: cur,
                handlers: matches
              });
            }
          }
        }
      }

      // Add the remaining (directly-bound) handlers
      if (delegateCount < handlers.length) {
        handlerQueue.push({
          elem: this,
          handlers: handlers.slice(delegateCount)
        });
      }

      return handlerQueue;
    },

    // Includes some event props shared by KeyEvent and MouseEvent
    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which"
      .split(" "),

    fixHooks: {},

    keyHooks: {
      props: "char charCode key keyCode".split(" "),
      //兼容处理filter方法
      //document.onkeydown = function(ev){
      //  var ev  = ev || window.event;
      //  alert(ev.which);
      //}
      filter: function(event, original) {

        // Add which for key events
        //which是弹出所对应键盘的键值
        if (event.which == null) {
          //基本所有浏览器都支持keyCode
          event.which = original.charCode != null ? original.charCode :
            original.keyCode;
        }

        return event;
      }
    },

    //可以看到下面有一个props属性和一个filter方法
    mouseHooks: {
      props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement"
        .split(" "),
        //这个方法解决鼠标相关的兼容性操作
      filter: function(event, original) {
        var eventDoc, doc, body,
          button = original.button;

          //document.onclick = function(ev){
          //  alert(ev.clientY)
          //}
        // Calculate pageX/Y if missing and clientX/Y available
        if (event.pageX == null && original.clientX != null) {
          eventDoc = event.target.ownerDocument || document;
          doc = eventDoc.documentElement;
          body = eventDoc.body;

          event.pageX = original.clientX + (doc && doc.scrollLeft || body &&
            body.scrollLeft || 0) - (doc && doc.clientLeft || body &&
            body.clientLeft || 0);
          event.pageY = original.clientY + (doc && doc.scrollTop || body &&
            body.scrollTop || 0) - (doc && doc.clientTop || body &&
            body.clientTop || 0);
        }

        // Add which for click: 1 === left; 2 === middle; 3 === right
        // Note: button is not normalized, so don't use it
        //鼠标左键 中 右键的兼容处理
        if (!event.which && button !== undefined) {
          event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ?
            2 : 0)));
        }

        return event;
      }
    },

    fix: function(event) {
      if (event[jQuery.expando]) {
        return event;
      }

      // Create a writable copy of the event object and normalize some properties
      var i, prop, copy,
        type = event.type,
        //原生的Event
        originalEvent = event,
        fixHook = this.fixHooks[type];

      if (!fixHook) {
        this.fixHooks[type] = fixHook =
          rmouseEvent.test(type) ? this.mouseHooks :
          rkeyEvent.test(type) ? this.keyHooks : {};
      }
      //拼接属性
      copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

      event = new jQuery.Event(originalEvent);

      //遍历属性，赋值原生方法
      i = copy.length;
      while (i--) {
        prop = copy[i];
        event[prop] = originalEvent[prop];
      }

      // Support: Cordova 2.5 (WebKit) (#13255)
      // All events should have a target; Cordova deviceready doesn't
      //针对移动端的兼容处理
      if (!event.target) {
        event.target = document;
      }

      // Support: Safari 6.0+, Chrome < 28
      // Target should not be a text node (#504, #13143)
      if (event.target.nodeType === 3) {
        event.target = event.target.parentNode;
      }

      return fixHook.filter ? fixHook.filter(event, originalEvent) :
        event;
    },

    //特殊事件下的兼容
    //jQuery.event.special{
    //  load
    //  focus
    //  blur
    //  click
    //  beforeunload
    //  mouseenter
    //  mouseleave
    //  focusin
    //  focusout
    //}
    //jquery中的trigger是支持冒泡操作的
    //$(fucntion(){
    //  $('#div1').on('click', function(){
    //    alert(1);
    //  });

    //  $('input').on('click',fucntion(){
    //    alert(12);
    //  });

    //  //可以发现input的trigger可以触发父级上的click事件
    //  $('input').trigger('click');
    //});

    

    special: {
      load: {
        // Prevent triggered image.load events from bubbling to window.load
        //不允许冒泡
        noBubble: true
      },
      focus: {
        // Fire native event if possible so blur/focus sequence is correct
        //focus不支持冒泡操作
        //$(fucntion(){
    //  $('#div1').on('focus', function(){
    //    alert(1);
    //  });

    //  $('input').on('focus',fucntion(){
    //    alert(12);
    //  });

    //  //可以发现input的trigger不可以触发父级上的focus事件
    //  $('input').trigger('focus');
    //});
        trigger: function() {
          if (this !== safeActiveElement() && this.focus) {
            this.focus();
            return false;
          }
        },
        //事件委托把focus加到div1上
        //$('#div1').delegate('input','focus',fucntion(){
        //  alert(1)
        //})
        delegateType: "focusin"
      },
      blur: {
        trigger: function() {
          if (this === safeActiveElement() && this.blur) {
            this.blur();
            return false;
          }
        },
        delegateType: "focusout"
      },
      //$('#input1').on('click',fucntion(){})
      //$('#input1').trigger('click');
      //<input type="checkbox" id="input1">
      click: {
        // For checkbox, fire native event so checked state will be right
        trigger: function() {
          if (this.type === "checkbox" && this.click && jQuery.nodeName(
              this, "input")) {
            this.click();
            return false;
          }
        },

        //当nodeName是a的时候不跳转页面
        //$('a').on('click',fucntion(){
        //  alert(1);
        //});
        //$('a').trigger('click');
        
        //<a href=""></a>
        // For cross-browser consistency, don't fire native .click() on links
        _default: function(event) {
          return jQuery.nodeName(event.target, "a");
        }
      },

      beforeunload: {
        postDispatch: function(event) {

          // Support: Firefox 20+
          // Firefox doesn't alert if the returnValue field is not set.
          //对火狐进行兼容处理下面的情况
          //$(window).on('beforeunload',function(){
          //  return 123;
          //})
          if (event.result !== undefined) {
            event.originalEvent.returnValue = event.result;
          }
        }
      }
    },

    simulate: function(type, elem, event, bubble) {
      // Piggyback on a donor event to simulate a different one.
      // Fake originalEvent to avoid donor's stopPropagation, but if the
      // simulated event prevents default then we do the same on the donor.
      var e = jQuery.extend(
        new jQuery.Event(),
        event, {
          type: type,
          isSimulated: true,
          originalEvent: {}
        }
      );
      if (bubble) {
        jQuery.event.trigger(e, null, elem);
      } else {
        jQuery.event.dispatch.call(elem, e);
      }
      if (e.isDefaultPrevented()) {
        event.preventDefault();
      }
    }
  };

  jQuery.removeEvent = function(elem, type, handle) {
    if (elem.removeEventListener) {
      elem.removeEventListener(type, handle, false);
    }
  };

  jQuery.Event = function(src, props) {
    // Allow instantiation without the 'new' keyword
    if (!(this instanceof jQuery.Event)) {
      return new jQuery.Event(src, props);
    }

    // Event object
    if (src && src.type) {
      this.originalEvent = src;
      this.type = src.type;

      // Events bubbling up the document may have been marked as prevented
      // by a handler lower down the tree; reflect the correct value.
      this.isDefaultPrevented = (src.defaultPrevented ||
          src.getPreventDefault && src.getPreventDefault()) ? returnTrue :
        returnFalse;

      // Event type
    } else {
      this.type = src;
    }

    // Put explicitly provided properties onto the event object
    if (props) {
      jQuery.extend(this, props);
    }

    // Create a timestamp if incoming event doesn't have one
    this.timeStamp = src && src.timeStamp || jQuery.now();

    // Mark it as fixed
    this[jQuery.expando] = true;
  };

  // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
  // http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
  jQuery.Event.prototype = {
    //判断是否阻止了默认事件
    //默认值都是false
    isDefaultPrevented: returnFalse,
    //判断是否阻止了冒泡
    isPropagationStopped: returnFalse,
    isImmediatePropagationStopped: returnFalse,

    preventDefault: function() {
      //上来就调用原生的JS
      var e = this.originalEvent;

      this.isDefaultPrevented = returnTrue;

      if (e && e.preventDefault) {
        e.preventDefault();
      }
    },
//    $('div').on('click',fucntion(){
//      alert(1);
//    })
//$('span').on('click',fucntion(ev){
//      alert(2);
//当阻止冒泡的时候，1就不会弹出（父级元素）
//ev.stopPropagation()
//当我们需要在同一元素执行一次事件的时候可以通过
// ev.stopImmediatePropagation()
//    });
//    <div><span></span></div>
//
    stopPropagation: function() {
      var e = this.originalEvent;

      this.isPropagationStopped = returnTrue;

      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
    },
    stopImmediatePropagation: function() {
      //可以查看dispathc里面的while 判断，如果为假则继续执行相同元素下的事件，如果为真则不进入while
      this.isImmediatePropagationStopped = returnTrue;
      this.stopPropagation();
    }
  };

  // Create mouseenter/leave events using mouseover/out and event-time checks
  // Support: Chrome 15+
  jQuery.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  }, function(orig, fix) {
    jQuery.event.special[orig] = {
      delegateType: fix,
      bindType: fix,

      handle: function(event) {
        var ret,
          target = this,
          related = event.relatedTarget,
          handleObj = event.handleObj;

        // For mousenter/leave call the handler if related is outside the target.
        // NB: No relatedTarget if the mouse left/entered the browser window
        if (!related || (related !== target && !jQuery.contains(
            target, related))) {
          event.type = handleObj.origType;
          ret = handleObj.handler.apply(this, arguments);
          event.type = fix;
        }
        return ret;
      }
    };
  });

  // Create "bubbling" focus and blur events
  // Support: Firefox, Chrome, Safari
  if (!jQuery.support.focusinBubbles) {
    jQuery.each({
      focus: "focusin",
      blur: "focusout"
    }, function(orig, fix) {

      // Attach a single capturing handler while someone wants focusin/focusout
      var attaches = 0,
        handler = function(event) {
          jQuery.event.simulate(fix, event.target, jQuery.event.fix(event),
            true);
        };

      jQuery.event.special[fix] = {
        setup: function() {
          if (attaches++ === 0) {
            document.addEventListener(orig, handler, true);
          }
        },
        teardown: function() {
          if (--attaches === 0) {
            document.removeEventListener(orig, handler, true);
          }
        }
      };
    });
  }

  //on的这个位置。。。
  jQuery.fn.extend({

    //data参数可以在ev下面找到，这个参数用来数据
    //$(fucntion(){
    //  $('#div1').on('click',{name:'hello'},function(){
    //    alert(ev.data.name);
    //  });
    //});
    //事件委托
    //$('#div1').delegate('li','click',{name:'hello'},fucntion(){
    //  $(this).css('background','red');
    //})当你看下delegate的实现的时候就发现，它调用的就是on只不过是把参数换了下位置！
    //第五个参数是内部使用，
    on: function(types, selector, data, fn, /*INTERNAL*/ one) {
      var origFn, type;

      // Types can be a map of types/handlers
      //能进入if是：
      //$('#div1').on({
      //  'click':function () {
      //    alert(123);
      //  },
      //  'mouseover': function () {
      //    alert(456) 
      //  }
      //});
      if (typeof types === "object") {
        // ( types-Object, selector, data )
        if (typeof selector !== "string") {
          // ( types-Object, data )
          data = data || selector;
          selector = undefined;
        }
        //进行for in 循环，拆解对象
        for (type in types) {
          this.on(type, selector, data, types[type], one);
        }
        return this;
      }

      //修正参数的位置，因为有时候我们会只写两个参数！
      if (data == null && fn == null) {
        //两个参数
        // ( types, fn )
        fn = selector;
        data = selector = undefined;
      } else if (fn == null) {
        if (typeof selector === "string") {
          //三个参数的时候
          // ( types, selector, fn )
          fn = data;
          data = undefined;
        } else {
          // ( types, data, fn )
          fn = data;
          data = selector;
          selector = undefined;
        }
      }
      if (fn === false) {
        fn = returnFalse;
      } else if (!fn) {
        return this;
      }

      //让事件只执行一次！
      if (one === 1) {
        origFn = fn;
        fn = function(event) {
          // Can use an empty set, since event contains the info
          //这个地方不理解的原因是，它为什么是执行一次！
          //你明明首先把事件给取消了，后面又调用了。。。
          jQuery()
            .off(event);
          return origFn.apply(this, arguments);
        };
        // Use same guid so caller can remove using origFn
        fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
      }
      return this.each(function() {
        jQuery.event.add(this, types, fn, data, selector);
      });
    },
    one: function(types, selector, data, fn) {
      return this.on(types, selector, data, fn, 1);
    },
    //事件取消，
    off: function(types, selector, fn) {
      var handleObj, type;
      if (types && types.preventDefault && types.handleObj) {
        // ( event )  dispatched jQuery.Event
        handleObj = types.handleObj;
        jQuery(types.delegateTarget)
          .off(
            handleObj.namespace ? handleObj.origType + "." + handleObj.namespace :
            handleObj.origType,
            handleObj.selector,
            handleObj.handler
          );
        return this;
      }
      //对象参数的处理
      if (typeof types === "object") {
        // ( types-object [, selector] )
        for (type in types) {
          this.off(type, selector, types[type]);
        }
        return this;
      }
      if (selector === false || typeof selector === "function") {
        // ( types [, fn] )
        fn = selector;
        selector = undefined;
      }
      if (fn === false) {
        fn = returnFalse;
      }
      return this.each(function() {
        jQuery.event.remove(this, types, fn, selector);
      });
    },

    //trigger使用方式
    //$('#input1').focus(fucntion(){
    //  $(this).css('background','red');
    //})
    //$('#input1').trigger('focus')
    //triggerHandler不会触发当前事件的默认行为
    //$('#input1').triggerHandler('focus')
    
    trigger: function(type, data) {
      return this.each(function() {
        jQuery.event.trigger(type, data, this);
      });
    },
    triggerHandler: function(type, data) {
      var elem = this[0];
      if (elem) {
        return jQuery.event.trigger(type, data, elem, true);
      }
    }
  });
  // 起始位置.代表任意字符，然后是[^]代表不包括冒号，#号等
  //匹配成功.box  div #div1 :odd ul li
  //匹配不成功  div：odd ul #li ul[title=“hello”]
  var isSimple = /^.[^:#\[\.,]*$/,
    rparentsprev = /^(?:parents|prev(?:Until|All))/,
    rneedsContext = jQuery.expr.match.needsContext,
    // methods guaranteed to produce a unique set when starting from a unique set
    guaranteedUnique = {
      children: true,
      contents: true,
      next: true,
      prev: true
    };
//DOM操作的结构简化

//$.fn.extend({
//  find
//  has
//  not
//  filter
//  is
//  closest
//  index
//  add
//  addBack
//})
//function sibling(){
//
//}
//
//jQuery.each({
//  parent
//  parents
//  parentsUntil
//next
//prev
//nextAll
//prevAll
//prevUntil
//siblings
//children
//contents
//})
//jQuery.extend({
//  filter
//  dir
//  sibling
//})
//
//jQuery.fn.extend({
//  text
//  append
//  prepend
//  before
//  after
//  remove
//  empty
//  clone
//  html
//  replaceWith
//  detach
//  domManip
//})
//jQuery.each({
//  appendTo: "append",
//  prependTo: "prepend",
//  insertBefore: "before",
//  insertAfter: "after",
//  replaceAll: "replaceWith"
//})
//jQuery.extend({
//  clone
//  buildFragment
//  cleanData
//  _evalUrl
//})
//
//function manipulationTarget(){}
//function disableScript() {}
//function restoreScript(){}
//function setGlobalEval() {}
//function cloneCopyEvent(){}
//function getAll(){}
//function fixInput(){}
//
//jQuery.fn.extend({
//  wrapAll
//  wrapInner
//  wrapMap
//  unwrap
//})
//

  jQuery.fn.extend({
    //<ul>
    //<li></li>
    //<li></li>
    //<li></li>
    //</ul>
    //<ol>
    //<li></li>
    //<li></li>
    //<li></li>
    //</ol>
    //find的基本使用！
    //$(fucntion(){
      //$('li').css('background', 'red');
      //只改变ul下的li
      //$('ul').find('li').css('background','red');
    //})

    find: function(selector) {
      var i,
        ret = [],
        self = this,
        len = self.length;

      if (typeof selector !== "string") {
        return this.pushStack(jQuery(selector)
          .filter(function() {
            for (i = 0; i < len; i++) {
              if (jQuery.contains(self[i], this)) {
                return true;
              }
            }
          }));
      }
      //上面我们传递的是字符串，所有要走下面的for语句

      for (i = 0; i < len; i++) {
        jQuery.find(selector, self[i], ret);
      }

      // Needed because $( selector, context ) becomes $( context ).find( selector )
      //进行去重处理
      ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);

      ret.selector = this.selector ? this.selector + " " + selector :
        selector;
      return ret;
    },

    //has使用例子
    has: function(target) {
      var targets = jQuery(target, this),
        l = targets.length;

      return this.filter(function() {
        var i = 0;
        for (; i < l; i++) {
          if (jQuery.contains(this, targets[i])) {
            return true;
          }
        }
      });
    },

    not: function(selector) {
      return this.pushStack(winnow(this, selector || [], true));
    },

    //filter使用方法进行过滤
    //<div class="box">div1<span>span</span></div>
    //<div>div2</div>
    //$(fucntion(){
    //  $('div').filter('.box').css('border','1px red solid');
    //  $('div').not('.box').css('border','1px red solid');
    //在子项上进行排查是否有box
    //  $('div').has('span').css('border','1px red soldi');
    //})
    filter: function(selector) {
      return this.pushStack(winnow(this, selector || [], false));
    },

    is: function(selector) {
      return !!winnow(
          this,

          // If this is a positional/relative selector, check membership in the returned set
          // so $("p:first").is("p:last") won't return true for a doc with two "p".
          typeof selector === "string" && rneedsContext.test(selector) ?
          jQuery(selector) :
          selector || [],
          false
        )
        .length;
    },

    //用法解释
    //选择与div2最近的祖先节点，满足拥有.box类型的添加CSS
    //$(fucntion(){
    //  $('#div2').closest('.box').css('border','1px red solid');
    //});
    closest: function(selectors, context) {
      var cur,
        i = 0,
        l = this.length,
        matched = [],
        pos = (rneedsContext.test(selectors) || typeof selectors !==
          "string") ?
        jQuery(selectors, context || this.context) :
        0;

      for (; i < l; i++) {
        for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
          // Always skip document fragments
          if (cur.nodeType < 11 && (pos ?
              pos.index(cur) > -1 :

              // Don't pass non-elements to Sizzle
              cur.nodeType === 1 &&
              jQuery.find.matchesSelector(cur, selectors))) {

            //找到满足条件的就push到数组里
            cur = matched.push(cur);
            //一旦找到就跳出循环，也就是找最近的意思
            break;
          }
        }
      }

      //去重操作
      return this.pushStack(matched.length > 1 ? jQuery.unique(matched) :
        matched);
    },

    // Determine the position of an element within
    // the matched set of elements
    //只看在兄弟结点中排名第几
    index: function(elem) {

      // No argument, return index in parent
      //<div>1</div>
      //<div id="div1"></div>
      //<div>1</div>
      //$(function(){
      //  console.log($('#div1').index());
      //})
      //可以包含参数，比如在某一类节点内排名第几

      if (!elem) {
        return (this[0] && this[0].parentNode) ? this.first()
          .prevAll()
          .length : -1;
      }

      // index in selector
      //调用原生的indexOf，寻找的是elem对象下this[0]排名第几
      if (typeof elem === "string") {
        return core_indexOf.call(jQuery(elem), this[0]);
      }

      // Locate the position of the desired element
      return core_indexOf.call(this,

        // If it receives a jQuery object, the first element is used
        elem.jquery ? elem[0] : elem
      );
    },

    //基本使用
    //$(fucntion(){
      //end的作用是出栈一次
      //$('div').add('span').css('border','1px red solid').end().css('border','1px red solid');
      //addback可以返回到div同时也可以作用于span
    //});
    //<div>div</div>
    //<span>span</span>
    add: function(selector, context) {
      var set = typeof selector === "string" ?
        jQuery(selector, context) :
        jQuery.makeArray(selector && selector.nodeType ? [selector] :
          selector),
        all = jQuery.merge(this.get(), set);

        //去重，入栈
      return this.pushStack(jQuery.unique(all)); 
    },

    addBack: function(selector) {
      return this.add(selector == null ?
        this.prevObject : this.prevObject.filter(selector)
      );
    }
  });

  function sibling(cur, dir) {
    while ((cur = cur[dir]) && cur.nodeType !== 1) {}

    return cur;
  }

  jQuery.each({
    //基本使用
    //$('span').parent().css('border','1px red solid');
    parent: function(elem) {
      var parent = elem.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function(elem) {
      return jQuery.dir(elem, "parentNode");
    },
    //从span上面找父节点直到body为止
    //$('span').parentsUntil('body').css('border','1px red solid');
    parentsUntil: function(elem, i, until) {
      return jQuery.dir(elem, "parentNode", until);
    },
    next: function(elem) {
      return sibling(elem, "nextSibling");
    },
    prev: function(elem) {
      return sibling(elem, "previousSibling");
    },
    nextAll: function(elem) {
      return jQuery.dir(elem, "nextSibling");
    },
    prevAll: function(elem) {
      return jQuery.dir(elem, "previousSibling");
    },
    nextUntil: function(elem, i, until) {
      return jQuery.dir(elem, "nextSibling", until);
    },
    prevUntil: function(elem, i, until) {
      return jQuery.dir(elem, "previousSibling", until);
    },
    siblings: function(elem) {
      return jQuery.sibling((elem.parentNode || {})
        .firstChild, elem);
    },
    children: function(elem) {
      return jQuery.sibling(elem.firstChild);
    },
    contents: function(elem) {
      //childNode会获取所有的节点类型！
      return elem.contentDocument || jQuery.merge([], elem.childNodes);
    }
  }, function(name, fn) {
    jQuery.fn[name] = function(until, selector) {
      var matched = jQuery.map(this, fn, until);

      //后5个字符串和Until匹配如果不匹配，那么
      if (name.slice(-5) !== "Until") {
        selector = until;
      }

      if (selector && typeof selector === "string") {
        matched = jQuery.filter(selector, matched);
      }

      if (this.length > 1) {
        // Remove duplicates
        if (!guaranteedUnique[name]) {
          jQuery.unique(matched);
        }

        // Reverse order for parents* and prev-derivatives
        if (rparentsprev.test(name)) {
          //[1] [2] [3]会变成[3] [2] [1]
          matched.reverse();
        }
      }

      return this.pushStack(matched);
    };
  });

  jQuery.extend({
    filter: function(expr, elems, not) {
      var elem = elems[0];

      //对第三个参数做判断
      if (not) {
        expr = ":not(" + expr + ")";
      }

      //返回三目运算，判断是多个元素还是单个元素
      return elems.length === 1 && elem.nodeType === 1 ?
      //sizzle 里面多个元素筛选
        jQuery.find.matchesSelector(elem, expr) ? [elem] : [] :
        //sizzle里面单个元素进行筛选
        jQuery.find.matches(expr, jQuery.grep(elems, function(elem) {
          return elem.nodeType === 1;
        }));
    },

    //elem当前要操作的元素，dir指定操作父级还是兄弟节点
    dir: function(elem, dir, until) {
      var matched = [],
        truncate = until !== undefined;

        //把elem[dir]存成elem，它是elem的父级
      while ((elem = elem[dir]) && elem.nodeType !== 9) {
        //判断元素节点
        if (elem.nodeType === 1) {
          //判断截至，如果有就跳出循环
          if (truncate && jQuery(elem)
            .is(until)) {
            break;
          }
          //把父级全部存到数组种
          matched.push(elem);
        }
      }
      return matched;
    },

    sibling: function(n, elem) {
      var matched = [];

      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
          matched.push(n);
        }
      }

      return matched;
    }
  });

  // Implement the identical functionality for filter and not
  function winnow(elements, qualifier, not) {
    //第一步对筛选的条件判断是否是函数
    //举个例子哈
    //$('div').filter(function(i,elem){
    //  return false;
    //}).css('border', '1px red solid');

    if (jQuery.isFunction(qualifier)) {
      return jQuery.grep(elements, function(elem, i) {
        /* jshint -W018 */
        return !!qualifier.call(elem, i, elem) !== not;
      });

    }

    //判断节点类型
    if (qualifier.nodeType) {
      return jQuery.grep(elements, function(elem) {
        return (elem === qualifier) !== not;
      });

    }

    //是字符串的时候！
    if (typeof qualifier === "string") {
      if (isSimple.test(qualifier)) {
        return jQuery.filter(qualifier, elements, not);
      }

      //复杂的不能在filter当中加not操作的！
      qualifier = jQuery.filter(qualifier, elements);
    }
//实现filter和not的功能
    return jQuery.grep(elements, function(elem) {
      return (core_indexOf.call(qualifier, elem) >= 0) !== not;
    });
  }
  var rxhtmlTag =
    /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    rtagName = /<([\w:]+)/,
    rhtml = /<|&#?\w+;/,
    rnoInnerhtml = /<(?:script|style|link)/i,
    manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
    // checked="checked" or checked
    rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    rscriptType = /^$|\/(?:java|ecma)script/i,
    rscriptTypeMasked = /^true\/(.*)/,
    rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

    // We have to close these tags to support XHTML (#13200)
    wrapMap = {

      // Support: IE 9
      option: [1, "<select multiple='multiple'>", "</select>"],

      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

      _default: [0, "", ""]
    };

  // Support: IE 9
  wrapMap.optgroup = wrapMap.option;

  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption =
    wrapMap.thead;
  wrapMap.th = wrapMap.td;

  jQuery.fn.extend({
    //只针对文本,而html()会获取所有节点
    //console.log($('div').text());
    text: function(value) {
      //acess是属性统一的一个方法可以获取，设置等等
      return jQuery.access(this, function(value) {
        //如果value是undefi就进行获取的操作
        return value === undefined ?
          jQuery.text(this) :
          //value如果有值则进行设置的操作
          //可以看到第一步是进行清空处理
          this.empty()
          .append((this[0] && this[0].ownerDocument || document)
            .createTextNode(value));
      }, null, value, arguments.length);
    },

    append: function() {
      return this.domManip(arguments, function(elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType ===
          9) {
          var target = manipulationTarget(this, elem);
          target.appendChild(elem);
        }
      });
    },

    prepend: function() {
      return this.domManip(arguments, function(elem) {
        if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType ===
          9) {
          var target = manipulationTarget(this, elem);
          target.insertBefore(elem, target.firstChild);
        }
      });
    },

    before: function() {
      return this.domManip(arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this);
        }
      });
    },

    after: function() {
      return this.domManip(arguments, function(elem) {
        if (this.parentNode) {
          this.parentNode.insertBefore(elem, this.nextSibling);
        }
      });
    },

    // keepData is for internal use only--do not document
    //remove 和 detach的区别是remove会移除元素的属性数据
    remove: function(selector, keepData) {
      var elem,
        elems = selector ? jQuery.filter(selector, this) : this,
        i = 0;

        //对每一个元素进行for循环
      for (;
        (elem = elems[i]) != null; i++) {
          //如果有true则不走这个if
        if (!keepData && elem.nodeType === 1) {
          //getAll是获取子元素所有集合
          jQuery.cleanData(getAll(elem));
        }

        //
        if (elem.parentNode) {
          if (keepData && jQuery.contains(elem.ownerDocument, elem)) {
            //变成全局
            setGlobalEval(getAll(elem, "script"));
          }
          elem.parentNode.removeChild(elem);
        }
      }

      return this;
    },

    empty: function() {
      var elem,
        i = 0;

      for (;
        (elem = this[i]) != null; i++) {
          //判断是否是元素节点
        if (elem.nodeType === 1) {

          // Prevent memory leaks
          //一个参数会获得整个，两个参数会获得内部元素
          jQuery.cleanData(getAll(elem, false));

          // Remove any remaining nodes
          //把内容置空
          elem.textContent = "";
        }
      }

      return this;
    },

    //基本使用
    //var cloneDiv = $('div').clone();
    //如何让克隆的元素拥有之前的事件呢？需要传递给clone一个true的参数

    //第二参数控制的是子元素下的事件复制，

    clone: function(dataAndEvents, deepDataAndEvents) {
      dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
      //可以看到在第二个参数不存在的情况下，默认是第一个参数的值
      deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents :
        deepDataAndEvents;

      return this.map(function() {
        //关键的地方是调用了jQuery下面的clone。内部工具方法
        return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
      });
    },

    html: function(value) {
      return jQuery.access(this, function(value) {
        var elem = this[0] || {},
          i = 0,
          l = this.length;

          //获取部分
        if (value === undefined && elem.nodeType === 1) {
          return elem.innerHTML;
        }

        // See if we can take a shortcut and just use innerHTML
        //设置部分
        //原生的innderHTML只会把内容当作字符串添加而不进行解析
        //$('span').get(0).innerHTML = '<script>alert (1) </script>';
        if (typeof value === "string" && !rnoInnerhtml.test(value) &&
        //如果输入的内容不符合规范，则不能进入这个if
          !wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]
        ) {

          //下面正则的作用是把不规范的标签转换成规范的
          //比如只写一个</div>会变成<div></div>
          value = value.replace(rxhtmlTag, "<$1></$2>");

          try {
            for (; i < l; i++) {
              elem = this[i] || {};

              // Remove element nodes and prevent memory leaks
              if (elem.nodeType === 1) {
                jQuery.cleanData(getAll(elem, false));
                elem.innerHTML = value;
              }
            }

            elem = 0;

            // If using innerHTML throws an exception, use the fallback method
          } catch (e) {}
        }

        if (elem) {
          //可以看到是先情况，然后用append方法添加
          this.empty()
            .append(value);
        }
      }, null, value, arguments.length);
    },

    replaceWith: function() {
      var
        // Snapshot the DOM in case .domManip sweeps something relevant into its fragment
        args = jQuery.map(this, function(elem) {
          return [elem.nextSibling, elem.parentNode];
        }),
        i = 0;

      // Make the changes, replacing each context element with the new content
      this.domManip(arguments, function(elem) {
        var next = args[i++],
          parent = args[i++];

        if (parent) {
          // Don't use the snapshot next if it has moved (#13810)
          if (next && next.parentNode !== parent) {
            next = this.nextSibling;
          }
          jQuery(this)
            .remove();
          parent.insertBefore(elem, next);
        }
        // Allow new content to include elements from the context set
      }, true);

      // Force removal if there was no new content (e.g., from empty arguments)
      return i ? this : this.remove();
    },

    detach: function(selector) {
      return this.remove(selector, true);
    },

    domManip: function(args, callback, allowIntersection) {

      // Flatten any nested arrays
      args = core_concat.apply([], args);

      var fragment, first, scripts, hasScripts, node, doc,
        i = 0,
        l = this.length,
        set = this,
        iNoClone = l - 1,
        value = args[0],
        isFunction = jQuery.isFunction(value);

      // We can't cloneNode fragments that contain checked, in WebKit
      if (isFunction || !(l <= 1 || typeof value !== "string" || jQuery
          .support.checkClone || !rchecked.test(value))) {
        return this.each(function(index) {
          var self = set.eq(index);
          if (isFunction) {
            args[0] = value.call(this, index, self.html());
          }
          self.domManip(args, callback, allowIntersection);
        });
      }

      if (l) {
        fragment = jQuery.buildFragment(args, this[0].ownerDocument,
          false, !allowIntersection && this);
        first = fragment.firstChild;

        if (fragment.childNodes.length === 1) {
          fragment = first;
        }

        if (first) {
          scripts = jQuery.map(getAll(fragment, "script"),
            disableScript);
          hasScripts = scripts.length;

          // Use the original fragment for the last item instead of the first because it can end up
          // being emptied incorrectly in certain situations (#8070).
          for (; i < l; i++) {
            node = fragment;

            if (i !== iNoClone) {
              node = jQuery.clone(node, true, true);

              // Keep references to cloned scripts for later restoration
              if (hasScripts) {
                // Support: QtWebKit
                // jQuery.merge because core_push.apply(_, arraylike) throws
                jQuery.merge(scripts, getAll(node, "script"));
              }
            }

            callback.call(this[i], node, i);
          }

          if (hasScripts) {
            doc = scripts[scripts.length - 1].ownerDocument;

            // Reenable scripts
            jQuery.map(scripts, restoreScript);

            // Evaluate executable scripts on first document insertion
            for (i = 0; i < hasScripts; i++) {
              node = scripts[i];
              if (rscriptType.test(node.type || "") &&
                !data_priv.access(node, "globalEval") && jQuery.contains(
                  doc, node)) {

                if (node.src) {
                  // Hope ajax is available...
                  jQuery._evalUrl(node.src);
                } else {
                  jQuery.globalEval(node.textContent.replace(
                    rcleanScript, ""));
                }
              }
            }
          }
        }
      }

      return this;
    }
  });

  jQuery.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
  }, function(name, original) {
    jQuery.fn[name] = function(selector) {
      var elems,
        ret = [],
        insert = jQuery(selector),
        last = insert.length - 1,
        i = 0;

      for (; i <= last; i++) {
        elems = i === last ? this : this.clone(true);
        jQuery(insert[i])[original](elems);

        // Support: QtWebKit
        // .get() because core_push.apply(_, arraylike) throws
        core_push.apply(ret, elems.get());
      }

      return this.pushStack(ret);
    };
  });

  jQuery.extend({
    clone: function(elem, dataAndEvents, deepDataAndEvents) {
      var i, l, srcElements, destElements,
        clone = elem.cloneNode(true),
        inPage = jQuery.contains(elem.ownerDocument, elem);

      // Support: IE >= 9
      // Fix Cloning issues解决下面的兼容性问题
      //<input type="checkbox">
      //$(fucntion(){
      //  $('input').prop('checked',true);
      //  //原生代码种如果进行复制，并不会带有checked属性,只是在IE9和10下
      //  $('input').clone().appendTo('body');
      //})
      if (!jQuery.support.noCloneChecked && (elem.nodeType === 1 ||
          elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {

        // We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
        destElements = getAll(clone);
        srcElements = getAll(elem);

        for (i = 0, l = srcElements.length; i < l; i++) {
          fixInput(srcElements[i], destElements[i]);
        }
      }

      //对事件进行复制
      // Copy the events from the original to the clone
      //第一个if判断自身的事件，第二个if判断子项的事件复制
      if (dataAndEvents) {
        if (deepDataAndEvents) {
          srcElements = srcElements || getAll(elem);
          destElements = destElements || getAll(clone);

          for (i = 0, l = srcElements.length; i < l; i++) {
            cloneCopyEvent(srcElements[i], destElements[i]);
          }
        } else {
          cloneCopyEvent(elem, clone);
        }
      }

      // Preserve script evaluation history
      //复制包含script标签的情况下：
      //<div><script>alert(1)</script></div>
      //$('div').clone().appendTo('body');
      destElements = getAll(clone, "script");
      if (destElements.length > 0) {
        //对script内容进行全局化
        setGlobalEval(destElements, !inPage && getAll(elem, "script"));
      }

      // Return the cloned set
      return clone;
    },

    buildFragment: function(elems, context, scripts, selection) {
      var elem, tmp, tag, wrap, contains, j,
        i = 0,
        l = elems.length,
        fragment = context.createDocumentFragment(),
        nodes = [];

      for (; i < l; i++) {
        elem = elems[i];

        if (elem || elem === 0) {

          // Add nodes directly
          if (jQuery.type(elem) === "object") {
            // Support: QtWebKit
            // jQuery.merge because core_push.apply(_, arraylike) throws
            jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

            // Convert non-html into a text node
          } else if (!rhtml.test(elem)) {
            nodes.push(context.createTextNode(elem));

            // Convert html into DOM nodes
          } else {
            tmp = tmp || fragment.appendChild(context.createElement(
              "div"));

            // Deserialize a standard representation
            tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
            wrap = wrapMap[tag] || wrapMap._default;
            tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag,
              "<$1></$2>") + wrap[2];

            // Descend through wrappers to the right content
            j = wrap[0];
            while (j--) {
              tmp = tmp.lastChild;
            }

            // Support: QtWebKit
            // jQuery.merge because core_push.apply(_, arraylike) throws
            jQuery.merge(nodes, tmp.childNodes);

            // Remember the top-level container
            tmp = fragment.firstChild;

            // Fixes #12346
            // Support: Webkit, IE
            tmp.textContent = "";
          }
        }
      }

      // Remove wrapper from fragment
      fragment.textContent = "";

      i = 0;
      while ((elem = nodes[i++])) {

        // #4087 - If origin and destination elements are the same, and this is
        // that element, do not do anything
        if (selection && jQuery.inArray(elem, selection) !== -1) {
          continue;
        }

        contains = jQuery.contains(elem.ownerDocument, elem);

        // Append to fragment
        tmp = getAll(fragment.appendChild(elem), "script");

        // Preserve script evaluation history
        if (contains) {
          setGlobalEval(tmp);
        }

        // Capture executables
        if (scripts) {
          j = 0;
          while ((elem = tmp[j++])) {
            if (rscriptType.test(elem.type || "")) {
              scripts.push(elem);
            }
          }
        }
      }

      return fragment;
    },

    cleanData: function(elems) {
      var data, elem, events, type, key, j,
        special = jQuery.event.special,
        i = 0;

      for (;
        (elem = elems[i]) !== undefined; i++) {
        if (Data.accepts(elem)) {
          key = elem[data_priv.expando];

          if (key && (data = data_priv.cache[key])) {
            events = Object.keys(data.events || {});
            if (events.length) {
              for (j = 0;
                (type = events[j]) !== undefined; j++) {
                if (special[type]) {
                  jQuery.event.remove(elem, type);

                  // This is a shortcut to avoid jQuery.event.remove's overhead
                } else {
                  jQuery.removeEvent(elem, type, data.handle);
                }
              }
            }
            if (data_priv.cache[key]) {
              // Discard any remaining `private` data
              delete data_priv.cache[key];
            }
          }
        }
        // Discard any remaining `user` data
        delete data_user.cache[elem[data_user.expando]];
      }
    },

    _evalUrl: function(url) {
      return jQuery.ajax({
        url: url,
        type: "GET",
        dataType: "script",
        async: false,
        global: false,
        "throws": true
      });
    }
  });

  // Support: 1.x compatibility
  // Manipulating tables requires a tbody
  function manipulationTarget(elem, content) {
    return jQuery.nodeName(elem, "table") &&
      jQuery.nodeName(content.nodeType === 1 ? content : content.firstChild,
        "tr") ?

      elem.getElementsByTagName("tbody")[0] ||
      elem.appendChild(elem.ownerDocument.createElement("tbody")) :
      elem;
  }

  // Replace/restore the type attribute of script elements for safe DOM manipulation
  function disableScript(elem) {
    elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
    return elem;
  }

  function restoreScript(elem) {
    var match = rscriptTypeMasked.exec(elem.type);

    if (match) {
      elem.type = match[1];
    } else {
      elem.removeAttribute("type");
    }

    return elem;
  }

  // Mark scripts as having already been evaluated
  function setGlobalEval(elems, refElements) {
    var l = elems.length,
      i = 0;

    for (; i < l; i++) {
      data_priv.set(
        elems[i], "globalEval", !refElements || data_priv.get(refElements[i],
          "globalEval")
      );
    }
  }

  function cloneCopyEvent(src, dest) {
    var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

    if (dest.nodeType !== 1) {
      return;
    }

    // 1. Copy private data: events, handlers, etc.
    if (data_priv.hasData(src)) {
      pdataOld = data_priv.access(src);
      pdataCur = data_priv.set(dest, pdataOld);
      events = pdataOld.events;

      if (events) {
        delete pdataCur.handle;
        pdataCur.events = {};

        for (type in events) {
          for (i = 0, l = events[type].length; i < l; i++) {
            jQuery.event.add(dest, type, events[type][i]);
          }
        }
      }
    }

    // 2. Copy user data
    if (data_user.hasData(src)) {
      udataOld = data_user.access(src);
      udataCur = jQuery.extend({}, udataOld);

      data_user.set(dest, udataCur);
    }
  }

  function getAll(context, tag) {
    var ret = context.getElementsByTagName ? context.getElementsByTagName(tag ||
        "*") :
      context.querySelectorAll ? context.querySelectorAll(tag || "*") : [];

    return tag === undefined || tag && jQuery.nodeName(context, tag) ?
      jQuery.merge([context], ret) :
      ret;
  }

  // Support: IE >= 9
  function fixInput(src, dest) {
    var nodeName = dest.nodeName.toLowerCase();

    // Fails to persist the checked state of a cloned checkbox or radio button.
    if (nodeName === "input" && manipulation_rcheckableType.test(src.type)) {
      dest.checked = src.checked;

      // Fails to return the selected option to the default selected state when cloning options
    } else if (nodeName === "input" || nodeName === "textarea") {
      dest.defaultValue = src.defaultValue;
    }
  }
  jQuery.fn.extend({
    wrapAll: function(html) {
      var wrap;

      if (jQuery.isFunction(html)) {
        return this.each(function(i) {
          jQuery(this)
            .wrapAll(html.call(this, i));
        });
      }

      if (this[0]) {

        // The elements to wrap the target around
        wrap = jQuery(html, this[0].ownerDocument)
          .eq(0)
          .clone(true);

        if (this[0].parentNode) {
          wrap.insertBefore(this[0]);
        }

        wrap.map(function() {
            var elem = this;

            while (elem.firstElementChild) {
              elem = elem.firstElementChild;
            }

            return elem;
          })
          .append(this);
      }

      return this;
    },

    wrapInner: function(html) {
      if (jQuery.isFunction(html)) {
        return this.each(function(i) {
          jQuery(this)
            .wrapInner(html.call(this, i));
        });
      }

      return this.each(function() {
        var self = jQuery(this),
          contents = self.contents();

        if (contents.length) {
          contents.wrapAll(html);

        } else {
          self.append(html);
        }
      });
    },

    wrap: function(html) {
      var isFunction = jQuery.isFunction(html);

      return this.each(function(i) {
        jQuery(this)
          .wrapAll(isFunction ? html.call(this, i) : html);
      });
    },

    unwrap: function() {
      return this.parent()
        .each(function() {
          if (!jQuery.nodeName(this, "body")) {
            jQuery(this)
              .replaceWith(this.childNodes);
          }
        })
        .end();
    }
  });
  var curCSS, iframe,
    // swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
    // see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    rdisplayswap = /^(none|table(?!-c[ea]).+)/,
    rmargin = /^margin/,
    rnumsplit = new RegExp("^(" + core_pnum + ")(.*)$", "i"),
    rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"),
    rrelNum = new RegExp("^([+-])=(" + core_pnum + ")", "i"),
    elemdisplay = {
      BODY: "block"
    },

    cssShow = {
      position: "absolute",
      visibility: "hidden",
      display: "block"
    },
    cssNormalTransform = {
      letterSpacing: 0,
      fontWeight: 400
    },

    cssExpand = ["Top", "Right", "Bottom", "Left"],
    cssPrefixes = ["Webkit", "O", "Moz", "ms"];

  // return a css property mapped to a potentially vendor prefixed property
  function vendorPropName(style, name) {

    // shortcut for names that are not vendor prefixed
    if (name in style) {
      return name;
    }

    // check for vendor prefixed names
    var capName = name.charAt(0)
      .toUpperCase() + name.slice(1),
      origName = name,
      i = cssPrefixes.length;

    while (i--) {
      name = cssPrefixes[i] + capName;
      if (name in style) {
        return name;
      }
    }

    return origName;
  }

  function isHidden(elem, el) {
    // isHidden might be called from jQuery#filter function;
    // in that case, element will be second argument
    elem = el || elem;
    return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument,
      elem);
  }

  // NOTE: we've included the "window" in window.getComputedStyle
  // because jsdom on node.js will break without it.
  function getStyles(elem) {
    return window.getComputedStyle(elem, null);
  }

  function showHide(elements, show) {
    var display, elem, hidden,
      values = [],
      index = 0,
      length = elements.length;

    for (; index < length; index++) {
      elem = elements[index];
      if (!elem.style) {
        continue;
      }

      values[index] = data_priv.get(elem, "olddisplay");
      display = elem.style.display;
      if (show) {
        // Reset the inline display of this element to learn if it is
        // being hidden by cascaded rules or not
        if (!values[index] && display === "none") {
          elem.style.display = "";
        }

        // Set elements which have been overridden with display: none
        // in a stylesheet to whatever the default browser style is
        // for such an element
        if (elem.style.display === "" && isHidden(elem)) {
          values[index] = data_priv.access(elem, "olddisplay",
            css_defaultDisplay(elem.nodeName));
        }
      } else {

        if (!values[index]) {
          hidden = isHidden(elem);

          if (display && display !== "none" || !hidden) {
            data_priv.set(elem, "olddisplay", hidden ? display : jQuery.css(
              elem, "display"));
          }
        }
      }
    }

    // Set the display of most of the elements in a second loop
    // to avoid the constant reflow
    for (index = 0; index < length; index++) {
      elem = elements[index];
      if (!elem.style) {
        continue;
      }
      if (!show || elem.style.display === "none" || elem.style.display === "") {
        elem.style.display = show ? values[index] || "" : "none";
      }
    }

    return elements;
  }

  jQuery.fn.extend({
    css: function(name, value) {
      return jQuery.access(this, function(elem, name, value) {
        var styles, len,
          map = {},
          i = 0;

        if (jQuery.isArray(name)) {
          styles = getStyles(elem);
          len = name.length;

          for (; i < len; i++) {
            map[name[i]] = jQuery.css(elem, name[i], false, styles);
          }

          return map;
        }

        return value !== undefined ?
          jQuery.style(elem, name, value) :
          jQuery.css(elem, name);
      }, name, value, arguments.length > 1);
    },
    show: function() {
      return showHide(this, true);
    },
    hide: function() {
      return showHide(this);
    },
    toggle: function(state) {
      if (typeof state === "boolean") {
        return state ? this.show() : this.hide();
      }

      return this.each(function() {
        if (isHidden(this)) {
          jQuery(this)
            .show();
        } else {
          jQuery(this)
            .hide();
        }
      });
    }
  });

  jQuery.extend({
    // Add in style property hooks for overriding the default
    // behavior of getting and setting a style property
    cssHooks: {
      opacity: {
        get: function(elem, computed) {
          if (computed) {
            // We should always get a number back from opacity
            var ret = curCSS(elem, "opacity");
            return ret === "" ? "1" : ret;
          }
        }
      }
    },

    // Don't automatically add "px" to these possibly-unitless properties
    cssNumber: {
      "columnCount": true,
      "fillOpacity": true,
      "fontWeight": true,
      "lineHeight": true,
      "opacity": true,
      "order": true,
      "orphans": true,
      "widows": true,
      "zIndex": true,
      "zoom": true
    },

    // Add in properties whose names you wish to fix before
    // setting or getting the value
    cssProps: {
      // normalize float css property
      "float": "cssFloat"
    },

    // Get and set the style property on a DOM Node
    style: function(elem, name, value, extra) {
      // Don't set styles on text and comment nodes
      if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
        return;
      }

      // Make sure that we're working with the right name
      var ret, type, hooks,
        origName = jQuery.camelCase(name),
        style = elem.style;

      name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] =
        vendorPropName(style, origName));

      // gets hook for the prefixed version
      // followed by the unprefixed version
      hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

      // Check if we're setting a value
      if (value !== undefined) {
        type = typeof value;

        // convert relative number strings (+= or -=) to relative numbers. #7345
        if (type === "string" && (ret = rrelNum.exec(value))) {
          value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem,
            name));
          // Fixes bug #9237
          type = "number";
        }

        // Make sure that NaN and null values aren't set. See: #7116
        if (value == null || type === "number" && isNaN(value)) {
          return;
        }

        // If a number was passed in, add 'px' to the (except for certain CSS properties)
        if (type === "number" && !jQuery.cssNumber[origName]) {
          value += "px";
        }

        // Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
        // but it would mean to define eight (for every problematic property) identical functions
        if (!jQuery.support.clearCloneStyle && value === "" && name.indexOf(
            "background") === 0) {
          style[name] = "inherit";
        }

        // If a hook was provided, use that value, otherwise just set the specified value
        if (!hooks || !("set" in hooks) || (value = hooks.set(elem,
            value, extra)) !== undefined) {
          style[name] = value;
        }

      } else {
        // If a hook was provided get the non-computed value from there
        if (hooks && "get" in hooks && (ret = hooks.get(elem, false,
            extra)) !== undefined) {
          return ret;
        }

        // Otherwise just get the value from the style object
        return style[name];
      }
    },

    css: function(elem, name, extra, styles) {
      var val, num, hooks,
        origName = jQuery.camelCase(name);

      // Make sure that we're working with the right name
      name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] =
        vendorPropName(elem.style, origName));

      // gets hook for the prefixed version
      // followed by the unprefixed version
      hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];

      // If a hook was provided get the computed value from there
      if (hooks && "get" in hooks) {
        val = hooks.get(elem, true, extra);
      }

      // Otherwise, if a way to get the computed value exists, use that
      if (val === undefined) {
        val = curCSS(elem, name, styles);
      }

      //convert "normal" to computed value
      if (val === "normal" && name in cssNormalTransform) {
        val = cssNormalTransform[name];
      }

      // Return, converting to number if forced or a qualifier was provided and val looks numeric
      if (extra === "" || extra) {
        num = parseFloat(val);
        return extra === true || jQuery.isNumeric(num) ? num || 0 : val;
      }
      return val;
    }
  });

  curCSS = function(elem, name, _computed) {
    var width, minWidth, maxWidth,
      computed = _computed || getStyles(elem),

      // Support: IE9
      // getPropertyValue is only needed for .css('filter') in IE9, see #12537
      ret = computed ? computed.getPropertyValue(name) || computed[name] :
      undefined,
      style = elem.style;

    if (computed) {

      if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
        ret = jQuery.style(elem, name);
      }

      // Support: Safari 5.1
      // A tribute to the "awesome hack by Dean Edwards"
      // Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
      // this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
      if (rnumnonpx.test(ret) && rmargin.test(name)) {

        // Remember the original values
        width = style.width;
        minWidth = style.minWidth;
        maxWidth = style.maxWidth;

        // Put in the new values to get a computed value out
        style.minWidth = style.maxWidth = style.width = ret;
        ret = computed.width;

        // Revert the changed values
        style.width = width;
        style.minWidth = minWidth;
        style.maxWidth = maxWidth;
      }
    }

    return ret;
  };

  function setPositiveNumber(elem, value, subtract) {
    var matches = rnumsplit.exec(value);
    return matches ?
      // Guard against undefined "subtract", e.g., when used as in cssHooks
      Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") :
      value;
  }

  function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
    var i = extra === (isBorderBox ? "border" : "content") ?
      // If we already have the right measurement, avoid augmentation
      4 :
      // Otherwise initialize for horizontal or vertical properties
      name === "width" ? 1 : 0,

      val = 0;

    for (; i < 4; i += 2) {
      // both box models exclude margin, so add it if we want it
      if (extra === "margin") {
        val += jQuery.css(elem, extra + cssExpand[i], true, styles);
      }

      if (isBorderBox) {
        // border-box includes padding, so remove it if we want content
        if (extra === "content") {
          val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
        }

        // at this point, extra isn't border nor margin, so remove border
        if (extra !== "margin") {
          val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true,
            styles);
        }
      } else {
        // at this point, extra isn't content, so add padding
        val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);

        // at this point, extra isn't content nor padding, so add border
        if (extra !== "padding") {
          val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true,
            styles);
        }
      }
    }

    return val;
  }

  function getWidthOrHeight(elem, name, extra) {

    // Start with offset property, which is equivalent to the border-box value
    var valueIsBorderBox = true,
      val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
      styles = getStyles(elem),
      isBorderBox = jQuery.support.boxSizing && jQuery.css(elem, "boxSizing",
        false, styles) === "border-box";

    // some non-html elements return undefined for offsetWidth, so check for null/undefined
    // svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
    // MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
    if (val <= 0 || val == null) {
      // Fall back to computed then uncomputed css if necessary
      val = curCSS(elem, name, styles);
      if (val < 0 || val == null) {
        val = elem.style[name];
      }

      // Computed unit is not pixels. Stop here and return.
      if (rnumnonpx.test(val)) {
        return val;
      }

      // we need the check for style in case a browser which returns unreliable values
      // for getComputedStyle silently falls back to the reliable elem.style
      valueIsBorderBox = isBorderBox && (jQuery.support.boxSizingReliable ||
        val === elem.style[name]);

      // Normalize "", auto, and prepare for extra
      val = parseFloat(val) || 0;
    }

    // use the active box-sizing model to add/subtract irrelevant styles
    return (val +
      augmentWidthOrHeight(
        elem,
        name,
        extra || (isBorderBox ? "border" : "content"),
        valueIsBorderBox,
        styles
      )
    ) + "px";
  }

  // Try to determine the default display value of an element
  function css_defaultDisplay(nodeName) {
    var doc = document,
      display = elemdisplay[nodeName];

    if (!display) {
      display = actualDisplay(nodeName, doc);

      // If the simple way fails, read from inside an iframe
      if (display === "none" || !display) {
        // Use the already-created iframe if possible
        iframe = (iframe ||
            jQuery("<iframe frameborder='0' width='0' height='0'/>")
            .css("cssText", "display:block !important")
          )
          .appendTo(doc.documentElement);

        // Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
        doc = (iframe[0].contentWindow || iframe[0].contentDocument)
          .document;
        doc.write("<!doctype html><html><body>");
        doc.close();

        display = actualDisplay(nodeName, doc);
        iframe.detach();
      }

      // Store the correct default display
      elemdisplay[nodeName] = display;
    }

    return display;
  }

  // Called ONLY from within css_defaultDisplay
  function actualDisplay(name, doc) {
    var elem = jQuery(doc.createElement(name))
      .appendTo(doc.body),
      display = jQuery.css(elem[0], "display");
    elem.remove();
    return display;
  }

  jQuery.each(["height", "width"], function(i, name) {
    jQuery.cssHooks[name] = {
      get: function(elem, computed, extra) {
        if (computed) {
          // certain elements can have dimension info if we invisibly show them
          // however, it must have a current display style that would benefit from this
          return elem.offsetWidth === 0 && rdisplayswap.test(jQuery.css(
              elem, "display")) ?
            jQuery.swap(elem, cssShow, function() {
              return getWidthOrHeight(elem, name, extra);
            }) :
            getWidthOrHeight(elem, name, extra);
        }
      },

      set: function(elem, value, extra) {
        var styles = extra && getStyles(elem);
        return setPositiveNumber(elem, value, extra ?
          augmentWidthOrHeight(
            elem,
            name,
            extra,
            jQuery.support.boxSizing && jQuery.css(elem,
              "boxSizing", false, styles) === "border-box",
            styles
          ) : 0
        );
      }
    };
  });

  // These hooks cannot be added until DOM ready because the support test
  // for it is not run until after DOM ready
  jQuery(function() {
    // Support: Android 2.3
    if (!jQuery.support.reliableMarginRight) {
      jQuery.cssHooks.marginRight = {
        get: function(elem, computed) {
          if (computed) {
            // Support: Android 2.3
            // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
            // Work around by temporarily setting element display to inline-block
            return jQuery.swap(elem, {
                "display": "inline-block"
              },
              curCSS, [elem, "marginRight"]);
          }
        }
      };
    }

    // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
    // getComputedStyle returns percent when specified for top/left/bottom/right
    // rather than make the css module depend on the offset module, we just check for it here
    if (!jQuery.support.pixelPosition && jQuery.fn.position) {
      jQuery.each(["top", "left"], function(i, prop) {
        jQuery.cssHooks[prop] = {
          get: function(elem, computed) {
            if (computed) {
              computed = curCSS(elem, prop);
              // if curCSS returns percentage, fallback to offset
              return rnumnonpx.test(computed) ?
                jQuery(elem)
                .position()[prop] + "px" :
                computed;
            }
          }
        };
      });
    }

  });

  if (jQuery.expr && jQuery.expr.filters) {
    jQuery.expr.filters.hidden = function(elem) {
      // Support: Opera <= 12.12
      // Opera reports offsetWidths and offsetHeights less than zero on some elements
      return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
    };

    jQuery.expr.filters.visible = function(elem) {
      return !jQuery.expr.filters.hidden(elem);
    };
  }

  // These hooks are used by animate to expand properties
  jQuery.each({
    margin: "",
    padding: "",
    border: "Width"
  }, function(prefix, suffix) {
    jQuery.cssHooks[prefix + suffix] = {
      expand: function(value) {
        var i = 0,
          expanded = {},

          // assumes a single number if not a string
          parts = typeof value === "string" ? value.split(" ") : [
            value
          ];

        for (; i < 4; i++) {
          expanded[prefix + cssExpand[i] + suffix] =
            parts[i] || parts[i - 2] || parts[0];
        }

        return expanded;
      }
    };

    if (!rmargin.test(prefix)) {
      jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
    }
  });
  var r20 = /%20/g,
    rbracket = /\[\]$/,
    rCRLF = /\r?\n/g,
    rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    rsubmittable = /^(?:input|select|textarea|keygen)/i;

  jQuery.fn.extend({
    serialize: function() {
      return jQuery.param(this.serializeArray());
    },
    serializeArray: function() {
      return this.map(function() {
          // Can add propHook for "elements" to filter or add form elements
          var elements = jQuery.prop(this, "elements");
          return elements ? jQuery.makeArray(elements) : this;
        })
        .filter(function() {
          var type = this.type;
          // Use .is(":disabled") so that fieldset[disabled] works
          return this.name && !jQuery(this)
            .is(":disabled") &&
            rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(
              type) &&
            (this.checked || !manipulation_rcheckableType.test(type));
        })
        .map(function(i, elem) {
          var val = jQuery(this)
            .val();

          return val == null ?
            null :
            jQuery.isArray(val) ?
            jQuery.map(val, function(val) {
              return {
                name: elem.name,
                value: val.replace(rCRLF, "\r\n")
              };
            }) : {
              name: elem.name,
              value: val.replace(rCRLF, "\r\n")
            };
        })
        .get();
    }
  });

  //Serialize an array of form elements or a set of
  //key/values into a query string
  jQuery.param = function(a, traditional) {
    var prefix,
      s = [],
      add = function(key, value) {
        // If value is a function, invoke it and return its value
        value = jQuery.isFunction(value) ? value() : (value == null ? "" :
          value);
        s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(
          value);
      };

    // Set traditional to true for jQuery <= 1.3.2 behavior.
    if (traditional === undefined) {
      traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
    }

    // If an array was passed in, assume that it is an array of form elements.
    if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
      // Serialize the form elements
      jQuery.each(a, function() {
        add(this.name, this.value);
      });

    } else {
      // If traditional, encode the "old" way (the way 1.3.2 or older
      // did it), otherwise encode params recursively.
      for (prefix in a) {
        buildParams(prefix, a[prefix], traditional, add);
      }
    }

    // Return the resulting serialization
    return s.join("&")
      .replace(r20, "+");
  };

  function buildParams(prefix, obj, traditional, add) {
    var name;

    if (jQuery.isArray(obj)) {
      // Serialize array item.
      jQuery.each(obj, function(i, v) {
        if (traditional || rbracket.test(prefix)) {
          // Treat each array item as a scalar.
          add(prefix, v);

        } else {
          // Item is non-scalar (array or object), encode its numeric index.
          buildParams(prefix + "[" + (typeof v === "object" ? i : "") +
            "]", v, traditional, add);
        }
      });

    } else if (!traditional && jQuery.type(obj) === "object") {
      // Serialize object item.
      for (name in obj) {
        buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
      }

    } else {
      // Serialize scalar item.
      add(prefix, obj);
    }
  }
  //可以看到根据参数的不同，调用的函数可能会是On
  jQuery.each((
      "blur focus focusin focusout load resize scroll unload click dblclick " +
      "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
      "change select submit keydown keypress keyup error contextmenu")
    .split(" "),
    function(i, name) {

      // Handle event binding
      jQuery.fn[name] = function(data, fn) {
        return arguments.length > 0 ?
        //可以看到，这里没有委托的行为，只可以传数据！
          this.on(name, null, data, fn) :
          this.trigger(name);
      };
    });

  jQuery.fn.extend({
    hover: function(fnOver, fnOut) {
      return this.mouseenter(fnOver)
        .mouseleave(fnOut || fnOver);
    },

    bind: function(types, data, fn) {
      //也是没有委托的，
      return this.on(types, null, data, fn);
    },
    unbind: function(types, fn) {
      return this.off(types, null, fn);
    },

    delegate: function(selector, types, data, fn) {
      return this.on(types, selector, data, fn);
    },
    undelegate: function(selector, types, fn) {
      // ( namespace ) or ( selector, types [, fn] )
      return arguments.length === 1 ? this.off(selector, "**") : this.off(
        types, selector || "**", fn);
    }
  });
  var
    // Document location
    ajaxLocParts,
    ajaxLocation,

    ajax_nonce = jQuery.now(),

    ajax_rquery = /\?/,
    rhash = /#.*$/,
    rts = /([?&])_=[^&]*/,
    rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
    // #7653, #8125, #8152: local protocol detection
    rlocalProtocol =
    /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    rnoContent = /^(?:GET|HEAD)$/,
    rprotocol = /^\/\//,
    rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

    // Keep a copy of the old load method
    _load = jQuery.fn.load,

    /* Prefilters
     * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
     * 2) These are called:
     *    - BEFORE asking for a transport
     *    - AFTER param serialization (s.data is a string if s.processData is true)
     * 3) key is the dataType
     * 4) the catchall symbol "*" can be used
     * 5) execution will start with transport dataType and THEN continue down to "*" if needed
     */
    prefilters = {},

    /* Transports bindings
     * 1) key is the dataType
     * 2) the catchall symbol "*" can be used
     * 3) selection will start with transport dataType and THEN go to "*" if needed
     */
    transports = {},

    // Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    allTypes = "*/".concat("*");

  // #8138, IE may throw an exception when accessing
  // a field from window.location if document.domain has been set
  try {
    ajaxLocation = location.href;
  } catch (e) {
    // Use the href attribute of an A element
    // since IE will modify it given document.location
    ajaxLocation = document.createElement("a");
    ajaxLocation.href = "";
    ajaxLocation = ajaxLocation.href;
  }

  // Segment location into parts
  ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

  // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
  function addToPrefiltersOrTransports(structure) {

    // dataTypeExpression is optional and defaults to "*"
    return function(dataTypeExpression, func) {

      if (typeof dataTypeExpression !== "string") {
        func = dataTypeExpression;
        dataTypeExpression = "*";
      }

      var dataType,
        i = 0,
        dataTypes = dataTypeExpression.toLowerCase()
        .match(core_rnotwhite) || [];

      if (jQuery.isFunction(func)) {
        // For each dataType in the dataTypeExpression
        while ((dataType = dataTypes[i++])) {
          // Prepend if requested
          if (dataType[0] === "+") {
            dataType = dataType.slice(1) || "*";
            (structure[dataType] = structure[dataType] || [])
            .unshift(func);

            // Otherwise append
          } else {
            (structure[dataType] = structure[dataType] || [])
            .push(func);
          }
        }
      }
    };
  }

  // Base inspection function for prefilters and transports
  function inspectPrefiltersOrTransports(structure, options, originalOptions,
    jqXHR) {

    var inspected = {},
      seekingTransport = (structure === transports);

    function inspect(dataType) {
      var selected;
      inspected[dataType] = true;
      jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
        var dataTypeOrTransport = prefilterOrFactory(options,
          originalOptions, jqXHR);
        if (typeof dataTypeOrTransport === "string" && !seekingTransport &&
          !inspected[dataTypeOrTransport]) {
          options.dataTypes.unshift(dataTypeOrTransport);
          inspect(dataTypeOrTransport);
          return false;
        } else if (seekingTransport) {
          return !(selected = dataTypeOrTransport);
        }
      });
      return selected;
    }

    return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
  }

  // A special extend for ajax options
  // that takes "flat" options (not to be deep extended)
  // Fixes #9887
  function ajaxExtend(target, src) {
    var key, deep,
      flatOptions = jQuery.ajaxSettings.flatOptions || {};

    for (key in src) {
      if (src[key] !== undefined) {
        (flatOptions[key] ? target : (deep || (deep = {})))[key] = src[key];
      }
    }
    if (deep) {
      jQuery.extend(true, target, deep);
    }

    return target;
  }

  jQuery.fn.load = function(url, params, callback) {
    if (typeof url !== "string" && _load) {
      return _load.apply(this, arguments);
    }

    var selector, type, response,
      self = this,
      off = url.indexOf(" ");

    if (off >= 0) {
      selector = url.slice(off);
      url = url.slice(0, off);
    }

    // If it's a function
    if (jQuery.isFunction(params)) {

      // We assume that it's the callback
      callback = params;
      params = undefined;

      // Otherwise, build a param string
    } else if (params && typeof params === "object") {
      type = "POST";
    }

    // If we have elements to modify, make the request
    if (self.length > 0) {
      jQuery.ajax({
          url: url,

          // if "type" variable is undefined, then "GET" method will be used
          type: type,
          dataType: "html",
          data: params
        })
        .done(function(responseText) {

          // Save response for use in complete callback
          response = arguments;

          self.html(selector ?

            // If a selector was specified, locate the right elements in a dummy div
            // Exclude scripts to avoid IE 'Permission Denied' errors
            jQuery("<div>")
            .append(jQuery.parseHTML(responseText))
            .find(selector) :

            // Otherwise use the full result
            responseText);

        })
        .complete(callback && function(jqXHR, status) {
          self.each(callback, response || [jqXHR.responseText, status,
            jqXHR
          ]);
        });
    }

    return this;
  };

  // Attach a bunch of functions for handling common AJAX events
  jQuery.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError",
    "ajaxSuccess", "ajaxSend"
  ], function(i, type) {
    jQuery.fn[type] = function(fn) {
      return this.on(type, fn);
    };
  });

  jQuery.extend({

    // Counter for holding the number of active queries
    active: 0,

    // Last-Modified header cache for next request
    lastModified: {},
    etag: {},

    ajaxSettings: {
      url: ajaxLocation,
      type: "GET",
      isLocal: rlocalProtocol.test(ajaxLocParts[1]),
      global: true,
      processData: true,
      async: true,
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      /*
      timeout: 0,
      data: null,
      dataType: null,
      username: null,
      password: null,
      cache: null,
      throws: false,
      traditional: false,
      headers: {},
      */

      accepts: {
        "*": allTypes,
        text: "text/plain",
        html: "text/html",
        xml: "application/xml, text/xml",
        json: "application/json, text/javascript"
      },

      contents: {
        xml: /xml/,
        html: /html/,
        json: /json/
      },

      responseFields: {
        xml: "responseXML",
        text: "responseText",
        json: "responseJSON"
      },

      // Data converters
      // Keys separate source (or catchall "*") and destination types with a single space
      converters: {

        // Convert anything to text
        "* text": String,

        // Text to html (true = no transformation)
        "text html": true,

        // Evaluate text as a json expression
        "text json": jQuery.parseJSON,

        // Parse text as xml
        "text xml": jQuery.parseXML
      },

      // For options that shouldn't be deep extended:
      // you can add your own custom options here if
      // and when you create one that shouldn't be
      // deep extended (see ajaxExtend)
      flatOptions: {
        url: true,
        context: true
      }
    },

    // Creates a full fledged settings object into target
    // with both ajaxSettings and settings fields.
    // If target is omitted, writes into ajaxSettings.
    ajaxSetup: function(target, settings) {
      return settings ?

        // Building a settings object
        ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) :

        // Extending ajaxSettings
        ajaxExtend(jQuery.ajaxSettings, target);
    },

    ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
    ajaxTransport: addToPrefiltersOrTransports(transports),

    // Main method
    ajax: function(url, options) {

      // If url is an object, simulate pre-1.5 signature
      if (typeof url === "object") {
        options = url;
        url = undefined;
      }

      // Force options to be an object
      options = options || {};

      var transport,
        // URL without anti-cache param
        cacheURL,
        // Response headers
        responseHeadersString,
        responseHeaders,
        // timeout handle
        timeoutTimer,
        // Cross-domain detection vars
        parts,
        // To know if global events are to be dispatched
        fireGlobals,
        // Loop variable
        i,
        // Create the final options object
        s = jQuery.ajaxSetup({}, options),
        // Callbacks context
        callbackContext = s.context || s,
        // Context for global events is callbackContext if it is a DOM node or jQuery collection
        globalEventContext = s.context && (callbackContext.nodeType ||
          callbackContext.jquery) ?
        jQuery(callbackContext) :
        jQuery.event,
        // Deferreds
        deferred = jQuery.Deferred(),
        completeDeferred = jQuery.Callbacks("once memory"),
        // Status-dependent callbacks
        statusCode = s.statusCode || {},
        // Headers (they are sent all at once)
        requestHeaders = {},
        requestHeadersNames = {},
        // The jqXHR state
        state = 0,
        // Default abort message
        strAbort = "canceled",
        // Fake xhr
        jqXHR = {
          readyState: 0,

          // Builds headers hashtable if needed
          getResponseHeader: function(key) {
            var match;
            if (state === 2) {
              if (!responseHeaders) {
                responseHeaders = {};
                while ((match = rheaders.exec(responseHeadersString))) {
                  responseHeaders[match[1].toLowerCase()] = match[2];
                }
              }
              match = responseHeaders[key.toLowerCase()];
            }
            return match == null ? null : match;
          },

          // Raw string
          getAllResponseHeaders: function() {
            return state === 2 ? responseHeadersString : null;
          },

          // Caches the header
          setRequestHeader: function(name, value) {
            var lname = name.toLowerCase();
            if (!state) {
              name = requestHeadersNames[lname] = requestHeadersNames[
                lname] || name;
              requestHeaders[name] = value;
            }
            return this;
          },

          // Overrides response content-type header
          overrideMimeType: function(type) {
            if (!state) {
              s.mimeType = type;
            }
            return this;
          },

          // Status-dependent callbacks
          statusCode: function(map) {
            var code;
            if (map) {
              if (state < 2) {
                for (code in map) {
                  // Lazy-add the new callback in a way that preserves old ones
                  statusCode[code] = [statusCode[code], map[code]];
                }
              } else {
                // Execute the appropriate callbacks
                jqXHR.always(map[jqXHR.status]);
              }
            }
            return this;
          },

          // Cancel the request
          abort: function(statusText) {
            var finalText = statusText || strAbort;
            if (transport) {
              transport.abort(finalText);
            }
            done(0, finalText);
            return this;
          }
        };

      // Attach deferreds
      deferred.promise(jqXHR)
        .complete = completeDeferred.add;
      jqXHR.success = jqXHR.done;
      jqXHR.error = jqXHR.fail;

      // Remove hash character (#7531: and string promotion)
      // Add protocol if not provided (prefilters might expect it)
      // Handle falsy url in the settings object (#10093: consistency with old signature)
      // We also use the url parameter if available
      s.url = ((url || s.url || ajaxLocation) + "")
        .replace(rhash, "")
        .replace(rprotocol, ajaxLocParts[1] + "//");

      // Alias method option to type as per ticket #12004
      s.type = options.method || options.type || s.method || s.type;

      // Extract dataTypes list
      s.dataTypes = jQuery.trim(s.dataType || "*")
        .toLowerCase()
        .match(core_rnotwhite) || [""];

      // A cross-domain request is in order when we have a protocol:host:port mismatch
      if (s.crossDomain == null) {
        parts = rurl.exec(s.url.toLowerCase());
        s.crossDomain = !!(parts &&
          (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[
              2] ||
            (parts[3] || (parts[1] === "http:" ? "80" : "443")) !==
            (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? "80" :
              "443")))
        );
      }

      // Convert data if not already a string
      if (s.data && s.processData && typeof s.data !== "string") {
        s.data = jQuery.param(s.data, s.traditional);
      }

      // Apply prefilters
      inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

      // If request was aborted inside a prefilter, stop there
      if (state === 2) {
        return jqXHR;
      }

      // We can fire global events as of now if asked to
      fireGlobals = s.global;

      // Watch for a new set of requests
      if (fireGlobals && jQuery.active++ === 0) {
        jQuery.event.trigger("ajaxStart");
      }

      // Uppercase the type
      s.type = s.type.toUpperCase();

      // Determine if request has content
      s.hasContent = !rnoContent.test(s.type);

      // Save the URL in case we're toying with the If-Modified-Since
      // and/or If-None-Match header later on
      cacheURL = s.url;

      // More options handling for requests with no content
      if (!s.hasContent) {

        // If data is available, append data to url
        if (s.data) {
          cacheURL = (s.url += (ajax_rquery.test(cacheURL) ? "&" : "?") +
            s.data);
          // #9682: remove data so that it's not used in an eventual retry
          delete s.data;
        }

        // Add anti-cache in url if needed
        if (s.cache === false) {
          s.url = rts.test(cacheURL) ?

            // If there is already a '_' parameter, set its value
            cacheURL.replace(rts, "$1_=" + ajax_nonce++) :

            // Otherwise add one to the end
            cacheURL + (ajax_rquery.test(cacheURL) ? "&" : "?") + "_=" +
            ajax_nonce++;
        }
      }

      // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
      if (s.ifModified) {
        if (jQuery.lastModified[cacheURL]) {
          jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[
            cacheURL]);
        }
        if (jQuery.etag[cacheURL]) {
          jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
        }
      }

      // Set the correct header, if data is being sent
      if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
        jqXHR.setRequestHeader("Content-Type", s.contentType);
      }

      // Set the Accepts header for the server, depending on the dataType
      jqXHR.setRequestHeader(
        "Accept",
        s.dataTypes[0] && s.accepts[s.dataTypes[0]] ?
        s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " +
          allTypes + "; q=0.01" : "") :
        s.accepts["*"]
      );

      // Check for headers option
      for (i in s.headers) {
        jqXHR.setRequestHeader(i, s.headers[i]);
      }

      // Allow custom headers/mimetypes and early abort
      if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) ===
          false || state === 2)) {
        // Abort if not done already and return
        return jqXHR.abort();
      }

      // aborting is no longer a cancellation
      strAbort = "abort";

      // Install callbacks on deferreds
      for (i in {
          success: 1,
          error: 1,
          complete: 1
        }) {
        jqXHR[i](s[i]);
      }

      // Get transport
      transport = inspectPrefiltersOrTransports(transports, s, options,
        jqXHR);

      // If no transport, we auto-abort
      if (!transport) {
        done(-1, "No Transport");
      } else {
        jqXHR.readyState = 1;

        // Send global event
        if (fireGlobals) {
          globalEventContext.trigger("ajaxSend", [jqXHR, s]);
        }
        // Timeout
        if (s.async && s.timeout > 0) {
          timeoutTimer = setTimeout(function() {
            jqXHR.abort("timeout");
          }, s.timeout);
        }

        try {
          state = 1;
          transport.send(requestHeaders, done);
        } catch (e) {
          // Propagate exception as error if not done
          if (state < 2) {
            done(-1, e);
            // Simply rethrow otherwise
          } else {
            throw e;
          }
        }
      }

      // Callback for when everything is done
      function done(status, nativeStatusText, responses, headers) {
        var isSuccess, success, error, response, modified,
          statusText = nativeStatusText;

        // Called once
        if (state === 2) {
          return;
        }

        // State is "done" now
        state = 2;

        // Clear timeout if it exists
        if (timeoutTimer) {
          clearTimeout(timeoutTimer);
        }

        // Dereference transport for early garbage collection
        // (no matter how long the jqXHR object will be used)
        transport = undefined;

        // Cache response headers
        responseHeadersString = headers || "";

        // Set readyState
        jqXHR.readyState = status > 0 ? 4 : 0;

        // Determine if successful
        isSuccess = status >= 200 && status < 300 || status === 304;

        // Get response data
        if (responses) {
          response = ajaxHandleResponses(s, jqXHR, responses);
        }

        // Convert no matter what (that way responseXXX fields are always set)
        response = ajaxConvert(s, response, jqXHR, isSuccess);

        // If successful, handle type chaining
        if (isSuccess) {

          // Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
          if (s.ifModified) {
            modified = jqXHR.getResponseHeader("Last-Modified");
            if (modified) {
              jQuery.lastModified[cacheURL] = modified;
            }
            modified = jqXHR.getResponseHeader("etag");
            if (modified) {
              jQuery.etag[cacheURL] = modified;
            }
          }

          // if no content
          if (status === 204 || s.type === "HEAD") {
            statusText = "nocontent";

            // if not modified
          } else if (status === 304) {
            statusText = "notmodified";

            // If we have data, let's convert it
          } else {
            statusText = response.state;
            success = response.data;
            error = response.error;
            isSuccess = !error;
          }
        } else {
          // We extract error from statusText
          // then normalize statusText and status for non-aborts
          error = statusText;
          if (status || !statusText) {
            statusText = "error";
            if (status < 0) {
              status = 0;
            }
          }
        }

        // Set data for the fake xhr object
        jqXHR.status = status;
        jqXHR.statusText = (nativeStatusText || statusText) + "";

        // Success/Error
        if (isSuccess) {
          deferred.resolveWith(callbackContext, [success, statusText,
            jqXHR
          ]);
        } else {
          deferred.rejectWith(callbackContext, [jqXHR, statusText,
            error
          ]);
        }

        // Status-dependent callbacks
        jqXHR.statusCode(statusCode);
        statusCode = undefined;

        if (fireGlobals) {
          globalEventContext.trigger(isSuccess ? "ajaxSuccess" :
            "ajaxError", [jqXHR, s, isSuccess ? success : error]);
        }

        // Complete
        completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

        if (fireGlobals) {
          globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
          // Handle the global AJAX counter
          if (!(--jQuery.active)) {
            jQuery.event.trigger("ajaxStop");
          }
        }
      }

      return jqXHR;
    },

    getJSON: function(url, data, callback) {
      return jQuery.get(url, data, callback, "json");
    },

    getScript: function(url, callback) {
      return jQuery.get(url, undefined, callback, "script");
    }
  });

  jQuery.each(["get", "post"], function(i, method) {
    jQuery[method] = function(url, data, callback, type) {
      // shift arguments if data argument was omitted
      if (jQuery.isFunction(data)) {
        type = type || callback;
        callback = data;
        data = undefined;
      }

      return jQuery.ajax({
        url: url,
        type: method,
        dataType: type,
        data: data,
        success: callback
      });
    };
  });

  /* Handles responses to an ajax request:
   * - finds the right dataType (mediates between content-type and expected dataType)
   * - returns the corresponding response
   */
  function ajaxHandleResponses(s, jqXHR, responses) {

    var ct, type, finalDataType, firstDataType,
      contents = s.contents,
      dataTypes = s.dataTypes;

    // Remove auto dataType and get content-type in the process
    while (dataTypes[0] === "*") {
      dataTypes.shift();
      if (ct === undefined) {
        ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
      }
    }

    // Check if we're dealing with a known content-type
    if (ct) {
      for (type in contents) {
        if (contents[type] && contents[type].test(ct)) {
          dataTypes.unshift(type);
          break;
        }
      }
    }

    // Check to see if we have a response for the expected dataType
    if (dataTypes[0] in responses) {
      finalDataType = dataTypes[0];
    } else {
      // Try convertible dataTypes
      for (type in responses) {
        if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
          finalDataType = type;
          break;
        }
        if (!firstDataType) {
          firstDataType = type;
        }
      }
      // Or just use first one
      finalDataType = finalDataType || firstDataType;
    }

    // If we found a dataType
    // We add the dataType to the list if needed
    // and return the corresponding response
    if (finalDataType) {
      if (finalDataType !== dataTypes[0]) {
        dataTypes.unshift(finalDataType);
      }
      return responses[finalDataType];
    }
  }

  /* Chain conversions given the request and the original response
   * Also sets the responseXXX fields on the jqXHR instance
   */
  function ajaxConvert(s, response, jqXHR, isSuccess) {
    var conv2, current, conv, tmp, prev,
      converters = {},
      // Work with a copy of dataTypes in case we need to modify it for conversion
      dataTypes = s.dataTypes.slice();

    // Create converters map with lowercased keys
    if (dataTypes[1]) {
      for (conv in s.converters) {
        converters[conv.toLowerCase()] = s.converters[conv];
      }
    }

    current = dataTypes.shift();

    // Convert to each sequential dataType
    while (current) {

      if (s.responseFields[current]) {
        jqXHR[s.responseFields[current]] = response;
      }

      // Apply the dataFilter if provided
      if (!prev && isSuccess && s.dataFilter) {
        response = s.dataFilter(response, s.dataType);
      }

      prev = current;
      current = dataTypes.shift();

      if (current) {

        // There's only work to do if current dataType is non-auto
        if (current === "*") {

          current = prev;

          // Convert response if prev dataType is non-auto and differs from current
        } else if (prev !== "*" && prev !== current) {

          // Seek a direct converter
          conv = converters[prev + " " + current] || converters["* " +
            current];

          // If none found, seek a pair
          if (!conv) {
            for (conv2 in converters) {

              // If conv2 outputs current
              tmp = conv2.split(" ");
              if (tmp[1] === current) {

                // If prev can be converted to accepted input
                conv = converters[prev + " " + tmp[0]] ||
                  converters["* " + tmp[0]];
                if (conv) {
                  // Condense equivalence converters
                  if (conv === true) {
                    conv = converters[conv2];

                    // Otherwise, insert the intermediate dataType
                  } else if (converters[conv2] !== true) {
                    current = tmp[0];
                    dataTypes.unshift(tmp[1]);
                  }
                  break;
                }
              }
            }
          }

          // Apply converter (if not an equivalence)
          if (conv !== true) {

            // Unless errors are allowed to bubble, catch and return them
            if (conv && s["throws"]) {
              response = conv(response);
            } else {
              try {
                response = conv(response);
              } catch (e) {
                return {
                  state: "parsererror",
                  error: conv ? e : "No conversion from " + prev + " to " +
                    current
                };
              }
            }
          }
        }
      }
    }

    return {
      state: "success",
      data: response
    };
  }
  // Install script dataType
  jQuery.ajaxSetup({
    accepts: {
      script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
      script: /(?:java|ecma)script/
    },
    converters: {
      "text script": function(text) {
        jQuery.globalEval(text);
        return text;
      }
    }
  });

  // Handle cache's special case and crossDomain
  jQuery.ajaxPrefilter("script", function(s) {
    if (s.cache === undefined) {
      s.cache = false;
    }
    if (s.crossDomain) {
      s.type = "GET";
    }
  });

  // Bind script tag hack transport
  jQuery.ajaxTransport("script", function(s) {
    // This transport only deals with cross domain requests
    if (s.crossDomain) {
      var script, callback;
      return {
        send: function(_, complete) {
          script = jQuery("<script>")
            .prop({
              async: true,
              charset: s.scriptCharset,
              src: s.url
            })
            .on(
              "load error",
              callback = function(evt) {
                script.remove();
                callback = null;
                if (evt) {
                  complete(evt.type === "error" ? 404 : 200, evt.type);
                }
              }
            );
          document.head.appendChild(script[0]);
        },
        abort: function() {
          if (callback) {
            callback();
          }
        }
      };
    }
  });
  var oldCallbacks = [],
    rjsonp = /(=)\?(?=&|$)|\?\?/;

  // Default jsonp settings
  jQuery.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
      var callback = oldCallbacks.pop() || (jQuery.expando + "_" + (
        ajax_nonce++));
      this[callback] = true;
      return callback;
    }
  });

  // Detect, normalize options and install callbacks for jsonp requests
  jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {

    var callbackName, overwritten, responseContainer,
      jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ?
        "url" :
        typeof s.data === "string" && !(s.contentType || "")
        .indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) &&
        "data"
      );

    // Handle iff the expected data type is "jsonp" or we have a parameter to set
    if (jsonProp || s.dataTypes[0] === "jsonp") {

      // Get callback name, remembering preexisting value associated with it
      callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ?
        s.jsonpCallback() :
        s.jsonpCallback;

      // Insert callback into url or form data
      if (jsonProp) {
        s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
      } else if (s.jsonp !== false) {
        s.url += (ajax_rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" +
          callbackName;
      }

      // Use data converter to retrieve json after script execution
      s.converters["script json"] = function() {
        if (!responseContainer) {
          jQuery.error(callbackName + " was not called");
        }
        return responseContainer[0];
      };

      // force json dataType
      s.dataTypes[0] = "json";

      // Install callback
      overwritten = window[callbackName];
      window[callbackName] = function() {
        responseContainer = arguments;
      };

      // Clean-up function (fires after converters)
      jqXHR.always(function() {
        // Restore preexisting value
        window[callbackName] = overwritten;

        // Save back as free
        if (s[callbackName]) {
          // make sure that re-using the options doesn't screw things around
          s.jsonpCallback = originalSettings.jsonpCallback;

          // save the callback name for future use
          oldCallbacks.push(callbackName);
        }

        // Call if it was a function and we have a response
        if (responseContainer && jQuery.isFunction(overwritten)) {
          overwritten(responseContainer[0]);
        }

        responseContainer = overwritten = undefined;
      });

      // Delegate to script
      return "script";
    }
  });
  jQuery.ajaxSettings.xhr = function() {
    try {
      return new XMLHttpRequest();
    } catch (e) {}
  };

  var xhrSupported = jQuery.ajaxSettings.xhr(),
    xhrSuccessStatus = {
      // file protocol always yields status code 0, assume 200
      0: 200,
      // Support: IE9
      // #1450: sometimes IE returns 1223 when it should be 204
      1223: 204
    },
    // Support: IE9
    // We need to keep track of outbound xhr and abort them manually
    // because IE is not smart enough to do it all by itself
    xhrId = 0,
    xhrCallbacks = {};

  if (window.ActiveXObject) {
    jQuery(window)
      .on("unload", function() {
        for (var key in xhrCallbacks) {
          xhrCallbacks[key]();
        }
        xhrCallbacks = undefined;
      });
  }

  jQuery.support.cors = !!xhrSupported && ("withCredentials" in xhrSupported);
  jQuery.support.ajax = xhrSupported = !!xhrSupported;

  jQuery.ajaxTransport(function(options) {
    var callback;
    // Cross domain only allowed if supported through XMLHttpRequest
    if (jQuery.support.cors || xhrSupported && !options.crossDomain) {
      return {
        send: function(headers, complete) {
          var i, id,
            xhr = options.xhr();
          xhr.open(options.type, options.url, options.async, options.username,
            options.password);
          // Apply custom fields if provided
          if (options.xhrFields) {
            for (i in options.xhrFields) {
              xhr[i] = options.xhrFields[i];
            }
          }
          // Override mime type if needed
          if (options.mimeType && xhr.overrideMimeType) {
            xhr.overrideMimeType(options.mimeType);
          }
          // X-Requested-With header
          // For cross-domain requests, seeing as conditions for a preflight are
          // akin to a jigsaw puzzle, we simply never set it to be sure.
          // (it can always be set on a per-request basis or even using ajaxSetup)
          // For same-domain requests, won't change header if already provided.
          if (!options.crossDomain && !headers["X-Requested-With"]) {
            headers["X-Requested-With"] = "XMLHttpRequest";
          }
          // Set headers
          for (i in headers) {
            xhr.setRequestHeader(i, headers[i]);
          }
          // Callback
          callback = function(type) {
            return function() {
              if (callback) {
                delete xhrCallbacks[id];
                callback = xhr.onload = xhr.onerror = null;
                if (type === "abort") {
                  xhr.abort();
                } else if (type === "error") {
                  complete(
                    // file protocol always yields status 0, assume 404
                    xhr.status || 404,
                    xhr.statusText
                  );
                } else {
                  complete(
                    xhrSuccessStatus[xhr.status] || xhr.status,
                    xhr.statusText,
                    // Support: IE9
                    // #11426: When requesting binary data, IE9 will throw an exception
                    // on any attempt to access responseText
                    typeof xhr.responseText === "string" ? {
                      text: xhr.responseText
                    } : undefined,
                    xhr.getAllResponseHeaders()
                  );
                }
              }
            };
          };
          // Listen to events
          xhr.onload = callback();
          xhr.onerror = callback("error");
          // Create the abort callback
          callback = xhrCallbacks[(id = xhrId++)] = callback("abort");
          // Do send the request
          // This may raise an exception which is actually
          // handled in jQuery.ajax (so no try/catch here)
          xhr.send(options.hasContent && options.data || null);
        },
        abort: function() {
          if (callback) {
            callback();
          }
        }
      };
    }
  });
  var fxNow, timerId,
    rfxtypes = /^(?:toggle|show|hide)$/,
    rfxnum = new RegExp("^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i"),
    rrun = /queueHooks$/,
    animationPrefilters = [defaultPrefilter],
    tweeners = {
      "*": [function(prop, value) {
        var tween = this.createTween(prop, value),
          target = tween.cur(),
          parts = rfxnum.exec(value),
          unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px"),

          // Starting value computation is required for potential unit mismatches
          start = (jQuery.cssNumber[prop] || unit !== "px" && +target) &&
          rfxnum.exec(jQuery.css(tween.elem, prop)),
          scale = 1,
          maxIterations = 20;

        if (start && start[3] !== unit) {
          // Trust units reported by jQuery.css
          unit = unit || start[3];

          // Make sure we update the tween properties later on
          parts = parts || [];

          // Iteratively approximate from a nonzero starting point
          start = +target || 1;

          do {
            // If previous iteration zeroed out, double until we get *something*
            // Use a string for doubling factor so we don't accidentally see scale as unchanged below
            scale = scale || ".5";

            // Adjust and apply
            start = start / scale;
            jQuery.style(tween.elem, prop, start + unit);

            // Update scale, tolerating zero or NaN from tween.cur()
            // And breaking the loop if scale is unchanged or perfect, or if we've just had enough
          } while (scale !== (scale = tween.cur() / target) && scale !==
            1 && --maxIterations);
        }

        // Update tween properties
        if (parts) {
          start = tween.start = +start || +target || 0;
          tween.unit = unit;
          // If a +=/-= token was provided, we're doing a relative animation
          tween.end = parts[1] ?
            start + (parts[1] + 1) * parts[2] :
            +parts[2];
        }

        return tween;
      }]
    };

  // Animations created synchronously will run synchronously
  function createFxNow() {
    setTimeout(function() {
      fxNow = undefined;
    });
    return (fxNow = jQuery.now());
  }

  function createTween(value, prop, animation) {
    var tween,
      collection = (tweeners[prop] || [])
      .concat(tweeners["*"]),
      index = 0,
      length = collection.length;
    for (; index < length; index++) {
      if ((tween = collection[index].call(animation, prop, value))) {

        // we're done with this property
        return tween;
      }
    }
  }

  function Animation(elem, properties, options) {
    var result,
      stopped,
      index = 0,
      length = animationPrefilters.length,
      deferred = jQuery.Deferred()
      .always(function() {
        // don't match elem in the :animated selector
        delete tick.elem;
      }),
      tick = function() {
        if (stopped) {
          return false;
        }
        var currentTime = fxNow || createFxNow(),
          remaining = Math.max(0, animation.startTime + animation.duration -
            currentTime),
          // archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
          temp = remaining / animation.duration || 0,
          percent = 1 - temp,
          index = 0,
          length = animation.tweens.length;

        for (; index < length; index++) {
          animation.tweens[index].run(percent);
        }

        deferred.notifyWith(elem, [animation, percent, remaining]);

        if (percent < 1 && length) {
          return remaining;
        } else {
          deferred.resolveWith(elem, [animation]);
          return false;
        }
      },
      animation = deferred.promise({
        elem: elem,
        props: jQuery.extend({}, properties),
        opts: jQuery.extend(true, {
          specialEasing: {}
        }, options),
        originalProperties: properties,
        originalOptions: options,
        startTime: fxNow || createFxNow(),
        duration: options.duration,
        tweens: [],
        createTween: function(prop, end) {
          var tween = jQuery.Tween(elem, animation.opts, prop, end,
            animation.opts.specialEasing[prop] || animation.opts.easing
          );
          animation.tweens.push(tween);
          return tween;
        },
        stop: function(gotoEnd) {
          var index = 0,
            // if we are going to the end, we want to run all the tweens
            // otherwise we skip this part
            length = gotoEnd ? animation.tweens.length : 0;
          if (stopped) {
            return this;
          }
          stopped = true;
          for (; index < length; index++) {
            animation.tweens[index].run(1);
          }

          // resolve when we played the last frame
          // otherwise, reject
          if (gotoEnd) {
            deferred.resolveWith(elem, [animation, gotoEnd]);
          } else {
            deferred.rejectWith(elem, [animation, gotoEnd]);
          }
          return this;
        }
      }),
      props = animation.props;

    propFilter(props, animation.opts.specialEasing);

    for (; index < length; index++) {
      result = animationPrefilters[index].call(animation, elem, props,
        animation.opts);
      if (result) {
        return result;
      }
    }

    jQuery.map(props, createTween, animation);

    if (jQuery.isFunction(animation.opts.start)) {
      animation.opts.start.call(elem, animation);
    }

    jQuery.fx.timer(
      jQuery.extend(tick, {
        elem: elem,
        anim: animation,
        queue: animation.opts.queue
      })
    );

    // attach callbacks from options
    return animation.progress(animation.opts.progress)
      .done(animation.opts.done, animation.opts.complete)
      .fail(animation.opts.fail)
      .always(animation.opts.always);
  }

  function propFilter(props, specialEasing) {
    var index, name, easing, value, hooks;

    // camelCase, specialEasing and expand cssHook pass
    for (index in props) {
      name = jQuery.camelCase(index);
      easing = specialEasing[name];
      value = props[index];
      if (jQuery.isArray(value)) {
        easing = value[1];
        value = props[index] = value[0];
      }

      if (index !== name) {
        props[name] = value;
        delete props[index];
      }

      hooks = jQuery.cssHooks[name];
      if (hooks && "expand" in hooks) {
        value = hooks.expand(value);
        delete props[name];

        // not quite $.extend, this wont overwrite keys already present.
        // also - reusing 'index' from above because we have the correct "name"
        for (index in value) {
          if (!(index in props)) {
            props[index] = value[index];
            specialEasing[index] = easing;
          }
        }
      } else {
        specialEasing[name] = easing;
      }
    }
  }

  jQuery.Animation = jQuery.extend(Animation, {

    tweener: function(props, callback) {
      if (jQuery.isFunction(props)) {
        callback = props;
        props = ["*"];
      } else {
        props = props.split(" ");
      }

      var prop,
        index = 0,
        length = props.length;

      for (; index < length; index++) {
        prop = props[index];
        tweeners[prop] = tweeners[prop] || [];
        tweeners[prop].unshift(callback);
      }
    },

    prefilter: function(callback, prepend) {
      if (prepend) {
        animationPrefilters.unshift(callback);
      } else {
        animationPrefilters.push(callback);
      }
    }
  });

  function defaultPrefilter(elem, props, opts) {
    /* jshint validthis: true */
    var prop, value, toggle, tween, hooks, oldfire,
      anim = this,
      orig = {},
      style = elem.style,
      hidden = elem.nodeType && isHidden(elem),
      dataShow = data_priv.get(elem, "fxshow");

    // handle queue: false promises
    if (!opts.queue) {
      hooks = jQuery._queueHooks(elem, "fx");
      if (hooks.unqueued == null) {
        hooks.unqueued = 0;
        oldfire = hooks.empty.fire;
        hooks.empty.fire = function() {
          if (!hooks.unqueued) {
            oldfire();
          }
        };
      }
      hooks.unqueued++;

      anim.always(function() {
        // doing this makes sure that the complete handler will be called
        // before this completes
        anim.always(function() {
          hooks.unqueued--;
          if (!jQuery.queue(elem, "fx")
            .length) {
            hooks.empty.fire();
          }
        });
      });
    }

    // height/width overflow pass
    if (elem.nodeType === 1 && ("height" in props || "width" in props)) {
      // Make sure that nothing sneaks out
      // Record all 3 overflow attributes because IE9-10 do not
      // change the overflow attribute when overflowX and
      // overflowY are set to the same value
      opts.overflow = [style.overflow, style.overflowX, style.overflowY];

      // Set display property to inline-block for height/width
      // animations on inline elements that are having width/height animated
      if (jQuery.css(elem, "display") === "inline" &&
        jQuery.css(elem, "float") === "none") {

        style.display = "inline-block";
      }
    }

    if (opts.overflow) {
      style.overflow = "hidden";
      anim.always(function() {
        style.overflow = opts.overflow[0];
        style.overflowX = opts.overflow[1];
        style.overflowY = opts.overflow[2];
      });
    }

    // show/hide pass
    for (prop in props) {
      value = props[prop];
      if (rfxtypes.exec(value)) {
        delete props[prop];
        toggle = toggle || value === "toggle";
        if (value === (hidden ? "hide" : "show")) {

          // If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
          if (value === "show" && dataShow && dataShow[prop] !== undefined) {
            hidden = true;
          } else {
            continue;
          }
        }
        orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
      }
    }

    if (!jQuery.isEmptyObject(orig)) {
      if (dataShow) {
        if ("hidden" in dataShow) {
          hidden = dataShow.hidden;
        }
      } else {
        dataShow = data_priv.access(elem, "fxshow", {});
      }

      // store state if its toggle - enables .stop().toggle() to "reverse"
      if (toggle) {
        dataShow.hidden = !hidden;
      }
      if (hidden) {
        jQuery(elem)
          .show();
      } else {
        anim.done(function() {
          jQuery(elem)
            .hide();
        });
      }
      anim.done(function() {
        var prop;

        data_priv.remove(elem, "fxshow");
        for (prop in orig) {
          jQuery.style(elem, prop, orig[prop]);
        }
      });
      for (prop in orig) {
        tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);

        if (!(prop in dataShow)) {
          dataShow[prop] = tween.start;
          if (hidden) {
            tween.end = tween.start;
            tween.start = prop === "width" || prop === "height" ? 1 : 0;
          }
        }
      }
    }
  }

  function Tween(elem, options, prop, end, easing) {
    return new Tween.prototype.init(elem, options, prop, end, easing);
  }
  jQuery.Tween = Tween;

  Tween.prototype = {
    constructor: Tween,
    init: function(elem, options, prop, end, easing, unit) {
      this.elem = elem;
      this.prop = prop;
      this.easing = easing || "swing";
      this.options = options;
      this.start = this.now = this.cur();
      this.end = end;
      this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
    },
    cur: function() {
      var hooks = Tween.propHooks[this.prop];

      return hooks && hooks.get ?
        hooks.get(this) :
        Tween.propHooks._default.get(this);
    },
    run: function(percent) {
      var eased,
        hooks = Tween.propHooks[this.prop];

      if (this.options.duration) {
        this.pos = eased = jQuery.easing[this.easing](
          percent, this.options.duration * percent, 0, 1, this.options.duration
        );
      } else {
        this.pos = eased = percent;
      }
      this.now = (this.end - this.start) * eased + this.start;

      if (this.options.step) {
        this.options.step.call(this.elem, this.now, this);
      }

      if (hooks && hooks.set) {
        hooks.set(this);
      } else {
        Tween.propHooks._default.set(this);
      }
      return this;
    }
  };

  Tween.prototype.init.prototype = Tween.prototype;

  Tween.propHooks = {
    _default: {
      get: function(tween) {
        var result;

        if (tween.elem[tween.prop] != null &&
          (!tween.elem.style || tween.elem.style[tween.prop] == null)) {
          return tween.elem[tween.prop];
        }

        // passing an empty string as a 3rd parameter to .css will automatically
        // attempt a parseFloat and fallback to a string if the parse fails
        // so, simple values such as "10px" are parsed to Float.
        // complex values such as "rotate(1rad)" are returned as is.
        result = jQuery.css(tween.elem, tween.prop, "");
        // Empty strings, null, undefined and "auto" are converted to 0.
        return !result || result === "auto" ? 0 : result;
      },
      set: function(tween) {
        // use step hook for back compat - use cssHook if its there - use .style if its
        // available and use plain properties where available
        if (jQuery.fx.step[tween.prop]) {
          jQuery.fx.step[tween.prop](tween);
        } else if (tween.elem.style && (tween.elem.style[jQuery.cssProps[
            tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
          jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
        } else {
          tween.elem[tween.prop] = tween.now;
        }
      }
    }
  };

  // Support: IE9
  // Panic based approach to setting things on disconnected nodes

  Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    set: function(tween) {
      if (tween.elem.nodeType && tween.elem.parentNode) {
        tween.elem[tween.prop] = tween.now;
      }
    }
  };

  jQuery.each(["toggle", "show", "hide"], function(i, name) {
    var cssFn = jQuery.fn[name];
    jQuery.fn[name] = function(speed, easing, callback) {
      return speed == null || typeof speed === "boolean" ?
        cssFn.apply(this, arguments) :
        this.animate(genFx(name, true), speed, easing, callback);
    };
  });

  jQuery.fn.extend({
    fadeTo: function(speed, to, easing, callback) {

      // show any hidden elements after setting opacity to 0
      return this.filter(isHidden)
        .css("opacity", 0)
        .show()

        // animate to the value specified
        .end()
        .animate({
          opacity: to
        }, speed, easing, callback);
    },
    animate: function(prop, speed, easing, callback) {
      var empty = jQuery.isEmptyObject(prop),
        optall = jQuery.speed(speed, easing, callback),
        doAnimation = function() {
          // Operate on a copy of prop so per-property easing won't be lost
          var anim = Animation(this, jQuery.extend({}, prop), optall);

          // Empty animations, or finishing resolves immediately
          if (empty || data_priv.get(this, "finish")) {
            anim.stop(true);
          }
        };
      doAnimation.finish = doAnimation;

      return empty || optall.queue === false ?
        this.each(doAnimation) :
        this.queue(optall.queue, doAnimation);
    },
    stop: function(type, clearQueue, gotoEnd) {
      var stopQueue = function(hooks) {
        var stop = hooks.stop;
        delete hooks.stop;
        stop(gotoEnd);
      };

      if (typeof type !== "string") {
        gotoEnd = clearQueue;
        clearQueue = type;
        type = undefined;
      }
      if (clearQueue && type !== false) {
        this.queue(type || "fx", []);
      }

      return this.each(function() {
        var dequeue = true,
          index = type != null && type + "queueHooks",
          timers = jQuery.timers,
          data = data_priv.get(this);

        if (index) {
          if (data[index] && data[index].stop) {
            stopQueue(data[index]);
          }
        } else {
          for (index in data) {
            if (data[index] && data[index].stop && rrun.test(index)) {
              stopQueue(data[index]);
            }
          }
        }

        for (index = timers.length; index--;) {
          if (timers[index].elem === this && (type == null ||
              timers[index].queue === type)) {
            timers[index].anim.stop(gotoEnd);
            dequeue = false;
            timers.splice(index, 1);
          }
        }

        // start the next in the queue if the last step wasn't forced
        // timers currently will call their complete callbacks, which will dequeue
        // but only if they were gotoEnd
        if (dequeue || !gotoEnd) {
          jQuery.dequeue(this, type);
        }
      });
    },
    finish: function(type) {
      if (type !== false) {
        type = type || "fx";
      }
      return this.each(function() {
        var index,
          data = data_priv.get(this),
          queue = data[type + "queue"],
          hooks = data[type + "queueHooks"],
          timers = jQuery.timers,
          length = queue ? queue.length : 0;

        // enable finishing flag on private data
        data.finish = true;

        // empty the queue first
        jQuery.queue(this, type, []);

        if (hooks && hooks.stop) {
          hooks.stop.call(this, true);
        }

        // look for any active animations, and finish them
        for (index = timers.length; index--;) {
          if (timers[index].elem === this && timers[index].queue ===
            type) {
            timers[index].anim.stop(true);
            timers.splice(index, 1);
          }
        }

        // look for any animations in the old queue and finish them
        for (index = 0; index < length; index++) {
          if (queue[index] && queue[index].finish) {
            queue[index].finish.call(this);
          }
        }

        // turn off finishing flag
        delete data.finish;
      });
    }
  });

  // Generate parameters to create a standard animation
  function genFx(type, includeWidth) {
    var which,
      attrs = {
        height: type
      },
      i = 0;

    // if we include width, step value is 1 to do all cssExpand values,
    // if we don't include width, step value is 2 to skip over Left and Right
    includeWidth = includeWidth ? 1 : 0;
    for (; i < 4; i += 2 - includeWidth) {
      which = cssExpand[i];
      attrs["margin" + which] = attrs["padding" + which] = type;
    }

    if (includeWidth) {
      attrs.opacity = attrs.width = type;
    }

    return attrs;
  }

  // Generate shortcuts for custom animations
  jQuery.each({
    slideDown: genFx("show"),
    slideUp: genFx("hide"),
    slideToggle: genFx("toggle"),
    fadeIn: {
      opacity: "show"
    },
    fadeOut: {
      opacity: "hide"
    },
    fadeToggle: {
      opacity: "toggle"
    }
  }, function(name, props) {
    jQuery.fn[name] = function(speed, easing, callback) {
      return this.animate(props, speed, easing, callback);
    };
  });

  jQuery.speed = function(speed, easing, fn) {
    var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) :
      {
        complete: fn || !fn && easing ||
          jQuery.isFunction(speed) && speed,
        duration: speed,
        easing: fn && easing || easing && !jQuery.isFunction(easing) &&
          easing
      };

    opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ?
      opt.duration :
      opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] :
      jQuery.fx.speeds._default;

    // normalize opt.queue - true/undefined/null -> "fx"
    if (opt.queue == null || opt.queue === true) {
      opt.queue = "fx";
    }

    // Queueing
    opt.old = opt.complete;

    opt.complete = function() {
      if (jQuery.isFunction(opt.old)) {
        opt.old.call(this);
      }

      if (opt.queue) {
        jQuery.dequeue(this, opt.queue);
      }
    };

    return opt;
  };

  jQuery.easing = {
    linear: function(p) {
      return p;
    },
    swing: function(p) {
      return 0.5 - Math.cos(p * Math.PI) / 2;
    }
  };

  jQuery.timers = [];
  jQuery.fx = Tween.prototype.init;
  jQuery.fx.tick = function() {
    var timer,
      timers = jQuery.timers,
      i = 0;

    fxNow = jQuery.now();

    for (; i < timers.length; i++) {
      timer = timers[i];
      // Checks the timer has not already been removed
      if (!timer() && timers[i] === timer) {
        timers.splice(i--, 1);
      }
    }

    if (!timers.length) {
      jQuery.fx.stop();
    }
    fxNow = undefined;
  };

  jQuery.fx.timer = function(timer) {
    if (timer() && jQuery.timers.push(timer)) {
      jQuery.fx.start();
    }
  };

  jQuery.fx.interval = 13;

  jQuery.fx.start = function() {
    if (!timerId) {
      timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
    }
  };

  jQuery.fx.stop = function() {
    clearInterval(timerId);
    timerId = null;
  };

  jQuery.fx.speeds = {
    slow: 600,
    fast: 200,
    // Default speed
    _default: 400
  };

  // Back Compat <1.8 extension point
  jQuery.fx.step = {};

  if (jQuery.expr && jQuery.expr.filters) {
    jQuery.expr.filters.animated = function(elem) {
      return jQuery.grep(jQuery.timers, function(fn) {
          return elem === fn.elem;
        })
        .length;
    };
  }
  jQuery.fn.offset = function(options) {
    if (arguments.length) {
      return options === undefined ?
        this :
        this.each(function(i) {
          jQuery.offset.setOffset(this, options, i);
        });
    }

    var docElem, win,
      elem = this[0],
      box = {
        top: 0,
        left: 0
      },
      doc = elem && elem.ownerDocument;

    if (!doc) {
      return;
    }

    docElem = doc.documentElement;

    // Make sure it's not a disconnected DOM node
    if (!jQuery.contains(docElem, elem)) {
      return box;
    }

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if (typeof elem.getBoundingClientRect !== core_strundefined) {
      box = elem.getBoundingClientRect();
    }
    win = getWindow(doc);
    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft
    };
  };

  jQuery.offset = {

    setOffset: function(elem, options, i) {
      var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft,
        calculatePosition,
        position = jQuery.css(elem, "position"),
        curElem = jQuery(elem),
        props = {};

      // Set position first, in-case top/left are set even on static elem
      if (position === "static") {
        elem.style.position = "relative";
      }

      curOffset = curElem.offset();
      curCSSTop = jQuery.css(elem, "top");
      curCSSLeft = jQuery.css(elem, "left");
      calculatePosition = (position === "absolute" || position ===
          "fixed") && (curCSSTop + curCSSLeft)
        .indexOf("auto") > -1;

      // Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
      if (calculatePosition) {
        curPosition = curElem.position();
        curTop = curPosition.top;
        curLeft = curPosition.left;

      } else {
        curTop = parseFloat(curCSSTop) || 0;
        curLeft = parseFloat(curCSSLeft) || 0;
      }

      if (jQuery.isFunction(options)) {
        options = options.call(elem, i, curOffset);
      }

      if (options.top != null) {
        props.top = (options.top - curOffset.top) + curTop;
      }
      if (options.left != null) {
        props.left = (options.left - curOffset.left) + curLeft;
      }

      if ("using" in options) {
        options.using.call(elem, props);

      } else {
        curElem.css(props);
      }
    }
  };

  jQuery.fn.extend({

    position: function() {
      if (!this[0]) {
        return;
      }

      var offsetParent, offset,
        elem = this[0],
        parentOffset = {
          top: 0,
          left: 0
        };

      // Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
      if (jQuery.css(elem, "position") === "fixed") {
        // We assume that getBoundingClientRect is available when computed position is fixed
        offset = elem.getBoundingClientRect();

      } else {
        // Get *real* offsetParent
        offsetParent = this.offsetParent();

        // Get correct offsets
        offset = this.offset();
        if (!jQuery.nodeName(offsetParent[0], "html")) {
          parentOffset = offsetParent.offset();
        }

        // Add offsetParent borders
        parentOffset.top += jQuery.css(offsetParent[0],
          "borderTopWidth", true);
        parentOffset.left += jQuery.css(offsetParent[0],
          "borderLeftWidth", true);
      }

      // Subtract parent offsets and element margins
      return {
        top: offset.top - parentOffset.top - jQuery.css(elem,
          "marginTop", true),
        left: offset.left - parentOffset.left - jQuery.css(elem,
          "marginLeft", true)
      };
    },

    offsetParent: function() {
      return this.map(function() {
        var offsetParent = this.offsetParent || docElem;

        while (offsetParent && (!jQuery.nodeName(offsetParent,
              "html") && jQuery.css(offsetParent, "position") ===
            "static")) {
          offsetParent = offsetParent.offsetParent;
        }

        return offsetParent || docElem;
      });
    }
  });

  // Create scrollLeft and scrollTop methods
  jQuery.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
  }, function(method, prop) {
    var top = "pageYOffset" === prop;

    jQuery.fn[method] = function(val) {
      return jQuery.access(this, function(elem, method, val) {
        var win = getWindow(elem);

        if (val === undefined) {
          return win ? win[prop] : elem[method];
        }

        if (win) {
          win.scrollTo(!top ? val : window.pageXOffset,
            top ? val : window.pageYOffset
          );

        } else {
          elem[method] = val;
        }
      }, method, val, arguments.length, null);
    };
  });

  function getWindow(elem) {
    return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
  }
  // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
  jQuery.each({
    Height: "height",
    Width: "width"
  }, function(name, type) {
    jQuery.each({
      padding: "inner" + name,
      content: type,
      "": "outer" + name
    }, function(defaultExtra, funcName) {
      // margin is only for outerHeight, outerWidth
      jQuery.fn[funcName] = function(margin, value) {
        var chainable = arguments.length && (defaultExtra || typeof margin !==
            "boolean"),
          extra = defaultExtra || (margin === true || value ===
            true ? "margin" : "border");

        return jQuery.access(this, function(elem, type, value) {
            var doc;

            if (jQuery.isWindow(elem)) {
              // As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
              // isn't a whole lot we can do. See pull request at this URL for discussion:
              // https://github.com/jquery/jquery/pull/764
              return elem.document.documentElement["client" +
                name];
            }

            // Get document width or height
            if (elem.nodeType === 9) {
              doc = elem.documentElement;

              // Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
              // whichever is greatest
              return Math.max(
                elem.body["scroll" + name], doc["scroll" + name],
                elem.body["offset" + name], doc["offset" + name],
                doc["client" + name]
              );
            }

            return value === undefined ?
              // Get width or height on the element, requesting but not forcing parseFloat
              jQuery.css(elem, type, extra) :

              // Set width or height on the element
              jQuery.style(elem, type, value, extra);
          }, type, chainable ? margin : undefined, chainable,
          null);
      };
    });
  });
  // Limit scope pollution from any deprecated API
  // (function() {

  // The number of elements contained in the matched element set
  jQuery.fn.size = function() {
    return this.length;
  };

  jQuery.fn.andSelf = jQuery.fn.addBack;

  // })();
  if (typeof module === "object" && module && typeof module.exports ===
    "object") {
    // Expose jQuery as module.exports in loaders that implement the Node
    // module pattern (including browserify). Do not create the global, since
    // the user will be storing it themselves locally, and globals are frowned
    // upon in the Node module world.
    module.exports = jQuery;
  } else {
    // Register as a named AMD module, since jQuery can be concatenated with other
    // files that may use define, but not via a proper concatenation script that
    // understands anonymous AMD modules. A named AMD is safest and most robust
    // way to register. Lowercase jquery is used because AMD module names are
    // derived from file names, and jQuery is normally delivered in a lowercase
    // file name. Do this after creating the global so that if an AMD module wants
    // to call noConflict to hide this version of jQuery, it will work.
    if (typeof define === "function" && define.amd) {
      define("jquery", [], function() {
        return jQuery;
      });
    }
  }

  // If there is a window object, that at least has a document property,
  // define jQuery and $ identifiers
  if (typeof window === "object" && typeof window.document === "object") {
    window.jQuery = window.$ = jQuery;
  }

})(window);
