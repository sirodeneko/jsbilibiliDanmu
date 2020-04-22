// ==UserScript==
// @name      bilibili直播烤肉man字幕显示
// @version   20200415
// @description ！！！
// @author    siro
// @match     http://live.bilibili.com/*
// @match     https://live.bilibili.com/*
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @namespace http://www.xiaosiro.cn
// @grant     unsafeWindow
// ==/UserScript==

//脚本多次加载这可能是因为目标页面正在加载帧或iframe。
//
//将这下行添加到脚本代码部分的顶部：
if (window.top != window.self)  //-- Don't run on frames or iframes
    return;

var room_id=22129083;//默认房间号
var url;
var mytoken;
var port;
var rawHeaderLen = 16;
var packetOffset = 0;
var headerOffset = 4;
var verOffset = 6;
var opOffset = 8;
var seqOffset = 12;
var socket;
var utf8decoder = new TextDecoder();
var f=0; //不知道为什么会建立两次连接，用这个标记一下。

// 创建页面字幕元素
var danmudiv=$('<div></div>');
danmudiv.attr('id','danmu');
danmudiv.css({
    "height":"50px",
    "min-width":"100px",
    "width":$("#live-player-ctnr").width(),
    "magin":"0 auto",
    "position":"absolute",
    "left":"0px",
    "bottom":"28px",//修改此数值改变字幕距底部的高度
    "z-index":"99",
    "color": "red",//修改此处改变字幕颜色
    "font-size": "25px",//修改此处改变字体大小
    "text-align":"center",
});
danmudiv.text("脚本启动");
danmudiv.appendTo($("#live-player-ctnr"));

//字幕清除定时器
var clearDanmu=setTimeout(function(){
    danmudiv.text(" ");
},3000);

//获取当前房间编号
var UR = document.location.toString();
var arrUrl = UR.split("//");
var start = arrUrl[1].indexOf("/");
var relUrl = arrUrl[1].substring(start+1);//stop省略，截取从start开始到结尾的所有字符
if(relUrl.indexOf("?") != -1){
    relUrl = relUrl.split("?")[0];
}
room_id=parseInt(relUrl);
//获取真实房间号
$.ajax({
    url: '//api.live.bilibili.com/room/v1/Room/room_init?id=' + room_id,
    type: 'GET',
    dataType: 'json',
    success: function (data) {
        room_id=data.data.room_id;

    }
});
//获取弹幕连接和token
$.ajax({
    url: '//api.live.bilibili.com/room/v1/Danmu/getConf?room_id=704808&platform=pc&player=web',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
        url = data.data.host_server_list[1].host;
        port = data.data.host_server_list[1].wss_port;
        mytoken = data.data.token;
        DanmuSocket();
    },
    xhrFields: {withCredentials: true}
})
// 蜜汁字符转换
function textEncoder(str){
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strlen = str.length; i < strlen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}
// 合并
function mergeArrayBuffer(ab1, ab2) {
    var u81 = new Uint8Array(ab1),
        u82 = new Uint8Array(ab2),
        res = new Uint8Array(ab1.byteLength + ab2.byteLength);
    res.set(u81, 0);
    res.set(u82, ab1.byteLength);
    return res.buffer;
}

//发送心跳包
function heartBeat() {
    var headerBuf = new ArrayBuffer(rawHeaderLen);
    var headerView = new DataView(headerBuf, 0);
    headerView.setInt32(packetOffset, rawHeaderLen);
    headerView.setInt16(headerOffset, rawHeaderLen);
    headerView.setInt16(verOffset, 1);
    headerView.setInt32(opOffset, 2);
    headerView.setInt32(seqOffset, 1);
    //console.log('发送信条');
    socket.send(headerBuf);
};
// socket连接
function DanmuSocket() {
    var ws = 'wss';
    //console.log('小爷来了');
    if(f){
        return;
    }
    socket = new WebSocket(ws + '://' + url + ':' + port + '/sub');
    f=1;
    socket.binaryType = 'arraybuffer';

    // Connection opened
    socket.addEventListener('open', function (event) {
        console.log('Danmu WebSocket Server Connected.');
        console.log('Handshaking...');
        var token = JSON.stringify({
            'uid': 0,
            'roomid': room_id,
            'token': mytoken
        });
        var headerBuf = new ArrayBuffer(rawHeaderLen);
        var headerView = new DataView(headerBuf, 0);
        var bodyBuf = textEncoder(token);
        headerView.setInt32(packetOffset, rawHeaderLen + bodyBuf.byteLength);
        headerView.setInt16(headerOffset, rawHeaderLen);
        headerView.setInt16(verOffset, 1);
        headerView.setInt32(opOffset, 7);
        headerView.setInt32(seqOffset, 1);
        socket.send(mergeArrayBuffer(headerBuf, bodyBuf));
        // heartBeat();
        var Id = setInterval(function () {
            heartBeat();
        }, 30*1000);
    });

    socket.addEventListener('error', function (event) {
        console.log('WebSocket error: ', event);
        console.log('WebSocket 关闭 ');
        socket.close();
    });

    // Listen for messages
    socket.addEventListener('message', function (evt) {
        var data = evt.data;
        var dataView = new DataView(data, 0);
        var packetLen = dataView.getUint32(packetOffset);
        if (dataView.byteLength >= packetLen) {
            var headerLen = dataView.getInt16(headerOffset);
            var ver = dataView.getInt16(verOffset);
            var op = dataView.getUint32(opOffset);
            var seq = dataView.getUint32(seqOffset);
            switch (op) {
                case 8:
                    console.log("心跳？");
                    break;
                case 3:
                    console.log('online='+dataView.getInt32(16));
                    break;
                case 5:
                    var packetView = dataView;
                    var msg = data;
                    var msgBody;
                    for (var offset = 0; offset < msg.byteLength; offset += packetLen) {
                        packetLen = packetView.getUint32(offset);
                        headerLen = packetView.getInt16(offset + headerOffset);
                        msgBody = msg.slice(offset + headerLen, offset + packetLen);
                        /*if (!msgBody)
                            textDecoder = getDecoder(false);
                            msgBody = textEncoder(msg.slice(offset + headerLen, offset + packetLen));
                        }*/
                        //console.log("packetLen="+packetLen+"  headerLen="+headerLen);
                        //console.log(msgBody);
                        var bjson=JSON.parse(utf8decoder.decode(msgBody));
                        if(bjson.cmd=="DANMU_MSG"){
                            // kaorouman里为弹幕消息，可自己根据需要进行过滤
                            // 调用danmudiv.text(" 传入字符串 ");可以显示在屏幕
                            var kaorouman= bjson.info[1]
                            //console.log(kaorouman);
                            //danmudiv.text(kaorouman);
                            if(kaorouman.indexOf("【") != -1){
                                danmudiv.text(kaorouman);
                                //暂时不使用定时器清除字幕，因为好像会堵塞程序，造成字幕显示缓慢
                                /*clearTimeout(clearDanmu);
                                clearDanmu=setTimeout(function(){
                                    danmudiv.text(" ");
                                    console.log("定时器触发");
                                },3000);*/
                            }
                        }
                    }
                    break;
            }
        }
    });
}

