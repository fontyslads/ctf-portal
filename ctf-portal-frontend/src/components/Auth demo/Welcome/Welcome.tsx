import React from 'react';
import styles from './Welcome.module.scss';
import Flag from "../../../models/Flag";
import {Collapse} from "react-bootstrap";
import SubmitFlag from "../../SubmitFlag/SubmitFlag";
import {connect} from "react-redux";

class Welcome extends React.Component<{}> {
    render() {
        return (
            <h1> wecolme </h1>
        );
    }
}
export default Welcome;
