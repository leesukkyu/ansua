"use strict";
/**
 * ansua.ROUTER
 */
(function() {
	ansua.ROUTER = (function(){
		var init, add, router, routerMap;
		routerMap = {};
		
		router = function(){
			var url;
			url = location.hash.slice(3) || '/';
			routerMap[url]();
		}

		
		add = function(option){
			routerMap[option.url] = option.cb;
			return this;
		}
		
		init = function(){
			window.addEventListener('hashchange', router);
		}

		return {
			init : init,
			add : add
		}
	})();
})();
