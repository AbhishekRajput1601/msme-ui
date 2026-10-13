




	$(function() {
		
		function getNextMonthFirstDay() {
		    const now = new Date();
		    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 11, 0); 
		}

		function getNextMonthFifteenthDay() {
		    const now = new Date();
		    return new Date(now.getFullYear(), now.getMonth() + 1, 15, 17, 0); 
		}

		
		$('.dateStart').datetimepicker({
		    lang: 'ch',
		    timepicker: true,
		    format: 'd/m/Y H:i',
		    defaultDate: getNextMonthFirstDay(),
		    value: getNextMonthFirstDay(),
		    minDate: getNextMonthFirstDay(),
		    minDateTime: getNextMonthFirstDay(),
		    scrollInput: false,
		    onChangeDateTime: function (selectedDate) {
		        var currentDate = new Date();
		        if (selectedDate < currentDate) {
		            $('#dateStart').val('');
		        }
		    }
		});
		$('.dateStart').keypress(function () {
		    return false;
		});

		
		$('.dateEnd').datetimepicker({
		    lang: 'ch',
		    timepicker: true,
		    format: 'd/m/Y H:i',
		    defaultDate: getNextMonthFifteenthDay(),
		    value: getNextMonthFifteenthDay(),
		    minDate: getNextMonthFirstDay(), 
		    minDateTime: getNextMonthFirstDay(),
		    scrollInput: false
		});
		$('.dateEnd').keypress(function () {
		    return false;
		});
		$(document).on('keypress', '.number-only', function(e) {
			if (isNaN(this.value + "" + String.fromCharCode(e.charCode))) {
				return false;
			}
		})
		$(document).on('change', '.number-only', function(e) {
			var v = parseFloat(this.value);
			this.value = isNaN(v) ? '' : v.toFixed(2);
		}).on('cut copy paste', '.number-only', function(e) {
			e.preventDefault();
		});
		$(document).on('keypress', '.number10', function(e) {
			if (this.value.length >= 10) {
				return false;
			}
		});
		$(document).on('keypress', '.number12', function(e) {
			if (this.value.length >= 12) {
				return false;
			}
		});
	});
	


	
	function setdatalatlong(setlong, setlat) {
		if (setlat > 27.00 || setlat < 21.00) {
			finallat = "";
			alert("Cordinate Out Side MP!");
			return;
		} else {
			finallat = setlat;
			1
			console.log("finallat" + finallat);
		}
		if (setlong > 83.00 || setlong < 74.00) {
			finallong = "";
			alert("Cordinate Out Side MP!");
			return;
		} else {
			finallong = setlong;
			console.log("finallong" + finallong);
		}
	}
	let geojsonLayer;
	var marker = null;
	var finallat;
	var finallong;
	var mapclk = 0;
	var latapi = 0;
	var lonGAPI = 0;
	function onMapClick(e) {
		if (mapclk == 1) {
			var templat = e.latlng.lat;
			var templong = e.latlng.lng;
			if (marker != null) {
				map.removeLayer(marker);
			}
			marker = new L.marker(e.latlng);
			setdatalatlong(templong, templat);
			if (finallat !== "" && finallong !== "") {
				angular.element(document.getElementById('divID')).scope()
					.getLatLngFrommap(templat, templong);
				map.addLayer(marker);
			}
		}
	}
	function onMapClick2() {

		setTimeout(function () {

			if (marker != null) {

				map.removeLayer(marker);
			}

			marker = new L.marker([latapi, lonGAPI]);

			

			map.addLayer(marker);
		}, 2000);

	}

	    
	   
		
    var map = L.map('map').setView([23.25, 77.41], 6); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);
     L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
			maxZoom: 19,
			"subdomains": ["mt0", "mt1", "mt2", "mt3"]
		}).addTo(map);

    var marker;

    function setdatalatlong(lat, lng) {
        
        if (lat < 21 || lat > 27 || lng < 74 || lng > 83) {
            alert("Location must be within Madhya Pradesh");
            return;
        }

        
        if (marker) map.removeLayer(marker);
        marker = L.marker([lat, lng]).addTo(map);

        
        var scope = angular.element(document.getElementById('divID')).scope();
        scope.$apply(function () {
            scope.vacantLandData.latitude = lat.toFixed(6);
            scope.vacantLandData.longitude = lng.toFixed(6);
        });
    }

    map.on('click', function (e) {
        setdatalatlong(e.latlng.lat, e.latlng.lng);
    });

	
