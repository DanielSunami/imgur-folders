!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;b="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,b.treo=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);var j=new Error("Cannot find module '"+g+"'");throw j.code="MODULE_NOT_FOUND",j}var k=c[g]={exports:{}};b[g][0].call(k.exports,function(a){var c=b[g][1][a];return e(c?c:a)},k,k.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){function e(a,b,c,d){this.store=a,this.name=b,this.field=c,this.opts=d,this.multi=d.multi||d.multiEntry||!1,this.unique=d.unique||!1}var d=a("idb-range");b.exports=e,e.prototype.get=function(a,b){function f(a){c.push(a.value),a.continue()}var c=[],d=this.unique,e={range:a,iterator:f};this.cursor(e,function(a){return a?b(a):void(d?b(null,c[0]):b(null,c))})},e.prototype.count=function(a,b){var c=this.store.name,e=this.name;this.store.db.transaction("readonly",[c],function(f,g){if(f)return b(f);var h=g.objectStore(c).index(e),i=h.count(d(a));i.onerror=b,i.onsuccess=function(c){b(null,c.target.result)}})},e.prototype.cursor=function(a,b){a.index=this.name,this.store.cursor(a,b)}},{"idb-range":6}],2:[function(a,b,c){function f(a,b){this.db=null,this.name=a,this.indexes={},this.opts=b,this.key=b.key||b.keyPath||void 0,this.increment=b.increment||b.autoIncretement||void 0}var d=a("component-type"),e=a("idb-range");b.exports=f,f.prototype.index=function(a){return this.indexes[a]},f.prototype.put=function(a,b,c){var e=this.name,f=this.key;f&&("object"==d(a)?(c=b,b=a,a=null):b[f]=a),this.db.transaction("readwrite",[e],function(d,g){if(d)return c(d);var h=g.objectStore(e),i=f?h.put(b):h.put(b,a);g.onerror=g.onabort=i.onerror=c,g.oncomplete=function(){c(null,i.result)}})},f.prototype.get=function(a,b){var c=this.name;this.db.transaction("readonly",[c],function(d,e){if(d)return b(d);var f=e.objectStore(c),g=f.get(a);g.onerror=b,g.onsuccess=function(c){b(null,c.target.result)}})},f.prototype.del=function(a,b){var c=this.name;this.db.transaction("readwrite",[c],function(d,e){if(d)return b(d);var f=e.objectStore(c),g=f.delete(a);e.onerror=e.onabort=g.onerror=b,e.oncomplete=function(){b()}})},f.prototype.count=function(a){var b=this.name;this.db.transaction("readonly",[b],function(c,d){if(c)return a(c);var e=d.objectStore(b),f=e.count();f.onerror=a,f.onsuccess=function(c){a(null,c.target.result)}})},f.prototype.clear=function(a){var b=this.name;this.db.transaction("readwrite",[b],function(c,d){if(c)return a(c);var e=d.objectStore(b),f=e.clear();d.onerror=d.onabort=f.onerror=a,d.oncomplete=function(){a()}})},f.prototype.batch=function(a,b){var c=this.name,d=this.key,e=Object.keys(a);this.db.transaction("readwrite",[c],function(f,g){function j(){if(!(i>=e.length)){var g,c=e[i],f=a[c];null===f?g=h.delete(c):d?(f[d]||(f[d]=c),g=h.put(f)):g=h.put(f,c),g.onerror=b,g.onsuccess=j,i+=1}}if(f)return b(f);var h=g.objectStore(c),i=0;g.onerror=g.onabort=b,g.oncomplete=function(){b()},j()})},f.prototype.all=function(a){function c(a){b.push(a.value),a.continue()}var b=[];this.cursor({iterator:c},function(c){c?a(c):a(null,b)})},f.prototype.cursor=function(a,b){var c=this.name;this.db.transaction("readonly",[c],function(d,f){if(d)return b(d);var g=a.index?f.objectStore(c).index(a.index):f.objectStore(c),h=g.openCursor(e(a.range));h.onerror=b,h.onsuccess=function(d){var e=d.target.result;e?a.iterator(e):b()}})}},{"component-type":5,"idb-range":6}],3:[function(a,b,c){function g(){return this instanceof g?(this._stores={},this._current={},void(this._versions={})):new g}var d=a("component-type"),e=a("./idb-store"),f=a("./idb-index");b.exports=g,g.prototype.version=function(a){if("number"!=d(a)||a<1||a<this.getVersion())throw new TypeError("not valid version");return this._current={version:a,store:null},this._versions[a]={stores:[],dropStores:[],indexes:[],dropIndexes:[],version:a},this},g.prototype.addStore=function(a,b){if("string"!=d(a))throw new TypeError("`name` is required");if(this._stores[a])throw new TypeError("store is already defined");var c=new e(a,b||{});return this._stores[a]=c,this._versions[this.getVersion()].stores.push(c),this._current.store=c,this},g.prototype.dropStore=function(a){if("string"!=d(a))throw new TypeError("`name` is required");var b=this._stores[a];if(!b)throw new TypeError("store is not defined");return delete this._stores[a],this._versions[this.getVersion()].dropStores.push(b),this},g.prototype.addIndex=function(a,b,c){if("string"!=d(a))throw new TypeError("`name` is required");if("string"!=d(b)&&"array"!=d(b))throw new TypeError("`field` is required");var e=this._current.store;if(e.indexes[a])throw new TypeError("index is already defined");var g=new f(e,a,b,c||{});return e.indexes[a]=g,this._versions[this.getVersion()].indexes.push(g),this},g.prototype.dropIndex=function(a){if("string"!=d(a))throw new TypeError("`name` is required");var b=this._current.store.indexes[a];if(!b)throw new TypeError("index is not defined");return delete this._current.store.indexes[a],this._versions[this.getVersion()].dropIndexes.push(b),this},g.prototype.getStore=function(a){if("string"!=d(a))throw new TypeError("`name` is required");if(!this._stores[a])throw new TypeError("store is not defined");return this._current.store=this._stores[a],this},g.prototype.getVersion=function(){return this._current.version},g.prototype.callback=function(){var a=Object.keys(this._versions).map(function(a){return this._versions[a]},this).sort(function(a,b){return a.version-b.version});return function(c){var d=c.target.result,e=c.target.transaction;a.forEach(function(a){c.oldVersion>=a.version||(a.stores.forEach(function(a){var b={};"undefined"!=typeof a.key&&(b.keyPath=a.key),"undefined"!=typeof a.increment&&(b.autoIncrement=a.increment),d.createObjectStore(a.name,b)}),a.dropStores.forEach(function(a){d.deleteObjectStore(a.name)}),a.indexes.forEach(function(a){var b=e.objectStore(a.store.name);b.createIndex(a.name,a.field,{unique:a.unique,multiEntry:a.multi})}),a.dropIndexes.forEach(function(a){var b=e.objectStore(a.store.name);b.deleteIndex(a.name)}))})}}},{"./idb-index":1,"./idb-store":2,"component-type":5}],4:[function(a,b,c){(function(d){function i(a,b){if(!(this instanceof i))return new i(a,b);if("string"!=e(a))throw new TypeError("`name` required");if(!(b instanceof f))throw new TypeError("not valid schema");this.name=a,this.status="close",this.origin=null,this.stores=b._stores,this.version=b.getVersion(),this.onupgradeneeded=b.callback(),Object.keys(this.stores).forEach(function(a){this.stores[a].db=this},this)}function j(){return k().cmp.apply(k(),arguments)}function k(){return d._indexedDB||d.indexedDB||d.msIndexedDB||d.mozIndexedDB||d.webkitIndexedDB}var e=a("component-type"),f=a("./schema"),g=a("./idb-store"),h=a("./idb-index");c=b.exports=i,c.schema=f,c.cmp=j,c.Treo=i,c.Schema=f,c.Store=g,c.Index=h,i.prototype.use=function(a){return a(this,c),this},i.prototype.drop=function(a){var b=this.name;this.close(function(c){if(c)return a(c);var d=k().deleteDatabase(b);d.onerror=a,d.onsuccess=function(){a()}})},i.prototype.close=function(a){return"close"==this.status?a():void this.getInstance(function(b,c){return b?a(b):(c.origin=null,c.status="close",c.close(),void a())})},i.prototype.store=function(a){return this.stores[a]},i.prototype.getInstance=function(a){if("open"==this.status)return a(null,this.origin);if("opening"==this.status)return this.queue.push(a);this.status="opening",this.queue=[a];var b=this,c=k().open(this.name,this.version);c.onupgradeneeded=this.onupgradeneeded,c.onerror=c.onblocked=function(c){b.status="error",b.queue.forEach(function(a){a(c)}),delete b.queue},c.onsuccess=function(c){b.origin=c.target.result,b.status="open",b.origin.onversionchange=function(){b.close(function(){})},b.queue.forEach(function(a){a(null,b.origin)}),delete b.queue}},i.prototype.transaction=function(a,b,c){this.getInstance(function(d,e){d?c(d):c(null,e.transaction(b,a))})}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./idb-index":1,"./idb-store":2,"./schema":3,"component-type":5}],5:[function(a,b,c){var d=Object.prototype.toString;b.exports=function(a){switch(d.call(a)){case"[object Date]":return"date";case"[object RegExp]":return"regexp";case"[object Arguments]":return"arguments";case"[object Array]":return"array";case"[object Error]":return"error"}return null===a?"null":void 0===a?"undefined":a!==a?"nan":a&&1===a.nodeType?"element":(a=a.valueOf?a.valueOf():Object.prototype.valueOf.apply(a),typeof a)}},{}],6:[function(a,b,c){(function(a){function c(a){return"[object Object]"==Object.prototype.toString.call(a)}b.exports=function(d){var e=a.IDBKeyRange||a.webkitIDBKeyRange;if(d instanceof e)return d;if("undefined"==typeof d)return null;if(!c(d))return e.only(d);var f=Object.keys(d).sort();if(1==f.length){var g=f[0],h=d[g];switch(g){case"eq":return e.only(h);case"gt":return e.lowerBound(h,!0);case"lt":return e.upperBound(h,!0);case"gte":return e.lowerBound(h);case"lte":return e.upperBound(h);default:throw new TypeError("`"+g+"` is not valid key")}}else{var i=d[f[0]],j=d[f[1]],k=f.join("-");switch(k){case"gt-lt":return e.bound(i,j,!0,!0);case"gt-lte":return e.bound(i,j,!0,!1);case"gte-lt":return e.bound(i,j,!1,!0);case"gte-lte":return e.bound(i,j,!1,!1);default:throw new TypeError("`"+k+"` are conflicted keys")}}}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[4])(4)});

var schema = treo.schema()
	.version(1)
		.addStore('images', { key: 'filename' })
			.addIndex('byFolder', 'folder')
			.addIndex('byName', 'name')
		.addStore('folders', {key: 'name'})
			.addIndex('parent','parent')

var db = treo('imgur-folders', schema);
var images = db.store('images');
var folders = db.store('folders');
folders.put({name: '', parent: ''}, function(err, f){});

function copyTextToClipboard(text) {
	var textArea = document.createElement("textarea");
	textArea.style.position = 'fixed';
	textArea.style.top = '0';
	textArea.style.left = '0';
	textArea.style.width = '2em';
	textArea.style.height = '2em';
	textArea.style.padding = '0';
	textArea.style.border = 'none';
	textArea.style.outline = 'none';
	textArea.style.boxShadow = 'none';
	textArea.style.background = 'transparent';
	textArea.value = text;
	document.body.appendChild(textArea);
	textArea.select();

	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		$('#humanMsg p').text(text+' copied!');
		$('#humanMsg').show();
		$('#humanMsg').animate({opacity: 1});	
	} catch (err) {
		$('#humanMsg p').text('Unable to copy.');
		console.log('[imgur-folders] '+err);
	}
	setTimeout(function(){$('#humanMsg').animate({opacity: 0},function(){$('#humanMsg').hide()})}, 1500);

	document.body.removeChild(textArea);
}

