import { property } from "class-converter";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import Team from "../enums/Team";

class SubmitFlag {
	@IsString()
	@IsNotEmpty()
	@property()
	hash!: string;

	@IsEnum(Team)
	@IsNotEmpty()
	@property()
	team!: Team;
}

export default SubmitFlag;
