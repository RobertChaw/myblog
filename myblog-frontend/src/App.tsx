import {useCallback, useEffect, useState} from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import {Outlet} from "react-router-dom";
import {atom, selector, useRecoilValue} from "recoil";
import {currentUser, getUser} from "./config/api";

// const userState = atom({
//   key: "userState",
//   default: "Robert",
// });

function App() {
    const [count, setCount] = useState(0);
    // const user = useRecoilValue(userState);
    // const getUser = useCallback(async () => {
    //   return await currentUser();
    // }, []);
    // console.log(user);
    return (
        <div className="App">
            {/*<input type="text" value={user} />*/}
            <Outlet/>
        </div>
    );
}

export default App;
