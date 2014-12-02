/**
* 
* 	@version 	1.0.3  November 25, 2014
* 	@package 	Get Bible API
* 	@author  	Llewellyn van der Merwe <llewellyn@vdm.io>
* 	@copyright	Copyright (C) 2013 Vast Development Method <http://www.vdm.io>
* 	@license	GNU General Public License <http://www.gnu.org/copyleft/gpl.html>
*
**/

	/*******************************************\
	*			Load Scripture Here				*
	\*******************************************/

// the Globals
var BIBLE_BOOK 			= 0;
var BIBLE_CHAPTER 		= 0;
var BIBLE_LAST_CHAPTER 	= 0;
var BIBLE_VERSION 		= 0;
var defaultVersion 		= 0;
var defaultVers			= 0;
var defaultBook 		= 0;
var defaultBookNr 		= 0;
var defaultChapter 		= 0;
var setQuery 			= 0;

// set bookmark array
var alpha 			= "abcdefghijklm";
var bookmarksArray 	= alpha.split("");

// get the data from the API
jQuery(function() {
	// load defaults
	getDefaults(getUrl, defaultRequest, defaultKey);
	appFeatures();
	setTextSize();
		
});
// Load this after page is fully loaded
jQuery(window).bind("load", function() {
	//jQuery('#t_loader').hide();
	jQuery('#getbible').show();
	if(searchApp != 1){
		jQuery('.button').show();
		if(autoLoadChapter === 1){
			loadTimer1();
		}
	} else {
		jQuery('#button_top').show();
	}		
});
		
jQuery(document).ready(function() {
	
	var preSB;

	jQuery('#books').focus(function () {
		// Store the current value on focus, before it changes
		preSB = this.value;
		}).change(function() {
			var newSB = this.value;
			jQuery('#t_loader').show();
			jQuery('#chapters').slideUp( "slow" );
			jQuery('.button').hide();
			jQuery('#chapters').html('');
			getDataCh(newSB);
			jQuery('#chapters').slideDown( "slow" );
			setSearchBook(newSB,preSB);
		});
	
	var preSV;
	var activePassage;
	
	jQuery('#versions').focus(function () {
		// Store the current value on focus, before it changes
		preSV 			= this.value;
		}).change(function() {
			activePassage 	= jQuery("#books option:selected").val();
			var newSV = this.value;
			jQuery('#books').hide();
			jQuery('.button').hide();
			jQuery('#chapters').hide();
			jQuery('#books').empty();
			getDataBo(newSV, activePassage, 1);
			jQuery('.search_version').val(newSV);
			// update global version
			BIBLE_VERSION = newSV;
			
		}); 
		
	/*******************************************\
	*			Search Scripture Here			*
	\*******************************************/
	// set the criteria for the search
	var crit1 = 1;
	var crit2 = 1;
	var crit3 = 1;
	jQuery('.search_crit1').click(function() {
		crit1 = jQuery(this).attr("value");
		setCrit();
	});
	jQuery('.search_crit2').click(function() {
		crit2 = jQuery(this).attr("value");
		setCrit();
	});
	jQuery('.search_crit3').click(function() {
		crit3 = jQuery(this).attr("value");
		setCrit();
	});
	function setCrit(){
		jQuery('.search_crit').val(crit1+'_'+crit2+'_'+crit3);
	}
	// set the type of search
	jQuery('.search_type_select').click(function() {
		jQuery('.search_type').val(jQuery(this).attr("value"));
	});
	
});

