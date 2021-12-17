import { cleanEnv, str, port } from "envalid";

function validateEnv() {
	cleanEnv(process.env, {
		NODE_ENV: str(),
		PORT: port(),
		DB_TYPE: str(),
		DB_HOST: str(),
		DB_PORT: port(),
		DB_USERNAME: str(),
		DB_PASSWORD: str(),
		DB_DATABASE: str(),
		DB_ENTITIES: str()
	});
}

export default validateEnv;
