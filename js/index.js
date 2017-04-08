document.documentElement.style.fontSize = document.documentElement.clientWidth / 3.75 +"px";
$(function(){
	

	var pos=[];
	//初始定位
    var map = new AMap.Map("mapContainer", {
        resizeEnable: true
    });
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(300, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition:'RB'
        });
       // map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息

    });

    function onComplete(data) {
		
        pos.push(data.position.getLng());
        pos.push(data.position.getLat());
      	console.log(1);
       
      return pos;
    }
    
     //中心点坐标
var cpoint = pos||[];
$('[data-toggle="popover"]').popover();
$('[data-toggle="tooltip"]').tooltip();

var uids = [],
	times = [],
	tels = [],
 	url = "";
//搜索框失去焦点时
var timeArr = [];
$("#searchTex").on("blur",function(){
	
	var keyword = $("#searchTex").val();
	AMap.service(["AMap.PlaceSearch"], function() {
		var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
		    pageSize:10,
		    typ:'餐饮服务',
		    pageIndex: 1,
		    city: "011", //城市
		    map: map,
//		    panel: "section"
		});
   		console.log(2)
       
	
	if(keyword !== ""){
		console.log(keyword)
		placeSearch.searchNearBy(keyword, cpoint, 500, function(status, result) {
					
		 			console.log(result,status)
		 			if(status!="no_data"){
			 			var data = result.poiList.pois||[];
			 			//搜索的条数
			 			var len = data.length;
			 		 timeArr =  randomTime(len);					 		
			 			//复制节点
			 			for (var i = 0; i < len-1; i++){
			 				var cloneli = 	$("#lis li:last").clone(true);
			 				$("#lis").append(cloneli);
			 			
			 			}
			 			for (var i = 0; i < len; i++){
			 				
			 					data[i].shoptime = timeArr[i];
		 					  var time = data[i].shoptime,//营业时间
									shopname= data[i].name,//店铺名称
									shopadd = data[i].address,// 店铺地址
									tel = data[i].tel,//电话
									score = 4,
									src = data[i].photos[0]||"../img/picShow1.jpg",
									distance = data[i].distance,
									loc = data[i].location;
									tels.push(tel);
									var obj = {
										"time":time,
										"shopname":shopname,
										"shopadd":shopadd,
										"tel":tel,
										"score":score,
										"src":src,
										"distance":distance,
										"loc":loc,
										"currloc":pos
									}
		 					  		$(function(obj,i){
											$($(".more")[i]).on("click",function(){
												$.cookie.json = true;
												$.cookie("info", obj, {expires:7, path:"/"});
												window.location.href = "myMap.html";
											})
											//点击“call"弹出该店联系电话
												//调用Bootstrap模板
												//.tooltip-inner的样式
												//data-original-title
//												$($(".tel")[i]).attr("title",tels[i]);
											$($(".tel")[i]).on("click",function(){
												$(this).attr("data-original-title",tels[i]); 
												$(this).tooltip('show');
											})
												
												
										}(obj,i));
			 					  	if(time){
												if(time.charAt(0)=="全"||time.charAt(0)==="24"){
													times.push("24:00");
												}
												else{
													var timee = time.split("-")[1];
													times.push(timee);
												}
							
										}else{                                                                                                       
												times.push("20:00")
										}
								//显示商家名字
								$(".shop_name")[i].innerHTML=shopname;
								//显示商家地址
								$(".shop_addr")[i].innerHTML=shopadd;
								//距离
									$(".distance span")[i].innerHTML = distance;
								//商家图片
								$($(".picShow img")[i]).attr("src",src.url);
								
							
			 			}
					 			
		 				//点击“call"弹出该店联系电话
					
		 			 	 console.log(data);
		 				console.log(times);
						//显示时间在页面上
						restTime(times);
						
								
		       		 }
		 			
	 	
		})
		 		
	}else{
		alert("你输入的关键字我们没有找到呢\n你是否要找“美食”??");
		$("#searchTex").val("美食")
		//window.reload();
		 }
	 })// AMap.service结束 
	 timeArr = [];
	 reset();
})//$("#searchTex")结束
	    
    
//随机营业时间函数 
	function randomTime(len){
		var arr = ["10:00-18:30","09:00-21:30","10:00-22:00","11:00-22:30","11:30-20:00","10:00-24:00","10:00-23:59","09:45-19:00","10:20-21:20","11:30-24:00","12:00-24:00","10:00-23:00"];
		var timeArr = [];
		for(var i = 0;i<len;i++){
			var num = parseInt(Math.random()*12);
			timeArr.push(arr[num]);
		}
		return timeArr;
	}
 
