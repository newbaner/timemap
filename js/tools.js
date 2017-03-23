// 封装查找元素
// 可以根据 id、类名、标签名查找元素
// 参数：
// 	selector:选择器
// 		#id
// 		.class
// 		tagName
// 	context:查找元素的上下文，可选参数，默认为 document
function $(selector, context) {
	context = context || document; // 默认取值：document
	if (selector.charAt(0) === "#") // 根据 id 查找
		return document.getElementById(selector.slice(1));
	else if (selector.charAt(0) === ".") // 根据类名查找
		return getByClass(selector.slice(1), context);
	
	return context.getElementsByTagName(selector);
}

// 解决 getElementsByClassName 兼容问题
function getByClass(className, context) {
	context = context || document;
	if (document.getElementsByClassName) // 浏览器支持使用 getElementsByClassName
		return context.getElementsByClassName(className);

	/* 不支持 getElementsByClassName */
	var result = []; // 保存查找结果的数组
	// 查找出所有标签
	var tags = context.getElementsByTagName("*");
	// 循环遍历每一个标签，判断该标签是否有待查找的类名
	for (var i = 0, len = tags.length; i < len; i++) {
		// 获取当前遍历到标签所使用的类名
		var classNames = tags[i].className.split(" ");
		// 遍历当前标签的所有类名
		for (var j = 0, l = classNames.length; j < l; j++) {
			if (classNames[j] === className) { // 说明当前遍历到的标签有使用过查找的类名
				result.push(tags[i]);
				break;
			}
		}
	}

	// 返回查找结果的数组
	return result;
}

/*// 封装获取某个元素指定CSS属性值的方法
function css(element, attr) {
	return element.currentStyle 
			? element.currentStyle[attr] 
			: getComputedStyle(element)[attr];
}*/

// 获取/设置 element 元素的 attr CSS属性值
// 该方法用于设置 css 属性时，可传递参数如：
// 		css($("#box"), "width", "300px") 一次设置一个CSS属性
// 也可以传递参数如：
// 		css($("#box"), {width:"300px", height:"400px"}) 一次设置多个CSS属性;
function css(element, attr, value) {
	if (typeof attr === "string") { // attr 是属性名字符串
		if (!value) // 获取 CSS 属性值
			return element.currentStyle 
					? element.currentStyle[attr] 
					: getComputedStyle(element)[attr];
		// 设置 CSS 属性值
		element.style[attr] = value;
	} else if (typeof attr === "object") { // attr 是对象，则设置CSS属性，包含所有需要设置的属性名与属性值
		for (var item in attr) {
			element.style[item] = attr[item];
		}
	}
}

// 获取/设置元素在文档中的定位坐标
// 不完善的实现：还没考虑边框....
// element : DOM 元素
// coordinates : 待设置的坐标对象(可选参数，不传该参数表示获取坐标，否则表示设置坐标)
function offset(element, coordinates) {
	var _top = 0,
		_left = 0,
		currentElement = coordinates ? element.offsetParent : element;
	// 循环累加定位坐标值
	do {
		_top += currentElement.offsetTop;
		_left += currentElement.offsetLeft;
		currentElement = currentElement.offsetParent;
	} while(currentElement !== null);

	if (!coordinates) // 获取元素在文档中定位，返回坐标对象
		return { top : _top, left : _left };

	// 设置 element 元素在文档中定位
	element.style.top = coordinates.top - _top + "px";
	element.style.left = coordinates.left - _left + "px";
}

// 添加事件监听
// 事件冒泡处理
// element:待添加事件监听的DOM元素
// type:事件类型
// callback:事件处理程序（函数）
function on(element, type, callback) {
	if (element.addEventListener) { // 支持标准方法的使用
		if (type.indexOf("on") === 0)
			type = type.slice(2);
		element.addEventListener(type, callback, false);
	} else { // IE9 之前
		if (type.indexOf("on") !== 0)
			type = "on" + type;
		element.attachEvent(type, callback);
	}
}

// 解除事件监听
// 事件冒泡处理
// element:待添加事件监听的DOM元素
// type:事件类型
// callback:事件处理程序（函数）
function off(element, type, callback) {
	if (element.removeEventListener) { // 支持标准方法的使用
		if (type.indexOf("on") === 0)
			type = type.slice(2);
		element.removeEventListener(type, callback, false);
	} else { // IE9 之前
		if (type.indexOf("on") !== 0)
			type = "on" + type;
		element.detachEvent(type, callback);
	}
}
// 获取/设置 cookie
// 根据 key 查找 cookie 的值
// key : cookie名称
// value: cookie值
// options: 可配置参数 
//      如：{expires:7, path:"/", secure:true, domain:".baidu.com"}
//		expires:失效时间，可以为 数字 或 Date 对象
function cookie(key, value, options) {
	if (typeof value === "undefined") { // 未传递 value 值，则进行 cookie 读取
		// 读取所有 cookie，并按 "; " 分割成字母串数组
		var cookies = document.cookie.split("; ");
		// 遍历每条 cookie，比较各条遍历到的 cookie 的名称是否与 key 一致
		for (var i = 0, len = cookies.length; i < len; i++) {
			// 遍历到的当前cookie格式为 key=value
			var cookie = cookies[i].split("=");
			if (decodeURIComponent(cookie[0]) === key)
				return decodeURIComponent(cookie[1]);
		}
		// 不存在，则返回 null
		return null;
	}

	/* 保存 cookie */
	options = options || {}; // 如果未传递 options 则使用空对象
	var cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);
	// 判断是否有其它可选参数
	if (options.expires){ // 设置失效时间
		if (typeof options.expires === "number"){ // 传递的失效时间是一个数字天数
			var days = options.expires, // days = 7
				date = options.expires = new Date();
			date.setDate(date.getDate() + days);
		}

		cookie += ";expires=" + options.expires.toUTCString();
	}
	if (options.path)  // 设置路径
		cookie += ";path=" + options.path;
	if (options.domain) // 设置域名
		cookie += ";domain=" + options.domain;
	if (options.secure) // 设置安全链接
		cookie += ";secure"
	// 保存 cookie
	document.cookie = cookie;
}

