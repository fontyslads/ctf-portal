import React from "react";
import "./App.scss";

//components
import AuhtGuard from "./components/Auth/AuhtGuard/AuhtGuard";

class App extends React.Component {
  render() {
    return <AuhtGuard />;
  }
}

export default App;
