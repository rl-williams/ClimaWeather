//make button unclickable if geolocation services not supported, with hover-over text
if ("geolocation" in navigator) {
  reload();
} else {
  // make button unclickable
}

var curr_u = 'f';

$("#findme").click(function() {
  navigator.geolocation.getCurrentPosition(function(position) {
    loadWeather(position.coords.latitude+','+position.coords.longitude, curr_u);
  });
});

$("#switch").click(function() {
  if (curr_u == 'f') {
    curr_u = 'c';
  } else {
    curr_u = 'f';
  }
  reload();
});

function reload() {
  navigator.geolocation.getCurrentPosition(function(position) {
    loadWeather(position.coords.latitude+','+position.coords.longitude, curr_u);
  });
}


function loadWeather(latlng, u, woeid) {
  $.simpleWeather({
    location: latlng,
    woeid: woeid,
    unit: u,
    success: function(weather) {
      $("#tempPri").html(weather.temp+'&deg'+ weather.units.temp);
      $("#tempAlt").html(weather.alt.temp+'&deg'+ weather.alt.unit);
      $("#climate").html(weather.currently);
      document.getElementById("icon").src=weather.image;
      $("#location").html(weather.city + ', ' + weather.region);      
      $('body').animate({backgroundColor: colorTempToHex(weather.temp)}, 1500);
    },
    error: function(error) {
      $("#location").html('<p>'+error+'</p>');
    }
  });
}


//create listener for key presses, save text value when pressing enter
var inputText;
window.onkeyup = keyup;
function keyup(e) {
  if (e.keyCode == 13) {
    inputText = e.target.value;
    inputText = inputText.replace(/\s/g, '');
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + inputText;
    
    $.getJSON(url, function(data) {
      if (data.status == "OK") {
        loadWeather(data.results[0].geometry.location.lat + ',' + 
                    data.results[0].geometry.location.lng, curr_u);
        e.target.value = '';
      } else {
        alert("Invalid input. Please try again.");
      }
    });
  }
}

// Given a temperature, return a color
function colorTempToHex(temp) {
  
  //convert to F
  if (curr_u == 'c') {
    temp = (temp * 9 / 5) + 32;
  }
  
  if (temp >= 100)
    return "#FF9900";
  if (temp >= 80)
    return "#FFAD33";
  if (temp >= 70)
    return "#FFC266";
  if (temp >= 60)
    return "#FFE0B2";
  if (temp >= 50)
    return "#FFF5E6";
  if (temp >= 40)
    return "#EBF0FF";
  if (temp >= 30)
    return "#C2D1FF";
  if (temp >= 20)
    return "#85A3FF";
  if (temp >= 10)
    return "#5C85FF";
  return "#3366FF";
}