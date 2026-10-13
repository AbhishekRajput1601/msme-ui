

$(function(){
	
$('.date').datetimepicker({		
		lang:'ch',
		timepicker:false,
		format:'d/m/Y',
		scrollInput: false,
	});
	
	$('.date').keypress(function() {	    
	    return false;	    
	});

});
