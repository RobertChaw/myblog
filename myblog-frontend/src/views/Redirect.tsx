import React from "react";
import {useLocalStorageState} from "ahooks";
import {Navigate} from "react-router-dom";

export default function Redirect() {
    return (
        <Navigate to={localStorage.getItem("redirect") || "/"} replace={true}/>
    );
}
