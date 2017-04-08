 /************************非地图部分*************************/
 var info =  jQuery.parseJSON($.cookie("info")||{});
var pos = [info.loc.lng,info.loc.lat]||[];
var currpos = [];
    $(function(){
    	 $("#shop_show").show();
    	//读取cookie
    	 
    	 var info =  jQuery.parseJSON($.cookie("info")||{});
    	 	
			if(info.length !== 0){
				$("#shop_name").html(info.shopname+"<i class='iconfont icon-moreunfold' id='unfold'></i>");
				$("#hours").text(info.time);
			 	$("#address").text(info.shopadd);
			    $("#tel").text(info.tel);
			    $("#shop_img img").attr("src",info.src.url);
			    starLight(info.score);
			    console.log(info.score)
			    //点击下拉按钮，店铺信息消失，显示地图
			    $("#unfold").on("click",function(){
			        $("#shop_show").hide();
			       	$("#fold").show();
			       	$("#map").show();
			      // 	$("#map").css({height:"100%"});
			    })
			     $("#fold").on("click",function(){
			    	//$("#map").css({height:"30%"});
			        $("#shop_show").show();
			       	$("#fold").hide();
					$("#walkinfo").hide();
			       	
			    })
			}
		//评分星星的亮度控制
	    function starLight(n){
	        var  n = Math.round(n);
	        var stars = $("#score i");
	        for(var i = 0;i<n;i++){
	            stars[i].style.color = "#424542";
	        }
	    }
	    //默认三颗星
	    starLight(3.9);

			
    })
 
    

 /**************************地图部分****************************/
  console.log(info.currloc);
  var currloc = info.currloc;
	var map, geolocation;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('map', {
        resizeEnable: true,
     	zoom:16,
       	center: currloc,
         mapStyle:'fresh'
    });
map.on('moveend', getCity);
    function getCity() {
        map.getCity(function(data) {
            if (data['province'] && typeof data['province'] === 'string') {
                document.getElementById('city').innerHTML =  (data['city'] || data['province']);
            }
        });
    }

  //添加目标点在地图
marker = new AMap.Marker({
	position: pos,
	title: info.name,
	size : new AMap.Size(24,24),
	icon:'../img/location.png'
 });
 selfmarker = new AMap.Marker({
	position: currloc,
	title: "me",
	size : new AMap.Size(24,24),
	icon:'../img/self.png'
 });
 
 marker.setMap(map);
 selfmarker.setMap(map);
AMap.service(["AMap.Walking"], function() {
 	var walking = new AMap.Walking({
    	map: map,
    	panel: ""
	}); 
	
	$("#map").on("click",".qubei",function(){
    	closeInfoWindow();
    	$("#shop_show").hide();
    	$("#fold").show();
	    $("#walkinfo").show();
	    	//根据起终点坐标规划步行路线
	    	console.log(currloc,pos)
	    		
	   		 walking.search(currloc, pos,function(status, result){
	   		 $(".amap-lib-marker-to").css({'background':"url(../img/location.png)"});
	   		 	console.log(result);
	   		 	var routes = result.routes;
	   		 	console.log(routes);
	   		 	var steps = [];
	   		 	var hh = parseInt(routes[0].time/3600),
	   		 		mm = parseInt(routes[0].time/60);
	   		 	
	   		 	var html = "<p class='pathnav_title'>饭前走一走，多吃一两口 <br>=。= 跟我来<i class='iconfont icon-skip'></i><br>走"+hh+"小时"+mm+"分钟就够啦</p>";
	   		 	for(var i = 0;i<routes.length;i++){
	   		 		steps.push(routes[i].steps);
	   		 	}
	   		 	console.log(steps)
	   		 	for(var n = 0;n<steps.length;n++){
	   		 		for(var j = 0;j<steps[n].length;j++){
	   		 			html+= "<p>step"+(j+1)+":<span>"+steps[n][j].instruction+"</span></p>";
	   		 		}
	   		 	}
	   		 	html+="<p style='text-align:center'>不用谢==</p>";
	   		 	$("#walkinfo").html(html);
	   		 });
  		 })
	});

$("#shop_show").on("click",function(){
	 map.setZoomAndCenter(16, [info.loc.lng,info.loc.lat]);
});

  AMap.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker.getPosition());
          $("#walkinfo").hide(); 
 });

   //实例化信息窗体
    var title = info.shopname,
        content = [];
    content.push("<p class='content_add'>"+info.shopadd+"</p>");
    content.push("<a href = '#' class='diancai'><i class='iconfont icon-diancai'></i></a><a href = 'tel:"+info.tel+ "class = 'callfor'><i class='iconfont icon-shouye'></i></a><a href = 'javascript:void(0)' class='qubei' id='test'><i class='iconfont icon-qubei aaa'></i></a>");
    var infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: createInfoWindow(title, content.join("<br/>")),
        offset: new AMap.Pixel(16, -45)
    });
////点击电话按钮，显示电话号码

    //构建自定义信息窗体
    function createInfoWindow(title, content) {
        var info = document.createElement("div");
        info.className = "info";

        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        var top = document.createElement("div");
        var titleD = document.createElement("div");
        var closeX = document.createElement("img");
        top.className = "info-top";
        titleD.innerHTML = title;
        closeX.src = "http://webapi.amap.com/images/close2.gif";
        closeX.onclick = closeInfoWindow;

        top.appendChild(titleD);
        top.appendChild(closeX);
        info.appendChild(top);

        // 定义中部内容
        var middle = document.createElement("div");
        middle.className = "info-middle";
        middle.style.backgroundColor = 'white';
        middle.innerHTML = content;
        info.appendChild(middle);

        // 定义底部内容
        var bottom = document.createElement("div");
        bottom.className = "info-bottom";
        bottom.style.position = 'relative';
        bottom.style.top = '0px';
        bottom.style.margin = '0 auto';
        var sharp = document.createElement("img");
        sharp.src = "http://webapi.amap.com/images/sharp.png";
        bottom.appendChild(sharp);
        info.appendChild(bottom);
        return info;
    }

    //关闭信息窗体
    function closeInfoWindow() {
        map.clearInfoWindow();
    }
    
    
