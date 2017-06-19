!function(){

	var imagesDB, foldersDB;

	function init(){
		//db init
		var schema = treo.schema()
			.version(1)
				.addStore('images', { key: 'filename' })
					.addIndex('byFolder', 'folder')
					.addIndex('byName', 'name')
				.addStore('folders', {key: 'name'})
					.addIndex('parent','parent');
		var db = treo('imgur-folders', schema);
		imagesDB = db.store('images');
		foldersDB = db.store('folders');
		foldersDB.put({name: '', parent: ''}, function(err, f){});

		//initiate box
		var boxTemplate = 
			'<div class="imgur-folders-box">' +
				'<div class="imgur-folders-box-wrapper">' +
					'<div class="imgur-folders-box-header">' +
						'<h3 style="display: inline;">folders</h3>' +
						'<span class="icon-arrow-down" style="right: 60px; position: absolute; display: block; top: 15px;cursor: pointer;"></span>' +
						'<span style="right: 20px; position: absolute; display: inline; font-size: 30px; top: -2px; cursor: pointer;">..</span>' +
					'</div>' +
					'<div id="nano-wrapper" class="nano" style="height: 200px;max-height: 200px;">'+
						'<div id="imgur-folders-box-content" class="nano-content"></div>' +
					'</div>' +
					'<div class="imgur-folders-box-action">' +
						'<input type="text" style="width: 75%; margin: 0 3px 0 0;" placeholder="Image URL" />' +
						'<button class="btn-small" style="display: inline-block; background-color: #1bb76e; padding: 8px 10px 6px; font-weight: 600;">Add</button>' +
					'</div>' +
				'</div>' +
			'</div>';
		
		var box = $(boxTemplate);
		box.find('span').click(function(){updateFolder()});
		box.insertAfter(document.body.lastElementChild);

		var boxHeight = $('.imgur-folders-box-wrapper').innerHeight();
		$('.imgur-folders-box-wrapper').css({height: boxHeight});

		$('.imgur-folders-box').draggable({axis: "x", handle: ".imgur-folders-box-header"});
		$('.imgur-folders-box-header span.icon-arrow-down').click(function(){
			if($('.imgur-folders-box-wrapper').innerHeight() == $('.imgur-folders-box-header').innerHeight()) $('.imgur-folders-box-wrapper').css({height: boxHeight});
			else $('.imgur-folders-box-wrapper').css({height: $('.imgur-folders-box-header').innerHeight()});
		})
		//init folders and tags
		updateFolder();

		try{
			$("#nano-wrapper").nanoScroller();
			$('#nano-wrapper > .nano-pane').css('display','');
		} catch(e){
			console.log('[imgur-folders] '+e);
		}
		
		console.log('entrando no each');
		$('.post-image').each(function(i, elem){
			new postTag(elem).insertBefore(elem);
		});

		document.querySelector('.post-container').addEventListener( 'DOMNodeInserted', function(e){
			if(e.target.querySelector('.post-image')) new postTag(e.target.querySelector('.post-image')).insertBefore(e.target.querySelector('.post-image'));
		}, false);
	}

	function postTag(post){

		_self = this;
		_self.expanded = false;
		var postLeftPosition = $(post).position().left;
		
		/**
		 * Object containing all templates to tag
		 */
		var template = {
			container: '<div class="imgur-folders-tag" style="left: '+(postLeftPosition-32)+'px;">',
			icon: '<div class="icon-plus imgur-folders-tag-icon"></div>',
			input: '<input type="text" class="imgur-folders-tag-input" placeholder="folder (optional)">',
			button: '<button class="btn-small imgur-folders-tag-button">Add</button>'
		}

		var containerDiv = $(template.container),
			iconDiv = $(template.icon),
			addButton = $(template.button),
			input = $(template.input);


		/**
		 * Expand tag and put it above post.
		 */
		var expand = function(){
			containerDiv.animate({
					left: (postLeftPosition-containerDiv.innerWidth())+"px"
				},
				function() {
					containerDiv.css('z-index','2');
					_self.expanded = true;
				}
			);
		}

		/**
		 * Collapse tag and put it beneath post.
		 */
		var collapse = function(){
			containerDiv.css('z-index','0').animate({left: (postLeftPosition-32)+"px"}, function(){_self.expanded = false;});		
		}

		/**
		 * Toggle between collapsed and expanded.
		 */
		var toggle = function(){
			if(_self.expanded) collapse();
			else expand();
		}

		/**
	 	 * Insert image in db
		 */
		var insertImage = function (e){
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
			foldersDB.put({name: folder, parent: ''}, function(err, f){});
			var t = (post.querySelector('img') || post.querySelector('source')).src.split('/');
			var thumb = t[t.length-1].split('.');
			thumb[0] = post.parentElement.id+'s';
			imagesDB.put({filename: post.parentElement.id, name: name, folder: folder, ext: thumb[1], thumb: thumb[0]+'.jpg'}, function(err, image){});
			$(this.parentElement).css('z-index','0').animate({left: ($(post).position().left-32)+"px"});
			updateFolder(folder);
		}

		addButton.click(insertImage);
		addButton.click(collapse);
		iconDiv.click(toggle);
		containerDiv.append(iconDiv, input, addButton);

		return containerDiv;
	}

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

	/**
	 *
	 */
	function loadImages(folder){
		imagesDB.index('byFolder').get(folder, function(err, img) {
			for(var i in img) {
				!function(obj){
					$('#imgur-folders-box-content').append(
						$('<div style="margin: 0px 4px 2px 0;">').append(
							$('<img src="http://i.imgur.com/'+obj.thumb+'" width="90" height="90" style="cursor: pointer;"/></div>')
								.click(function(e){
									copyTextToClipboard('http://i.imgur.com/'+obj.filename+'.'+obj.ext);
								})
						)
					)
				}({filename: img[i].filename, thumb: img[i].thumb, ext: img[i].ext})
			}
		});
	}

	/**
	 *
	 */
	function updateFolder(folder = ''){
		$('#imgur-folders-box-content').empty();

		foldersDB.index('parent').get(folder, function(err, folders){
			for(var a in folders) {
				!function(obj){
					if(folders[a].name !== '') $('#imgur-folders-box-content').append(
						$('<div style="margin: 0px 4px 2px 0; width: 90px; height: 90px; line-height: 90px; text-align: center; cursor: pointer; background-color: #191919;">'+folders[a].name+'</div>')
							.click(function(e){
								console.log('[imgur-folders] abrindo pasta:'+ obj.name);
								this.updateFolder(obj.name);
							})
						)
				}({name:folders[a].name})
			}
			loadImages(folder);
		});
	}

	init();
}()
