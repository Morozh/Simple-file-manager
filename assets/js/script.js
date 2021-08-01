(function($){
	$.fn.tablesorter = function() {
		let $table = this;
		let $tableTwo = this;
		this.find('th').click(function() {
			let idx = $(this).index();
			let direction = $(this).hasClass('sort_asc');
			$table.tablesortby(idx,direction);
			$tableTwo.tablesortby(idx,direction);
		});
		return this;
	};
	$.fn.tablesortby = function(idx,direction) {
		let $rows = this.find('tbody tr');
		function elementToVal(a) {
			let $a_elem = $(a).find('td:nth-child('+(idx+1)+')');
			let a_val = $a_elem.attr('data-sort') || $a_elem.text();
			return (a_val == parseInt(a_val) ? parseInt(a_val) : a_val);
		}
		$rows.sort(function(a,b){
			let a_val = elementToVal(a), b_val = elementToVal(b);
			return (a_val > b_val ? 1 : (a_val == b_val ? 0 : -1)) * (direction ? 1 : -1);
		})
		this.find('th').removeClass('sort_asc sort_desc');
		$(this).find('thead th:nth-child('+(idx+1)+')').addClass(direction ? 'sort_desc' : 'sort_asc');
		for(let i = 0; i< $rows.length; i++)
			this.append($rows[i]);
		this.settablesortmarkers();
		return this;
	}
	$.fn.retablesort = function() {
		let $e = this.find('thead th.sort_asc, thead th.sort_desc');
		if($e.length)
			this.tablesortby($e.index(), $e.hasClass('sort_desc') );

		return this;
	}
	$.fn.settablesortmarkers = function() {
		this.find('thead th span.indicator').remove();
		this.find('thead th.sort_asc').append('<span class="indicator">&darr;<span>');
		this.find('thead th.sort_desc').append('<span class="indicator">&uarr;<span>');
		return this;
	}
})(jQuery);
$(function(){
	let XSRF = (document.cookie.match('(^|; )_sfm_xsrf=([^;]*)')||0)[2];
	let $tbody = $('#list');
	let $tbodyTwo = $('#list-two');
	$(window).on('hashchange',list).trigger('hashchange');
	$('#table').tablesorter();
	$('#table-two').tablesorter();

	$('#del-file').on('click', function() {
		$('tbody tr input:checkbox:checked').each(function() {
			$.post("",{'do':'delete',file:$(this).parent().attr('data-file'),xsrf:XSRF},function(response){
				list();
			},'json');
			$(this).parent().remove();
		})
	});

	$('#del-file-two').on('click', function() {
		$('tbody tr input:checkbox:checked').each(function() {
			$.post("",{'do':'delete',file:$(this).parent().attr('data-file'),xsrf:XSRF},function(response){
				list();
			},'json');
			$(this).parent().remove();
		})
	});

	$('#mkdir').submit(function(e) {
		let hashval = decodeURIComponent(window.location.hash.substr(1)),
			$dir = $(this).find('[name=name]');
		e.preventDefault();
		let trData = " ";

		$dir.val().length && $.post('?',{'do':'mkdir',name:$dir.val(),xsrf:XSRF,file:hashval},function(data){
			trData = data;
			list();
		},'json');
		$dir.val('');

		return false;
	});

	function list() {
		let hashval = window.location.hash.substr(1);
		$.get('?do=list&file='+ hashval,function(data) {
			$tbody.empty();
			$tbodyTwo.empty();
			$('#breadcrumb').empty().html(renderBreadcrumbs(hashval));
			$('#breadcrumb-two').empty().html(renderBreadcrumbs(hashval));
			if(data.success) {
				$.each(data.results,function(k,v){
					$tbody.append(renderFileRow(v));
					$tbodyTwo.append(renderFileRow(v));
				});
				!data.results.length && $tbody.append('<tr><td class="empty" colspan=3>Папка пуста</td></tr>')
				data.is_writable ? $('body').removeClass('no_write') : $('body').addClass('no_write');
				!data.results.length && $tbodyTwo.append('<tr><td class="empty" colspan=3>Папка пуста</td></tr>')
				data.is_writable ? $('body').removeClass('no_write') : $('body').addClass('no_write');
				$('tbody tr').prepend('<input type="checkbox" />');
			} else {
				console.warn(data.error.msg);
			}
			$('#table').retablesort();
			$('#table-two').retablesort();
		},'json');
	}

	function renderFileRow(data) {
		console.log(data.mtime);
		let $link = $('<a class="name" />')
			.attr('href', data.is_dir ? '#' + encodeURIComponent(data.path) : './' + data.path)
			.text(data.name);
		let allow_direct_link = true;
		if (!data.is_dir && !allow_direct_link)  $link.css('pointer-events','none');
		let $delete_link = $('<a href="#" />').attr('data-file',data.path).addClass('delete').text('delete');
		let perms = [];
		if(window.location.hash != '') {
			$('.get-back').css('display', 'block');
			$('tbody').css('padding-top', + 60);
		} else {
			$('.get-back').css('display', 'none');
			$('tbody').css('padding-top', + 40);
		}
		let $html = $('<tr />')
			.addClass(data.is_dir ? 'is_dir' : '').attr('data-file', data.path)
			.append( $('<td class="first" />').append($link) )
			.append( $('<td/>').attr('data-sort',data.is_dir ? -1 : data.size)
				.html($('<span class="size" />').text(formatFileSize(data.size))) )
			.append( $('<td/>').attr('data-sort',data.mtime).text(formatTimestamp(data.mtime)) )
		return $html;
	}

	function renderBreadcrumbs(path) {
		let base = "",
			$html = $('<div/>').append( $('<a href=#>Корневая папка</a></div>') );
		$.each(path.split('%2F'),function(k,v){
			if(v) {
				let v_as_text = decodeURIComponent(v);
				$html.append( $('<span/>').text('/') )
					.append( $('<a/>').attr('href','#'+base+v).text(v_as_text) );
				base += v + '%2F';
			}
		});
		return $html;
	}

	$('.get-back').on('click', function() {
		window.location.hash = $('#breadcrumb').find('a').eq(-2).attr('href');
	});

	function formatTimestamp(unix_timestamp) {
		let m = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
		let d = new Date(unix_timestamp*1000);
		return [m[d.getMonth()],' ',d.getDate(),', ',d.getFullYear()," ",
			(d.getHours() % 12 || 12),":",(d.getMinutes() < 10 ? '0' : '')+d.getMinutes(),
			" ",d.getHours() >= 12 ? 'PM' : 'AM'].join('');
	}

	function formatFileSize(bytes) {
		let s = ['bytes', 'KB','MB','GB','TB','PB','EB'];
		for(var pos = 0; bytes >= 1000; pos++,bytes /= 1024);
		let d = Math.round(bytes*10);
		return pos ? [parseInt(d/10),".",d%10," ",s[pos]].join('') : bytes + ' bytes';
	}
})

$(document).ready(function($) {
	$('.popup-open').click(function() {
		$('.popup-fade').fadeIn();
		return false;
	});	
		
	$(document).keydown(function(e) {
		if (e.keyCode === 27) {
			e.stopPropagation();
			$('.popup-fade').fadeOut();
		}
	});
	
	$('.popup-fade').click(function(e) {
		if ($(e.target).closest('.popup').length == 0) {
			$(this).fadeOut();					
		}
	});
});