// 删除 cookie
function removeCookie(key, options){
	options = options || {};
	options.expires = -1;
	cookie(key, "", options);
}

//查询某个元素是否在数组中存在，返回存在时的索引
function inArray(array,value){
	for(var i=0;i<array.length;i++){
		if(array[i]===value)
			return i;
	}
	return -1;
}

//多属性运动封装
		/*
		 * element: 待运动元素
		 * options: 待设置运动动画的属性对象
		 * speed: 运动时长
		 * fn: 运动结束后要继续执行的函数
		 */
		function animate(element, options, speed, fn) {
			// 先取消该运动元素上之前有的动画效果
			clearInterval(element.timer);
			// 使用对象保存各运动属性的初值与可运动区间
			var _starts = {}, _ranges = {};
			// 遍历 options 对象的所有属性，获取这些属性运动前的初值与运动区间
			for (var attr in options) {
				_starts[attr] = parseFloat(css(element, attr)) || 0;
				_ranges[attr] = options[attr] - _starts[attr];
			}
			// 记录运动开始的时间
			var _startTime = +new Date(); // Date.now() 或 new Date().getTime()
			// 启动定时器
			element.timer = setInterval(function(){
				// 运动消耗时间
				var elapsed = Math.min(+new Date() - _startTime, speed);
				// 循环遍历每个运动属性，设置当前运动到的值
				for (var attr in options) {
					var result = _ranges[attr] / speed * elapsed + _starts[attr];
					element.style[attr] = result + (attr === "opacity" ? "" : "px");
					// 暂未考虑IE
					// element.style.filter = "alpha(opacity="+ result * 100 +")";
				}
				// 判断是否停止定时器
				if (elapsed === speed){
					clearInterval(element.timer);
					// 如果有运动结束后执行的函数，则调用
					fn && fn();
				}
			}, 1000/60);
		}


//淡入
	function fadeIn(element,speed,fn){
		element.style.display = "block";
		element.style.opacity = 0;
		animate(element,{opacity:1},speed,fn);
	}
//淡出
	function fadeOut(element,speed,fn){
		animate(element,{opacity:0},speed,function(){
			element.style.display = "none";
			fn&&fn();
		});
	}

//封装AJAX的post,get函数
/*option----表示AJAX的请求配置信息
	options = {
		type:"get",   						        //请求方式 ，可取get或者post,默认get
		url:"xxx.php" , 					       //请求资源路径
		async:true,  						      //是否异步请求  默认true
		data:{username="xiao",phone:13134},      //需要在请求过程中发送的数据
		dataType:"",    					    //预期从服务器返回的数据格式   可取 json或者text 默认text
		headers:{key:"value"},   			   //额外设置的请求头信息
 		success:function(data){} ,			  //请求成功时的函数
		error:function(xhr){},   			 //请求失败时的函数
		complete:function(){} , 			//请求成功或者失败都要执行的函数

   	}
*/
function ajax(options){
	var xhr,//创建核心对象
		method, //保存请求方式
		url,//保存请求的URL
		queryString, //保存查询字符串
		async;   //是否异步
	options = options || {};
	
	if(window.XMLHttpRequest)
		xhr = new XMLHttpRequest();
	else
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	//建立连接
	method = options.type || "get"; //默认get
	url =options.url;
	if(options.data){
		var arr = [];
		for(var attr in options.data){
			arr.push(attr + "=" + options.data[attr]);
		}
		queryString = arr.join("&");
	}
	//get:使用？将queystring加到url后
	if(queryString && method.toLowerCase()==="get"){

		url += "?" + queryString;//连接到URl后
		queryString = null;//get请求使用完查询字符串，置为空
	}
  //设置是否异步
   async = typeof options.async === "boolean" ? options.async : true;

	xhr.open(method,url,async);
	//设置请求头信息
	if(method.toLowerCase() === "post"){
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	if(options.headers){
		for(var attr in options.headers){
			xhr.setRequestHeader(attr,options.headers[attr]);
		}
	}
	//发送请求
	xhr.send(queryString);
	//处理回调
	if(async){
		xhr.onreadystatechange  = function(){
			if(xhr.readyState === 4){ // 请求处理完毕， 响应就绪
				handle();
			}
		}
	}else{
		handle();
	}

	function handle(){
			options.complete && options.complete(xhr); //请求成功或者失败都要执行的函数
			if(xhr.status === 200){ //成功
				
				var data = xhr.responseText;
			
			if(options.dataType === "json")  //预期从服务器返回的是JSOn数据
				data = JSON.parse(data);
			//处理响应数据,若有成功的函数则执行
				options.success && options.success(data);
			}else{
				//如果有失败的函数，则调用执行
				options.error && options. error(xhr);
			}

	}
}