// set highlight option on or off
var setHight = false;
function highScripture(){
	var how = searchCrit.split('_');
	if (setHight){
		setHight = false;
		if (how[0] == 3){
			if (how[2] == 2){
				if (how[1] == 1){
					jQuery('#scripture p').unhighlight(searchFor, { caseSensitive: true, wordsOnly: true });
				} else {
					jQuery('#scripture p').unhighlight(searchFor, { caseSensitive: true });
				}
			} else {
				jQuery('#scripture p').unhighlight(searchFor);
			}
		} else {
			var searchwords = searchFor.split(' ');
			var i;
			for (i = 0; i < searchwords.length; ++i) {
				if (how[2] == 2){
					if (how[1] == 1){
						jQuery('#scripture p').unhighlight(searchwords[i], { caseSensitive: true, wordsOnly: true });
					} else {
						jQuery('#scripture p').unhighlight(searchwords[i], { caseSensitive: true });
					}
				} else {
					jQuery('#scripture p').unhighlight(searchwords[i]);
				}
			}
		}
	} else {
		setHight = true;
		if (how[0] == 3){
			if (how[2] == 2){
				if (how[1] == 1){
					jQuery('#scripture p').highlight(searchFor, { caseSensitive: true, wordsOnly: true });
				} else {
					jQuery('#scripture p').highlight(searchFor, { caseSensitive: true });
				}
			} else {
				jQuery('#scripture p').highlight(searchFor);
			}
		} else {
			var searchwords = searchFor.split(' ');
			var i;
			for (i = 0; i < searchwords.length; ++i) {
				if (how[2] == 2){
					if (how[1] == 1){
						jQuery('#scripture p').highlight(searchwords[i], { caseSensitive: true, wordsOnly: true  });
					} else {
						jQuery('#scripture p').highlight(searchwords[i], { caseSensitive: true });
					}
				} else {
					jQuery('#scripture p').highlight(searchwords[i]);
				}
			}
		}
	}
	
}
// set the search book when a book is changed
function setSearchBook(newBook,lastBook){
	var bookNew = newBook.split('__');
	jQuery('.search_book').val(bookNew[2]);
	var bookLast = lastBook.split('__');
	if(jQuery('.search_type').val() == bookLast[2]){
		jQuery('.search_type').val(bookNew[2]);
	}
}
// load the chapter where the search verse is found 
function loadFoundChapter(call, setGlobal){
	if(autoLoadChapter === 1){
		loadTimer1();
	}
	//  Call to get scripture
	jQuery('#t_loader').show();
	var result = setGlobal.split('__');
	BIBLE_BOOK 			= result[0];
	BIBLE_BOOK_NR 		= result[1];
	BIBLE_CHAPTER 		= result[2];
	BIBLE_LAST_CHAPTER 	= --result[2];
	BIBLE_VERSION		= result[3];
	jQuery('.button').show();
	getDataBo(BIBLE_VERSION,BIBLE_VERSION+'__'+BIBLE_BOOK_NR+'__'+BIBLE_BOOK);
	getDataCh(BIBLE_VERSION+'__'+BIBLE_BOOK_NR+'__'+BIBLE_BOOK);
	jQuery('.searchbuttons').hide();
	jQuery('#button_top').hide();
	jQuery('#versions').val(BIBLE_VERSION);
	jQuery('#cPanel').show();
	// set the search book ref
	jQuery('.search_book').val(BIBLE_BOOK);
	if(BIBLE_LAST_CHAPTER < 1){
		jQuery('#prev').hide();
	}
	getData(call, false, true);
	if(appMode == 2){
		gotoTop();
	}
}	

	/*******************************************\
	*		Load App Page features Here			*
	\*******************************************/
	
jQuery(document).ready(function() {
	// first page load	
	jQuery('.verse').hover(function() {
			jQuery(this).addClass('hoverStyle');
		}, function() {
			jQuery(this).removeClass('hoverStyle');
		}
	);
	jQuery('.verse').click(function() {
		setBookmark(this);
	});
	
});

// script to set all app apge features
function appFeatures(){
	// for other ajax pages
	jQuery('.verse').hover(function() {
			jQuery(this).addClass('hoverStyle');
		}, function() {
			jQuery(this).removeClass('hoverStyle');
		}
	);
	jQuery('.verse').click(function() {
		setBookmark(this);
	});
	
	var bookMarks = jQuery.jStorage.get('bookmarks');
	if(bookMarks){
		jQuery.jStorage.deleteKey('bookmarks');
		jQuery.each( bookMarks, function( val, mark ) {
			if(jQuery("#" + val).length != 0) {
			  jQuery("#" + val).addClass('bookmark_'+mark);
			}
		});
	}
	// ensure that text gets resized
	setTextSize();
	//save bookmarks
	jQuery.jStorage.set('bookmarks',bookMarks);
	
}

