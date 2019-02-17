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
	"rate-color-change-mode": "Modo",

}

jQuery(function ($) {

	var profile = $('#profile'),
		mode = $('#mode'),
		btnStatus = $('.btn-status'),
		btnSoundRange = $("#sound-range"),
		btnSoundAuto = $("#sound-auto");
	soundVizpicker = $(".soundViz")
	soundColLimits = $(".soundColLimits")

	var info = {}

	//soundviz colors
	$("#color-from").spectrum({
		color: "#f00"
	});

	$("#color-to").spectrum({
		color: "#f00"
	});

	//static color
	$('#color').spectrum({
		flat: true,
		showButtons: false,
		move: function (color) {
			sendData('/setcolor', 'data=' + color.toRgb().r + ',' + color.toRgb().g + ',' + color.toRgb().b);
		}
	});

	//move color soundViz
	soundColLimits.spectrum({
		// flat: true,
		// showButtons: false,
		move: function (color) {
			// sendData('/setcolor', 'data=' + color.toRgb().r + ',' + color.toRgb().g + ',' + color.toRgb().b);
			const t2 = $("#color-from").spectrum("get").toRgb();
			const t1 = $("#color-to").spectrum("get").toRgb();
			const colors = t1.r + ',' + t1.g + ',' + t1.b + ';' + t2.r + ',' + t2.g + ',' + t2.b
			sendData('/setsoundvizcolors', 'data=' + colors)

		}
	});


	$('.brightness-slider').noUiSlider({
		range: [0, 100],
		start: 20,
		handles: 1,
		connect: 'lower',
		set: function () {
			var value = Math.round(this.val());
			sendData('/setbrightness', 'data=' + value);
		}
	});


	$('.smooth-slider').noUiSlider({
		range: [0, 255],
		start: 20,
		handles: 1,
		connect: 'lower',
		set: function () {
			var value = Math.round(this.val());
			sendData('/setsmooth', 'data=' + value);
		}
	});

	function getValues() {
		// $('#loading').show();

		$.ajax({
			type: 'get',
			dataType: 'json',
			url: '/info',
			// data: 'action=onload',
			success: function (data) {
				if (JSON.stringify(data) != JSON.stringify(info)) {
					info = data


					if (data.hasOwnProperty("status")) {
						// $('#loading').fadeOut(500);


						// console.log(data);

						//profile
						if (profile[0].options.length == 0) {
							const profs = data.profiles
							for (var i in profs) {
								profile.append('<option data-imp="' + i + '" value="' + profs[i] + '">' + profs[i] + '</option>');

							}

						}

						//plugin list
						// for (var i in data.pluginList) {
						// 	$('#plugin').append('<option value="'+i+'">'+data.pluginList[i]+'</option>');
						// }

						//profile change
						profile.find("option").filter(function () {
							return $(this).text() == data.actProfile;
						}).prop("selected", true);

						profile.change()


						//status
						$('.btn-status[value=' + data.status + ']').hide();

						//languages
						for (var i in language) {
							$('[data-lang=' + i + ']').text(language[i])
						}
					} else {
						alert("error de conexion \n " + data + "\n Reintentando ")
						setTimeout(getValues(), 5000)

					}
				}else{
					profile.change()
				}
			}
		});

	}

	function profileChange() {
		var value = profile.val(),
			index = profile.find('option:selected').data('imp');
		// console.log(value, index)
		$.ajax({
			type: 'post',
			dataType: 'json',
			url: '/setProfile',
			data: { 'profile': value },
			success: () => {
				// console.log('success')

				$.ajax({
					type: 'get',
					dataType: 'json',
					url: '/info',
					// data: 'action=onload',
					success: function (data) {
						// console.log(data);

						// persistent
						let actmode = data.mode


						if (actmode == "moodlamp" && data.persistent == "on") {
							actmode = "moodlamp-static"
							sendData('/setcolor', 'data=57,227,39')
							$('#color').spectrum("set", 'rgb(57,227,39)');

						}

						mode.find("option").filter(function () {
							return $(this).val() == actmode;
						}).prop("selected", true);



						mode.change()

						// get smoot and brightness
						$('#brightness').val(data.brightness)
						$('#smooth').val(data.smooth)

					}
				})
			}, error: (x, y, z) => { console.log("error", x, y, z) }

		})

	}


	function modeChange() {
		var value = mode.val();

		$('[class*="tab"]').hide();
		$('.tab-' + value).fadeIn();

		if (value == "moodlamp-static") {
			sendData('/setcolor', 'data=57,227,39')
		}
		// rgb(255, 128, 0)
		// console.log(value)
		if (value == "soundviz") {

			$.ajax({
				type: 'get',
				dataType: 'json',
				url: '/soundinfo',
				success: function (data) {
					console.log(data)
					$("#color-from").spectrum("set", "rgb(" + data.min + ")")
					$("#color-to").spectrum("set", "rgb(" + data.max + ")")


					if (data.liquid == 0) {
						btnSoundRange.prop('checked', true)
					} else {
						btnSoundAuto.prop('checked', true)
					}


					soundVizpicker.change()
				},
				error: (z, x, c) => { console.log(z, x, c) }
			})

		}

		sendData("/setmode", "data=" + value)
	}

	function sendData(url, data) {
		$.ajax({
			type: 'post',
			dataType: 'application/json',
			url: url,
			data: data,
			success: function (rta) {
				// console.log(rta);
			}
		});
	}

	// function elementSend() {
	// 	var element = $(this),
	// 		value = element.hasClass('data-imp') ? element.find('option:selected').data('imp') : element.val(),
	// 		name = element.attr('id');

	// 	sendData(name + '=' + value);
	// }

	function btnStatusClick() {
		var element = $(this),
			value = element.val();

		btnStatus.toggle();
		sendData('/setstatus', 'status=' + value);
	}

	getValues();



	profile.on('change', profileChange);

	mode.on('change', modeChange);

	btnStatus.on('click', btnStatusClick);

	soundVizpicker.on('change', soundVizModeChange)


	function soundVizModeChange() {
		const val = this.value
		if (this.checked) {
			val == 1 ? soundColLimits.spectrum("disable") : soundColLimits.spectrum("enable");
			sendData('/setsoundvizliquid', 'data=' + val)
		}
	}




	setInterval(getValues, 8000);

})