function id(idstr)
{
	return document.getElementById(idstr);
}
function makeDataStr(obj)
{
    var eles = Object.keys(obj);
    var data = "";
    for (var i = 0; i < eles.length; i++)
    {
        var ele = eles[i];
		var value=obj[ele];
		if(i!=0)
		{
			data=data+ "&";
		}
        data = data + encodeURIComponent(ele) + "=" + encodeURIComponent(value) ;
    }
    return data;
}