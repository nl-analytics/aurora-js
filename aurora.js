const endpoint = "http://localhost:3030/";
const version = "100";

const oneYear = 60 * 60 * 24 * 365;

function setCookie(name, value, expiresIn) {
	
	var arguments = "";
	
	var date = new Date();
	
	date.setTime(date.getTime() + expiresIn * 1000);
	
	arguments += ";expires=" + date.toUTCString();
	arguments += ";max-age=" + expiresIn;
	
	var cookieString = name + "=" + value + arguments + ";";
	
	document.cookie = cookieString;
}

function getFingerprint() {
	
	// check if cookie can be set
	if (!navigator.cookieEnabled) {
		return;
	}
	
	// Search for aurora cookie
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		var c = cookies[i].trim();
	
		if (c.startsWith("aur=")) {
			return c.substr(4);
		}
	}
	
	// Generate a new fingerprint
	var crypto = window.crypto || window.msCrypto;
		
	var bytes;
	
	if (crypto && typeof crypto.getRandomValues === 'function') {
		bytes = new Uint8Array(8);
		window.crypto.getRandomValues(bytes);
	} else {
		// Use Math.random - not ideal, but workable
		
		bytes = [];
		
		for (var i = 0; i < 8; i++) {
			bytes[i] = Math.floor(Math.random() * 256);
		}
	}
	
	var fingerprint = "";
	
	for (var b of bytes) {
		var str = b.toString(16);
		
		// Pad with zeroes
		while (str.length < 2) {
			str = "0" + str;
		}
		
		fingerprint += str;
	}
	
	console.log("FP: " + fingerprint);
	
	setCookie("aur", fingerprint, oneYear);
	
	return fingerprint;
}

function sendData() {
	
	// TODO: separate resolution into H and W

	// Basic info
	var data = {
		"res": window.screen.width + "x" + window.screen.height,
		"den": window.devicePixelRatio,
		"vpt": window.innerWidth + "x" + window.innerHeight,
		"url": document.location.href,
		"lng": navigator.language,
		"nl_client": "ajs" + version
	};
	
	var fingerprint = getFingerprint();
	
	if (fingerprint) {
		data["fpt"] = fingerprint;
	}
	
	// Get referral url
	if (document.referrer) {
		data.ref = document.referrer;
	}
	
	var queryString = "aurora?";
	
	var keys = Object.keys(data);
	for (var i = 0; i < keys.length; i++) {
		if (i > 0) {
			queryString += "&";
		}
	
		queryString += encodeURIComponent(keys[i]) + "=" + encodeURIComponent(data[keys[i]]);
	}
	
	var img = document.createElement("IMG");
	img.setAttribute("src", endpoint + queryString);
}

sendData();