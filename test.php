
<?php
$conn = mysqli_connect("localhost", "root", ""); // 或你的密碼
if ($conn) {
    echo "資料庫連線成功 🎉";
} else {
    echo "連線失敗：" . mysqli_connect_error();
}
?>

