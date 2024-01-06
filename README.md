## ApiTest
一个简单接口测试工具
### 请求方式
* Ajax,即通过XMLHttpRequest提交数据
* Form表单,`<form>`表单元素,通过点击`type='submit'`的按钮提交数据
* Fetch,是es6最新的方法，可参见MDN的[Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
* Beacon,`navigator.sendBeacon()`方法,可参见MDN的[Beacon API](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon)
### Content-Type
即请求头中Content-Type的值
### 数据内容
Ajax中的XMLHttpRequest#send方法传入内容类型,Fetch中body的内容类型
### 跨域授权
XMLHttpRequest#withCredentials是否为true,如果跨域请求需要设置这个属性
### 书签
如将地址`http://xxx/apitest/#action=http://i.i:8080/TestJavaWeb/testService/sayOK`保存为书签,下次打开即可调试`http://i.i:8080/TestJavaWeb/testService/sayOK`接口
### 为什么要用它
postman等工具很好用,为什么还要用它呢?
* 浏览器使用环境:postman并不是浏览器环境,有时候浏览器与软件环境还是有区别的(如跨域)
* 支持多种请求方式:swagger-ui并不方便自定义调试(如跨域,自定义数据,数据编码等)
* 轻量级:postman是安装软件,功能多,但简单调试没必要
### 如何使用
访问在线网页,或者拷贝到你的项目中,都可以