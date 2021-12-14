var session = require("express-session");
var Keycloak = require("keycloak-connect");

let _keycloak;

var keycloakConfig = {
	clientId: "ctf-react",
	bearerOnly: true,
	serverUrl: "http://localhost:8080/auth",
	realm: "CTF-portal",
	credentials: {
		secret: "viybzodg2me5BizVgdalnN4z8AWF3tqL"
	}
};

function initKeycloak() {
	if (_keycloak) {
		console.warn("Trying to init Keycloak again!");
		return _keycloak;
	} else {
		console.log("Initializing Keycloak...");
		var memoryStore = new session.MemoryStore();
		_keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
		return _keycloak;
	}
}

function getKeycloak() {
	if (!_keycloak) {
		console.error(
			"Keycloak has not been initialized. Please called init first."
		);
	}
	return _keycloak;
}

module.exports = {
	initKeycloak,
	getKeycloak
};
