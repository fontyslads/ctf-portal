import { property } from "class-converter";
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import Team from "../enums/Team";

class SubmitFlag {
	@IsInt()
	@Min(0)
	@property()
	id!: number;

	@IsString()
	@IsNotEmpty()
	@property()
	hash!: string;

	@IsEnum(Team)
	@IsNotEmpty()
	@property()
	team!: Team;

	@IsString()
	@IsNotEmpty()
	@property()
	token!: string;
}

export default SubmitFlag;
