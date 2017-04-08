$(".ex_icon").on("click",function(){
	 var ico = $(this).find("i").attr("class"),
	 	 name=$(this).find(".ex_name").text(),
	 	 color = $(this).find('p').css("background");
	
	 $("#spacial_icon i").attr("class",ico);
	 $(".spacial_name ").text(name);
	 $("#spacial").css("background",color);
	 $("#input").css("background",color);
	 
	 $("#input").val("");
	 $("#input").focus();
	 
})

$(function(){
	$("#addpage").hide();
	$(".ex_icon p").each(function(i,ele){
		$(ele).css("background",getRandomColor());
	})
	function getRandomColor(){ 
		return "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6); 
	}
})
 
$("#confirm").on("mouseenter",function(){
	$(this).animate({ width: "2.0rem" }, 400);
});
$("#confirm").on("mouseout",function(){
	$(this).animate({ width: "0.46rem" }, 400);
})


//$("#confirm").hover(
//function () {
// $(this).animate({ width: "2.0rem" }, 400);
//},
//function () {
//  $(this).animate({ width: "0.46rem" }, 400);
//}
//);


$("#confirm").on("click",function(){
	var name = $(".spacial_name").text(),
		money = $("#input").val(),
		color = $("#spacial").css("background"),
		icoclass = $("#spacial_icon i").attr("class");
	var date = new Date();
	var md = date.getMonth()+1+"-"+date.getUTCDate();
	console.log(md);
	if(money!=""){
		$.post("../php/addbill.php",{name:name,money:money,color:color,md:md,icoclass:icoclass}, function(data){
				if (data.status === 1) {
					console.log("记账成功~");
					
					window.location.reload();
					$("#addpage").hide();
				} else {
					console.log("记账失败，重新试试呗，"+ data.message);
				}
		}, "json");
	}else{
		console.log("没花钱就不用记咯")
	}
})
//
//$("#add").on("mouseenter",function(){
//	$(this).animate({ transform:rotate("180deg") }, 400);
//});
//$("#add").on("mouseout",function(){
//	$(this).animate({ transform:rotate("-180deg") }, 400);
//})
$("#add").on("click",function(){
	$("#addpage").show();
})