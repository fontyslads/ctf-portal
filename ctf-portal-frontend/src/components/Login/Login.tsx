import React from "react";
import { Button } from "react-bootstrap";
import styles from "./Login.module.scss";
import { login } from "./TeacherAPI";

class Login extends React.Component<
  {},
  { isTeacher: boolean; username: string; password: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { isTeacher: false, username: "", password: "" };

    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  changeUsername(event: { target: { value: string } }) {
    this.setState({ ...this.state, username: event.target.value });
  }

  changePassword(event: { target: { value: string } }) {
    this.setState({ ...this.state, password: event.target.value });
  }

  handleSubmit(event: { preventDefault: () => void }) {
    login(this.state.username, this.state.password);
    event.preventDefault();
  }

  render() {
    return (
      <div className={styles.login_container}>
        <Button
          onClick={() => this.setState({ ...this.state, isTeacher: false })}
        >
          I'm a blue teamer
        </Button>

        <div className={styles.form_container}>
          <form className="flex flex-col gap-2" onSubmit={this.handleSubmit}>
            <h1 className="text-xl">Teacher login:</h1>
            <div className="flex">
              <span className="text-sm text-black flex items-center rounded-l px-4 py-2 bg-yellow-300 whitespace-no-wrap">
                Username:
              </span>
              <input
                name="username"
                className="text-black rounded-r px-4 py-2 w-full bg-gray-200"
                type="text"
                placeholder="Username..."
                onChange={this.changeUsername}
                value={this.state.username}
              />
            </div>
            <div className="flex">
              <span className="text-sm text-black flex items-center rounded-l px-4 py-2 bg-yellow-300 whitespace-no-wrap">
                Password:
              </span>
              <input
                name="password"
                className="text-black rounded-r px-4 py-2 w-full bg-gray-200"
                type="password"
                placeholder="Password..."
                onChange={this.changePassword}
                value={this.state.password}
              />
            </div>
            <Button type="submit">Login</Button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
