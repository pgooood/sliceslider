# SliceSlider
HTML slider with some slice effects

[Demo page](http://pgood.ru/userfiles/file/sliceslider/demo/)

```js
var ss;
jQuery(function(){
	ss=$('#sliceslider > figure').sliceslider({
		autorun:true
		
		// default content panel position
		// also you can set position using data-position attribute
		,captionPosition:'right'
		
		// animation types
		,useMethod: [
			'blocks02'
			,'blocks01'
			,'verticalCol'
			,'verticalColOpposite'
			,'verticalColLouvers'
			,'horizontalCol'
			,'horizontalColOpposite'
			,'horizontalColLouvers'
		]
		
		// randomize or not animation types
		,randomMethod: false
		
		// callback function for buttons highlight
		,onchange: function(i){
			var $ns=$('input.numButton');
			$ns.removeClass('selected');
			$($ns.get(i)).addClass('selected');
		}
		
	});
});
```
```html
<div id="sliceslider">
	<figure>
		<img src="images/img01.jpg" alt="" width="1000" height="450">
		<figcaption>Green<b>Leaves</b></figcaption>
	</figure>
	<figure>
		<img src="images/img06.jpg" alt="" width="1000" height="450">
		<figcaption>Mist</figcaption>
	</figure>
	<figure>
		<img src="images/img02.jpg" alt="" width="1000" height="450">
		<figcaption>Apple<b>Flower</b></figcaption>
	</figure>
	<figure>
		<img src="images/img07.jpg" alt="" width="1000" height="450">
		<figcaption data-position="bottom">Field</figcaption>
	</figure>
	<figure>
		<img src="images/img04.jpg" alt="" width="1000" height="450">
		<figcaption data-position="left">Rose</figcaption>
	</figure>
	<figure>
		<img src="images/img08.jpg" alt="" width="1000" height="450">
	</figure>
</div>
<input type="button" value="previous slide" onclick="ss.prev()">
<input type="button" value="1" class="numButton selected" onclick="ss.showSlide(0)">
<input type="button" value="2" class="numButton" onclick="ss.showSlide(1)">
<input type="button" value="3" class="numButton" onclick="ss.showSlide(2)">
<input type="button" value="4" class="numButton" onclick="ss.showSlide(3)">
<input type="button" value="5" class="numButton" onclick="ss.showSlide(4)">
<input type="button" value="6" class="numButton" onclick="ss.showSlide(5)">
<input type="button" value="next slide" onclick="ss.next()">
<input type="button" value="start slide show" onclick="ss.startNoTimeout()">
<input type="button" value="stop slide show" onclick="ss.stop()">
```


## License

Copyright (c) 2015 Pavel Khoroshkov. Licensed under the [MIT license](https://github.com/pgooood/sliceslider/blob/master/LICENSE).