

$(function(){
	
$('.date').datetimepicker({
		
		lang:'ch',
		timepicker:false,
		format:'d/m/Y',
		});
	
	$('.date').keypress(function() {
	    
	    return false;
	    
	});

});
