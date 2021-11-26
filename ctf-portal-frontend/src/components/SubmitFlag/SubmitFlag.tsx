import React, {useState} from "react";
import { Button } from "react-bootstrap";
import FlagStatus from "../../models/enums/FlagStatus";
import {useAppDispatch} from "../../app/hooks";
import { submitFlagAsync } from "./FlagSlice"


const SITE_KEY = "6LdeqJkcAAAAAFcW4LbVNriRt-fMTu0DZHBrYb-0";

export default function SubmitFlag (props: any){

    const dispatch = useAppDispatch();
    const [flagValue, setFlagValue] = useState('');
   function handleChange(event: { target: { value: string } }) {
        setFlagValue(event.target.value );
    }

    function handleSubmit(token: string) {
        const submittedFlag = {
            id: props.flag.id,
            value: flagValue,
            token: token
        };
        dispatch(submitFlagAsync(submittedFlag));
    }

//  onSubmit={this.handleVerifyRecaptcha}
    return (
        <form className="flex gap-2" >
            <div className="flex">
          <span className="text-sm text-black flex items-center rounded-l px-4 py-2 bg-yellow-300 whitespace-no-wrap">
            Flag:
          </span>
                <input
                    name="field_name"
                    className="text-black rounded-r px-4 py-2 w-full"
                    type="text"
                    placeholder="Enter your flag..."
                    onChange={handleChange}
                    value={flagValue}
                />
            </div>
            <Button type="submit">Validate</Button>

            {props.flag.status === FlagStatus.Pending ? (
                <div className="p-0 text-black">
                    <i className="fas fa-circle-notch fa-spin fa-2x"></i>
                </div>
            ) : (
                ""
            )}
        </form>
    );
}
