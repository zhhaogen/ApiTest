/**
 * ajax提交
 */
function doAjax(){
    if(window["XMLHttpRequest"]==undefined){
        doActiveX();
        return;
    }
    console.log("Ajax 提交"); 
    //清空结果
    clearResult();
    //提交数据
    var data=getSubmitData();
    console.log("提交数据",data); 
    var method=getCheckElementValue("method");
	var url=actionText.value;
    var withCredentials=withCredentialsCheck.checked;
    var responseType=getCheckElementValue("responseType");
    var contentType=getCheckElementValue("contentType");
    var headers=getHeaderList();

    var req= new XMLHttpRequest();
    req.withCredentials=withCredentials;  
	if((method=="get"||method=="delete")&&isNoEmpty(data))
	{
		req.open(method,url+"?"+data); 
	}else
	{
		req.open(method,url);
	}		 
	if(isNoEmpty(responseType))
	{
		req.responseType =responseType;
	} 
	if(isNoEmpty(contentType))
	{ 
		req.setRequestHeader("Content-Type",contentType);
	} 
	for(var i=0;i<headers.length;i++)
	{
		var item=headers[i]; 	
		req.setRequestHeader(item.name,item.value);			
	}
    req.onerror = function (err)
	{
		console.log("网络错误",err); 
		responseText.innerText="err.message : "+err.message;
		responseText.style.color="red";
		result.value="";
	};
	req.onload = function ()
	{
		console.log(req);
        var contentTypeHead=req.getResponseHeader("Content-Type");
        if(req.status!=200)
        { 
            addResponse("status : "+req.status,"red");
            addResponse("statusText : "+req.statusText,"red");
            addResponse("Content-Type : "+contentTypeHead,"red"); 
        }else
        { 
            addResponse("status : "+req.status,"green");
            addResponse("statusText : "+req.statusText,"green");
            addResponse("Content-Type : "+contentTypeHead,"green");
        }  

        if(req.response==null)
        {
            resultText.value="null";
            return;
        } 
        if(typeof(req.response)=="string")
        {
            resultText.value=req.response; 
            if(isNoEmpty(contentTypeHead)&&contentTypeHead.startsWith("application/json"))
            {
                doFormatJson();
            }
            return;
        }
        if(req.response instanceof Blob)
        { 
            resultText.value="Blob{size:"+req.response.size+",type:\""+req.response.type+"\"}";
        }else if(req.response instanceof ArrayBuffer)
        { 
            resultText.value="ArrayBuffer{byteLength:"+req.response.byteLength+"}";
        }else if(req.response instanceof Document)
        {
            resultText.value=req.response.constructor.name+"{body:"+req.response.body.innerHTML+"}";
        }else if(typeof(req.response)=="object")
        {
            resultText.value=JSON.stringify(req.response); 
            doFormatJson();
        }else
        { 
            resultText.value=req.response;
        } 
	};
    if(data==null||method=="get"||method=="delete")
	{
		req.send();
	}else
	{
		req.send(data);
	}
}
/**
 * ie6的ajax
 */
function doActiveX(){
    responseText.innerHTML="";
	resultText.value=""; 
    jsonResultPanel.style.display="none";
    //提交数据
    var data=getSubmitData();  
    var method=getCheckElementValue("method");
	var url=actionText.value;  
    var contentType=getCheckElementValue("contentType");
    var headers=getHeaderList();
    var req=new ActiveXObject("Microsoft.XMLHTTP");
    if((method=="get"||method=="delete")&&isNoEmpty(data))
	{
		req.open(method,url+"?"+data); 
	}else
	{
		req.open(method,url);
	}
    if(isNoEmpty(contentType)){
        req.setRequestHeader("Content-Type",contentType);
    }
    for(var i=0;i<headers.length;i++)
	{
		var item=headers[i]; 	
		req.setRequestHeader(item.name,item.value);			
	}  
	req.onreadystatechange = function ()
	{   
        if(req.readyState!=4){
            addResponse("readyState : "+req.readyState);   
            return;
        }  
        var contentTypeHead=req.getResponseHeader("Content-Type");
        if(req.status!=200)
        {
            addResponse("readyState : "+req.readyState,"red");
            addResponse("status : "+req.status,"red");
            addResponse("statusText : "+req.statusText,"red");
            addResponse("Content-Type : "+contentTypeHead,"red");
        }else
        {
            addResponse("readyState : "+req.readyState,"green");
            addResponse("status : "+req.status,"green");
            addResponse("statusText : "+req.statusText,"green");
            addResponse("Content-Type : "+contentTypeHead,"green");
        } 
        resultText.value=req.responseText;
        if(contentTypeHead&&contentTypeHead.startsWith("application/json")){
            doFormatJson();
        }  
	};
    if(data==null||method=="get"||method=="delete")
	{
		req.send();
	}else
	{
		req.send(data);
	}
}
/**
 * 表单提交
 */
