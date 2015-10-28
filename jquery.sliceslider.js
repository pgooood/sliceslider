/**
 * @author Pavel Khoroshkov aka pgood
 */
(function($){$.fn.sliceslider=function(options){
var isIE7=navigator.appVersion.indexOf("MSIE 7.")!=-1
,rand=function(min,max){return Math.floor(arguments.length>1?(max-min+1)*Math.random()+min:(min+1)*Math.random());}
,settings=$.extend({
		blankDiv:$('<div style="border:0;background:none;position:absolute;padding:0;margin:0;left:auto;right:auto;bottom:auto;top:auto;overflow:visible;"></div>')
		,autorun:false
		,buttonStartSlideShow:null
		,buttonStopSlideShow:null
		,buttonNext:null
		,buttonPrev:null
		,slideShowDelay:3000
		,zIndex:1
		,captionPosition:'bottom'
		,useMethod:[
		    'blocks02'
		    ,'blocks01'
			,'verticalCol'
			,'verticalColOpposite'
			,'verticalColLouvers'
			,'horizontalCol'
			,'horizontalColOpposite'
			,'horizontalColLouvers'
		]
		,randomMethod:false
		,onchange:null
	},options)
,piece={
	$e:null,callback:null,nextPiece:null,width:null,height:null
	,setWidth:function(v){this.width=v;this.$e.css('width',v);}
	,setHeight:function(v){this.height=v;this.$e.css('height',v);}
	,setCallback:function(v){this.callback=v;}
	,setNextPiece:function(v){this.nextPiece=v;}
	,appendTo:function($e){if(this.$e)this.$e.appendTo($e);}
	,init:function(src,pos){
		this.$e=settings.blankDiv.clone();
		this.$e.css({background:'#ccc url("'+src+'") no-repeat',top:pos[0],right:pos[1],bottom:pos[2],left:pos[3]});
	}
}
,pieceSlice={
	getShowMethod:function(css,conf){return function(){
		var piece=this;
		this.$e.animate(css,conf.speed,this.callback?function(){piece.callback();}:null);
		if(this.nextPiece){
			if(conf.nextPieceDelay)window.setTimeout(function(){piece.nextPiece.show();},conf.speed*conf.nextPieceDelay);
			else piece.nextPiece.show();
		};
	};}
	,initCol:function(index,src,width,height,conf,type1,type2){
		$.extend(this,piece);
		var pos=[0,'auto','auto',0];
		switch(type1){
		case 2:
		case 0:this.setWidth=function(v){
				this.width=Math.ceil(v/conf.numPieces);
				this.$e.css({
					'width':this.width
					,'background-position':'-'+(index*this.width)+'px '+(type2?'100%':0)
					,'left':index*this.width
				});
			};
			break;
		case 3:
		case 1:this.setHeight=function(v){
				this.height=Math.ceil(v/conf.numPieces);
				this.$e.css({
					'height':this.height
					,'background-position':(type2?'100%':0)+' -'+(index*this.height)+'px'
					,'top':index*this.height
				});
			};
			break;
		};
		switch(type1){
		case 3:
		case 0:
			if(type2)pos=['auto','auto',0,0];
			this.hide=function(){
				this.$e.height(0);
				this.$e.css('opacity',0.2);
			};
			break;
		case 2:
		case 1:
			if(type2)pos=[0,0,'auto','auto'];
			this.hide=function(){
				this.$e.width(0);
				this.$e.css('opacity',0.2);
			};
			break;
		};
		this.init(src,pos);
		this.setWidth(width);
		this.setHeight(height);
		switch(type1){
		case 3:
		case 0:
			this.show=this.getShowMethod({'height':this.height,'opacity':1},conf);
			break;
		case 2:
		case 1:
			this.show=this.getShowMethod({'width':this.width,'opacity':1},conf);
			break;
		};
	}
}
,slide={
	getWidth:function(){return this.$getImg().width();}
	,getHeight:function(){return this.$getImg().height();}
	,getIndex:function(){return parseInt(this.$s.css('z-index'));}
	,setIndex:function(v){
		this.$s.css('z-index',v);
		if(isIE7){
			var parentFigure=function(e){while(e=e.parentNode)if(e.tagName.toLowerCase()=='figure')return e;}(this.$s.get(0));
			$(parentFigure).css('z-index',v);
		};
	}
	,getCaption:function(){return this.caption;}
	,setCaption:function(v){this.caption=v;}
	,getSrc:function(){return this.$getImg().attr('src');}
	,$getImg:function(){return this.$img;}
	,getImg:function(){return this.$getImg().get(0);}
	,$getFigure:function(){return this.$e;}
	,setCaption:function(e){
		if(!$(e).length)return;
		this.$caption=$(e).clone();
		this.$caption.css({'z-index':settings.zIndex+1,position:'absolute',top:'auto',right:'auto',bottom:'auto',left:'auto'});
		$(e).hide();
	}
	,showCaption:function(){
		if(!this.$caption)return;
		this.$s.append(this.$caption);
		var position=this.$caption.data('position')||settings.captionPosition;
		this.$caption.show();
		switch(position){
			case 'top':
				this.$caption.css({top:this.$caption.outerHeight()*-1,bottom:'auto',left:0,right:0});
				this.$caption.animate({top:0});
				break;
			case 'bottom':
				this.$caption.css({bottom:this.$caption.outerHeight()*-1,top:'auto',left:0,right:0});
				this.$caption.animate({bottom:0});
				break;
			case 'left':
				this.$caption.css({top:0,bottom:0,left:this.$caption.outerWidth()*-1,right:'auto'});
				this.$caption.animate({left:0});
				break;
			case 'right':
				this.$caption.css({top:0,bottom:0,right:this.$caption.outerWidth()*-1,left:'auto'});
				this.$caption.animate({right:0});
				break;
		};
		
	}
	,hideCapption:function(){
		if(!this.$caption)return;
		this.$caption.remove();
	}
	,show:function(callback){
		var $slide=this;
		this.pieces[this.pieces.length-1].setCallback(function(){
			if(callback)callback();
			$slide.showCaption();
		});
		this.pieces[0].show();
	}
	,hide:function(){
		this.hideCapption();
		for(var i=0;i<this.pieces.length;i++)
			this.pieces[i].hide();
	}
	,init:function(figure){
		this.$e=$(figure);
		this.$img=$(this.$e.find('img')[0]);
		this.$s=settings.blankDiv.clone();
		this.setCaption(this.$e.find('>figcaption'));
		this.pieces=[];
		this.callback=null;
		this.$s.css({'width':this.getWidth(),'height':this.getHeight(),'overflow':'hidden'});
		this.linkMode=this.$getImg().parent().get(0).tagName.toLowerCase()=='a';
		if(this.linkMode){
			this.getImage().parent().before(this.$s);
		}else this.$getImg().before(this.$s);
		this.initPieces();
		if(this.linkMode)for(var i=0;i<this.pieces.length;i++){
			this.pieces[i].$e.click(function($e){return function(){$e.click();}}(this.$getImg()));
			$(this.pieces[i].$e).css('cursor','pointer');
		}
	}
	,remove:function(){
		this.$s.remove();
	}
}
,slideSlice={
	initSlice:function(e,name,numClasses){
		$.extend(this,slide);
		this.initPieces=function(){
			if(this.pieces.length)return;
			eval('var conf=settings.pieces.'+name);
			var width=this.getWidth()
				,height=this.getHeight();
			for(var i=0;i<conf.numPieces;i++){
				this.pieces[i]=new conf['class'+(numClasses>1?i%numClasses:'')](i,this.getSrc(),width,height,conf);
				if(i)this.pieces[i-1].setNextPiece(this.pieces[i]);
				this.pieces[i].appendTo(this.$s);
			};
		};
		this.init(e);
	}
}
,setConf=function(name,conf){
	settings.pieces[name]=typeof(settings[name])=='object'?$.extend(conf,settings[name]):conf;
};
function slideshow($ns){
	this.slides=[];
	this.current=0;
	this.timeOutId=null;
	this.state=false;
	this.block=false;
	this.isRunning=function(){return this.state;};
	this.setCurrentSlide=function(index){
		try{
			for(var i=0;i<this.slides.length;i++)this.slides[i].setIndex(settings.zIndex-1);
			this.getSlide(index).setIndex(settings.zIndex+1);
			this.getSlide(this.current).setIndex(settings.zIndex);
			this.current=index;
		}catch(er){
			console.log('setCurrentSlide: Slide "'+index+'" not found');
		};
	};
	this.getNextSlideIndex=function(){return this.current+1==this.slides.length?0:this.current+1;};
	this.getPrevSlideIndex=function(){return this.current-1<0?this.slides.length-1:this.current-1;};
	this.getSlide=function(index){return this.slides[index];};
	this.setSlide=function(index,slide){this.slides[index]=slide;};
	this.getSlideMethod=function(){
		if(settings.randomMethod){
			var i=function(min,max){return Math.floor(arguments.length>1?(max-min+1)*Math.random()+min:(min+1)*Math.random());}(0,settings.useMethod.length-1);
			return settings.useMethod[i];
		}else{
			if(typeof(this.methodCounter)=='undefined'||this.methodCounter>=settings.useMethod.length)this.methodCounter=0;
			return settings.useMethod[this.methodCounter++];
		}
	};
	this.initSlides=function(){
		var slide;
		if(this.slides.length){
			for(var i=0;i<$ns.length;i++)this.slides[i].remove();
			this.slides=[];
		};
		for(var i=0,j=0;i<$ns.length;i++){
			if(slide=this.createSlide($ns.get(i)))
				this.slides[j++]=slide;
		};
		for(var i=0,l=this.slides.length;i<l;i++){
			this.slides[i].setIndex(i?settings.zIndex+i-1:settings.zIndex+l-1);
			$(this.slides[i].getImg()).css('visibility','hidden');
		};
		this.setCurrentSlide(0);
		this.slides[0].showCaption();
	};
	this.createSlide=function(figure,method){
		if(!method)method=this.getSlideMethod();
		return new settings.slides[method](figure);
	};
	this.showSlide=function(index,callback){
		if(this.block)return;
		var ss=this
			,slide=ss.getSlide(index)
			,zIndex=slide.getIndex()
			,isRunning=this.isRunning();
		slide.remove();
		this.slides[index]=slide=this.createSlide(slide.$e);
		slide.setIndex(zIndex);
		slide.hide();
		ss.setCurrentSlide(index);
		ss.block=true;
		if(isRunning&&!callback)ss.stop();
		slide.show(function(){
			ss.block=false;
			if(callback)callback();
			else if(isRunning)ss.start();
		});
		if(settings.onchange)settings.onchange(index);
	};
	this.start=function(){
		if(this.isRunning())return;
		this.state=true;
		var ss=this;
		(function(){
			var callback=arguments.callee;
			if(ss.isRunning())ss.timeOutId=window.setTimeout(function(){
				ss.showSlide(ss.getNextSlideIndex(),callback);
			},settings.slideShowDelay);
		})();
	};
	this.startNoTimeout=function(){
		var ss=this;
		if(!ss.isRunning())
			ss.showSlide(ss.getNextSlideIndex(),function(){ss.start(arguments.callee);});
	};
	this.stop=function(){
		if(this.timeOutId){
			window.clearTimeout(this.timeOutId);
			this.timeOutId=null;
		};
		this.state=false;
	};
	this.next=function(){
		this.showSlide(this.getNextSlideIndex());
	};
	this.prev=function(){
		this.showSlide(this.getPrevSlideIndex());
	};
	this.initSlides();
	if(settings.autorun)this.start();
};
settings.slides={};
settings.pieces={};
setConf('verticalCol',{
		'numPieces':22
		,'speed':300
		,'nextPieceDelay':0.3
	});
setConf('verticalColOpposite',{
		'numPieces':30
		,'speed':300
		,'nextPieceDelay':0.1
	});
setConf('verticalColLouvers',{
		'numPieces':20
		,'speed':300
		,'nextPieceDelay':0.3
	});
setConf('horizontalCol',{
		'numPieces':14
		,'speed':300
		,'nextPieceDelay':0.3
	});
setConf('horizontalColOpposite',{
		'numPieces':15
		,'speed':400
		,'nextPieceDelay':0.1
	});
setConf('horizontalColLouvers',{
		'numPieces':10
		,'speed':300
		,'nextPieceDelay':0.3
	});
setConf('blocks01',{
		'numPiecesH':10
		,'numPiecesV':5
		,'speed':400
		,'nextPieceDelay':0.3
	});
setConf('blocks02',{
		'numPiecesH':12
		,'numPiecesV':6
		,'speed':400
		,'nextPieceDelay':0.3
	});

settings.pieces.blocks02['class']=
settings.pieces.blocks01['class']=function(index,src,width,height,conf){
	$.extend(this,piece);
	this.setWidth=function(v){
		this.width=Math.ceil(v/conf.numPiecesH);
		this.$e.css({'width':this.width,'left':(index%conf.numPiecesH)*this.width});
	};
	this.setHeight=function(v){
		this.height=Math.ceil(v/conf.numPiecesV);
		this.$e.css({'height':this.height,'top':parseInt(index/conf.numPiecesH)*this.height});
	};
	this.show=function(){
		if(this.state)return;
		this.state=true;
		var piece=this
			,next
			,css={'width':this.width,'height':this.height,'opacity':1};
		this.$e.animate(css,conf.speed,this.callback?function(){piece.callback();}:null);
		if(this.nextPiece){
			if(!this.nextPiece.length)this.nextPiece=[this.nextPiece];
			for(var i=0;i<this.nextPiece.length;i++)if(next=this.nextPiece[i]){
				if(conf.nextPieceDelay)window.setTimeout(function(next){return function(){next.show();}}(next),conf.speed*conf.nextPieceDelay);
				else next.show();
			};
		};
	};
	this.hide=function(){
		this.$e.css({width:0,height:0,opacity:0.2});
		this.state=false;
	};
	this.init(src,pos=[0,0,'auto','auto']);
	this.setWidth(width);
	this.setHeight(height);
	this.$e.css({'background':'#fff url('+src+') no-repeat -'+((index%conf.numPiecesH)*this.width)+'px -'+(parseInt(index/conf.numPiecesH)*this.height)+'px'});
};
settings.slides.blocks01=function(e,c){
	$.extend(this,slide);
	this.initPieces=function(){
		if(this.pieces.length)return;
		var conf=settings.pieces.blocks01
			,width=this.getWidth()
			,height=this.getHeight()
			,l=conf.numPiecesH*conf.numPiecesV;
		for(var i=0;i<l;i++){
			this.pieces[i]=new conf['class'](i,this.getSrc(),width,height,conf);
			this.pieces[i].appendTo(this.$s);
		};
		for(var i=0;i<l;i++)
			if(i&&i%conf.numPiecesH)this.pieces[i-1].setNextPiece(this.pieces[i]);
	};
	this.show=function(callback){
		var $slide=this
			,conf=settings.pieces.blocks01;
		this.pieces[this.pieces.length-1].setCallback(function(){
			if(callback)callback();
			$slide.showCaption();
		});
		for(var i=0;i<conf.numPiecesV;i++)
			window.setTimeout(function(piece){return function(){piece.show();}}(this.pieces[i*conf.numPiecesH]),100*i);
	};
	this.init(e);
};
settings.slides.blocks02=function(e,c){
	$.extend(this,slide);
	this.startIndex=0;
	this.initPieces=function(){
		if(this.pieces.length)return;
		var conf=settings.pieces.blocks02
			,width=this.getWidth()
			,height=this.getHeight()
			,l=conf.numPiecesH*conf.numPiecesV
			,seq=this.getSequence(l);
		for(var i=0;i<l;i++){
			this.pieces[i]=new conf['class'](i,this.getSrc(),width,height,conf);
			this.pieces[i].appendTo(this.$s);
			this.pieces[i].hide=function(){this.$e.css({opacity:0});};
		};
		this.startIndex=seq.controlPoints(Math.round(l/16));
		var i=seq.next(),j;
		while(typeof(j=seq.next())!='undefined'){
			this.pieces[i].setNextPiece(this.pieces[j]);
			i=j;
		}
	};
	this.show=function(callback){
		var $slide=this
			,conf=settings.pieces.blocks02;
		this.pieces[this.pieces.length-1].setCallback(function(){
			if(callback)callback();
			$slide.showCaption();
		});
		for(var i=0;i<this.startIndex.length;i++)
			this.pieces[this.startIndex[i]].show();
	};
	this.getSequence=function(length){
		return new function(l){
			this.get=function(i){
				var v,j,k,l=this.ar.length,ar=[],br=0;
				do{j=rand(0,l-1);v=this.ar[j];br++;}while(i==v&&br<8);
				for(var k=0;k<l;k++)if(k!=j)ar.push(this.ar[k]);
				this.ar=ar;
				return v;
			};
			this.next=function(){return this.arRes.shift();};
			this.controlPoints=function(n){
				var i=0,v=Math.ceil(this.arRes.length/n),ar=[];
				if(v>0)while(i<this.arRes.length){ar.push(this.arRes[i]);i+=v;};
				return ar;
			};
			this.length=l;
			this.ar=[];
			this.arRes=[];
			for(var i=0;i<l;i++)this.ar.push(i);
			for(var i=0;i<l;i++)this.arRes.push(this.get(i));
		}(length);
	}
	this.init(e);
};


settings.pieces.verticalColOpposite['class0']=
settings.pieces.verticalCol['class']=function(index,src,width,height,conf){
	$.extend(this,pieceSlice);
	this.initCol(index,src,width,height,conf,0,0);
};
settings.pieces.verticalColOpposite['class1']=function(index,src,width,height,conf){
	$.extend(this,pieceSlice);
	this.initCol(index,src,width,height,conf,0,1);
};
settings.pieces.verticalColLouvers['class']=function(index,src,width,height,conf){
	$.extend(this,pieceSlice);
	this.initCol(index,src,width,height,conf,2,0);
};
settings.pieces.horizontalColOpposite['class0']=
settings.pieces.horizontalCol['class']=function(index,src,width,height,conf){
	$.extend(this,pieceSlice);
	this.initCol(index,src,width,height,conf,1,0);
};
settings.pieces.horizontalColOpposite['class1']=function(index,src,width,height,conf){
	$.extend(this,pieceSlice);
	this.initCol(index,src,width,height,conf,1,1);
};
settings.pieces.horizontalColLouvers['class']=function(index,src,width,height,conf){
	$.extend(this,pieceSlice);
	this.initCol(index,src,width,height,conf,3,0);
};


settings.slides.verticalCol=function(e,c){
	$.extend(this,slideSlice);
	this.initSlice(e,'verticalCol');
};
settings.slides.verticalColLouvers=function(e){
	$.extend(this,slideSlice);
	this.initSlice(e,'verticalColLouvers');
};
settings.slides.horizontalColLouvers=function(e){
	$.extend(this,slideSlice);
	this.initSlice(e,'horizontalColLouvers');
};
settings.slides.horizontalCol=function(e){
	$.extend(this,slideSlice);
	this.initSlice(e,'horizontalCol');
};
settings.slides.horizontalColOpposite=function(e){
	$.extend(this,slideSlice);
	this.initSlice(e,'horizontalColOpposite',2);
};
settings.slides.verticalColOpposite=function(e){
	$.extend(this,slideSlice);
	this.initSlice(e,'verticalColOpposite',2);
};

return new slideshow(this);
};})(jQuery);