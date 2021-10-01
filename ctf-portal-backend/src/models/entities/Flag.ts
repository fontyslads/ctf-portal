import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	OneToOne,
	JoinColumn
} from "typeorm";
import Team from "../enums/Team";

@Entity()
export default class Flag {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: "enum", enum: Team, default: Team.Blue })
	team!: Team;

	@Column()
	hash!: string;

	@Column()
	story!: string;

	@Column()
	storyPart!: string;

	@Column({ default: false })
	submitted!: boolean;
}
