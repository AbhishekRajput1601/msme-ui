

$(document).ready(function() {

  $('.number-only').keypress(function(e) {
	if(isNaN(this.value+""+String.fromCharCode(e.charCode))) return false;
  })
  .on("cut copy paste",function(e){
	e.preventDefault();
  });
  
  $('.number10').keypress(function() {
	    if (this.value.length >= 10) {
	        return false;
	    }
	});
  
});

