import React from "react";
import { Button } from "react-bootstrap";
import { startWorkshop } from "./TeacherPanelAPI";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

class TeacherPanel extends React.Component {
  private markdown = `# Hello *World* **!**
  dIT IS MARKDOWN
  `;

  render() {
    return (
      <div className="flex flex-col gap-4 h-screen w-screen items-center justify-start pt-8 overflow-x-hidden">
        <h1 className="text-4xl">Welcome Teacher!</h1>
        <p>Before you start the workshop, read the instructions below.</p>
        <Button onClick={() => startWorkshop()}>Start workshop</Button>
        <ReactMarkdown
          className="bg-gray-200"
          children={this.markdown}
          remarkPlugins={[remarkGfm]}
        />
      </div>
    );
  }
}
export default TeacherPanel;
