<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/1/8
 * Time: 9:16
 */
include "phpFuncs1.php";

//echo "begin";
$results = read_all_dir("./../shuchuwenjian");
//$results = read_all_dir("http://10.2.3.4/gersEarth/jiashangltf");
//$results = read_all_dir("../gltf");

//var_dump($results['files']);
echo json_encode($results['files']);
//echo "end";phpFuncs1.php
//http://localhost:63342/viewGltf/index.html?_ijt=3o2bgo5074k5ep75r5tsicmu0d
