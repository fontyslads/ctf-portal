import { Repository, getConnection } from "typeorm";
import bcrypt from "bcrypt";

import Flag from "../models/entities/Flag";
import Team from "../models/enums/Team";

class FlagLogic {
	private repository: Repository<Flag>;

	constructor() {
		this.repository = getConnection(process.env.ORM_CONFIG).getRepository(Flag);
	}

	public async submitFlag(
		hash: string,
		team: Team = Team.Blue
	): Promise<boolean> {
		let validFlag = null;

		const flags: Flag[] = await this.repository.find({
			where: { submitted: false }
		});

		flags
			.filter((flag: Flag) => flag.team === team)
			.forEach((flag: Flag) => {
				if (bcrypt.compareSync(hash, flag.hash)) validFlag = flag;
			});

		if (validFlag) return true;
		return false;
	}
}

export default FlagLogic;
