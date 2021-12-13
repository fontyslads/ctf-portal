import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import Controller from "./controllers/controller";
import { validationError } from "./utils/validation/validateBody";
import errorMiddleware from "./utils/exceptions/errorMiddleware";

class App {
	private app: Application;

	private frontendHost: string = process.env.FRONTEND_HOST!;

	constructor() {
		this.app = express();
		this.initializeMiddlewares();
	}

	private initializeMiddlewares() {
		require("./config/keycloak-config.js").initKeycloak();
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(cookieParser());
	}

	public initializeErrorHandling() {
		this.app.use(validationError);
		this.app.use(errorMiddleware);
	}

	public initializeControllers(controllers: Controller[]) {
		controllers.forEach((controller) => {
			this.app.use(controller.path, controller.router);
		});
	}

	public listen() {
		const port: number = Number(process.env.PORT || 3000);
		this.app.listen(port, () => {
			console.log(`Server is listening on port ${port}...`);
		});
	}
}

export default App;
