<?php
	// 数据库连接
	$conn = mysql_connect("localhost:3306", "root", "");
	if (!$conn)
		die ("数据库连接失败");
	mysql_query("set character set 'utf8'");
	mysql_query("set names 'utf8'");
	mysql_select_db("timemap");
	// 发送数据插入
	$sql = "SELECT * from bill";
	$result = mysql_query($sql, $conn);
	// 处理结果
	$rowArr = array();
	
	while($row = mysql_fetch_array($result, MYSQL_ASSOC)) 
		{
			$rowArr[] = $row;
		
		}
		echo '{"status":1, "message":"success", "billlist":'. json_encode($rowArr) .'}';
	// 关闭数据库连接
	mysql_close($conn);
	