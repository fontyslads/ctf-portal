import { optional, property } from "class-converter";
import { IsAlphanumeric, IsEnum, IsNotEmpty, IsString } from "class-validator";
import Team from "../../enums/Team";

class SignIn {
	@IsNotEmpty()
	@IsAlphanumeric()
	@property()
	groupname!: string;

	@IsNotEmpty()
	@IsString()
	@property()
	password!: string;

	@IsEnum(Team)
	@IsNotEmpty()
	@optional()
	@property()
	team!: Team;
}

export default SignIn;