// get selected text
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
// set the bookmark color
function setCurrentColor(mark){
	//save current bookmark
	jQuery.jStorage.set('currentMark',mark);
}
// set the text size
function setCurrentTextSize(size){
	//get current size
	var was = jQuery.jStorage.get('TextSize', 'medium');
	//save new current size
	jQuery.jStorage.set('TextSize',size);
	// update text
	setTextSize(was,size);
}
function setTextSize(wasSize,newSize){
	if(!newSize){
		var newSize = jQuery.jStorage.get('TextSize', 'medium');
	}
	// set new class size
	jQuery(".verse").addClass('verse_'+newSize);
	jQuery(".verse_nr").addClass('nr_'+newSize);
	if(wasSize){
		if(newSize !== wasSize){
			// remove last class size
			jQuery(".verse").removeClass('verse_'+wasSize);
			jQuery(".verse_nr").removeClass('nr_'+wasSize);
		}
	}
	
}
// set the bookmarks object
function setBookmark(e) {
	// get default current bookmark
	var markIt = jQuery.jStorage.get('markit', 1);
	if(markIt == 1){
		// get default current bookmark
		var currentMark = jQuery.jStorage.get('currentMark', 'a');
		// get bookmarks
		var bookMarksStore = jQuery.jStorage.get('bookmarks');
		if(!bookMarksStore){
			var bookMarksStore = {};
		}
		var id 	= jQuery(e).attr("id");
		var add = true;
		jQuery(bookmarksArray).each(function(index, mark) {
			// remove the class and unset values
			jQuery('#'+id+' span').removeClass('highlight');
			if(jQuery('#'+id).hasClass('bookmark_'+mark)){
				jQuery('#'+id).removeClass('bookmark_'+mark);
				delete bookMarksStore[id];
				if('bookmark_'+mark == 'bookmark_'+currentMark){
					add = false;
				}
			}
		});
		if (add){
			// add the class and set the values
			bookMarksStore[id] = currentMark;
			jQuery('#'+id).addClass('bookmark_'+currentMark);
		}
		
		//save bookmarks
		jQuery.jStorage.set('bookmarks',bookMarksStore);
	}
}

// load the next book
function loadNextBook(addTo,Found){
	
	//  Call to get scripture
	var bookNow = false;
	jQuery("#books option").each(function(){
		option = this.value;
		var check = option.split('__');
		if(check[2] == BIBLE_BOOK){
			bookNow = option;
			return false;
		}
	});
	if(bookNow){
		var bookNowArray 	= bookNow.split('__');
		var bookNew			= false;
		if(bookNowArray[1] == 66){
			--BIBLE_LAST_CHAPTER;
			--BIBLE_CHAPTER;
			jQuery('#scripture').removeClass('text_loading');
		} else {
			BIBLE_BOOK_NR 		= ++bookNowArray[1];
			jQuery("#books option").each(function(){
				option = this.value;
				var check = option.split('__');
				if(check[1] == BIBLE_BOOK_NR){
					bookNew = option;
					return false;
				}
			});
		}
		if(bookNew){
			// add loading class
			if(!addTo){
				jQuery('#scripture').addClass('text_loading');
			}
			jQuery('#t_loader').show();
			var bookNewArray 	= bookNew.split('__');
			BIBLE_BOOK			= bookNewArray[2];
			BIBLE_VERSION		= bookNewArray[0];
			BIBLE_CHAPTER 		= 1;
			BIBLE_LAST_CHAPTER 	= 0;
			getDataBo(BIBLE_VERSION,BIBLE_VERSION+'__'+BIBLE_BOOK_NR+'__'+BIBLE_BOOK);
			getDataCh(BIBLE_VERSION+'__'+BIBLE_BOOK_NR+'__'+BIBLE_BOOK);
			jQuery('#versions').val(BIBLE_VERSION);
			jQuery("#books").val(bookNew);
			jQuery('.search_book').val(BIBLE_BOOK);
			// set the search book ref
			jQuery('#prev').hide();
			// load next book
			getData('p='+BIBLE_BOOK+BIBLE_CHAPTER+'&v='+BIBLE_VERSION,addTo,Found);
			if(appMode == 2){
				gotoTop();
			}
		}
	}
}

