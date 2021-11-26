import React, { Component } from 'react';
import Keycloak from 'keycloak-js';
import {flatten} from "@reduxjs/toolkit/dist/query/utils";
import Secured from "../Secured/Secured";
import {BrowserRouter, Route} from "react-router-dom";
import FlagList from "../../FlagList/FlagList";

class AuhtGuard extends React.Component<any, any>{
    private keycloak = Keycloak('/keycloak.json');
    constructor(props: any) {
        super(props);
        this.state = { keycloak: null, authenticated: false, isTeacher: false  };
        this.logOut = this.logOut.bind(this);
    }
    componentDidMount() {

        this.keycloak.init({onLoad: 'login-required'}).then(authenticated => {
            this.setState({ keycloak: this.keycloak, authenticated: authenticated, isTeacher: this.keycloak.hasRealmRole('teacher') })
        })

        //console.log(this.keycloak.hasRealmRole('teacher'));
    }
    logOut(){
        this.state.keycloak.logout({ redirectUri: 'http://localhost:3000' });
    }
    render() {


    console.log(this.state.keycloak)
        if (this.state.keycloak) console.log( this.state.keycloak.authenticated)
        console.log(this.state.isTeacher)

        if (this.state.keycloak ) {
            if (this.state.authenticated && this.state.isTeacher) return (
                <div>
                    <Secured/>
                </div>


            );  else   if (this.state.authenticated && !this.state.isTeacher) return (
                <div>
                    <FlagList/>
                </div>



            );
            else return (
                    <div>
                        <div>Unable to authenticate!</div>
                    </div>

                )
        }
        return (
            <div>Initializing Keycloak...</div>
        );

    }
}
export default AuhtGuard;