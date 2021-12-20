import React from "react";
import "./App.scss";

//components
import AuhtGuard from "./components/Auth/AuhtGuard/AuhtGuard";
import FlagList from "./components/FlagList/FlagList";

class App extends React.Component {
  render() {
    return <FlagList />;
    return <AuhtGuard />;
  }
}

export default App;
