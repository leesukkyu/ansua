"use strict";
(function(){
	(function(){
		// date 형식은 YYYY.MM.DD 이다.
		var datePicker, timePicker, calcCalendar, calcPosition;

		calcPosition = (function () {
			var CALENDAR_WIDTH = 251,
				CALENDAR_HEIGHT = 241,
				TIME_WIDTH = 131,
				TIME_HEIGHT = 125;
			var findPos, findIsFixed, checkOffset;
			var isFixed;
			var result;
			var inputHeight, inputWidth;
			var POPUP_WIDTH, POPUP_HEIGHT;
			findPos = function (t) {
				var docElem, win,
					box = { top: 0, left: 0 },
					doc = t && t.ownerDocument;
				if (!doc) {
					return;
				}
				docElem = doc.documentElement;
				if (typeof t.getBoundingClientRect !== 'undefined') {
					box = t.getBoundingClientRect();
				}
				win = doc.defaultView || doc.parentWindow;
				return {
					top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
					left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
				}
			}
			findIsFixed = function (t) {
				$(t).parents().each(function () {
					isFixed |= $(this).css('position') === 'fixed';
					return !isFixed;
				});
			}
			checkOffset = function () {
				var viewWidth = document.documentElement.clientWidth + (isFixed ? 0 : $(document).scrollLeft());
				var viewHeight = document.documentElement.clientHeight + (isFixed ? 0 : $(document).scrollTop());
				var realLeft = result.left - (isFixed ? $(document).scrollLeft() : 0);
				var realTop = result.top - (isFixed ? $(document).scrollTop() : 0);
				result.top += inputHeight + 3;
				if (realLeft + POPUP_WIDTH + 50 > viewWidth) {
					result.left -= POPUP_WIDTH - inputWidth
				}
				if (realTop + POPUP_HEIGHT + 50 > viewHeight) {
					result.top -= POPUP_HEIGHT + inputHeight + 6
				}

			}
			return function (e, isTime) {
				if (isTime) {
					POPUP_WIDTH = TIME_WIDTH
					POPUP_HEIGHT = TIME_HEIGHT
				} else {
					POPUP_WIDTH = CALENDAR_WIDTH
					POPUP_HEIGHT = CALENDAR_HEIGHT
				}
				inputHeight = $(e.target).outerHeight()
				inputWidth = $(e.target).outerWidth()
				isFixed = false
				findIsFixed(e.target);
				result = findPos(e.target);
				checkOffset(e.target)
				return result
			}
		})();
		
		datePicker = (function(){
			var $targetInput;
			var openCalendar, closeCalendar, makeCalendar, setDateData, drawCalendarData;
			var _date, targetOBJ, todayOBJ, isMakeCalendar;
			var $t, $monthViewTextBox, $yearViewTextBox, $calendarMonthCellBox;
			var onClickTodayBtn, onClickPrevMonthBtn, onClickNextMonthBtn, onClickPrevYearBtn, onClickNextYearBtn;
			var onClickCell;
			
			_date = new Date()
			targetOBJ = {}
			todayOBJ = { year: _date.getFullYear(), month: (_date.getMonth() + 1), day: _date.getDate() };
			
			onClickTodayBtn = function(){
				targetOBJ = {
						year : todayOBJ.year,
						month : todayOBJ.month,
						day : todayOBJ.day
				}
				drawCalendarData();
			}
			
			onClickPrevMonthBtn = function(){
				targetOBJ.month--;
				if(targetOBJ.month == 0){
					targetOBJ.month = 12;
					targetOBJ.year--;
				}
				drawCalendarData();
			}
			
			onClickNextMonthBtn = function(){
				targetOBJ.month++;
				if(targetOBJ.month == 13){
					targetOBJ.month = 1;
					targetOBJ.year++;
				}
				drawCalendarData();
			}
			
			onClickPrevYearBtn = function(){
				targetOBJ.year--;
				drawCalendarData();
			}
			
			onClickNextYearBtn = function(){
				targetOBJ.year++;
				drawCalendarData();
			}
			
			onClickCell = function(){
				ansua.dom($targetInput).val(ansua.dom(this).attr('data-day'));
				closeCalendar();
			}
			
			setDateData = function(){
				targetOBJ = {
						year : todayOBJ.year,
						month : todayOBJ.month,
						day : todayOBJ.day
				}
			}
			
			makeCalendar = function(){
				$t = ansua.dom('<div class="calendarWrap"></div>')
					.insert(
						ansua.dom('<div class="calendarMonthNaviWrap"></div>')
							.insert(ansua.dom('<button class="btn todayBtn">오늘</button>').event('click', onClickTodayBtn))
							.insert(ansua.dom('<button class="btn leftMonthBtn"><span class="ti-angle-left icon"></span></button>').event('click', onClickPrevMonthBtn))
							.insert($monthViewTextBox = ansua.dom('<span class="monthViewTextBox"></span>'))
							.insert(ansua.dom('<button class="btn rightMonthBtn"><span class="ti-angle-right icon"></span></button>').event('click', onClickNextMonthBtn))
					)
					.insert(
							ansua.dom('<div class="calendarYearNaviWrap"></div>')
								.insert(ansua.dom('<button class="btn leftYearBtn"><span class="ti-angle-left icon"></span></button>').event('click', onClickPrevYearBtn))
								.insert($yearViewTextBox = ansua.dom('<span class="yearViewTextBox"></span>'))
								.insert(ansua.dom('<button class="btn rightYearBtn"><span class="ti-angle-right icon"></span></button>').event('click', onClickNextYearBtn))
					)
					.insert(
							ansua.dom('<div class="calendarMonthCellWrap"></div>').insert($calendarMonthCellBox = ansua.dom('<div class="calendarMonthCellBox"></div>'))
					)
					
				ansua.dom('body').insert($t);
				isMakeCalendar = true;
			}
			
			closeCalendar = function(){
				$t.css('display','none');
				ansua.dom('#wrapper').removeEvent('click', closeCalendar);
			}
			
			drawCalendarData = function(){
				var cellData, $t;
				
				$monthViewTextBox.html(targetOBJ.month + ' 월');
				$yearViewTextBox.html(targetOBJ.year + ' 년');
				cellData = calcCalendar(targetOBJ.year, targetOBJ.month);
				cellData = cellData.weekList;
				$calendarMonthCellBox.html('');
				for(var i in cellData){
					$calendarMonthCellBox.insert($t = ansua.dom('<div class="cellTr"></div>'))
					for(var j in cellData[i]){
						if(cellData[i][j].isThisMonth == 1){
							if(cellData[i][j].today){
								$t.insert(ansua.dom('<div data-day="'+ cellData[i][j].year + '.' + cellData[i][j].month + '.' + cellData[i][j].day +'" class="cellTd today">'+ cellData[i][j].day +'</div>').event('click',onClickCell))
							}else{
								$t.insert(ansua.dom('<div data-day="'+ cellData[i][j].year + '.' + cellData[i][j].month + '.' + cellData[i][j].day +'" class="cellTd">'+ cellData[i][j].day +'</div>').event('click',onClickCell))
							}
							
						}else{
							$t.insert(ansua.dom('<div data-day="'+ cellData[i][j].year + '.' + cellData[i][j].month + '.' + cellData[i][j].day +'" class="cellTd notThisMonth">'+ cellData[i][j].day +'</div>').event('click',onClickCell))
						}
					}
				}
			}
			
			openCalendar = (function(){
				
				return function(e){
					var position;
					if(!isMakeCalendar){
						makeCalendar();
					}
					drawCalendarData();
					position = calcPosition(e);
					$t.css('top', position.top + 'px').css('left', position.left + 'px').css('display','block');
					setTimeout(function(){
						ansua.dom('#wrapper').event('click', closeCalendar);
					}, 1)
				}
			})()
			
			return function(){
				this.event('click', function(e){
					$targetInput = e.target;
					setDateData();
					openCalendar(e);
				})
				return this;
			}
		})()
		
		timePicker = (function(){
			var setDateData, openTimePicker, makeTimePicker, closeTimePicker, drawTimePicker, setInputStr;
			var onMousewheelMin, onMousewheelHour, onClickSelectTime, onClickUpHourBtn, onClickDownHourBtn, onClickUpMinBtn, onClickDownMinBtn;
			var $targetInput, $t, $hourWrap, $minWrap, $currentHour, $currentMin;
			var targetOBJ;
			var isMakeTimePicker;
			
			targetOBJ = {
				hour : 12,
				min : 0
			}
			
			setDateData = function(){
				
			}
			
			setInputStr = function(){
				ansua.dom($targetInput).val($currentHour.attr('data-hour') + ':' + $currentMin.attr('data-min'))
			}
			
			onMousewheelMin = function(e){
				if(e.wheelDelta < 0) {
					onClickDownMinBtn();
				}else{
					onClickUpMinBtn();
				}
				e.preventDefault();
			}
			
			onMousewheelHour = function(e){
				if(e.wheelDelta < 0) {
					onClickDownHourBtn();
				}else{
					onClickUpHourBtn();
				}
				e.preventDefault();
			}
			
			onClickSelectTime = function(){
				var value;
				if((value = ansua.dom(event.target).attr('data-hour')) != null){
					targetOBJ.hour = value - 2;
					if(targetOBJ.hour < 0){
						targetOBJ.hour = 25 + targetOBJ.hour;
					}
					drawTimePicker.drawHour();
				}
				if((value = ansua.dom(event.target).attr('data-min')) != null){
					targetOBJ.min = value - 2;
					if(targetOBJ.min < 0){
						targetOBJ.min = 61 + targetOBJ.min;
					}
					drawTimePicker.drawMin();
				}
				setInputStr();
				closeTimePicker();
			}
			
			onClickUpHourBtn = function(){
				targetOBJ.hour--;
				if(targetOBJ.hour < 0){
					targetOBJ.hour = 24;
				}
				drawTimePicker.drawHour();
				setInputStr();
			}
			
			onClickDownHourBtn = function(){
				targetOBJ.hour++;
				if(targetOBJ.hour > 24){
					targetOBJ.hour = 0;
				}
				drawTimePicker.drawHour();
				setInputStr();
			}

			onClickUpMinBtn = function(){
				targetOBJ.min--;
				if(targetOBJ.min < 0){
					targetOBJ.min = 59;
				}
				drawTimePicker.drawMin();
				setInputStr();
			}

			onClickDownMinBtn = function(){
				targetOBJ.min++;
				if(targetOBJ.min > 59){
					targetOBJ.min = 0;
				}
				drawTimePicker.drawMin();
				setInputStr();
			}
			
			drawTimePicker = (function(){
				var init, drawHour, drawMin;
				var attachZero;
				
				attachZero = function(str){
					return	str.toString().length < 2 ? '0' + str : str
				}
				
				init = function(){
					drawHour();
					drawMin();
				}
				
				drawHour = function(){
					var i, startHour;
					i = 0;
					startHour = targetOBJ.hour;
					$hourWrap.html('');
					for(i; i < 5; i++){
						if(i == 2){
							$hourWrap
								.insert(
									$currentHour = ansua.dom('<div data-hour = "'+ attachZero(startHour) +'" class="timePickerTimeBox current">'+ attachZero(startHour) +'</div>')
										.event('click', onClickSelectTime)
								)
						}else{
							$hourWrap
								.insert(
									ansua.dom('<div data-hour = "'+ attachZero(startHour) +'" class="timePickerTimeBox">'+ attachZero(startHour) +'</div>')
										.event('click', onClickSelectTime)
								)
						}
						
						startHour++;
						if(startHour > 24){
							startHour = 0;
						}
					}
				}
				
				drawMin = function(){
					var i, startMin;
					i = 0;
					startMin = targetOBJ.min;
					$minWrap.html('');
					for(i; i < 5; i++){
						if(i == 2){
							$minWrap
								.insert(
									$currentMin = ansua.dom('<div data-min = "'+ attachZero(startMin) +'" class="timePickerTimeBox current">'+ attachZero(startMin) +'</div>')
										.event('click', onClickSelectTime)
								)
						}else{
							$minWrap
								.insert(
									ansua.dom('<div data-min = "'+ attachZero(startMin) +'" class="timePickerTimeBox">'+ attachZero(startMin) +'</div>')
										.event('click', onClickSelectTime)
								)
						}
						startMin++;
						if(startMin > 60){
							startMin = 0;
						}
					}
				}
				
				return {
					init : init,
					drawHour : drawHour,
					drawMin : drawMin
				}
			})()
			
			makeTimePicker = function(){
				$t = ansua.dom('<div class="timePickerWrap"></div>')
					.insert(
						ansua.dom('<div class="timePickerBox left"></div>')
							.insert(
								ansua.dom('<div class="timePickerNaviBtnBox"></div>')
									.insert(
										ansua.dom('<button class="timePickerNaviBtn"><span class="ti-angle-up icon"></span></button>')
											.event('click', onClickUpHourBtn)
									)
							)
							.insert(
								$hourWrap = ansua.dom('<div class="timePickerTimeWrap"></div>')
									.event('mousewheel', onMousewheelHour)
							)
							.insert(
								ansua.dom('<div class="timePickerNaviBtnBox"></div>')
									.insert(
										ansua.dom('<button class="timePickerNaviBtn"><span class="ti-angle-down icon"></span></button>')
											.event('click', onClickDownHourBtn)
									)
							)
					)
					.insert(
						ansua.dom('<div class="timePickerBox right"></div>')
							.insert(
								ansua.dom('<div class="timePickerNaviBtnBox"></div>')
									.insert(
										ansua.dom('<button class="timePickerNaviBtn"><span class="ti-angle-up icon"></button>')
											.event('click', onClickUpMinBtn)
									)
							)
							.insert(
									$minWrap = ansua.dom('<div class="timePickerTimeWrap"></div>')
										.event('mousewheel', onMousewheelMin)
							)
							.insert(
								ansua.dom('<div class="timePickerNaviBtnBox"></div>')
									.insert(
										ansua.dom('<button class="timePickerNaviBtn"><span class="ti-angle-down icon"></button>')
											.event('click', onClickDownMinBtn)
									)
							)
					)
					
				ansua.dom('body').insert($t);
				isMakeTimePicker = true;
			}
			
			closeTimePicker = function(){
				$t.css('display','none');
				ansua.dom('#wrapper').removeEvent('click', closeTimePicker);
			}
			
			
			openTimePicker = (function(){
				return function(e){
					var position;
					if(!isMakeTimePicker){
						makeTimePicker();
					}
					drawTimePicker.init();
					position = calcPosition(e);
					$t.css('top', position.top + 'px').css('left', position.left + 'px').css('display','block');
					setTimeout(function(){
						ansua.dom('#wrapper').event('click', closeTimePicker);
					},1)
				}
			})()
			
			
			return function(){
				this.event('click', function(e){
					$targetInput = e.target;
					setDateData();
					openTimePicker(e);
				})
				return this;
			}
		})()
		
		
		calcCalendar = (function () {
			var __date, i, j, len, len2, dayCount, firstDay, lastDay, pastDayCount, pastYear, pastMonth, nextYear,
			nextMonth, count, tYEAR, tMONTH, list1, list2, list3
			var dayTable;
			var getDow = (function(){
				return function(v){
					return dayTable[(v-1)%7]
				}
			})()
			var _D, thisYear, thisMonth, today;
			_D = new Date();
			__date = new Date();
			thisYear = _D.getFullYear();
			thisMonth = _D.getMonth() + 1;
			today = _D.getDate();
			return function (y,m, startDay, weekendViewYn) { // int year ,int month, string 주의 시작 요일 '월', boolean 주말 표시 여부
				var weekList = [[]], weekCount = 0;
				var correct1, bool, length;
				if(startDay == '월'){
					correct1 = 2;
					dayTable = ['월','화','수','목','금','토','일'];
				}
				else if(startDay == '토'){
					correct1 = 0;
					dayTable = ['토','일','월','화','수','목','금'];
				}
				// 기본은 일요일 시작
				else{
					correct1 = 1;
					dayTable = ['일','월','화','수','목','금','토'];
				}
				j = 0, count = 1, list1 = [], list2 = [], list3 = []
				__date.setFullYear(y, m, 0),
				dayCount = __date.getDate(),
				__date.setFullYear(y, m-1, 1),
				firstDay = __date.getDay(),
				__date.setFullYear(y, m-1, dayCount),
				lastDay = __date.getDay();
				tYEAR = y, tMONTH = m-1
				
				// 이전달 계산
				__date.setFullYear(tYEAR, tMONTH, 0),
				pastDayCount = __date.getDate(),
				pastYear = __date.getFullYear(),
				pastMonth = __date.getMonth() +1,
				j = (pastDayCount - firstDay + correct1)
				len = pastDayCount
				for (j; j <= len; j++, count++) list1.push({
					day: j,
					year: pastYear,
					month: pastMonth,
					isThisMonth: '0',
					dow : getDow(count)
				})
				
				// 이번달 계산
				len = dayCount
				for (j = 1; j <= len; j++, count++) {
					if (count % 7 - 1 == 0) {
						list2.push({day: j, year: tYEAR, month: m, isThisMonth: 1, dow : getDow(count)})
						continue;
					}
					if (count % 7 - 1 == 1) {
						list2.push({day: j, year: tYEAR, month: m, isThisMonth: 1, dow : getDow(count)})
						continue;
					}
					list2.push({day: j, year: tYEAR, month: m, isThisMonth: 1, dow : getDow(count) })
				}

				j = 6 - lastDay, i = 1;
				__date.setFullYear(tYEAR, m, 1),
					nextYear = __date.getFullYear(),
					nextMonth = __date.getMonth() + 1
				len = 36
				for (count; count < len; count++, i++) list3.push({
					day: i,
					year: nextYear,
					month: nextMonth,
					isThisMonth: 2,
					dow : getDow(count)
				})
				// 다음달이 0인 경우 표현을 위해서 강제로 추가
				if(list3.length == 0){
					len = 43;
					for (count; count < len; count++, i++) list3.push({
						day: i,
						year: nextYear,
						month: nextMonth,
						isThisMonth: 2,
						dow : getDow(count)
					})
				}
				list2[0] ? list2[0].first = true : 0;
				list3[0] ? list3[0].first = true : 0;
				count = 0;
				for(var i in list1){
					if(list1[i].year && thisMonth == list1[i].month && today == list1[i].day){
						list1[i].today = true
					}
					weekList[weekCount].push(list1[i])
					count++
					if(count % 7 == 0){
						weekCount++;
						weekList[weekCount] = []
					}
				}
				for(var i in list2){
					if(list2[i].year && thisMonth == list2[i].month && today == list2[i].day){
						list2[i].today = true
					}
					weekList[weekCount].push(list2[i])
					count++
					if(count % 7 == 0){
						weekCount++;
						weekList[weekCount] = []
					}
				}
				for(var i in list3){
					if(list3[i].year && thisMonth == list3[i].month && today == list3[i].day){
						list3[i].today = true
					}
					weekList[weekCount].push(list3[i])
					count++
					if(count % 7 == 0){
						weekCount++;
						weekList[weekCount] = []
					}
				}
				
				if(weekList[weekCount].length == 0){
					weekList.splice(weekCount,1)
				}
				if(weekList[weekList.length - 1][0].isThisMonth == 2){
					weekList.splice(weekList.length - 1,1)
				}
				
				// 주말은 표시 안하기로 했는데
				if(!weekendViewYn){
					bool = true
					for(var i in weekList[0]){
						if(weekList[0][i].dow != '일' && weekList[0][i].dow != '토' && weekList[0][i].isThisMonth == '1'){
							bool = false
							break;
						}
					}
					if(bool){
						weekList.splice(0,1)
					}
					bool = true
					length = weekList.length - 1
					for(var i in weekList[length]){
						if(weekList[length][i].dow != '일' && weekList[length][i].dow != '토' && weekList[length][i].isThisMonth == '1'){
							bool = false
							break;
						}
					}
					if(bool){
						weekList.splice(length,1)
					}
				}
				
				return {
					list1 : list1,			// 지난 달 목록
					list2 : list2,			// 이번 달 목록
					list3 : list3,			// 다음 달 목록 // 세 개 다 합치면 달력 완성
					weekList : weekList		// 달력 정보
				}
			}
		})()
		
		ansua.ansuaDomObj.prototype.datePicker = datePicker;
		ansua.ansuaDomObj.prototype.timePicker = timePicker;
		ansua.util.calcCalendar = calcCalendar;
	})()
})()