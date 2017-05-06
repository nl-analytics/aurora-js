const endpoint = "http://localhost:3030/aurora";

// Basic info
var data = {
	"res": window.screen.width + "x" + window.screen.height,
	"den": window.devicePixelRatio,
	"vpt": window.innerWidth + "x" + window.innerHeight,
	"url": document.location.href,
	"lng": navigator.language
};

// Search for aurora cookie
var cookies = document.cookie.split(";");
for (var i = 0; i < cookies.length; i++) {
	var c = cookies[i].trim();

	if (c.startsWith("aur=")) {
		data.fp = c.substr(4);
		break;
	}
}

// Get referral url
if (document.referrer) {
	data.ref = document.referrer;
}

var queryString = "?";

var keys = Object.keys(data);
for (var i = 0; i < keys.length; i++) {
	if (i > 0) {
		queryString += "&";
	}

	queryString += encodeURIComponent(keys[i]) + "=" + encodeURIComponent(data[keys[i]]);
}

var img = document.createElement("IMG");
img.setAttribute("src", endpoint + queryString);