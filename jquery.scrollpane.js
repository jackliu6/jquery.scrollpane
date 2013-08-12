//jquery plugin scrollpane by da front-end item
;
(function($){

	var ScrollPane = function(elem, options){

			this.elem = elem;

			this.options = options;

			this.id = new Date().getTime();

			this.container = null;

			this.step = 1; //步长

			this.init();

		},
		fn = ScrollPane.prototype = {
			init : function(){
				var self = this,
					$elem = $(self.elem),
					elemH = $elem.height() || $elem.get(0).offsetHeight,
					elemW = $elem.get(0).offsetWidth,
					range = this.options.range || 20,				
					$container = self.container = $("<div>"),
					$scroller = $("<div>"),
					$scrollBar = self.scrollBar = $("<div>");

				$container
					.attr({
						id : 'sp-' + self.id,
						'class' : 'sp-container ' + $elem.attr('class')
					})
					.css({
						width : elemW,
						height : elemH
					})
					.on('mousewheel', function(e, n){
						n === -1 && self.up(range);
						n === 1 && self.down(range);
					})
					;

				$elem
					.css({
						position : 'absolute',
						top : 0,
						height : 'auto',
						width : elemW - 8, // 8 is the scrollbar's width
						overflow : 'hidden',
						border : 'none'
					})
					;

				//高度没有滚动条
				if(elemH >= $elem.get(0).offsetHeight){
					$elem.removeAttr('style');
					return;
				}

				$scroller
					.attr({
						'class' : 'sp-scroller'
					})
					.css({
						height : elemH
					})
					;

				var canDrag = false,
					minHeight = self.options.scrollbarMiniHeight || 50,
					originElemPos,
					originPos,
					currentPos,
					minY,
			        maxY;

				self.step = (elemH - ($elem.get(0).offsetHeight - elemH) < minHeight ? (elemH - minHeight) / ($elem.get(0).offsetHeight - elemH) : 1);

				$scrollBar
					.attr({
						'class' : 'sp-scrollbar'
					})
					.css({						
						height : (elemH - ($elem.get(0).offsetHeight - elemH) < minHeight ? minHeight : elemH - ($elem.get(0).offsetHeight - elemH)) + 'px'
					})
					.on('mousedown', function(e){
						canDrag = true;
						originPos = e.pageY;
						originElemPos = parseInt($elem.css('top'));
						minY = parseInt($(this).css('top'));
			            maxY = elemH - $(this).height() - minY;
					})
					.on('click', function(){
						return false;
					})
					;
				$(document)
					.on('mousemove', function(e){
						if(!canDrag) return;

						currentPos = e.pageY;

						if(currentPos - originPos < 0 && currentPos - originPos <= -minY){
			                self.move(0);
			                return;
			            }
			            if(currentPos - originPos > 0 && currentPos - originPos >= maxY){
			                self.move($elem.get(0).offsetHeight - elemH);
			                return;
			            }
			            
						self.move((currentPos - originPos) / self.step - originElemPos);
					})
					.on('mouseup', function(){
						canDrag = false;
					})
					.on('mousedown', function(){
						return !canDrag;
					})
					.on('selectstart', function(){
						return !canDrag;
					})
					;

				$elem.after($container);
				$scroller.append($scrollBar);
				$container.append($elem).append($scroller);
			},
			move : function(range){
				var $elem = $(this.elem);
				$elem.css('top', -range);
				this.fixScrollbar();
			},
			up : function(range){
				var $elem = $(this.elem);
				(parseInt($elem.css('top')) > -($elem.get(0).offsetHeight - this.container.height())) && $elem.css('top', parseInt($elem.css('top')) - range);
				(parseInt($elem.css('top')) < -($elem.get(0).offsetHeight - this.container.height())) && $elem.css('top', -($elem.get(0).offsetHeight - this.container.height()));
				this.fixScrollbar();
			},
			down : function(range){
				var $elem = $(this.elem);
				parseInt($elem.css('top')) < 0 && $elem.css('top', parseInt($elem.css('top')) + range);
				parseInt($elem.css('top')) > 0 && $elem.css('top', 0);
				this.fixScrollbar();
			},
			fixScrollbar : function(){
				this.scrollBar
					.css({
						top : -(parseInt($(this.elem).css('top')) * this.step) + 'px'
					})
					;
			}
		};

	/* ScorllPane PLUGIN DEFINITION
  	* ======================= */

  	var old = $.fn.scrollpane;

	$.fn.scrollpane = function(option){
		return this.each(function(){
			var $this = $(this),
				data = $this.data('scrollpane'),
				options = $.extend({}, $.fn.scrollpane.defaults, typeof option === 'object' && option);

			if(!data){
				$this.data('scrollpane', (data = new ScrollPane(this, options)));
			}

			if(typeof option === 'string'){
				typeof data[option] === 'function' && data[option]();
			}
		});
	};

	$.fn.scrollpane.Constructor = ScrollPane;

	$.fn.scrollpane.defauts = {
		range : 20,
		scrollbarMiniHeight : 50
	};

	/* ScrollPane NO CONFLICT
  	* ================= */

  	$.fn.scrollpane.noConflict = function(){
  		$.fn.scrollpane = old;
  		return this;
  	}

})(window.jQuery);