function updateFolder(folder = ''){
	$('#folder-content').empty();

	var addImages = function(){
		images.index('byFolder').get(folder, function(err, img) {
			for(var i in img) {
				!function(obj){
					$('#folder-content').append(
						$('<div style="margin: 0px 4px 2px 0; cursor: pointer;"><img src="http://i.imgur.com/'+obj.thumb+'"/></div>')
							.click(function(e){
								copyTextToClipboard('http://i.imgur.com/'+obj.filename+'.'+obj.ext);
							})
					)
				}({filename: img[i].filename, thumb: img[i].thumb, ext: img[i].ext})
			}
		});
	}

	folders.index('parent').get(folder, function(err, folders){
		for(var a in folders) {
			!function(obj){
				if(folders[a].name !== '') $('#folder-content').append(
					$('<div style="margin: 0px 4px 2px 0; width: 90px; height: 90px; line-height: 90px; text-align: center; cursor: pointer; background-color: #191919;">'+folders[a].name+'</div>')
						.click(function(e){
							console.log('abrindo pasta:'+ obj.name);
							updateFolder(obj.name);
						})
					)
			}({name:folders[a].name})
		}
		addImages();
	});
	
}

function a() {
	$('.post-image').each(function(i, elem){
		var input = $('<input type="text" style="display: inline-block; width: 65%; margin: 2px 7px 2px 2px;" placeholder="folder (optional)">');
		$('<div class="folders" style="left: '+($(elem).position().left-34)+'px;">')
			.append(
				$('<div class="icon-plus folders-icon"></div>')
					.click(function(e){$(this.parentElement).animate({left: ($(elem).position().left-$(this.parentElement).innerWidth())+"px"}, function(){$(this).css('z-index','2')})}),
				input,
				$('<button class="btn-small" style="display: inline-block; background-color: #1bb76e; padding: 8px 10px 6px; font-weight: 600;">Add</button>')
					.click(function (e){
						if(/\/(\/+)/g.test(input.val()) || /^\//.test(input.val()) || /\/$/.test(input.val())) {
							return false;
						}
						
						var folder = input.val();
						var name = "";
						if(/\//.test(input.val())) {
							var pair = input.val().split('/');
							folder = pair[0];
							name = pair[1];
						}
						folders.put({name: folder, parent: ''}, function(err, f){});
						var t = elem.querySelector('img').src.split('/');
						var thumb = t[t.length-1].split('.');
						thumb[0] = elem.parentElement.id+'s';
						images.put({filename: elem.parentElement.id, name: name, folder: folder, ext: thumb[1], thumb: thumb.join('.')}, function(err, image){});
						$(this.parentElement).css('z-index','0').animate({left: ($(elem).position().left-32)+"px"});
						updateFolder();
					})
			).insertBefore(elem);
	});
}

a();

var box = $('<div style="margin: 0 auto; width: 900px"><div style="position: fixed; bottom: 0; width: 220px; margin-left: 728px; z-index: 100;"><div style="padding:10px; border-radius: 3px 3px 0 0; background-color: #2c2f34;"><h3 style="display: inline;">folders</h3><span style="right: 20px; position: absolute; display: inline; font-size: 30px; top: -2px; cursor: pointer;">..</span></div><div id="folder-content" style="height: 200px; display: flex; flex-wrap: wrap; overflow-y: scroll; padding: 4px 4px 4px 10px; background-color: black;"></div><div style="background-color: #2c2f34; padding: 4px 2px 9px;"><input type="text" style="width: 75%; margin: 0 3px 0 0;" placeholder="Image URL" /><button class="btn-small" style="display: inline-block; background-color: #1bb76e; padding: 8px 10px 6px; font-weight: 600;">Add</button></div></div></div></div>')
$(box).find('span').click(function(){updateFolder()});
box.insertAfter(document.body.lastElementChild);

$(document.body).keypress(function(e){if(e.keyCode === 113 && $('.folders').length === 0) a()})
updateFolder();