function doForm(){
    console.log("Form 提交"); 
    clearResult();
    var method=getCheckElementValue("method");
	var url=actionText.value;  
    var enctype=getCheckElementValue("enctype");
    var target=getCheckElementValue("target");

    dataFormList.setAttribute("action",url);
	dataFormList.setAttribute("method",method);
    if(isNoEmpty(enctype))
	{
		dataFormList.setAttribute("enctype",enctype); 
	}else
	{
		dataFormList.removeAttribute("enctype"); 
	}
    dataFormList.setAttribute("target", target); 
    //生成表单元素
    var children=dataFormList.children;
    if(children.length>0){ 
        for(var i=0;i<children.length;i++){ 
            var itemEle=children[i]; 
            var inputsEle=itemEle.getElementsByTagName("input");
            var key=inputsEle[0].value; 
            if(isNoEmpty(key)){
                inputsEle[1].setAttribute("name",key);
            }else{
                inputsEle[1].removeAttribute("name");
                continue;
            } 
        }
    }
    dataFormList.submit();
    id("resultFrameEle").style.display="";
}
/**
 * fetch提交
 */
function doFetch(){
    console.log("Fetch 提交");
    clearResult(); 
    var method=getCheckElementValue("method");
	var url=actionText.value;  
    var fetchMode=getCheckElementValue("fetchMode");
    var fetchResponseType=getCheckElementValue("fetchResponseType");
    var data=getSubmitData(); 
    var headers=getHeaders();

    var option={"method":method};
    if(isNoEmpty(fetchMode)){
        option["mode"]=fetchMode;
    } 
    if(data!=null){
        if((method=="get"||method=="delete")&&isNoEmpty(data)){
            url=url+"?"+data;
        }else{
			option["body"]=data; 
        }       
    } 
    if(headers!=null){
        option["headers"]=headers;
    } 
    console.log("请求数据",option);
    var request = new Request(url, option);
    fetch(request).then(function(response){
        addResponse("status : "+response.status,"green"); 
        if(fetchResponseType=="json"){
            return response.json();
        } 
        if(fetchResponseType=="formData"){
            return response.formData();
        }
        if(fetchResponseType=="blob"){
            return response.blob();
        }
        if(fetchResponseType=="arrayBuffer"){
            return response.arrayBuffer();
        }
        return response.text();
    }).then(function(response){
        console.log("返回数据",response);
        if(response==null)
		{
			responseText.value="null";
            return;
		} 
        if(fetchResponseType=="json")
        {
            resultText.value=JSON.stringify(response); 
            doFormatJson();
            return;
        }
        if(fetchResponseType=="blob")
        { 
            resultText.value="Blob{size:"+response.size+",type:\""+response.type+"\"}";
            return;
        }
        if(fetchResponseType=="arrayBuffer")
        { 
            resultText.value="ArrayBuffer{byteLength:"+response.byteLength+"}";
        }
        if(fetchResponseType=="formData")
        {
            let keys=response.keys();
            let obj={};
            for(let key of keys){
                obj[key]=response.getAll(key);
            }
            resultText.value=JSON.stringify(obj);
            doFormatJson();
        }
        resultText.value=response;
    }).catch(function(err){
        addResponse("err.message : "+err.message,"red");
    });
}
/**
 * beacon提交
 */
function doBeacon(){
    console.log("Beacon 提交"); 
    clearResult();
    var url=actionText.value; 
    var data=getSubmitData();  
    console.log("请求数据",data);
    var ret=navigator.sendBeacon(url,data);
    addResponse("执行结果:"+ret,"green");
}
/**
 * 返回请求头对象
 */
function getHeaders(){
    var obj={};
    var arr=getHeaderList();
    for(var i=0;i<arr.length;i++){
        var item=arr[i];
        obj[item.name]=item.value;
    }
    return obj;
}
/**
 * 返回请求头列表
 * @returns {Array}
 */
function getHeaderList(){
    var arr=[];
    var children=headerList.children;
    for(var i=0;i<children.length;i++){ 
        var itemEle=children[i]; 
        var inputsEle=itemEle.getElementsByTagName("input");
        var key=inputsEle[0].value; 
        if(!isNoEmpty(key)){
            continue;
        }
        var value=inputsEle[1].value; 
        arr.push({
            "name":key,
            "value":value
        }); 
    }
    return arr;
}
/**
 * 获取提交数据
 */
function getSubmitData(){
    var dataType=getCheckElementValue("dataType");
    var data; 
	if(dataType=="kv"){ 
        var children=dataKvList.children;
        if(children.length>0){
            data="";
            for(var i=0;i<children.length;i++){
                if(i!=0){
                    data=data+"&";
                }
                var itemEle=children[i]; 
                var inputsEle=itemEle.getElementsByTagName("input");
                var key=inputsEle[0].value; 
                if(!isNoEmpty(key)){
                    continue;
                }
                var value=inputsEle[1].value; 
                data=data+encodeURIComponent(key)+"="+encodeURIComponent(value); 
            }
        }
        return data; 
	} 
    if(dataType=="text"){
		data=dataText.value;
        return data;
	}
    if(dataType=="blob"){
		data=dataFile.files[0];
        return data;
	}
    if(dataType=="formData"){
        data=new FormData();
		var children=dataFormList.children;
        if(children.length>0){ 
            for(var i=0;i<children.length;i++){ 
                var itemEle=children[i]; 
                var inputsEle=itemEle.getElementsByTagName("input");
                var key=inputsEle[0].value; 
                if(!isNoEmpty(key)){
                    continue;
                }
                if(inputsEle[1].type=="file"){
                    var files=inputsEle[1].files;
                    for(var k=0;k<files.length;k++){
                        data.append(key,files[k]);
                    } 
                }else{
                    data.append(key,inputsEle[1].value);
                }
            }
        }
        return data;
	}  
}
/**
 * 判断字符串非空
 * @param {string} str 
 */
function isNoEmpty(str){
    return str!=null&&str!="";
}