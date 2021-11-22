import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import FlagStatus from "../enums/FlagStatus";
import Team from "../enums/Team";

@Entity()
export default class Flag {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	flagNumber!: number;

	@Column({ type: "enum", enum: Team, default: Team.Blue })
	team!: Team;

	@Column()
	hash?: string;

	@Column()
	description!: string;

	@Column()
	story?: string;

	@Column({ type: "enum", enum: FlagStatus, default: FlagStatus.NotSubmitted })
	status!: FlagStatus;

	@Column({ default: 0 })
	attempts!: number;

	//in seconds, default: 10 minutes
	@Column({ default: 600 })
	timeLimit!: number;

	@Column({ nullable: true })
	startTime!: Date;
}
