$(window).load(function () {
	// $('#loading').fadeOut(500);
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
		btnStatus = $('.btn-status');


	var defValue = new Object();

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
		$('#loading').show();

		$.ajax({
			type: 'get',
			dataType: 'json',
			url: '/info',
			// data: 'action=onload',
			success: function (data) {

				if (data.hasOwnProperty("status")) {
					$('#loading').fadeOut(500);


					console.log(data);

					//profile
					const profs = data.profiles
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
						return $(this).text() == data.actProfile;
					}).prop("selected", true);

					profile.change()


					//status
					$('.btn-status[value=' + data.status + ']').hide();
					console.log(data)
					console.log(data.status)

					//languages
					for (var i in language) {
						$('[data-lang=' + i + ']').text(language[i])
					}
				} else {
					alert("error de conexion \n " + data + "\n Reintentando ")
					setTimeout(getValues(), 5000)

				}

			}
		});

	}

	function profileChange() {
		var value = profile.val(),
			index = profile.find('option:selected').data('imp');
		console.log(value, index)
		// send value
		$.ajax({
			type: 'post',
			dataType: 'json',
			url: '/setProfile',
			data: { 'profile': value },
			success: () => {
				console.log('success')

				$.ajax({
					type: 'get',
					dataType: 'json',
					url: '/info',
					// data: 'action=onload',
					success: function (data) {
						console.log(data);

						// persistent
						let actmode = data.mode

						console.log(actmode)

						if (actmode == "moodlamp" && data.persistent == "off") {
							actmode = "moodlamp-static"
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
		//add set profile first

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
		// rgb(255, 128, 0)
		console.log(value == "soundviz")
		if (value == "soundviz") {

			$.ajax({
				type: 'get',
				dataType: 'json',
				url: '/soundinfo',
				success: function (data) {

					$("#color-from").spectrum("set", "rgb(" + data.min + ")")
					$("#color-to").spectrum("set", "rgb(" + data.max + ")")


					// chec for sound being marked correctly
					console.log(data.liquid==0)
					if(data.luquid == 0){
						$("#sound-range").checked = true
					}else{
						$("#sound-auto").checked = true
					}


				},
				error: (z, x, c) => { console.log(z, x, c) }
			})

		}

		sendData("/setmode", "data=" + value)
	}

	function sendData(url, data) {
		console.log(url, data);
		$.ajax({
			type: 'post',
			dataType: 'application/json',
			url: url,
			data: data,
			success: function (rta) {
				console.log(rta);
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
		// $.ajax({
		// 	type:'post',
		// 	url:'/setstatus',
		// 	dataType:'application/json',
		// 	data:'status=' + value,
		// 	success:(data)=>{
		// 		console.log(data)
		// 	}
		// })
	}

	getValues();



	profile.on('change', profileChange);

	mode.on('change', modeChange);

	btnStatus.on('click', btnStatusClick);

	// $('.send').on('change', elementSend);


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