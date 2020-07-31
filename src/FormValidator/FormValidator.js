import React from "react";

export default function ValidationError(props) {
  console.log("validator ran");
  if (props.message) {
    console.log("error detected");
    return <div className="error">{props.message}</div>;
  }
  console.log("no error detected");
  return <></>;
}
