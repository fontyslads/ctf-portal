import gsap from "gsap";
import React from "react";
import styles from "./Platform.module.scss";


class Platform extends React.Component {
  //
  // train: React.RefObject<SVGGElement>;
  // trainShadow: React.RefObject<SVGGElement>;
  test:React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);

    // this.train = React.createRef();
    // this.trainShadow = React.createRef();
    this.test = React.createRef();

  }

  // wait until DOM has been rendered
  componentDidMount(){
    // gsap.to(this.train.current, { x: "-320", duration: "3", ease: "easeOut"});
    // gsap.to(this.trainShadow.current, { x: "-320", duration: "3", ease: "easeOut"});
    gsap.to(this.test.current, { backgroundColor: "red", delay:"1", repeat: -1, ease: "none", duration: 0.25});

  }


    render() {
    return (
     <div ref={this.test}>
      sadgfsdfsadfsadfdsa
     </div>
    );
  }
}

export default Platform;
