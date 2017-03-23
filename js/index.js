$('[data-toggle="popover"]').popover();
  $('[data-toggle="tooltip"]').tooltip();
var uids = [],
	times = [],
	tels = [],
	search = $("#searchTex").val(),
	 url = "";
//搜索框失去焦点时
$("#searchTex").on("blur",function(){
                       
		//模拟JSON数据 ../data/data.json  
		$.ajax("/data/data.json").done(function(data){
			
			console.log(data);
			var timeArr = data.showapi_res_body.result;//读取jsons的数据
			for (var i = 0; i < timeArr.length; i++) {
				var time = timeArr[i].detail_info.shop_hours,//营业时间
					shopname= timeArr[i].name,//店铺名称
					shopadd = timeArr[i].address,// 店铺地址
					tel = timeArr[i].telephone,//电话
					score = timeArr[i].detail_info.overall_rating,
					location = timeArr[i].detail_info.locatoin;
					
					tels.push(tel);
				    url = "myMap.html?shopname="+shopname+"&time="+time+"&shopadd="+shopadd+"&tel="+tel+"&score="+score;
				    $(".more").each(function(n){
				    	$(this).click(function(){
				    		console.log(url)
				    		  window.open(url);
				    		  url = "";
				    	})
				      
				    }); 
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
				
				
			}
			
			//点击“call"弹出该店联系电话
			$(".tel").each(function(n){
				//调用Bootstrap模板
				//.tooltip-inner的样式
				$(this).attr("data-original-title",tels[n]); 
			})
			console.log(times);
			//显示时间在页面上
			restTime(times);
			
		});
				
	
	
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
				hous[i].style.marginLeft="-0.20rem";
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
});


//搜索框获得焦点变长
$("#searchTex").focus(function(){
	$("#searchTex").animate({
	 	width:"75%"
	 },400);
})
