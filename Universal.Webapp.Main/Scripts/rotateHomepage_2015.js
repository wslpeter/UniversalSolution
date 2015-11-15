function rotateComp(_obj, _imgArray, _linkArray){

	var currentHomeTopImgNum=0;
	var currentHomeTopImgSt="F";
	var canvasWidth=_obj.offsetWidth;//画布大小
	var canvasPositionTemp=canvasWidth;//画布临时值，用来计算位置
	var isMoveable=1;//是否可以滚动?为1时可以，滚动时变0，滚动结束变1
	var maxObjLength=5; 

	var rotatePrev=document.getElementById("rotatePrev");//后退
	var rotateNext=document.getElementById("rotateNext");//前进按钮
	var rotateExtra=document.getElementById("rotateExtra");
	var rotateImage1=document.getElementById("rotateImage1");
	var rotateImage2=document.getElementById("rotateImage2");
	var rotateImageLink1=document.getElementById("rotateImageLink1");
	var rotateImageLink2=document.getElementById("rotateImageLink2");
	var rotateImageLink= document.getElementById("rotateImageLink");//可以点击跳转的link

	var rotateControl=document.getElementById("rotateControl");//控制层，包含左右箭头按钮

	var rotateImg1=document.getElementById("rotateImg1");//滚动容器
	var rotateImg2=document.getElementById("rotateImg2");


	rotateImage2.style.backgroundImage="url("+_imgArray[0]+")";
	rotateImage1.style.backgroundImage="url("+_imgArray[1]+")";
	rotateImageLink2.href=_linkArray[0];
	rotateImageLink1.href=_linkArray[1];
	rotateImageLink.href=_linkArray[0];

	function $ro_preloadImages() { //v3.0预读图片
		var d=document; if(d.images){ if(!d.$ro_p) d.$ro_p=new Array();
		var i,j=d.$ro_p.length,a=$ro_preloadImages.arguments; for(i=0; i<a.length; i++)
		if (a[i].indexOf("#")!=0){ d.$ro_p[j]=new Image; d.$ro_p[j++].src=a[i];}}
	}
	for (i=0; i<_imgArray.length ; i++) {
		$ro_preloadImages(_imgArray[i]);
	}


	var tempPic;
	function $ro_changePicPlay(st) { //触发单次滚动的函数
		if(st!=currentHomeTopImgSt){
			$ro_getHomeTopDataChangeDirection(st);
		}
		currentHomeTopImgSt=st;
		

		if(currentHomeTopImgSt=="F"){
			canvasPositionTemp=canvasWidth;
		currentHomeTopImgNum++;
			if(currentHomeTopImgNum>=_imgArray.length){currentHomeTopImgNum=0; }
		}
		if(currentHomeTopImgSt=="B"){
			canvasPositionTemp=0-canvasWidth;
			currentHomeTopImgNum--;
			if(currentHomeTopImgNum<0){currentHomeTopImgNum=_imgArray.length-1; }
		}
		clearInterval(tempPic);
		
		if(currentHomeTopImgSt=="F"){canvasPositionTemp=canvasWidth;}
		if(currentHomeTopImgSt=="B"){canvasPositionTemp=0-canvasWidth;}
		rotateImg1.style.left = canvasPositionTemp + "px";
		rotateImg2.style.left = 0;
		
		tempPic=setInterval ($ro_changePicProcess, 30);

	}

	function $ro_changePicProcess() {//基本的滚动处理公式 $ro_changePicPlay中调用
		canvasPositionTemp-= canvasPositionTemp/3;
		rotateImg1.style.left=canvasPositionTemp + "px" ;
		if(currentHomeTopImgSt=="F"){rotateImg2.style.left=canvasPositionTemp - canvasWidth + "px" ;}
		if(currentHomeTopImgSt=="B"){rotateImg2.style.left=canvasPositionTemp + canvasWidth + "px" ;}
		if (canvasPositionTemp<6&&canvasPositionTemp>-6){
			clearInterval(tempPic);//滚动停止点，以下为处理程序
			isMoveable=1;
			rotateImage2.style.backgroundImage="url("+_imgArray[1]+")";
			rotateImage1.style.backgroundImage="url("+_imgArray[0]+")";
			rotateImageLink2.href=_linkArray[0];
			rotateImageLink1.href=_linkArray[1];
			rotateImageLink.href=_linkArray[0];

			if(currentHomeTopImgSt=="F"){
				tempNum=currentHomeTopImgNum+1;
				if(tempNum>=_imgArray.length){tempNum=0}
			}
			if(currentHomeTopImgSt=="B"){
				tempNum=currentHomeTopImgNum-1;
				if(tempNum<0){tempNum=_imgArray.length-1}
			}
			rotateImage2.style.backgroundImage="url("+_imgArray[currentHomeTopImgNum]+")";
			rotateImage1.style.backgroundImage="url("+_imgArray[tempNum]+")";
			rotateImageLink2.href=_linkArray[currentHomeTopImgNum];
			rotateImageLink1.href=_linkArray[tempNum];
			rotateImageLink.href=_linkArray[currentHomeTopImgNum];

			if(currentHomeTopImgSt=="F"){canvasPositionTemp=canvasWidth;}
			if(currentHomeTopImgSt=="B"){canvasPositionTemp=0-canvasWidth;}
			rotateImg1.style.left=canvasWidth + "px" ;
			rotateImg2.style.left=0;

			//准备播放视频
			video_play();
		}
	}

	function $ro_getHomeTopDataChangeDirection(st){//设置改变滚动方向时呈现的图片和链接(滚动开始时就完成改变)
		if(st=="B"){
			tempNum=currentHomeTopImgNum-1;
			if(tempNum<0){tempNum=_imgArray.length-1}

			rotateImage1.style.backgroundImage="url(" +$ro_img[tempNum]+ ")";
			rotateImageLink1.href=$ro_link[tempNum];
			rotateImageLink.href=$ro_link[tempNum];
		}
		if(st=="F"){
			tempNum=currentHomeTopImgNum+1;
			if(tempNum>=_imgArray.length){tempNum=0}

			rotateImage1.style.backgroundImage="url(" +$ro_img[tempNum]+ ")";
			rotateImageLink1.href=$ro_link[tempNum];
			rotateImageLink.href=$ro_link[tempNum];
		}
	}

	var tempRoll;
	function $ro_homeTopDataPlay(st){//启动整个程序滚动
		st=st||currentHomeTopImgSt;
		clearInterval( tempRoll );
		tempRoll=setInterval(function(){
			$ro_changePicPlay(st);
		},7500);
	}
	function $ro_changePicPause(){//暂停整个程序滚动
		clearInterval( tempRoll )
	}


	//$ro_homeTopDataPlay("F") ;//窗口加载后启动程序
	//视频初始化
	var rotateExtra=checkElement( document.getElementById("rotateExtra") );
	var videoSkip=checkElement( document.getElementById("videoSkip") );
	if(typeof(myVideo_html5_api)!="undefined" ){
		myVideo_html5_api.onended =function(){ myPlayer.load(); } //视频结束后立即显示poster（此事件设置在myPlayer上无效）
		myVideo_html5_api.onplay =function(){ $ro_changePicPause(); }
	}
	video_play();//窗口加载后启动一下视频

	//----------------以下开始是事件定义---------------------
	if(SysPC == true){//events on PC
		addEvent(rotateNext, "click", function(){
			if(isMoveable==1) {
				video_hide();//v
				$ro_homeTopDataPlay("F");
				$ro_changePicPlay("F");
				isMoveable=0;
			}
		} );

		addEvent(rotatePrev, "click", function(){
			if(isMoveable==1) {
				video_hide();//v
				$ro_homeTopDataPlay("B");
				$ro_changePicPlay("B");
				isMoveable=0;
			}
		} );

		addEvent(window, "resize", function(){//窗口缩放后延时计算一次宽度
			setTimeout( function(){
				canvasWidth=_obj.offsetWidth;
			}, 800);
		});
		addEvent(window, "load", function(){//解决IE78中第一次加载宽度不对的问题
			canvasWidth=_obj.offsetWidth;
		});

		addEvent(rotateControl, "mousewheel", function(event){
			var event=event || window.event;
			event.preventDefault();
			// if (event && event.preventDefault) {//阻止事件传播冒泡
			// 	event.stopPropagation();
			// }else if (document.all){
			// 	event.cancelBubble=true;
			// }
			if(isMoveable==1) {
				video_hide();//v
				var direct=0;
				if(event.wheelDelta){//IE/Opera/Chrome
					direct = event.wheelDelta;
				}else if(event.detail){//Firefox
					direct = event.detail;
				}
				if(direct>0){
					$ro_homeTopDataPlay("B");
					$ro_changePicPlay("B");
				} else {
					$ro_homeTopDataPlay("F");
					$ro_changePicPlay("F");
				}
				isMoveable=0;
			}
		});

	}

	if(SysPC == false){//events on Mobile
		var touchValue = {x:5,y:5,sx:0,sy:0,ex:0,ey:0};//initialize the touch values

		addEvent(rotateControl, "touchstart", function(event){
			var event=event || window.event;
			touchValue.sx = event.targetTouches[0].pageX;
			touchValue.sy = event.targetTouches[0].pageY;
			touchValue.ex = touchValue.sx;
			touchValue.ey = touchValue.sy;
			$ro_changePicPause();
		});

		addEvent(rotateControl, "touchmove", function(event){
			var event=event || window.event;
			event.preventDefault();
			touchValue.ex = event.targetTouches[0].pageX;
			touchValue.ey = event.targetTouches[0].pageY;
		});

		addEvent(rotateControl, "touchend", function(event){
			var event=event || window.event;
			var changeX = touchValue.ex - touchValue.sx;
			var changeY = touchValue.ey - touchValue.sy;
			//console.log("X:"+changeX+" Y:"+changeY);
			if(Math.abs(changeX)>Math.abs(changeY)&&Math.abs(changeX)>=touchValue.x){
				//console.log("try"+currentHomeTopImgNum);
				if(changeX > 0) {//to right
					$ro_changePicPlay('B'); 
					$ro_homeTopDataPlay();
				} else {//to left
					$ro_changePicPlay('F'); 
					$ro_homeTopDataPlay();
				}
			}
			window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); 
			$ro_homeTopDataPlay();
		});
	}//end if

	//视频设置
	addEvent(videoSkip, "click", function(){
		$ro_homeTopDataPlay("F");
		$ro_changePicPlay("F");
	});
	addEvent(checkElement("myVideo"), "click", function(){
		$ro_changePicPause();
	});
	function video_play(){
		if(currentHomeTopImgNum==0){//第一帧的时候播放视频
			rotateExtra.style.display="block";
			rotateExtra.style.opacity=1;
			if(SysIe>8){
				myPlayer.autoplay(false);//第一次打开会自动播放，以后就不会，显示poster先
			}

		}else{
			if(SysIe>8){
				if(myPlayer.ended()) { 
					myPlayer.load();
				}//如果结束了，显示poster
				else { myPlayer.pause(); } //否则暂停
			}

			rotateExtra.style.opacity=0;
			setTimeout(function(){rotateExtra.style.display="none";} , 250);//延后消失

		}
	}
	function video_hide(){
		if(currentHomeTopImgNum==0){ //第一帧移走前先去掉视频层
			if(SysIe>8){
				if(myPlayer.ended()) { 
					myPlayer.load();
				}//如果结束了，显示poster
				else { myPlayer.pause(); } //否则暂停
			}
			rotateExtra.style.opacity=0;
			setTimeout(function(){rotateExtra.style.display="none";} , 250);//延后消失
		}
	}

}