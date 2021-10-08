import { optional, property } from "class-converter";
import {
	IsAlphanumeric,
	IsEnum,
	IsNotEmpty,
	Length,
	Matches
} from "class-validator";
import Team from "../../enums/Team";

class SignUp {
	@Length(3, 15)
	@IsAlphanumeric()
	@property()
	groupname!: string;

	@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g, {
		message:
			"password must be at least 8 characters long and contain 1 lower case letter, 1 upper case letter and 1 number"
	})
	@property()
	password!: string;

	@IsEnum(Team)
	@IsNotEmpty()
	@optional()
	@property()
	team!: Team;
}

export default SignUp;
