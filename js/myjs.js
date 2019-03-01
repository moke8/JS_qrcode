layui.use(['layer', 'form'], function(){
    layer=layui.layer;
});
function code(data){ //处理图片
    let qrimg=document.getElementById("res");
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
    document.getElementById("a_down").setAttribute("href",qrimg.children[0].getAttribute("src"));
    document.getElementById("a_down").style.display="block";
}
function preview(e,param){ //解析二维码
    console.log("调用了preview");
    analyticCode.getUrl(param,e,function(url1){
        let i=null;
        let ele=null;
        ele=document.getElementsByClassName("AL")[0];
        // URL[UA]=url1;
        ele.setAttribute("value",url1);
        let adecode=document.getElementById("decode");
        adecode.value="解码结果："+url1;
        adecode.style.display="block";
        return 0;
    });
}