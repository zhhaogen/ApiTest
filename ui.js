if(window["console"]===undefined){
    //兼容ie6
    window["console"]={
        log:function(){}
    }; 
}
/**
 * document.getElementById
 * @param {str} str 
 * @returns 
 */
function id(str){
	return document.getElementById(str);
}
/**
 * 一组HTML元素管理
 */
function PanelGroup(){
    var panels=arguments;
    var that=this;
    /**
     * 隐藏全部元素
     */
    that.hideAll=function(){
        for(var i=0;i<panels.length;i++){
            panels[i].style.display="none";
        }
    };
    /**
     * 仅显示指定内容
     */
    that.show=function(){
        that.hideAll();
        var showPanels=arguments;
        for(var i=0;i<showPanels.length;i++){
            showPanels[i].style.display="";
        }
    };
	/**
	 * 显示全部
	 */
	that.showAll=function(){
		for(var i=0;i<panels.length;i++){
            panels[i].style.display="";
        }
	}
} 
/**
 * 单选框组管理
 */
function RadioPanelGroup(container) {
	var radioEles=container.getElementsByTagName("input");
	var that=this;
	/**
     * 隐藏全部元素
     */
    that.hideAll=function(){
        for(var i=0;i<radioEles.length;i++){
            radioEles[i].parentElement.style.display="none";
        }
    };
    /**
     * 仅显示指定内容
     */
    that.show=function(){
        that.hideAll();
        var showValues=Array.from(arguments);
		for(var i=0;i<radioEles.length;i++){
			var radioEle=radioEles[i];
			if(showValues.indexOf(radioEle.value)===-1){
				continue;
			}
            radioEle.parentElement.style.display="";
        }
    };
	/**
	 * 显示全部
	 */
	that.showAll=function(){
        for(var i=0;i<radioEles.length;i++){
            radioEles[i].parentElement.style.display="";
        }
    };
}
/**
 * 返回选中的input元素
 * @param {string} name 
 */
function getCheckElement(name){
	if(name==""){
		return;	
	}
   var eles=document.body.getElementsByTagName("input");
   for(var i=0;i<eles.length;i++){
       var ele=eles[i];
       if(ele.name==name&&ele.checked){
         return ele;
       }
   }
}
/**
 * 返回选中的input元素的值
 * @param {string} name 
 */
function getCheckElementValue(name){
	var ele=getCheckElement(name);
	if(ele!=null){
		return ele.value;
	} 
}
/**
 * 设置选中input元素
 * @param {string} name 
 * @param {string} value 
 */
function setCheckElementValue(name,value){
    var eles=document.body.getElementsByTagName("input");
    for(var i=0;i<eles.length;i++){
        var ele=eles[i];
        if(ele.name==name){
          if(ele.value==value){
            ele.checked=true;
          }else{
            ele.checked=false;
          }
        }
    }
}
/**
 * Api方法切换
 */
function onApiChange(){
	var pg=new PanelGroup(methodPanel,targetPanel,enctypePanel,contentTypePanel,responseTypePanel,corsPanel,fetchModelPanel,fetchResponseTypePanel,dataTypePanel,headerListPanel,dataListPanel,responsePanel,resultPanel,resultFramePanel);
	var api=getCheckElementValue("api"); 
	if(api=="ajax")
	{
		pg.show(methodPanel,contentTypePanel,responseTypePanel,corsPanel,dataTypePanel,headerListPanel,dataListPanel,responsePanel,resultPanel);
	}else if(api=="form")
	{
		pg.show(methodPanel,targetPanel,enctypePanel,dataListPanel,resultFramePanel); 
        onTargetChange();
	}else if(api=="fetch")
	{
		pg.show(methodPanel,fetchModelPanel,fetchResponseTypePanel,dataTypePanel,headerListPanel,dataListPanel,responsePanel,resultPanel);
	}else if(api=="beacon")
	{
		pg.show(dataTypePanel,dataListPanel,responsePanel);
		setCheckElementValue("method","get");
	}
	onMethodChange();
}
/**
 * 请求方法切换
 */
function onMethodChange(){
	var api=getCheckElementValue("api"); 
	var rg=new RadioPanelGroup(dataTypePanel);

	if(api=="ajax"||api=="fetch"){
		var method=getCheckElementValue("method");
		if(method=="get"||method=="delete"){
			//隐藏formdata和blob
			rg.show("kv","text");
			var dataType=getCheckElementValue("dataType"); 
			if(!(dataType=="kv"||dataType=="text")){
				setCheckElementValue("dataType","kv");
			}
		}else{
			rg.showAll();
		} 
	}else if(api=="form"){
		rg.show("formData");
		setCheckElementValue("dataType","formData");
	}else if(api=="beacon"){
		//隐藏formdata和blob
		rg.show("kv","text");
		var dataType=getCheckElementValue("dataType"); 
		if(!(dataType=="kv"||dataType=="text")){
			setCheckElementValue("dataType","kv");
		}
	}  
	
	onDataTypeChange();
}
/**
 * 数据内容切换
 */
