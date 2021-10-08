import React from "react";
import "./App.scss";

//components
import FlagList from "./components/FlagList/FlagList";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <FlagList />
      </div>
    );
  }
}

export default App;