// set the found verse page next chapter load text
FoundTheVerse = false;
// Ajax Call to get Data
function getData(request, addTo, Found) {
	// keep the api key out of the store value
	var requestStore = request;
	// if memory is too full remove some
	if(jQuery.jStorage.storageSize() > 4500000){ 
		var storeIndex = jQuery.jStorage.index();
		// now remove the first once set when full
		jQuery.jStorage.deleteKey(storeIndex[5]);
		jQuery.jStorage.deleteKey(storeIndex[6]);
		jQuery.jStorage.deleteKey(storeIndex[7]);
		jQuery.jStorage.deleteKey(storeIndex[8]);
		jQuery.jStorage.deleteKey(storeIndex[9]);
		
	}
	// add loading class
	if(!addTo){
		jQuery('#scripture').addClass('text_loading');
	}	
	if(Found){
		FoundTheVerse = Found;
	}
	// Check if "requestStore" exists in the local storage
	var jsonStore = jQuery.jStorage.get(requestStore);
	if(!jsonStore || typeof jsonStore.version === 'undefined'){
		if (typeof appKey !== 'undefined') {
			request = request+'&appKey='+appKey;
		}
		jQuery.ajax({
		 url:jsonUrl,
		 dataType: 'jsonp',
		 data: request,
		 jsonp: 'getbible',
		 success:function(json){
			 // and save the result
			 jQuery.jStorage.set(requestStore,json);
			 // set text direction
			 if (json.direction == 'RTL'){
				var direction = 'rtl';
			 } else {
				var direction = 'ltr'; 
			 }
			 // check json
			 if (json.type == 'verse'){
				setVerses(json,direction,addTo);
			 } else if (json.type == 'chapter'){
				setChapter(json,direction,addTo);
			 } else if (json.type == 'book'){
				setBook(json,direction,addTo);
			 } else if (json.type == 'search'){
				setSearch(json,direction);
			 }
			 jQuery('#b_loader').hide();
			 jQuery('#t_loader').hide();
			 if(searchApp != 1 || FoundTheVerse){
				jQuery('.navigation').show();
			 }
		 },
		 error:function(e){
				jQuery('#b_loader').hide();
				jQuery('#t_loader').hide();
				if((searchApp != 1) || FoundTheVerse){
					jQuery('.navigation').show();
				} else {
					jQuery('#scripture').html('<h2>Not Found! Please try again!</h2> '); // <---- this is the div id we update
					jQuery('#scripture').removeClass('text_loading');
				}
				if(!addTo && appMode == 1){
					jQuery('#scripture').html('<h2>No scripture was returned, please try again!</h2>'); // <---- this is the div id we update
					jQuery('#scripture').removeClass('text_loading');
				} else {
					// check if result else load next book
					loadNextBook(addTo,Found);
				}
			 },
		});
	} else {
		if(Found){
			FoundTheVerse = Found;
		}
		if(!addTo){
			jQuery('#scripture').addClass('text_loading');
		}
		// set text direction
		 if (jsonStore.direction == 'RTL'){
			var direction = 'rtl';
		 } else {
			var direction = 'ltr'; 
		 }
		 // check jsonStore
		 if (jsonStore.type == 'verse'){
			setVerses(jsonStore,direction,addTo);
		 } else if (jsonStore.type == 'chapter'){
			setChapter(jsonStore,direction,addTo);
		 } else if (jsonStore.type == 'book'){
			setBook(jsonStore,direction,addTo);
		 } else if (jsonStore.type == 'search'){
			setSearch(jsonStore,direction);
		 }
		 jQuery('#b_loader').hide();
		 jQuery('#t_loader').hide();
		 if(searchApp != 1 || FoundTheVerse){
			jQuery('.navigation').show();
		 }
	}
}

