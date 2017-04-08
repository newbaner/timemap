  $(function(){
		$.post("../php/loadbill.php",{},function(data){
  			chart(callfor(data))
    },"json")
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
  	//console.log(enableData);
////		for(var i = 0;i<enableData.length;i++){
//			var money = 0;
//			$.each(enableData, function(m,dat) {
//					
//					if(dat.name===enableData[m].name){
//						
//						money +=	parseFloat(enableData[m].money);
//						enableData.splice(m,1);
//					}
//					dat.money = money;
//					console.log(enableData[m].money)
//					console.log(enableData[m].name)
//			});
//			
////		}
  	
  	return enableData;
  }
  
  
  function chart(enableData){
  	
  	if(enableData.length==0){
  		$(".chart").html("<div style='background:#A6E1EC;width:100%;height:100%'>还没消费呢</div>")
  	}
  	else{
  	var names = [],
  			values = [],
  			obj = [];
  	for(var i=0;i<enableData.length;i++){
  		names.push(enableData[i].name);
  		values.push(enableData[i].money);
  		obj.push({name:enableData[i].name,value:enableData[i].money});
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