function onDataTypeChange(){
	var pg=new PanelGroup(dataKvListBtns,dataKvList,dataFormListBtns,dataFormList,dataText,dataFile);
	var dataType=getCheckElementValue("dataType");
	if(dataType=="kv"){
		pg.show(dataKvListBtns,dataKvList);
	}else if(dataType=="formData"){
		pg.show(dataFormListBtns,dataFormList);
	}else if(dataType=="text"){
		pg.show(dataText);
	}else if(dataType=="blob"){
		pg.show(dataFile);
	}
}
/**
 * form打开位置切换
 */
function onTargetChange(){
    var target=getCheckElementValue("target");
    if(target=="resultFrame"){
        resultFramePanel.style.display="";
    }else if(target=="_blank"){
        resultFramePanel.style.display="none";
    }
}
/**
 * 添加请求头
 */
function addHeaderItem(){
	addKvItem(headerList);
}
/**
 * 添加kv数据
 */
function addKvDataItem(){
	addKvItem(dataKvList);
}
/**
 * 添加表单数据
 */
 function addFormDataItem(){
	addKvItem(dataFormList);
}
/**
 * 添加表单文件
 */
 function addFormFileItem(){
	addKvItem(dataFormList,"file");
}
/**
 * 添加kv值输入元素
 * @param {HTMLElement} panel 父级元素
 *  @param {string} inputType 值类型
 */
function addKvItem(panel,inputType){
	var index=0;
	if(panel.children.length>0)
	{
		var lastElementChild=panel.children[panel.children.length-1];
		index=parseInt(lastElementChild.getAttribute("data-index")); 
	}  
	index=index+1;
	if(inputType==null){
		inputType="text";
	}
	var itemEle=document.createElement("div");  
	var nameLabelEle=document.createElement("label"); 
	nameLabelEle.innerHTML="名称:"; 
	itemEle.appendChild(nameLabelEle); 
	var nameInputEle=document.createElement("input"); 
	nameInputEle.type="text";
	nameInputEle.setAttribute("placeholder","key"+index);
	nameInputEle.setAttribute("title","key"+index);
	itemEle.appendChild(nameInputEle);
	var valueLabelEle=document.createElement("label");
	valueLabelEle.innerHTML="值:";
	itemEle.appendChild(valueLabelEle);
	var valueInputEle=document.createElement("input");
	valueInputEle.type=inputType;
	valueInputEle.setAttribute("placeholder","value"+index);
	valueInputEle.setAttribute("title","value"+index);
	itemEle.appendChild(valueInputEle);
	var deleteBtnEle=document.createElement("button");
	deleteBtnEle.innerHTML="删除"; 
	itemEle.appendChild(deleteBtnEle);
	itemEle.setAttribute("data-index",index);
	panel.appendChild(itemEle);
	deleteBtnEle.onclick=function(){
		panel.removeChild(itemEle);
	};
}
/**
 * 执行操作
 */
function doSubmit(){
	var api=getCheckElementValue("api");
    if(api=="ajax")
	{
		doAjax();
	}else if(api=="form")
	{
		doForm();
	}else if(api=="fetch")
	{
		doFetch();
	}else if(api=="beacon")
	{
		doBeacon();
	}
}
/**
 * 清空结果
 */
function clearResult(){
	resultText.value="";
	jsonResultPanel.style.display="none";
	id("resultFrameEle").style.display="none";
	responseText.innerHTML="";
}
/**
 * 记录响应信息
 * @param {string} msg 
 */
function addResponse(msg,color){
	var ele=document.createElement("div");
	ele.innerText=msg;
	if(color!=null){
		ele.style.color=color;
	} 
	responseText.appendChild(ele);
}
document.body.onload=function()
{
	locationText.value=location.href;
	if(location.hash!="")
	{
		var hashObj={};
		var hash=location.hash.substring(1);
		var tmpHashs=hash.split("&");
		for(var i=0;i<tmpHashs.length;i++)
		{
			var kvs=tmpHashs[i].split("=");
			hashObj[kvs[0]]=kvs[1];
		}
		if(hashObj["action"]!=null)
		{
			actionText.value=hashObj["action"];
		}
	} 
	onApiChange(); 
};