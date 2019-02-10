$(window).load(function () {
	$('#loading').fadeOut(500);
});

const language = {
	"turn-on": "Turn On",
	"turn-off": "Turn Off",
	"screen-capture": "Screen capture",
	"static": "Static background",
	"dynamic": "Dynamic background",
	"color-music": "Color music",
	"profile-selection": "Selecting a profile",
	"mode": "Mode",
	"screen-capture-method": "The method of screen capture",
	"backlight-color": "Background color",
	"rate-change-color": "Speed of color change",
	"brightness": "Brillo",
	"smooth": "smooth"
}

jQuery(function ($) {

	var profile = $('#profile'),
		mode = $('#mode'),
		btnStatus = $('.btn-status');

	var defValue = new Object();

	$('#color').spectrum({
		flat: true,
		showButtons: false,
		move: function (color) {
			sendData('static=' + color.toHexString());
			console.log(color.toRgb())
		}
	});

	$('.brightness-slider').noUiSlider({
		range: [0, 100],
		start: 20,
		handles: 1,
		connect: 'lower',
		set: function () {
			var value = Math.round(this.val());
			sendData('setbrightness:' + value);
		}
	});

	$('.dynamic-slider').noUiSlider({
		range: [0, 255],
		start: 20,
		handles: 1,
		connect: 'lower',
		set: function () {
			var value = Math.round(this.val());
			sendData('dynamic=' + value);
		}
	});
	$('.smooth-slider').noUiSlider({
		range: [0, 255],
		start: 20,
		handles: 1,
		connect: 'lower',
		set: function () {
			var value = Math.round(this.val());
			sendData('dynamic=' + value);
		}
	});

	function getValues() {
		$.ajax({
			type: 'get',
			dataType: 'json',
			url: '/info',
			// data: 'action=onload',
			success: function (data) {
				console.log(data);

				//profile
				const profs = data.info.profiles
				for (var i in profs) {
					profile.append('<option data-imp="' + i + '" value="' + profs[i] + '">' + profs[i] + '</option>');

					// defValue[i] = new Object();
					// for (var j in data.profile[i].default) {
					// 	defValue[i][j] = data.profile[i].default[j];
					// }
				}

				//plugin list
				// for (var i in data.pluginList) {
				// 	$('#plugin').append('<option value="'+i+'">'+data.pluginList[i]+'</option>');
				// }

				//profile change
				profile.find("option").filter(function () {
					return $(this).text() == data.info.actProfile;
				}).prop("selected", true);

				profile.change()


				//status
				$('.btn-status[value=' + data.info.status + ']').hide();
				console.log(data.info)
				console.log(data.info.status)

				//languages
				for (var i in language) {
					$('[data-lang=' + i + ']').text(language[i])
				}

			}
		});

	}

	function profileChange() {
		var value = profile.val(),
			index = profile.find('option:selected').data('imp');
		console.log(value, index)
		// send value

		//add set profile first
		$.ajax({
			type: 'get',
			dataType: 'json',
			url: '/info',
			// data: 'action=onload',
			success: function (data) {
				console.log(data);

				// persistent
				let actmode=data.info.mode
				if (actmode=="moodlamp" && data.info.persistent=="off") {
					actmode="moodlamp-static"
				}
				mode.find("option").filter(function () {
					return $(this).val() == actmode;
				}).prop("selected", true);



				mode.change()

				// get smoot and brightness
				$('#brightness').val(data.info.brightness)
				$('#smooth').val(data.info.smooth)

			}
		})

		//fix 
		//sets de value for mode
		// for (var i in defValue[index]) {
		// 	if (i == 'static') $('#color').spectrum('set', defValue[index][i]);
		// 	else $('#' + i).val(defValue[index][i])
		// }
	}

	function liveUpdate(index) {
		for (var i in defValue[index]) {
			if (i == 'static') $('#color').spectrum('set', defValue[index][i]);
			else $('#' + i).val(defValue[index][i])
		}
	}

	function modeChange() {
		var value = mode.val();

		$('[class*="tab"]').hide();
		$('.tab-' + value).fadeIn();
	}

	function sendData(data) {
		console.log(data);
		// $.ajax({
		// 	type: 'post',
		// 	url: '/',
		// 	data: data,
		// 	success: function(data) {
		// 		console.log('Успешно');
		// 	}
		// });
	}

	function elementSend() {
		var element = $(this),
			value = element.hasClass('data-imp') ? element.find('option:selected').data('imp') : element.val(),
			name = element.attr('id');

		sendData(name + '=' + value);
	}

	function btnStatusClick() {
		var element = $(this),
			value = element.val();

		btnStatus.toggle();
		sendData('status=' + value);
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
			success: function (data) {

				if (!data) return;

				if ('profile' in data) {
					defValue[data.profile.index][data.profile.name] = data.profile.value;
					liveUpdate(data.profile.index);
				}

				//profile change
				profile.find('option').eq(data.profileActive).prop('selected', true).change();

				//cambiar esto por nueva forma de buscar el modo
				$('#mode').find('option[value="' + data.action + '"]').prop('selected', true).change();

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