  $(function(){
		$.post("../php/loadbill.php",{},function(data){
  			chart(callfor(data))
    },"json")
 })
  
  $("#back").on("click",function(){
  	window.location.href = "time.html";
  })
  $("#echart").on("click",function(){
  	window.location.href = "time.html";
  	
  })
   $("h1").on("click",function(){
  	window.location.href = "index.html";
  	
  })
  $(".lastm").on("click",function(){
  		$(".month span").text(parseInt($(".month span").text())-1);
  		$.post("../php/loadbill.php",{},function(data){
  			chart(callfor(data))
    },"json")
  })
   $(".nextm").on("click",function(){
  		$(".month span").text(1+parseInt($(".month span").text()));
  		$.post("../php/loadbill.php",{},function(data){
  			chart(callfor(data))
    },"json")
  })
  
  function callfor(data){
  	var enableData = [];
  	var currMonth = $(".month span").text();
  	var data = data.billlist;
  	for(var i= 0;i<data.length;i++){
  		if(data[i].month.split("-")[0]==currMonth){
	  			enableData.push(data[i]);
  		}
  	}
  		
		for(var j = 0;j<enableData.length;j++){
				var curr = enableData[j];
				for(var n= 0;n<enableData.length;n++){
						var per = enableData[n];
						if(n!=j){
							if(curr.name === per.name){
								per.money = parseFloat(per.money) + parseFloat(curr.money);
								enableData.splice(j,1);
								
							}
						}
				}
		}
  	return enableData;
  }
  
  
  function chart(enableData){
  	
  	if(enableData.length==0){
  		$(".chart").html("<div style='background:#FFECEC;width:100%;height:100%'><i class='icon iconfont icon-yongcan' style='font-size:200px;margin-left:25%;color:#fff';display:'block'></i><p style='font-size:30px;font-weight:bold;color:#FFF;text-align:center' >还没消费呢</p></div>")
  	}
  	else{
  	var names = [],
  			values = [],
  			obj = [],
  			colors=[];
  	for(var i=0;i<enableData.length;i++){
  		
  		names.push(enableData[i].name);
  		values.push(enableData[i].money);
  		obj.push({name:enableData[i].name,value:enableData[i].money});
  		colors.push(enableData[i].color);
  	}
  
  var myChart = echarts.init(document.getElementsByClassName("chart")[0]);
 

	option = {
	    tooltip: {
	        trigger: 'item',
	        formatter: "{a} <br/>{b}: {c} ({d}%)"
	    },
	    legend: {
	        orient: 'vertical',
	        x: 'left',
	        data:names
	    },
	    color:colors,
	    series: [
	        {
	            name:'个人花销',
	            type:'pie',
	            radius: ['50%', '70%'],
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: false,
	                    position: 'center'
	                },
	                emphasis: {
	                    show: true,
	                    textStyle: {
	                        fontSize: '30',
	                        fontWeight: 'bold'
	                    }
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data:obj
	        }
	    ]
	};

 // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
 }
 }