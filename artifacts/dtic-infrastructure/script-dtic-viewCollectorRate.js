

	$(document).ready(function() {
		$('.date').datetimepicker({
			lang : 'ch',
			timepicker : false,
			scrollInput : false,
			format : 'd/m/Y',
		});
		$('.date').keypress(function() {
			return false;
		});
	});
