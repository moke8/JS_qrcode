<?php
    header("Content-type: text/html; charset=utf-8");
    if(isset($_GET["code"])){
        $json_string = file_get_contents('qrcode.json');
        $data = json_decode($json_string, true);
        if(isset($data[$_GET["code"]])){
            if (!empty($_SERVER['HTTP_USER_AGENT'])) {
                $br = $_SERVER['HTTP_USER_AGENT'];
                if (preg_match('/MicroMessenger/i', $br)) {
                    $br = '微信访问';
                    echo "<script>window.location.href=".$data[$_GET["code"]["WX"]]."</script>";
                } else if (preg_match('/mobile mqqbrowser/i', $br)) {
                    $br = 'QQ访问';
                    echo "<script>window.location.href=".$data[$_GET["code"]]["QQ"]."</script>";
                } else if (preg_match('/Alipay/i', $br)) {
                    $br = '支付宝访问';
                    echo "<script>window.location.href=".$data[$_GET["code"]]["AL"]."</script>";
                } else {
                    echo "<script>alert('请用支付宝/QQ/微信扫描该二维码');window.location.href=".$_SERVER['HTTP_HOST']."</script>";
                }
                echo "<br/>".$br;
            } else {
                echo 'unknow';

            }
//            echo $data[$_GET["code"]]["QQ"];
        }
        else{
            echo "错误";
        }
    }
    else if(isset($_POST["storage"])){
        if($_POST["QQ"]!=="null"||$_POST["WX"]!=="null"||$_POST["AL"]!=="null"){
            $QQ=strtr(htmlspecialchars_decode($_POST["QQ"]), '*', '&');
            $WX=strtr(htmlspecialchars_decode($_POST["WX"]), '*', '&');
            $AL=strtr(htmlspecialchars_decode($_POST["AL"]), '*', '&');
            $QQ_BL=preg_match("/i.qianbao.qq.com/i",$QQ);
            $WX_BL=preg_match("/wxp:\/\//i",$WX);
            $AL_BL=preg_match("/QR.ALIPAY.COM/i",$AL);
            if(!$QQ_BL&&!$QQ!=="null"){  //若未匹配上且不未空 报错
                echo "QQ";
                return 0;
            }else if(!$WX_BL&&$WX!=="null"){  //若未匹配上 表示二维码错误 给予提示
                echo "WX";
                return 0;
            }else if(!$AL_BL&&$AL!=="null"){  //若未匹配上 表示二维码错误 给予提示
                echo "AL";
                return 0;
            }
            $myfile = fopen("qrcode.json", "r+") or die("服务器出错！");
            $data=fread($myfile,filesize("qrcode.json"));  //读取至结尾
            $data = json_decode($data, true);   //将json转数组
            $code = md5(uniqid());
            $data[$code]["QQ"]=$QQ;
            $data[$code]["WX"]=$WX;
            $data[$code]["AL"]=$AL;
            $data = json_encode($data);
            fclose($myfile);
            $myfile = fopen("qrcode.json","w+");
            if(fwrite($myfile,$data)){
                echo $_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF']."?code=".$code;
            }else{
                echo "null";
            }

            return 0;
        }
        else{
            echo "null";
        }
    }