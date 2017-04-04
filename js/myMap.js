 /************************非地图部分*************************/
 var info =  jQuery.parseJSON($.cookie("info")||{});
var pos = [info.loc.lng,info.loc.lat];
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
			      // 	$("#map").css({height:"100%"});
			    })
			     $("#fold").on("click",function(){
			    	//$("#map").css({height:"30%"});
			        $("#shop_show").show();
			       	$("#fold").hide();
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
  console.log(info.loc.lng,info.loc.lat)
  var map, geolocation;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('map', {
        resizeEnable: true,
        mapStyle:'fresh'
    });
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(300, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false	
          	
            buttonPosition:'RB',
          
          
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
    });
   

map.on('moveend', getCity);
    function getCity() {
        map.getCity(function(data) {
            if (data['province'] && typeof data['province'] === 'string') {
                document.getElementById('city').innerHTML =  (data['city'] || data['province']);
            }
        });
    }
    
function onComplete(data) {
        var str=['定位成功'];
        str.push('经度：' + data.position.getLng());
        str.push('纬度：' + data.position.getLat());
        if(data.accuracy){
             str.push('精度：' + data.accuracy + ' 米');
        }//如为IP精确定位结果则没有精度信息
        str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
       console.log(str.join('<br>')) ;
 		var currpos=[];	
        currpos.push(data.position.getLng());
        currpos.push(data.position.getLat());
		
		return currpos;
    	
        $("#shop_show").show();
    }
    //解析定位错误信息
    function onError(data) {
      console.log('定位失败');
    }

   //添加目标点在地图
marker = new AMap.Marker({
	position: pos,
	title: info.name,
	size : new AMap.Size(24,24),
	icon:'../img/location.png'
 });
	marker.setMap(map);
$("#shop_show").on("click",function(){
	 map.setZoomAndCenter(16, [info.loc.lng,info.loc.lat]);
});

  AMap.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker.getPosition());
            
 });

   //实例化信息窗体
    var title = info.shopname,
        content = [];
    content.push("<p class='content_add'>"+info.shopadd+"</p>");
    content.push("<a href = '#' class='diancai'><i class='iconfont icon-diancai'></i></a><a href = '#'><i class='iconfont icon-shouye'></i></a><a href = 'javascript:void(0)' class='qubei' id='test'><i class='iconfont icon-qubei'></i></a>");
    var infoWindow = new AMap.InfoWindow({
        isCustom: true,  //使用自定义窗体
        content: createInfoWindow(title, content.join("<br/>")),
        offset: new AMap.Pixel(16, -45)
    });

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
    
    console.log($("#test"));
   $(".qubei").on("click",function(event){
   	event.stopPropagation();
   	console.log(event.target);
   		alert(1);
   	  closeInfoWindow();
   	  
   	    var walking = new AMap.Walking({
	        map: map,
	        panel: "walkinfo"
	    }); 
    //根据起终点坐标规划步行路线
    walking.search(currpos, pos);
   });
  
   
