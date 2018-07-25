"use strict";
/**
 * ansua.DATE
 */
(function() {
	var DATE = new Date();
	
	String.prototype.zf = function (len){return '0'.slice(0,len-this.length)+this };
	Number.prototype.zf = function (len){ return this.toString().zf(len) };
	
	var convertDateFormatFromTimestamp = (function () {
		Date.prototype.format = function (f) {
			var weekName, d, h
			if (!this.valueOf()) return ''
			weekName = ['일', '월', '화', '수', '목', '금', '토']
			d = this, h = -1
			return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function ($1) {
				switch ($1) {
					case 'yyyy': return d.getFullYear();
					case 'yy': return d.getFullYear().toString().substring(2, 4);
					case 'MM': return (d.getMonth() + 1).zf(2);
					case 'dd': return d.getDate().zf(2);
					case 'E': return weekName[d.getDay()];
					case 'HH': return d.getHours().zf(2);
					case 'hh': return ((h = d.getHours() % 12) ? h : 12).zf(2);
					case 'mm': return d.getMinutes().zf(2);
					case 'ss': return d.getSeconds().zf(2);
					case 'a/p': return d.getHours() < 12 ? '오전' : '오후';
					default: return $1;
				}
			});
		};
		var t0, tResult
		return function (timestamp, format) {
			if (timestamp && typeof timestamp == 'number') {
				t0 = new Date(timestamp)
				if (format) tResult = (t0.format(format))
				else {
					tResult = (t0.format('yyyy-MM-dd HH:mm:ss'));
					if (!tResult && (timestamp.length == 10)) { // IE 처리
						tResult = (new Date(timestamp.replace(/\./gi, '-')).format('yyyy-MM-dd HH:mm:ss'));
					}
				}
				return tResult;
			}else{
				return false;
			}
		}
	})();
	
	ansua.DATE = function(v){
		if(typeof arguments[0] == 'string'){
			return convertDateFormatFromTimestamp(DATE.getTime(), arguments[0]);
		}
	}
})();
