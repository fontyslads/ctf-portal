import { property } from "class-converter";
import { IsEnum, IsInt, IsNotEmpty, IsString, Min } from "class-validator";
import Team from "../enums/Team";

class Check_reCAPTCHA_Variation {
	@IsString()
	@IsNotEmpty()
	@property()
	token!: string;

	@IsString()
	@IsNotEmpty()
	@property()
	secretKey!: string;

}

export default Check_reCAPTCHA_Variation;
