import React from "react";
import { Button } from "react-bootstrap";
import { startWorkshop } from "./TeacherPanelAPI";

class TeacherPanel extends React.Component {
  render() {
    return (
      <div className="flex flex-col gap-4 h-screen w-screen items-center justify-start pt-8 overflow-x-hidden">
        <h1 className="text-4xl">Welcome Teacher!</h1>
        <p>Before you start the workshop, read the instructions below.</p>
        <Button onClick={() => startWorkshop()}>Start workshop</Button>
        <embed
          className="w-full h-full"
          src="/Walkthrough.pdf"
          type="application/pdf"
        />
      </div>
    );
  }
}
export default TeacherPanel;
