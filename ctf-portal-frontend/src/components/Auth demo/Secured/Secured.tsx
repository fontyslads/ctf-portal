import React, { Component } from 'react';
import Keycloak from 'keycloak-js';
import {flatten} from "@reduxjs/toolkit/dist/query/utils";

class Secured extends React.Component<any, any>{

    constructor(props: any) {
        super(props);

    }

    render() {
        return (
            <div>Admin Dashboard</div>
        );
    }
}
export default Secured;