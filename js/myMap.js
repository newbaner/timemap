 /************************非地图部分*************************/
   
    $(function(){
    	//读取cookie
    	 var info =  jQuery.parseJSON($.cookie("info")||{});
    	 	console.log(info)
			if(info.length !== 0){
				$("#shop_name").html(info.shopname+"<i class='iconfont icon-moreunfold' id='unfold'></i>");
				$("#hours").text(info.time);
			 	$("#address").text(info.shopadd);
			    $("#tel").text(info.tel);
			    $("#shop_img img").attr("src",info.src);
			    starLight(info.score);
			    
			    //点击下拉按钮，店铺信息消失，显示地图
			    $("#unfold").on("click",function(){
			    	alert(1)
			        $("#shop_show").hide();
			       
			    })
			}
			
    })
 
 
////分割出传递的数据

//   console.log(data)
    /* //依次给当前页面需要显示的地方赋值：
     $("#shop_name").html(data[0]);
     $("#hours").html(data[1]);
     $("#address").html(data[2]);
     $("#tel").html(data[3]);
     starLight(data[4]);
*/
    //评分星星的亮度控制
    function starLight(n){
        var  n = Math.round(n);
        var stars = $("i",$("#score"));
        for(var i = 0;i<n;i++){
            stars[i].style.color = "#424542";
        }
    }
    //默认三颗星
    starLight(3.9);


 /**************************地图部分****************************/
    var map, geolocation;
    //加载地图，调用浏览器定位服务
    map = new AMap.Map('map', {
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
    }
    //解析定位错误信息
    function onError(data) {
      console.log('定位失败');
    }
