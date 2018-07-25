"use strict";
(function() {
	var temp;

	temp = ansua.ansuaDomObj.prototype;

	// dom 삽입
	temp.insert = function($c) {
		this.dom.appendChild($c.dom);
		return this;
	}

	temp.prepend = function($c) {
		$(this.dom).prepend($($c.dom));
		return this;
	}
	
	// inner Html
	temp.html = function(v) {
		if(v !== undefined){
			this.dom.innerHTML = v;
			return this;
		}else{
			return this.dom.innerHTML;
		}
	}
	
	// event
	temp.event = (function(){
		var eventMap;
		eventMap = {};
		
		eventMap['enter'] = function(cb){
			this.dom.addEventListener('keyup', function(e){
				if(e.keyCode == 13){
					cb();
				}
			})
		}
		
		eventMap['mousewheel'] = function(cb){
			this.dom.addEventListener('mousewheel', function(e){
					cb(e);
			})
		}
		
		eventMap['swipe'] = (function(){
			var startX, startY;
			return function(cb){
				this.dom.addEventListener('touchstart', function(e){
					var touchobj = e.changedTouches[0];
					startX = touchobj.pageX;
					startY = touchobj.pageY;
				})
				this.dom.addEventListener('touchmove', function(e){
					var customEventObj;
					var touchobj = e.changedTouches[0];
					ansua.dom('#footer').html(touchobj.pageX);
					customEventObj = {
							moveX : startX - touchobj.pageX,
							moveY : startY - touchobj.pageY,
							originalEvent : e.originalEvent
					}
					cb(customEventObj);
				})
				this.dom.addEventListener('touchmove', function(){
					//ansua.dom('#footer').html('move');
				})
			}
		})()
		
		return function(k, cb){
			if(eventMap[k]){
				eventMap[k].call(this, cb);
			}else{
				this.dom.addEventListener(k, cb);
			}
			return this;
		}
	})()
	
	temp.on = function(event, tag, cb){
		$(this.dom).on(event, tag, function(e){
			cb.call(this, e.originalEvent ? e.originalEvent : e);
		});
	}
	
	temp.removeEvent = function(k, cb){
		this.dom.removeEventListener(k, cb);
	}
	
	// 이벤트 발생기
	temp.trigger = function(k){
		if(k == 'hashchange'){
			window.dispatchEvent(new HashChangeEvent("hashchange"));
		}
		else if(k == 'click'){
			this.dom.click();
		}else{
			$(this.dom).trigger(k);
		}
	}
	
	// input 값
	temp.val = function(v){
		if(v != undefined){
			this.dom.value = v;
			return this;
		}else{
			return this.dom.value;
		}
	}
	
	// class
	temp.addClass = function(v){
		var list, name;
		var i;
		
		for(list = v.split(' '), i = list.length; i--;){
			name = list[i],
			~this.dom.className.indexOf(name) ? 0 : this.dom.className += ' ' + name;
		}
		return this;
	}
	
	temp.removeClass = function(v){
		var list, name;
		var temp;
		var i;
		
		temp = this.dom.className;
		for(list = v.split(' '), i = list.length; i--;){
			name = list[i],
			~temp.indexOf(name) ? temp = temp.replace(name, '') : 0
		}
		this.dom.className = temp;
		return this;
	}
	
	temp.hasClass = function(v){
		var temp, list, i;
		temp = this.dom.className;
		if(temp){
			for(list = temp.split(' '), i = list.length; i--;){
				if(list[i] == v){
					return true;
				}
			}
		}
		return false;
	}
	
	
	// attr
	temp.attr = function(k, v){
		if(v !== undefined){
			this.dom.setAttribute(k, v);
			return this;
		}else{
			return this.dom.getAttribute(k);
		}
	}
	
	// css
	temp.css = function(k, v){
		if(v != undefined){
			this.dom.style[k] = v;
			return this;
		}else{
			return this.dom.style[k];
		}
	}
	
	// dom remove
	temp.remove = function(){
		$(this.dom).remove();
	}
	
	
	//dom query
	temp.query = function(v){
		var result;
		result = this.dom.querySelectorAll(v);
		if(result.length == 0){
			return false;
		}
		else if(result.length == 1){
			return ansua.dom(result[0]);
		}
		else{
			result =  Array.prototype.slice.call(result);
			for(var i in result){
				result[i] = ansua.dom(result[i])
			}
			return result;
		}
	}
	
	temp.forEach = function(_F){
		_F(this,0);
	}
	
	// dom closest
	temp.parent = function(v){
		var temp, classList, attributeKey;
		temp = this.dom
		if(v[0] == '.'){
			classList = v.slice(1).split('.');
			while(temp){
				for(var i in classList){
					if(~temp.className.indexOf(classList[i])){
						return ansua.dom(temp);
					}
				}
				temp = temp.parentElement;
			}
		}else if(v[0] == '#'){
			
		}else if(v[0] == '['){
			attributeKey = v.slice(1, v.length - 1)
			while(temp){
				if(temp.getAttribute(attributeKey) != null){
					return ansua.dom(temp);
				}
				temp = temp.parentElement;
			}
		}
	}
	
})()