//设置营业时间终止时间距离当前时间的进度条，显示在每个li的下面
//.process_border
//.process_border的width通过计算得到：
	function restTime(lastTimes){//传入当前6个店铺的营业截止时间的数组，如['19 ：00','19 ：00','19 ：00',...
		    var currTime = new Date(),//获取当前时间
			    currH = currTime.getHours(),//当前时间的小时
			    currM = currTime.getMinutes(),//当前时间的分钟
				//section>ul>li的个数，与ajax返回数据条数应该一致
				len = lastTimes.length,
				//每个process_border
				 proes = $(".process_border");
		for(var i = 0;i<len;i++){
			var lasttimeH = Number(lastTimes[i].split(":")[0]),//获取传入的时间-小时
		   		lasttimeM = Number(lastTimes[i].split(":")[1]);//获取传入的时间-分钟
				//判断若是凌晨打烊，则要加上24小时，如凌晨02点，则是26小时
				 if(lasttimeH<12){
						lasttimeH+=24;
					}
				var diffMinu = lasttimeH*60+lasttimeM - currH*60-currM,//两个时间的差值转化为分钟数
				//每个显示出来的hour
				 hous = $(".hNum"),
				//每个显示出来的minute
				 mins =$(".mNum");
			if(Math.floor(diffMinu/60)>=10){
				//hous[i].style.marginLeft="-0.20rem";
				$(hous[i]).css({"margin-left":"-0.2rem"});
			}
			hous[i].innerHTML = Math.floor(diffMinu/60);
			mins[i].innerHTML = diffMinu%60;
			
			if(diffMinu>=180){
				proes[i].style.background = "#55A532";
				proes[i].style.width = "90%";
			}else if(diffMinu>0&&diffMinu<180){
				proes[i].style.width = diffMinu/180*0.9*100+"%";
				if(diffMinu<120){
					proes[i].style.background = "#f7e721";
				}
				if(diffMinu<60){
					proes[i].style.background = "#ff7184";
				}
			}else{
				//当前时间不在营业时间范围内，显示已打烊
				$(".restTime")[i].innerHTML = "<p class='hours'><span class='hNum timeout'>已打烊</span ></p><p class='minu'><span class='mNum'></span></p>";
				proes[i].style.width = "90%";
				proes[i].style.background = "#dae4e4";
				continue;
			}
		}
	}
	//var times = ["19:00","24:00","14:24","18:00","17:30","19:35"];

function reset(){
	 timeArr = [];
	 times = [];
	tels = [];
 	url = "";
 	data = [];
 	len = 0;
 	$("#lis").html('<li><div class="shop_Info"><div class="picShow"><a href="#"><img src="../img/picShow1.jpg" /></a></div><div class="specific_info"><p class="shop_name">shop name</p><p class="shop_addr">shop address</p><p class="contact"><span class="distance"><span>300</span>m</span><a href="#" class="tel btn-default" data-toggle="tooltip" data-placement="top" title>call</a><a href="javascript:void(0)" class="more">Details<i class="iconfont icon-more"></i></a></p></div></div><div class="restTime"><p class="hours"><span class="hNum">2</span >h</p><p class="minu"><span class="mNum">43</span>min</p></div><div class="process_border"></div></li>'
 	);
 	console.log($("#lis li").length)
}

//搜索框获得焦点变长
$("#searchTex").focus(function(){
	$("#searchTex").animate({
	 	width:"75%"
	 },400);
})
})