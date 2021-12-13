import React from "react";
import Keycloak from "keycloak-js";
import Secured from "../Secured/Secured";
import FlagList from "../../FlagList/FlagList";
import Timer from "../../Timer/Timer";
import styles from "./AuthGuard.module.scss";

class AuhtGuard extends React.Component<any, any> {
  private keycloak = Keycloak("/keycloak.json");

  constructor(props: any) {
    super(props);
    this.state = { keycloak: null, authenticated: false, isTeacher: false };
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    this.keycloak.init({ onLoad: "login-required" }).then((authenticated) => {
      this.setState({
        keycloak: this.keycloak,
        authenticated: authenticated,
        isTeacher: this.keycloak.hasRealmRole("teacher"),
      });
    });
  }

  logOut() {
    this.state.keycloak.logout({ redirectUri: "http://localhost:3000" });
  }

  render() {
    if (this.state.keycloak) {
      if (this.state.authenticated)
        localStorage.setItem("token", this.state.keycloak.token);
      if (this.state.authenticated && this.state.isTeacher)
        return (
          <div>
            <Secured />
          </div>
        );
      else if (this.state.authenticated && !this.state.isTeacher)
        return (
          <div>
            <Timer />
            <FlagList />
          </div>
        );
      else
        return (
          <div>
            <div>Unable to authenticate!</div>
          </div>
        );
    }
    return (
      <div className={styles.loader_container}>
        <div className={styles.loader}></div>
      </div>
    );
  }
}
export default AuhtGuard;
