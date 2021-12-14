import App from "./app";

import "dotenv/config";
import validateEnv from "./utils/validation/validateEnv";

import DatabaseFactory from "./factories/databaseFactory";

//controllers
import FlagController from "./controllers/flagController";
import TeacherController from "./controllers/teacherController";

const main = async () => {
	const databaseFactory: DatabaseFactory = new DatabaseFactory();

	await databaseFactory
		.connectDatabase()
		.then(async () => {
			const app = new App();
			app.initializeControllers([
				new FlagController(),
				new TeacherController()
			]);
			app.initializeErrorHandling();
			await app.createTeacherAccount();
			app.listen();
		})
		.catch((err) => {
			console.warn(
				"Something went wrong while starting the application...",
				err
			);
		});
};

validateEnv();
main();
