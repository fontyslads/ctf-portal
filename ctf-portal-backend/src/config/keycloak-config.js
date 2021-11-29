var session = require("express-session");
var Keycloak = require("keycloak-connect");

let _keycloak;

var keycloakConfig = {
	clientId: "Backend",
	bearerOnly: true,
	serverUrl: "http://localhost:8080/auth",
	realm: "CTF-portal",
	credentials: {
		secret: "dc0d2904-8544-4d68-9529-eed3f32d36e5"
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
