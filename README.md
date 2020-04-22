# jsbilibiliDanmu
基于油猴的的在浏览器上直接运行的直播弹幕获取脚本，并选中特定弹幕显示屏幕（没错，就是把vtb直播同传man的烤的肉显示在屏幕）

### [另一个基于go的弹幕获取客户端传送门](https://github.com/sirodeneko/gobilibiliDanmu)


## 开始使用
1. 油猴直接安装  
    [传送门](https://greasyfork.org/zh-CN/scripts/400941-bilibili%E7%9B%B4%E6%92%AD%E7%83%A4%E8%82%89man%E5%AD%97%E5%B9%95%E6%98%BE%E7%A4%BA)
2. 复制danmu.js内容 右键油猴图标创建新得脚本删除原来的，粘贴代码，保存。
  

3. 自定义修改
```
//代码第36行
danmudiv.css({
    "height":"50px",
    "min-width":"100px",
    "width":$("#live-player-ctnr").width(),
    "magin":"0 auto",
    "position":"absolute",
    "left":"0px",
    "bottom":"28px",//修改此数值改变字幕距底部的高度
    "z-index":"99",
    "color": "red",//修改此处改变字幕颜色 附上颜色链接 http://bbs.bianzhirensheng.com/color01.html 支持英文单词 和十六进制`如#ef5b9c`
    "font-size": "25px",//修改此处改变字体大小
    "text-align":"center",
});
```


  ![image.png](https://i.loli.net/2020/04/15/I1OQEcVUHjbMreT.png)