<?php

session_start();

if (!isset($_SESSION['username'])){
    header('locattion');
}

?>

<html>
<head>
    <title>Home</title>
</head>

<body>

<a href="logout.php">Logout</a>
<h5><?php echo $_SESSION['username'];?> </h5>
</body>

</html>
