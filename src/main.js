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

function insertImage(e){
	console.log(this);
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
					.click(insertImage)
			).insertBefore(elem);
	});
}

a();

var box = $('<div style="margin: 0 auto; width: 900px"><div style="position: fixed; bottom: 0; width: 220px; margin-left: 728px; z-index: 100;"><div style="padding:10px; border-radius: 3px 3px 0 0; background-color: #2c2f34;"><h3 style="display: inline;">folders</h3><span style="right: 20px; position: absolute; display: inline; font-size: 30px; top: -2px; cursor: pointer;">..</span></div><div id="folder-content" style="height: 200px; display: flex; flex-wrap: wrap; overflow-y: scroll; padding: 4px 4px 4px 10px; background-color: black;"></div><div style="background-color: #2c2f34; padding: 4px 2px 9px;"><input type="text" style="width: 75%; margin: 0 3px 0 0;" placeholder="Image URL" /><button class="btn-small" style="display: inline-block; background-color: #1bb76e; padding: 8px 10px 6px; font-weight: 600;">Add</button></div></div></div></div>')
$(box).find('span').click(function(){updateFolder()});
box.insertAfter(document.body.lastElementChild);

$(document.body).keypress(function(e){if(e.keyCode === 113 && $('.folders').length === 0) a()})
updateFolder();