// Ajax Call to get Defaults
function getDefaults(getUrl, request, requestStore) {
	// Check if "requestStore" exists in the local storage
	var jsonStore = jQuery.jStorage.get(requestStore);
	if(!jsonStore){
		 if (typeof appKey !== 'undefined') {
			request = request+'&appKey='+appKey;
		}
		// get the chapters from server
		jQuery.ajax({
		 type: 'GET',
		 url: getUrl,
		 dataType: 'jsonp',
		 data: request,
		 jsonp: 'callback',
		 success:function(json){
			 // and save the result
			 jQuery.jStorage.set(requestStore,json);
			 // set defaults
			 BIBLE_BOOK 		= json.book_ref;
			 BIBLE_CHAPTER 		= json.chapter;
			 BIBLE_LAST_CHAPTER = json.lastchapter;
			 BIBLE_VERSION 		= json.version;
			 defaultVersion 	= json.version;
			 defaultVers		= json.vers;
			 defaultBook 		= json.book_ref;
			 defaultBookNr 		= json.book_nr;
			 defaultChapter 	= json.chapter;
			 setQuery 			= "p="+defaultBook+defaultChapter+"&v="+defaultVersion;
			 if(request && json.search == 1){
				 searchFor 			= json.searchFor;
				 searchCrit 		= json.crit;
				 searchType 		= json.type;
				 searchApp 			= json.search;
				 setQuery 			= "s="+searchFor+"&crit="+searchCrit+"&t="+searchType+"&v="+defaultVersion;
			 }
			 
			if(searchApp != 1){
				getDataBo(defaultVersion,defaultVersion+'__'+defaultBookNr+'__'+defaultBook);
				getDataCh(defaultVersion+'__'+defaultBookNr+'__'+defaultBook);
			} else {
				
				jQuery('#cPanel').hide();
				jQuery('.searchbuttons').show();
			}
			if(BIBLE_LAST_CHAPTER < 1){
				jQuery('#prev').hide();
			}
			// get the data
			getData(setQuery);
			// set the search version
			jQuery('.search_version').val(BIBLE_VERSION);
			// set the search book ref
			jQuery('.search_book').val(BIBLE_BOOK);
			 
		 },
		 error:function(e){
				
			 },
		});
	} else {
		// set defaults
		 BIBLE_BOOK 		= jsonStore.book_ref;	
		 BIBLE_CHAPTER 		= jsonStore.chapter;
		 BIBLE_LAST_CHAPTER = jsonStore.lastchapter;
		 BIBLE_VERSION 		= jsonStore.version;		
		 defaultVersion 	= jsonStore.version;
		 defaultVers		= jsonStore.vers;

		 defaultBook 		= jsonStore.book_ref;
		 defaultBookNr 		= jsonStore.book_nr;
		 defaultChapter 	= jsonStore.chapter;
		 setQuery 			= "p="+defaultBook+defaultChapter+"&v="+defaultVersion;
		 if(request && jsonStore.search == 1){
			 searchFor 			= jsonStore.searchFor;
			 searchCrit 		= jsonStore.crit;
			 searchType 		= jsonStore.type;
			 searchApp 			= jsonStore.search;
			 setQuery 			= "s="+searchFor+"&crit="+searchCrit+"&t="+searchType+"&v="+defaultVersion;
		 }
		 
		if(searchApp != 1){
			getDataBo(defaultVersion,defaultVersion+'__'+defaultBookNr+'__'+defaultBook);
			getDataCh(defaultVersion+'__'+defaultBookNr+'__'+defaultBook);
		} else {
			jQuery('#cPanel').hide();
			jQuery('.searchbuttons').show();
		}
		if(BIBLE_LAST_CHAPTER < 1){
			jQuery('#prev').hide();
		}
		// get the data
		getData(setQuery);
		// set the search version
		jQuery('.search_version').val(BIBLE_VERSION);
		// set the search book ref
		jQuery('.search_book').val(BIBLE_BOOK);
	}	
}

// Set Verses
function setVerses(json,direction,addTo){
	var output = '';
		jQuery.each(json.book, function(index, value) {
			output += '<p class="uk-text-center uk-text-bold">'+value.book_name+'&#160;'+value.chapter_nr+'</p><p class=\"'+direction+'\">';
			jQuery.each(value.chapter, function(index, value) {
				output += '&#160;&#160;<span class="verse_nr ltr">' +value.verse_nr+ '</span>&#160;&#160;<span class="verse" id="'+value.book_nr+'_'+value.chapter_nr+'_' +value.verse_nr+ '">';

				output += value.verse;
				if(verselineMode == 2){
					output += '</span>&#160;';
				} else {
					output += '</span><br/>';
				}
			});
			output += '</p>';
		});
		if(addTo){
			jQuery('#scripture').append(output);
		} else {
			jQuery('#scripture').html(output);  // <---- this is the div id we update
		}
		appFeatures();
		jQuery('#scripture').removeClass('text_loading');
}

// Set Chapter
function setChapter(json,direction,addTo){
	listVers = getVerses();
	jQuery("#books option:selected").text(json.book_name+' '+json.chapter_nr);
	var output = '<p class="'+direction+'">';
	jQuery.each(json.chapter, function(index, value) {
		if(isInArray(value.verse_nr, listVers)){
			output += '&#160;&#160;<span class="verse_nr ltr">' +value.verse_nr+ '</span>&#160;&#160;<span class="verse" id="'+json.book_nr+'_'+json.chapter_nr+'_' +value.verse_nr+ '">';
			output += '<span class="highlight">' +value.verse+ '</span>';
		} else {
			output += '&#160;&#160;<span class="verse_nr ltr">' +value.verse_nr+ '</span>&#160;&#160;<span class="verse" id="'+json.book_nr+'_'+json.chapter_nr+'_' +value.verse_nr+ '">';
			output += value.verse;
		}
		if(verselineMode == 2){
			output += '</span>&#160;';
		} else {
			output += '</span><br/>';
		}
	});
	output += '</p>';
	if(addTo){
		jQuery('#scripture').append(output);
	} else {
		jQuery('#scripture').html(output);  // <---- this is the div id we update
	}
	appFeatures();
	jQuery('#scripture').removeClass('text_loading');
}

