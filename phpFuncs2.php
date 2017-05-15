<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2016/1/16
 * Time: 19:34
 */

function read($dir, $fileList)
{
    $handle = opendir($dir);
    if ($handle) {
        while (($file = readdir($handle)) !== false) {
            if ($file != '.' && $file != '..') {
                $cur_path = $dir . '/' . $file;
                if (is_dir($cur_path)) {
//                    $filesArr1=read($cur_path, $fileList);
//                    for($i=0;$i<sizeof($filesArr1);$i++){
//                        array_push($fileList,$filesArr1[$i]);
//                    }
                    $fileList=read($cur_path, $fileList);
                } else {
                    if(strstr($file,"3d")!== false){
                        array_push($fileList, $cur_path);
                    }
                }
            }
        }
        closedir($handle);
    }

    return $fileList;
}

function read_all_dir($dir)
{
    $result = array();
    $files = array();

    $files=read($dir, $files);
    $result['files'] = $files;

    return $result;
}
