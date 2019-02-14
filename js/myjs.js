layui.use(['layer', 'form'], function(){
    layer=layui.layer;
});
var URL={
    QQ:"null",
    WX:"null",
    AL:"null"
};
//处理ajax
function ajax(opts){
    var xhr = new XMLHttpRequest(); //创建ajax对象
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status == 200) {
            opts.success(xhr.responseText)
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            opts.error();
        }
    };
    var urlStr='';
    for(var key in opts.data) {
        urlStr += key + '=' + opts.data[key] + "&";
    }
    urlStr=urlStr.substring(0, urlStr.length-1);
    console.log(urlStr);
    if(opts.type.toLowerCase()==='get'){
        xhr.open(opts.type, opts.url+ ' ?' + urlStr, true);
        xhr.send()
    }
    if(opts.type.toLowerCase()==='post'){
        xhr.open('post', opts.url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(urlStr);
    }
}
//处理请求和请求结果
function upload() {
    try {
        ajax({
            url: "code.php",
            type: "post",
            data: {
                "storage": 123,
                "QQ": URL.QQ.replace(/&/g, "*"),
                "WX": URL.WX.replace(/&/g, "*"),
                "AL": URL.AL.replace(/&/g, "*")
            },
            success: function (data) {
                if (data === "WX") {
                    layer.msg('<i class="layui-icon layui-icon-face-cry" style="font-size: 30px; color: #FF9933;"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;微信收款码出错，请检查后重试');
                } else if (data === "QQ") {
                    layer.msg('<i class="layui-icon layui-icon-face-cry" style="font-size: 30px; color: #FF9933;"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;QQ收款码出错，请检查后重试');
                } else if (data === "AL") {
                    layer.msg('<i class="layui-icon layui-icon-face-cry" style="font-size: 30px; color: #FF9933;"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支付宝收款码出错，请检查后重试');
                } else if(data === "null"){
                    layer.msg('<i class="layui-icon layui-icon-face-cry" style="font-size: 30px; color: #FF9933;"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请选择二维码！');
                } else {
                    image(data);
                }
            },
            error: function () {
                console.log("发生错误");
            }
        });
    }catch (e) {
        console.log("发生错误");
    }
    return 0;
}
function image(data){ //处理图片
    //创建一个element以存放制作的二维码
    var qrimg=document.createElement("div");
    if(qrimg.innerHTML!==""){
        qrcode.clear();
        qrcode.makeCode(data);
    } else{
        qrcode = new QRCode(qrimg, {
            text: data,
            width: 560,
            height: 560,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        });
    }
    setTimeout(function(){//等待0.3秒后绘制二维码
        //创建canvas
        let c=document.createElement("canvas");
        c.width="900";
        c.height="1130";
        let ctx=c.getContext("2d");
        ctx.drawImage(document.getElementsByTagName("img")[0],0,0); //背景图
        ctx.font="70px Arial";
        ctx.fillStyle="white";
        ctx.textAlign='center';//文字居中
        ctx.textBaseline='middle';
        ctx.fillText("扫一扫向“"+document.getElementById("username").value+"”付款",450,100);//生成文字
        ctx.drawImage(qrimg.children[1],160,220);//生成的二维码
        let imgURI = c.toDataURL("image/png");//canvas转图片
        document.getElementById("show").setAttribute("src",imgURI);//将图片展示给用户
        document.getElementById("a_down").setAttribute("href",imgURI);
        document.getElementById("a_down").style.display="block";
    },300);
    return 0;
}
function preview(e,param,UA){ //处理用户图片上传和解析
    console.log("调用了preview");
    analyticCode.getUrl(param,e,function(url1){
        let i=null;
        let ele=null;
        switch (UA) {
            case "QQ":
                i=url1.match(/i.qianbao.qq.com/i);
                if(!i){
                    layer.msg('<i class="layui-icon layui-icon-face-cry" style="font-size: 30px; color: #FF9933;"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您上传的不是QQ收款二维码');
                    return 0;
                }
                ele=document.getElementsByClassName("QQ")[0];
                break;
            case "WX":
                i=url1.match(/wxp:\/\//i);
                if(!i){
                    layer.msg('<i class="layui-icon layui-icon-face-cry" style="font-size: 30px; color: #FF9933;"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您上传的不是微信收款二维码');
                    return 0;
                }
                ele=document.getElementsByClassName("WX")[0];
                break;
            case "AL":
                i=url1.match(/QR.ALIPAY.COM/i);
                if(!i){
                    layer.msg('<i class="layui-icon layui-icon-face-cry" style="font-size: 30px; color: #FF9933;"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您上传的不是支付宝收款二维码');
                    return 0;
                }
                ele=document.getElementsByClassName("AL")[0];
                break;
        }
        URL[UA]=url1;
        ele.setAttribute("value",url1);
        return 0;
    });
}