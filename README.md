# jsbilibiliDanmu
基于油猴的的在浏览器上直接运行的直播弹幕获取脚本，并选中特定弹幕显示屏幕（没错，就是把vtb直播同传man的烤的肉显示在屏幕）

### [另一个基于go的弹幕获取客户端传送门](https://github.com/sirodeneko/gobilibiliDanmu)


## 开始使用
1. 方法一油猴直接安装 
    [传送门](https://greasyfork.org/zh-CN/scripts/400941-bilibili%E7%9B%B4%E6%92%AD%E7%83%A4%E8%82%89man%E5%AD%97%E5%B9%95%E6%98%BE%E7%A4%BA)
2. 方法二（不推荐，因为无法拥有后继更新）复制danmu.js内容 右键油猴图标创建新得脚本删除原来的，粘贴代码，保存。

3. 使用方法
可通过屏幕左上角按钮修改相关属性 

4. 自定义修改
```
//代码第32行
var zimuBottom="28px";//修改此数值改变字幕距底部的高度
var zimuColor="red";//修改此处改变字幕颜色
var zimuFontSize="25px";//修改此处改变字体大小

var IsSikiName=0;// 1为启动同传man过滤 0为不启动，默认不启动
//如果要启动同传man过滤，启动后需要修改SikiName里括号里的内容
//如SikiName=["斋藤飞鳥Offcial","小明1","小明2"],则只会显示名字为，斋藤飞鳥Offcial，小明1，小明2的同传
//此变量为字符串数字，元素为字符串变量，元素内容由 , 分隔(不是中文下的 ，)
var SikiName=[""];
```


  ![image.png](https://i.loli.net/2020/04/15/I1OQEcVUHjbMreT.png)


### 谷歌浏览器已经上传了，可直接下载（应该可以使用吧）  
  ```
  链接: https://pan.baidu.com/s/1vI2vXq3mkYe4hO7YCKMGCQ 提取码: s5ih
  ```
###   这是油猴的安装包（国内搬运）  
  [传送门](https://www.xmpojie.com/697.html)
