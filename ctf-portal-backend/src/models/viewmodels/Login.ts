import { property } from "class-converter";
import { IsNotEmpty, IsString } from "class-validator";

class Login {
	@IsString()
	@IsNotEmpty()
	@property()
	username!: string;

	@IsString()
	@IsNotEmpty()
	@property()
	password!: string;
}

export default Login;