// Set Book
function setBook(json,direction,addTo){
	var output = '';
	jQuery.each(json.book, function(index, value) {
		output += '<p class="uk-text-center uk-text-bold">'+json.book_name+'&#160;'+value.chapter_nr+'</p><p class="'+direction+'">';
		jQuery.each(value.chapter, function(index, value) {
			output += '&#160;&#160;<span class="verse_nr ltr">' +value.verse_nr+ '</span>&#160;&#160;<span class="verse" id="'+json.book_nr+'_'+value.chapter_nr+'_' +value.verse_nr+ '">';
			output += value.verse;
			if(verselineMode == 2){
				output += '</span>&#160;';
			} else {
				output += '</span><br/>';
			}
		});
		output += '</p>';
	});
	if(addTo){
		jQuery('#scripture').append(output);
	} else {
		jQuery('#scripture').html(output);  // <---- this is the div id we update
	}
	appFeatures();
	jQuery('#scripture').removeClass('text_loading');
}

// Set Search
function setSearch(json,direction){
	var output = '<small>('+json.counter+')</small><br/>';
	jQuery.each(json.book, function(index, value) {
		var book_ref 	= value.book_ref.replace(/\s+/g, '');
		var setCall 	= 'p='+book_ref+value.chapter_nr+"&v="+BIBLE_VERSION;
		var setGlobal 	= book_ref+'__'+value.book_nr+'__'+value.chapter_nr+'__'+BIBLE_VERSION;
		output += '<p class="uk-text-center uk-text-bold"><a href="javascript:void(0)" onclick="loadFoundChapter(\''+setCall+'\',\''+setGlobal+'\')">'+value.book_name+'&#160;'+value.chapter_nr+'</a></p><p class="'+direction+'">';
		jQuery.each(value.chapter, function(index, chapter) {
			output += '&#160;&#160;<span class="verse_nr ltr">' +chapter.verse_nr+ '</span>&#160;&#160;<span class="verse" id="'+value.book_nr+'_'+value.chapter_nr+'_' +chapter.verse_nr+ '">';
			output += chapter.verse;
			output += '</span><br/>';
		});
		output += '</p>';
	});
	jQuery('#scripture').html(output);  // <---- this is the div id we update
	// add highlighting if auto hightligs is turned on
	if(highlightOption == 1){
		highScripture();							
	}
	appFeatures();
	jQuery('#scripture').removeClass('text_loading');
}

// get verses from string
function getVerses(){
	if(isNumeric(defaultVers)){
		var listVers = [];
		if (isInArray(",", defaultVers)){
			var result = defaultVers.split(',');
		} else {
			if (isInArray("-", defaultVers)){
				var numbers = defaultVers.split('-');
				for (var nr = numbers[0]; nr <= numbers[1]; nr++) {
					listVers.push(nr*1);
				}
			} else {
				listVers.push(defaultVers*1);
			}
		}
		defaultVers = 0;
		if(typeof result !== 'undefined'){
			for(var i = 0; i <= result.length; i++){
				if (isInArray("-", result[i])){
					var numbers = result[i].split('-');
					for (var nr = numbers[0]; nr <= numbers[1]; nr++) {
						listVers.push(nr*1);
					}
				} else {
					listVers.push(result[i]*1);
				}
			}
		}
		return listVers;
	}
	return false;
}
// check if value is in array
function isInArray(value, array) {
	if(typeof array !== 'undefined'){
		if(array !== false){
  			return array.indexOf(value) > -1;
		}
	} return false;
}
// check if number is found in string but not 0
function isNumeric(number) {
	if(typeof number !== 'undefined'){
		if(number != 0 && number != null){
			var matches = number.match(/\d+/g);
			if (matches != null) {
				return true;
			}
		}
	}
	return false;
}

	/*******************************************\
	*			  Control Pannel				*
	\*******************************************/

