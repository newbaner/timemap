<?php
	// 获取 POST 请求中提交的用户信息
	$name = $_POST["name"];
	$money = $_POST["money"];
	$color = $_POST["color"];
	$md = $_POST["md"];
	$icoclass = $_POST["icoclass"];
	// 数据库连接
	$conn = mysql_connect("localhost:3306", "root", "");
	if (!$conn)
		die ("数据库连接失败");
	mysql_query("set character set 'utf8'");
	mysql_query("set names 'utf8'");
	mysql_select_db("timemap");
	// 发送数据插入
	$sql = "INSERT INTO bill VALUES(NULL, '$name', '$money','$color','$md','$icoclass')";
	$result = mysql_query($sql, $conn);
	// 处理结果
	if ($result) 
		echo '{"status":1, "message":"success"}';
	else
		echo '{"status":0, "message":"'. mysql_error() .'"}';

	// 关闭数据库连接
	mysql_close($conn);
?>