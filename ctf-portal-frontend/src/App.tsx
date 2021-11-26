import React from "react";
import "./App.scss";

//components
import Timer from "./components/Timer/Timer";
import FlagList from "./components/FlagList/FlagList";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Timer />
        <FlagList />
      </div>
    );
  }
}

export default App;
