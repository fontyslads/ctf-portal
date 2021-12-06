import React from "react";

//components
import Table from "react-bootstrap/Table";

//models
import Flag from "../../models/Flag";
import FlagStatus from "../../models/enums/FlagStatus";
import BlueScore from "../../models/enums/BlueScore";

class Scoreboard extends React.Component<{ flags: Flag[] }> {
  getTotalTime() {
    let totalTime = 0;
    this.props.flags.forEach((flag) => (totalTime += flag.timeTaken));

    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;

    return (
      <div>
        {minutes} min {seconds} s
      </div>
    );
  }

  getScore() {
    const flags = this.props.flags || [];
    return (
      <div>
        {
          BlueScore[
            flags.filter((flag) => flag.status === FlagStatus.Valid).length
          ]
        }
      </div>
    );
  }

  render() {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-4 ">
        <h1 className="text-5xl">{this.getScore()}</h1>

        <Table className="w-4/5">
          <thead>
            <tr className="border-b-2 border-black">
              <th>Flag #</th>
              <th>Status</th>
              <th>False attempts</th>
              <th>Time limit</th>
              <th>Time taken</th>
            </tr>
          </thead>
          <tbody>
            {this.props.flags.map((flag) => {
              return (
                <tr
                  className={
                    flag.status === FlagStatus.Valid
                      ? "bg-green-200"
                      : "bg-red-200"
                  }
                  key={flag.id}
                >
                  <td>{flag.flagNumber}</td>
                  <td>{flag.status}</td>
                  <td>{flag.attempts}</td>
                  <td>{flag.timeLimit}</td>
                  <td>{flag.timeTaken}</td>
                </tr>
              );
            })}
            <tr className="font-bold border-t-2 border-b-2 border-black">
              <td></td>
              <td></td>
              <td></td>
              <td>Total time taken</td>
              <td>{this.getTotalTime()}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

export default Scoreboard;
