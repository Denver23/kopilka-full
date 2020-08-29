import React, {useEffect} from 'react';
import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {GetInitialized} from "./redux/selectors/appSelectors";
import {GetIsAuth, GetUserId} from "./redux/selectors/authSelectors";
import {initializeApp} from "./redux/appReducer";
import Preloader from "./components/common/Preloader/Preloader";
import Main from "./components/MainComponents/Main";
import Header from "./components/HeaderComponents/Header";
import SignIn from "./components/SignInComponents/SignIn";

function App() {

    const isAuth = useSelector(GetIsAuth);
    const initialized = useSelector(GetInitialized);
    const userId = useSelector(GetUserId);
    const dispatch = useDispatch();
    const initializeAppThunk = (): void => {
        dispatch(initializeApp());
    }

    useEffect(() => {
        function autoInitial() {
            let localUserId = localStorage.getItem('userId') ? localStorage.getItem('userId') : null;
            if (userId === localUserId && localUserId !== null) {
                return;
            }
            initializeAppThunk();
        }

        window.addEventListener('storage', autoInitial);
        autoInitial();
        return () => window.removeEventListener('storage', autoInitial);
    }, [userId]);

    return (
        <div className="App">
            {!initialized ? <Preloader/> :
                (
                    <>
                        <Header/>
                        {!isAuth ? <SignIn/> : <Main/>}
                    </>
                )
            }
        </div>
    );
}

export default App;
