import React from "react";
import styles from "./FlagList.module.scss";

//components
import FlagCard from "../FlagCard/FlagCard";

class FlagList extends React.Component {
  getFlagCards() {
    const flagCount = 6;
    let html = [];
    for (let i = 0; i < flagCount; i++) {
      html.push(<FlagCard key={i} />);
    }
    return html;
  }

  render() {
    return (
      <div className={styles.FlagList}>
        <div className="p-4 mt-4">
          <h1 className="text-4xl text-center font-semibold mb-6">Blue Team</h1>
          <div className="container">
            <div className="flex flex-col md:grid grid-cols-12 text-gray-50">
              {this.getFlagCards()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FlagList;
