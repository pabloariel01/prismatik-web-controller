$(window).load(function() {
	$('#loading').fadeOut(500);
});

jQuery(function($) {

	var profile 	= $('#profile'),
		mode 		= $('#mode'),
		btnStatus 	= $('.btn-status');

	var defValue = new Object();

	$('#color').spectrum({
		flat: true,
		showButtons: false,
		move: function(color) {
			sendData('static='+color.toHexString());
		}
	});

	$('.slider').noUiSlider({
		range: [15,255],
		start: 20,
		handles: 1,
		connect: 'lower',
		set: function() {
			var value = Math.round(this.val());
			sendData('dynamic='+value);
		}
	});

	function getValues() {
		$.ajax({
			type: 'get',
			dataType: 'json',
			url: '/info',
			// data: 'action=onload',
			success: function(data) {
				console.log(data);}
			})


		$.ajax({
			type: 'post',
			dataType: 'json',
			url: 'test.txt',
			data: 'action=onload',
			success: function(data) {
				console.log(data);
				
				//profile
				for (var i in data.profile) {
					profile.append('<option data-imp="'+i+'" value="'+data.profile[i].action+'">'+data.profile[i].name+'</option>');
					
					defValue[i] = new Object();
					for (var j in data.profile[i].default) {
						defValue[i][j] = data.profile[i].default[j];
					}
				}

				//plugin list
				for (var i in data.pluginList) {
					$('#plugin').append('<option value="'+i+'">'+data.pluginList[i]+'</option>');
				}

				//profile change
				profile.find('option').eq(data.profileActive).prop('selected', true).change();

				//status
				$('.btn-status[value='+data.status+']').hide();				

				//languages
				for (var i in data.language) {
					$('[data-lang='+i+']').text(data.language[i])
				}


				console.log(defValue)
			}
		});

	}

	function profileChange() {
		var value 	= profile.val(),
			index 	= profile.find('option:selected').data('imp');

		mode.val(value);
		modeChange();

		for (var i in defValue[index]) {
			if (i == 'static') $('#color').spectrum('set', defValue[index][i]);
			else $('#'+i).val(defValue[index][i])
		}
	}

	function liveUpdate(index) {
		for (var i in defValue[index]) {
			if (i == 'static') $('#color').spectrum('set', defValue[index][i]);
			else $('#'+i).val(defValue[index][i])
		}
	}

	function modeChange() {
		var value = mode.val();

		$('[class*="tab"]').hide();
		$('.tab-'+value).fadeIn();
	}

	function sendData(data) {
		console.log(data);
		$.ajax({
			type: 'post',
			url: '/',
			data: data,
			success: function(data) {
				console.log('Успешно');
			}
		});
	}

	function elementSend() {
		var element = $(this),
			value 	= element.hasClass('data-imp') ? element.find('option:selected').data('imp') : element.val(),
			name 	= element.attr('id');

		sendData(name+'='+value);
	}

	function btnStatusClick() {
		var element = $(this),
			value 	= element.val();

		btnStatus.toggle();
		sendData('status='+value);
	}

	getValues();


	profile.on('change', profileChange);

	mode.on('change', modeChange);

	btnStatus.on('click', btnStatusClick);

	$('.send').on('change', elementSend);
	

	function liveValues() {
		$.ajax({
			type: 'post',
			dataType: 'json',
			url: 'test.txt',
			data: 'action=liveValue',
			success: function(data) {

				if (!data) return;
				
				if ('profile' in data) {
					defValue[data.profile.index][data.profile.name] = data.profile.value;
					liveUpdate(data.profile.index);
				}

				//profile change
				profile.find('option').eq(data.profileActive).prop('selected', true).change();
				$('#mode').find('option[value="'+data.action+'"]').prop('selected', true).change();

				//status
				if ('status' in data) {
					if (data.status == 'on') {
						$('.btn-status[value=on]').hide();
						$('.btn-status[value=off]').show();
					} else {
						$('.btn-status[value=on]').show();
						$('.btn-status[value=off]').hide();
					}
				}
			}
		});

	}

	// setInterval(liveValues, 5000);

})