

	$('.date').datetimepicker({
		lang : 'ch',
		timepicker : false,
		format : 'd/m/Y',
	});

	$('.date').keypress(function() {

		return false;

	});

	$('.number-only').keypress(function(e) {
		if (isNaN(this.value + "" + String.fromCharCode(e.charCode)))
			return false;
	}).on("cut copy paste", function(e) {
		e.preventDefault();
	});


	

	