// Ajax Call to get chapter
function getDataCh(call) {
	if (typeof cPanelUrl !== 'undefined') {
		getUrl = cPanelUrl+"index.php?option=com_getbible&task=bible.chapter&format=json";     	
	} else {
		getUrl = "index.php?option=com_getbible&task=bible.chapter&format=json";
	}
	jQuery('#scripture').addClass('text_loading');
	var result = call.split('__');
	var Get = 'v='+result[0]+'&nr='+result[1];
	// check if already in local store
	var requestStore = 'chapters_'+Get;
	var jsonStore = jQuery.jStorage.get(requestStore);
	if(!jsonStore){
		if (typeof appKey !== 'undefined') {
			Get = Get+'&appKey='+appKey;
		}
		// get the chapters from server
		jQuery.ajax({
		 type: 'GET',
		 url: getUrl,
		 dataType: 'jsonp',
		 data: Get,
		 jsonp: 'callback',
		 success:function(json){
			 // and save the result
			jQuery.jStorage.set(requestStore,json);
			var output = '<div style="display: inline-block;">';
			jQuery.each(json, function(index, element) {
				var setGlobal = result[2]+'__'+element+'__'+result[0];
				output += '<div style="float: left; margin: 5px;"><button  class="uk-button uk-button-small" type="button" href="javascript:void(0)" onclick="getScripture(\'p='+result[2]+element+'&v='+result[0]+'\', \''+setGlobal+'\')"><span style="display: block; width: 30px;">'+element+'</span></button></div>';
			});
			output += '</div>';
			jQuery('#t_loader').hide();
			jQuery('#chapters').html(output);  // <---- this is the div id we update
		 },
		 error:function(){
				jQuery('#chapters').html('error!');
			 },
		});
	} else {
		var output = '<div style="display: inline-block;">';
		jQuery.each(jsonStore, function(index, element) {
			var setGlobal = result[2]+'__'+element+'__'+result[0];
			output += '<div style="float: left; margin: 5px;"><button  class="uk-button uk-button-small" type="button" href="javascript:void(0)" onclick="getScripture(\'p='+result[2]+element+'&v='+result[0]+'\', \''+setGlobal+'\')"><span style="display: block; width: 30px;">'+element+'</span></button></div>';
		});
		output += '</div>';
		jQuery('#t_loader').hide();
		jQuery('#chapters').html(output);  // <---- this is the div id we update
	}
}

// Ajax Call to get Books
function getDataBo(version, first, versionChange) {
	jQuery('#books').hide();
	jQuery('#f_loader').show();
	if (typeof cPanelUrl !== 'undefined') {
		getUrl = cPanelUrl+"index.php?option=com_getbible&task=bible.books&format=json";     	
	} else {
		getUrl = "index.php?option=com_getbible&task=bible.books&format=json";
	}
	jQuery('#scripture').addClass('text_loading');
	
	// check if already in local store
	var requestStore = 'books_'+version;
	// first check if any books have been updated	
	var reloadBooksStore = jQuery.jStorage.get('booksDate');
	if(!reloadBooksStore){
			jQuery.jStorage.set('booksDate',booksDate);
			reloadBooksStore = booksDate;
	}
	if(reloadBooksStore == booksDate){
		var jsonStore = jQuery.jStorage.get(requestStore);
	} else {
		var newBooksDate = booksDate.split('_');
		if(version == newBooksDate[0]){
			var jsonStore = jQuery.jStorage.get('reload');
			jQuery.jStorage.set('booksDate',booksDate);
		} else {
			var jsonStore = jQuery.jStorage.get(requestStore);
		}
	}
	if(!jsonStore){
		var Get = 'v='+version;
		if (typeof appKey !== 'undefined') {
			Get = Get+'&appKey='+appKey;
		}
		// get the books from server
		jQuery.ajax({
		 type: 'GET',
		 url: getUrl,
		 dataType: 'jsonp',
		 data: Get,
		 jsonp: 'callback',
		 success:function(json){
			 // and save the result
			jQuery.jStorage.set(requestStore,json);
			var op = new Option('- Select Book -', '');
			/// jquerify the DOM object 'o' so we can use the html method
			jQuery(op).html('- Select Book -');
			jQuery('#books').append(op);
			jQuery.each(json, function() {
				str = this.ref.replace(/\s+/g, '');
				$value = version+'__'+this.book_nr+'__'+str;
				var op = new Option(this.book_name, $value);
				/// jquerify the DOM object 'o' so we can use the html method
				jQuery(op).html(this.book_name);
				jQuery('#books').append(op);
			});
			if(first){
				if(versionChange == 1){
					var active = first.split('__');
					var option = '';
					var loadthis = '';
					jQuery("#books option").each(function(){
						option = this.value;
						var check = option.split('__');
						if(check[1] == active[1]){
							 jQuery("#books").val(option);
							 loadthis = option;
							 breakOut = true;
							 return false;
						}
					});
					if(loadthis && breakOut){
						jQuery('#books').val(loadthis);
						var builder 	= loadthis.split('__');
						var calling 	= 'p='+builder[2]+BIBLE_CHAPTER+'&v='+builder[0];
						var globalSet 	= builder[2]+'__'+BIBLE_CHAPTER+'__'+builder[0];
						getDataCh(loadthis);
						getScripture(calling,globalSet);
					}
				} else {
					jQuery('#books').val(first);
				}
			}
			jQuery('#f_loader').hide();
			jQuery('#books').show();
		 },
		 error:function(){
				jQuery('#books').append('error');
			 },
		});
	} else {
		var op = new Option('- Select Book -', '');
		// jquerify the DOM object 'o' so we can use the html method
		jQuery(op).html('- Select Book -');
		jQuery('#books').append(op);
		jQuery.each(jsonStore, function() {
			str = this.ref.replace(/\s+/g, '');
			$value = version+'__'+this.book_nr+'__'+str;
			var op = new Option(this.book_name, $value);
			/// jquerify the DOM object 'o' so we can use the html method
			jQuery(op).html(this.book_name);
			jQuery('#books').append(op);
		});
		if(first){
			if(versionChange == 1){
				var active = first.split('__');
				var option = '';
				var loadthis = '';
				jQuery("#books option").each(function(){
					option = this.value;
					var check = option.split('__');
					if(check[1] == active[1]){
						 jQuery("#books").val(option);
						 loadthis = option;
						 breakOut = true;
						 return false;
					}
				});
				if(loadthis && breakOut){
					jQuery('#books').val(loadthis);
					var builder 	= loadthis.split('__');
					var calling 	= 'p='+builder[2]+BIBLE_CHAPTER+'&v='+builder[0];
					var globalSet 	= builder[2]+'__'+BIBLE_CHAPTER+'__'+builder[0];
					getDataCh(loadthis);
					getScripture(calling,globalSet);
				}
			} else {
				jQuery('#books').val(first);
			}
		}
		jQuery('#f_loader').hide();
		jQuery('#books').show();
	}
}
// scroll to top function
function gotoTop(){
	jQuery("html, body").animate({ scrollTop: 0 }, "slow");
}
// show chapter selection
function showChapters(slideup) {
	jQuery('.button').hide();
	jQuery('#chapters').slideDown( "slow" );
	if(slideup){
		gotoTop();
	}
}
//  Call to get scripture
function getScripture(call,setGlobal) {
	jQuery('#t_loader').show();
	var result = setGlobal.split('__');
	BIBLE_BOOK 			= result[0];
	BIBLE_CHAPTER 		= result[1];
	BIBLE_LAST_CHAPTER 	= -- result[1];
	BIBLE_VERSION		= result[2];
	getData(call);
	jQuery('#chapters').slideUp( "slow" );
	jQuery('.button').show();
	gotoTop();
	if(BIBLE_LAST_CHAPTER < 1){
		jQuery('#prev').hide();
	}
}

