import React from "react";
import s from './SignUpComponent.module.scss'
import {useSelector} from "react-redux";
import SignUpComponent from "./SignUpComponent";
import {Redirect} from "react-router-dom";
import {GetIsAuth} from "../../redux/selectors/authSelectors";

const SignUpComponentWrapper: React.FC = () => {

    const isAuth = useSelector(GetIsAuth);

    return <div className={s.signUpComponentWrapper}>
        {!isAuth ? <SignUpComponent/> : <Redirect to={'/'}/>}
    </div>
}

export default SignUpComponentWrapper;