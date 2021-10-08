import { useState } from "react";
import { Button, Collapse } from "react-bootstrap";

//components
import SubmitFlag from "../SubmitFlag/SubmitFlag";

import { selectFlagStatus } from "../SubmitFlag/FlagSlice";
import { useAppSelector } from "../../app/hooks";

const FlagCard = () => {
  const [open, setOpen] = useState(false);
  const flagStatus = useAppSelector(selectFlagStatus);

  function getBackgroundColor() {
    switch (flagStatus) {
      case "invalid":
        return "bg-red-500";
      case "valid":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  }

  return (
    <div className="flex md:contents">
      <div className="col-start-2 col-end-4 mr-10 md:mx-auto relative">
        <div className="h-full w-6 flex items-center justify-center">
          <div
            className={`${getBackgroundColor()} h-full w-1 pointer-events-none`}
          ></div>
        </div>
        <div
          className={`${getBackgroundColor()} w-6 h-6 absolute top-1/2 -mt-3 rounded-full shadow text-center`}
        >
          <i className="fas fa-check-circle text-white"></i>
        </div>
      </div>
      <div
        className={`${getBackgroundColor()} 
          col-start-4 col-end-12 p-4 rounded-xl my-4 mr-auto shadow-md w-full`}
      >
        <h3 className="font-semibold text-lg mb-1">Flag 1</h3>
        <p className="leading-tight text-justify w-full">{flagStatus}</p>
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
        >
          click
        </Button>
        <Collapse in={open}>
          <div>
            <SubmitFlag />
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default FlagCard;
function getBackgroundColor() {
  throw new Error("Function not implemented.");
}