// Set window scroll
var didScroll = false;
jQuery(window).scroll(function() {
    didScroll = true;
});
// set delay timer var
var clickTimer = false;
// Get next chapter as you scroll down
function loadTimer1(){
	timerInterval_1 = setInterval(function() {
		if ((autoLoadChapter === 1) && didScroll) {
			if (jQuery(window).scrollTop() >= jQuery(document).height() - jQuery(window).height() - 10) {
				if(appMode == 1){				
					// listen for click
				   if(clickTimer) { 
					  // abort previous request if 800ms have not passed
					  clearTimeout(clickTimer);
				   }
					clickTimer = setTimeout(function() {  nextChapter();  },1000);
				} else {
					nextChapter();
				}
				// set scroll lock
				didScroll = false;
			 }
		}
	}, 250);
}

// get next chapter with next button
function nextChapter(){
	BIBLE_LAST_CHAPTER = BIBLE_CHAPTER;
	BIBLE_CHAPTER++;
	if(appMode == 1){
		addTo = true;
		jQuery('#b_loader').show();
	} else if(appMode == 2){
		addTo = false;
		gotoTop();
		jQuery('#t_loader').show();
		if(BIBLE_CHAPTER > 1){
			jQuery('#prev').show();
		}
	}
	jQuery('.navigation').hide();
	getData('p='+BIBLE_BOOK+BIBLE_CHAPTER+'&v='+BIBLE_VERSION,addTo);
}
// get previous chapter with prev button
function prevChapter(){
	addTo = false;
	if(appMode == 2){
		gotoTop();
	}
	if(BIBLE_LAST_CHAPTER < 1){
		// this should not happen... since it should be hidden.
		jQuery('#prev').hide();
	} else {
		jQuery('.navigation').hide();
		jQuery('#t_loader').show();
		getData('p='+BIBLE_BOOK+BIBLE_LAST_CHAPTER+'&v='+BIBLE_VERSION,addTo);
		BIBLE_CHAPTER--;
		BIBLE_LAST_CHAPTER--;
		if(BIBLE_LAST_CHAPTER < 1){
			jQuery('#prev').hide();
		}
	}
}
