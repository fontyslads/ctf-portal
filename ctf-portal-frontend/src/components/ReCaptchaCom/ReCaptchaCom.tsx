import React, {useCallback, useEffect, useState} from 'react';
import styles from './ReCaptchaCom.module.scss';
import {useGoogleReCaptcha, GoogleReCaptcha} from "react-google-recaptcha-v3";


function  ReCaptchaCom(){
    const { executeRecaptcha } = useGoogleReCaptcha();

    // Create an event handler so you can call the verification on button click event or form submit
    // const handleReCaptchaVerify = useCallback(async () => {
    //     if (!executeRecaptcha) {
    //         console.log('Execute recaptcha not yet available');
    //         return;
    //     }
    //
    //     const token = await executeRecaptcha('yourAction');
    //     console.log(token);
    //     // Do whatever you want with the token
    // }, []);

    const handleSubmit = async (data: any) => {
        try {
            if (executeRecaptcha) {
                const newToken = await executeRecaptcha("MS_Pyme_DatosEmpresa");
                return newToken
            }
        } catch (err) {
            throw new Error("Token error");
        }
    };

    return (
      <button onClick={handleSubmit}>test</button>
    );
}
export default ReCaptchaCom;
