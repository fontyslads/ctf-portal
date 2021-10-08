import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import Team from "../enums/Team";

@Entity()
export default class Auth {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true })
	groupname!: string;

	@Column()
	password!: string;

	@Column({ type: "enum", enum: Team, default: Team.Blue })
	team!: Team;

	@Column("simple-array")
	members!: string[];
}
