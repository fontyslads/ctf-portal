import { ConnectionOptions, createConnection } from "typeorm";

class DatabaseFactory {
	public async connectDatabase(): Promise<void> {
		if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
			const config: ConnectionOptions = {
				type: process.env.DB_TYPE,
				host: process.env.DB_HOST,
				port: +process.env.DB_PORT!,
				username: process.env.DB_USERNAME,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_DATABASE,
				entities: [`dist/${process.env.DB_ENTITIES}`],
				logging: false,
				synchronize: false
			} as ConnectionOptions;

			await createConnection(config);
		} else {
			const config: ConnectionOptions = {
				type: process.env.DB_TYPE,
				host: process.env.DB_HOST,
				port: +process.env.DB_PORT!,
				username: process.env.DB_USERNAME,
				password: process.env.DB_PASSWORD,
				database: `${process.env.DB_DATABASE}_dev`,
				entities: [`src/${process.env.DB_ENTITIES}`],
				logging: false,
				synchronize: true
			} as ConnectionOptions;
			await createConnection(config);
		}
	}
}

export default DatabaseFactory;
