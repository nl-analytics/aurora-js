const endpoint = "http://localhost:3030/";
const version = "100";

function getFingerprint() {
	
	// TODO: check if cookie can be set
	
	// Search for aurora cookie
	var cookies = document.cookie.split(";");
	for (var i = 0; i < cookies.length; i++) {
		var c = cookies[i].trim();
	
		if (c.startsWith("aur=")) {
			return c.substr(4);
		}
	}
	
	// Generate a new fingerprint
	if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
		var bytes = new Uint8Array(8);
		window.crypto.getRandomValues(bytes);
		
		var fingerprint = "";
		
		// TODO: investigate why strings are inconsistent lengths
		for (var b of bytes) {
			fingerprint += b.toString(16);
		}
		
		console.log("FP: " + fingerprint);
		
		// setFingerprintCookie(fingerprint);
		
		return fingerprint;
	} else {
		return "";
	}
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
	
	data["fpt"] = getFingerprint();
	
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