/*
* JavaScript Document
*
* @author tkt
*/

var CommandBase = function(){};
CommandBase.prototype.data;
CommandBase.prototype.execute = function(){};

/*
-------------------------------------------------------------------------
	Util class
-------------------------------------------------------------------------
*/


var STimer = function(obj)
{
	this.ms = obj.ms;
	this.cnt = obj.cnt;
	this.func = obj.func;
	this.compFunc = obj.compFunc;
	this.name = 'STimer';
	this.cmd = obj.cmd;
	return this;
};

STimer.prototype.id;
STimer.prototype.ms;
STimer.prototype.cnt;
STimer.prototype.func;
STimer.prototype.compFunc;
STimer.prototype.cmd;

STimer.prototype.start = function()
{
	this.id = setInterval(
		(function(obj){
			var cnt = 0;
			return function(e){
				obj.func(obj.cmd);
				if( ++cnt >= obj.cnt ){
					clearInterval(obj.id);
					obj.compFunc();
				}
			};
		})(this),
		this.ms
	);
};

STimer.prototype.stop = function(){
	clearInterval(this.id);
}

/*
---------------------------------------------------
	LOAD JSON
---------------------------------------------------
*/

var HttpRequestCommand = function(){};
HttpRequestCommand.prototype = new CommandBase();

HttpRequestCommand.prototype.data;
HttpRequestCommand.prototype.me;
var xmlHttp;
HttpRequestCommand.prototype.execute = function()
{
	var req = new XMLHttpRequest();
	
	req.onreadystatechange = function()
	{
		if(req.readyState == 4 && req.status == 200)
		{
			var json = JSON.parse(req.responseText);
			
			for (var i=0; i<json.data.length; i++)
			{
				//image pass
				var img = json.data[i].images.low_resolution.url;
				//user name
				var name = json.data[i].user.username;
				
				imgList.push(img);
				nameList.push(name);
			}
			
			//create rondom text
			var rondomTxtCommand = new RondomTxtCommand(document.getElementById('mess'),nameList[0]);
			rondomTxtCommand.execute();
			
			jsonLoadComplete();
		}
	}
	req.open('GET', 'http://www.shiruco.com/insta/proxy.php',true);
	req.send(null);
	
};

function checkStatus(){
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        alert(xmlHttp.responseText);
    }
}


/*
---------------------------------------------------
	SLIDE
---------------------------------------------------
*/

var SlideCommand = function(){};
SlideCommand.prototype = new CommandBase();
SlideCommand.prototype.execute = function(btn,d){
	
	btn.lock();
	
	var elem = document.getElementById('imgContainer');
	
	if(d==='left')
	{
		STweener(elem.style, {
			left :{from:273 , to:-306, suffix:'px'},
		},{
		  duration: 100,
		  onComplete:function(){
			imgIndex++;
			changeImgElm(imgIndex);
		
			STweener(elem.style, {
				left :{from:1000 , to:273, suffix:'px'},
			},{
			  duration: 100,
			  onComplete:function(){
				
				btn.unlock();
				
				if(imgIndex == (imgNum-1))
				{
					btnL.hide();
				}else{
					btnR.show();
				}
			}
			});
		}
		});
	}
	else
	{	
		STweener(elem.style, {
			left :{from:273 , to:1000, suffix:'px'},
		},{
		  duration: 100,
		  onComplete:function(){
			  
			imgIndex--;
			changeImgElm(imgIndex);
		
			STweener(elem.style, {
				left :{from:-306 , to:273, suffix:'px'},
			},{
			  duration: 100,
			  onComplete:function(){

				btn.unlock();
				if(imgIndex == 0)
				{
					btnR.hide();
					btnL.show();
				}else{
					btnR.show();
					btnL.show();
				}
				
			}
			});
		}
		});	
	}
	
}

/*
---------------------------------------------------
	RANDOM TXT
---------------------------------------------------
*/

var RondomTxtCommand = function(elem,str)
{
	this.elem = elem;
	this.txt1 = str;
	this.txt2 = "";
	this.randomTxt = "";
	this.textComp = "";
	this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789[]{}.,;:+=_-?/><";
	this.name = 'testFunc';
	this.counter = 0;
	return this;
};

RondomTxtCommand.prototype.elem;
RondomTxtCommand.prototype.txt1;
RondomTxtCommand.prototype.txt2;
RondomTxtCommand.prototype.alphabet;
RondomTxtCommand.prototype.randomTxt;
RondomTxtCommand.prototype.textComp;
RondomTxtCommand.prototype.counter;
RondomTxtCommand.prototype.timer;

RondomTxtCommand.prototype = new CommandBase();

RondomTxtCommand.prototype.execute = function()
{
	this.timer = new STimer({
		cnt	 : this.txt1.length,
		func : this.start,
		compFunc : this.fin,
		cmd : this,
		ms	: 30
	})
	
	this.timer.start();
	
};

RondomTxtCommand.prototype.start = function(cmd)
{
	cmd.randomTxt = "";
	
	cmd.txt2 += cmd.txt1.charAt(cmd.counter);
	

	for(var n = cmd.txt1.length - cmd.txt2.length; n > 0; n--)
	{
		cmd.randomTxt += cmd.alphabet.charAt(Math.floor(Math.random()*52));
		
	}
	
	cmd.textComp = cmd.txt2 + cmd.randomTxt;
	cmd.elem.innerHTML = cmd.textComp;
	
	cmd.counter++;	
};

RondomTxtCommand.prototype.fin = function()
{
	this.elem.innerHTML = txt2;
};

RondomTxtCommand.prototype.stop = function()
{
	this.timer.stop();
};
