$(function(){

	$.post("../php/loadbill.php",{},function(data){
		if (data.status === 1) { 
				var lists = data.billlist;
				var len = lists.length;
				var samedates = [];
				var monthtotal = 0;
				for(var j = 0;j<len;j++){
					var m = j;
					var clonelist = $(".list:first").clone(true);
					console.log(clonelist)
					$("#lists").append(clonelist);
				}
									
				for(var j = 0;j<len;j++){
					console.log(lists[j].name);
					$($(".list ")[j]).find("i").attr("class",lists[j].icoclass);
					
					$($(".classicon")[j]).css("background",lists[j].color);
					
					$($(".className")[j]).text(lists[j].name);
					
					$($(".money")[j]).text(lists[j].money);
					
					$($(".day")[j]).text(lists[j].month);
					monthtotal += parseFloat(lists[j].money);
				}
				$(".list:last").hide();
				$("#monthtotal").text(monthtotal);
		}
	},"json");
	
	$("#chart").on("click",function(){
		location.href = "chart.html";
	})
})
