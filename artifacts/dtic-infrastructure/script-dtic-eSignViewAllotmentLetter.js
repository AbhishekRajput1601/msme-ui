

	$(document).ready(function() {
		
		$(window).scroll(function() {
			if ($(this).scrollTop() > 200) {
				$('#scrollTopBtn').fadeIn();
			} else {
				$('#scrollTopBtn').fadeOut();
			}
		});

		
		$('#scrollTopBtn').click(function() {
			$('html, body').animate({
				scrollTop : 0
			}, 600);
			return false;
		});
	});


	$(function() {

		$('#datetimepicker1').datetimepicker({
			
			
			
			format : 'DD/MM/YYYY'
		
		});
		

		$('#datetimepicker2').datetimepicker({
			
			maxDate : moment(),
			
			format : 'DD/MM/YYYY',
			useCurrent : false
		});

		$('#datetimepicker3').datetimepicker({
			
			maxDate : moment(),
			
			format : 'DD/MM/YYYY',
			useCurrent : false
		});

		$('#datetimepicker4').datetimepicker({
			
			maxDate : moment(),
			
			format : 'DD/MM/YYYY',
			useCurrent : false
		});

		

		

		$('#add-new-item-popup').on("shown.bs.modal", function() {
			var index = $('#id').val();
			var type = $('#type').val();
			$('#id').scope().addWorkEstimationItemEntryChild(index, type);

		});

		$(document).on("click", ".test", function() {
			var id_value = $(this).data('id');
			var type_value = $(this).data('type');
			$("#id").val(id_value);
			$("#type").val(type_value);
		});

	});


				const today = new Date();
				const day = String(today.getDate()).padStart(2, '0');
				const month = String(today.getMonth() + 1).padStart(2, '0'); 
				const year = today.getFullYear();
				const formattedDate = `${day}/${month}/${year}`;
				document.getElementById("currentDate").textContent = formattedDate;
			