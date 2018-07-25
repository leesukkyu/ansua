"use strict";
/**
 * ansua.core
 */
var ansua;
(function() {
	ansua = (function() {
		var base, ansuaDomObj, createAnsuaDomObj;
		var temp;
		// ansua constructer
		base = function() {}
		// ansuaDom constructer
		ansuaDomObj = function() {}

		base.ansuaDomObj = ansuaDomObj;

		// create ansuaDomObj
		createAnsuaDomObj = function(v) {
			var i, temp, _ansuaDomObj;
			if (typeof v == 'string') {
				// mark up
				if (v[0] == '<') {
					if(~v.indexOf('<colgroup') || ~v.indexOf('<col') || ~v.indexOf('<thead') || ~v.indexOf('<tbody') || ~v.indexOf('<tr') || ~v.indexOf('<td')||~v.indexOf('<th')){
						_ansuaDomObj = new ansuaDomObj();
						_ansuaDomObj.dom = $(v)[0];
						return _ansuaDomObj;
					}else{
						temp = document.createElement("div");
						temp.innerHTML = v;
						_ansuaDomObj = new ansuaDomObj();
						_ansuaDomObj.dom = temp.childNodes[0];
						return _ansuaDomObj;
					}
				}
				// selector
				else if(v[0] == '#' || v[0] == '.' || v[0] == '['){
					temp = document.querySelectorAll(v);
					i = 0;
					if (temp.length == 1) {
						_ansuaDomObj = new ansuaDomObj();
						_ansuaDomObj.dom = temp[0];
						return _ansuaDomObj;
					} else {
						
					}
				}
				else if(v == 'body'){
					_ansuaDomObj = new ansuaDomObj();
					_ansuaDomObj.dom = document.body;
					return _ansuaDomObj;	
				}
				// tag
				else {
					temp = document.createElement(v)
					_ansuaDomObj = new ansuaDomObj();
					_ansuaDomObj.dom = temp;
					return _ansuaDomObj;
				}
			}
			else if(v instanceof HTMLElement){
				_ansuaDomObj = new ansuaDomObj();
				_ansuaDomObj.dom = v;
				return _ansuaDomObj;
			}
			else if(v === document){
				_ansuaDomObj = new ansuaDomObj();
				_ansuaDomObj.dom = v;
				return _ansuaDomObj;
			}
			else if(v === window){
				_ansuaDomObj = new ansuaDomObj();
				_ansuaDomObj.dom = v;
				return _ansuaDomObj;
			}else if(v instanceof ansuaDomObj){
				return v;
			}
		}

		/*
		 * dom dom 생성 api
		 */
		base.dom = function(v) {
			return createAnsuaDomObj(v);
		}

		/*
		 * ajax api option { cb : function, url : string }
		 */
		base.ajax = function(option) {
			ansua['common.util'].ajaxAnimation.init();
			try {
				var xmlhttp, sendData;
				if (window.XMLHttpRequest) {
					xmlhttp = new XMLHttpRequest();
				} else {
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
				option.method = option.method ? option.method : 'POST'
				xmlhttp.open(option.method, option.url, true);
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						console.log('========================')
						console.log(option.url);
						console.log(JSON.parse(xmlhttp.responseText));
						console.log('========================')
						if(option.type && option.type.toUpperCase() == 'JSON'){
							option.cb(JSON.parse(xmlhttp.responseText));
						}else{
							option.cb(xmlhttp.responseText);
						}
						ansua['common.util'].ajaxAnimation.destroy();
					}
				}
				if(option.data instanceof FormData){
					$.ajax({
		                url: option.url,
		                processData: false,
		                    contentType: false,
		                data: option.data,
		                type: 'POST',
		                success: function(d){
		                	option.cb(JSON.parse(d));
		                },
		                complete : function(){
		                	ansua['common.util'].ajaxAnimation.destroy();
		                }
		            });
				}
				else if(option.method.toUpperCase() == 'POST'){
					sendData = option.data ? jQuery.param(option.data) : null;
					console.log('=========== 보내는 데이터 ========================');
					try {
						option.data ? console.log(option.data) : 0;
					} catch (e) {
						// TODO: handle exception
					}
					console.log('=========== 보내는 데이터 끝 ========================')
					
					xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
					xmlhttp.send(sendData);
					
				}else if(option.method.toUpperCase() == 'GET'){
					xmlhttp.send(null);
				}
			} catch (e) {
				ansua['common.util'].ajaxAnimation.destroy();
			}
			// 나중에 지워야 함
			finally{
				ansua['common.util'].ajaxAnimation.destroy();
			}
		}
		
		/*
		 * 여러 ajax api option { cb : function, urlList : [] }
		 */
		base.load = (function() {
			var checkAllLoaded, result;
			var cb, urlList, length, count;

			checkAllLoaded = function(r) {
				count--;
				// this == index
				result[this] = r;
				if (count == 0) {
					cb(result);
				}
			}

			return function(option) {
				var i;
				cb = option.cb;
				urlList = option.urlList;
				length = urlList.length;
				count = length;
				i = 0;
				result = [];
				for (i; i < length; i++) {
					base.ajax({
						cb : checkAllLoaded.bind(i),
						url : urlList[i],
						method : 'post',
						data : option.dataList[i]
					});
				}
			}
		})()

		/*
		 * page init api option { cb : function, urlList(js) : [], devKeyword : string }
		 */
		base.init = (function(option) {
			var cb, count, length;
			var importScript, checkAllLoaded;
			var loadedFile;
			loadedFile = {};
			
			importScript = (function(oHead) {
				function loadError(oError) {
					throw new URIError("The script " + oError.target.src
							+ " is not accessible.");
				}
				return function(option) {
					var oScript;
					if(loadedFile[option.url]){
						console.log('Exist loaded file : ' + option.url);
						if (option.cb) {
							option.cb();
						}
					}else{
						oScript = document.createElement("script");
						oScript.type = "text\/javascript";
						oScript.onerror = loadError;
						if (option.cb) {
							oScript.onload = option.cb;
						}
						oHead.appendChild(oScript);
						oScript.src = option.url;
					}
				}
			})(document.head || document.getElementsByTagName("head")[0]);
			
			checkAllLoaded = function(){
				count--;
				if(count == 0){
					cb();
				}
			}
			
			return function(option) {
				var i, urlList;
				
				if(option.devKeyword && ~window.location.href.indexOf(option.devKeyword)){
					base.MODE = 'DEV'
				}else{
					base.MODE = 'OPER'
				}
				if(!option.urlList){
					option.cb();
					return 
				}
				cb = option.cb;
				urlList = option.urlList;
				length = urlList.length;
				count = length;
				
				i = 0;
				for(i; i < length; i++){
					importScript({
						url : urlList[i],
						cb : checkAllLoaded
					})
				}
			}
		})()
		
		// onload event wrap
		base.onLoad = (function(){
			var cbList;
			cbList = [];
			(function(){
				document.addEventListener("DOMContentLoaded", function(){
					var i;
					i = 0;
					for(i in cbList){
						cbList[i]();
					}
				});
			})()
			return function(cb){
				cbList.push(cb);
			}
		})()
		
		// static regist
		base.regist = (function(){
			return function(k, v){
				if(base[k]){
					throw new Error('Exist Static variable'); 
				}else{
					base[k] = v;
				}
			}
		})()

		base.util = {};
		base.data = {};
		
		return base;
	})()
})();