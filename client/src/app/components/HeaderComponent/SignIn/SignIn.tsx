import React, {useState} from "react";
import s from "./SignIn.module.scss";
import SignInForm, { SignInFormValuesType } from "./SignInForm/SignInForm";
import {connect, useDispatch} from "react-redux";
import {login} from "../../../redux/authReducer";
import {AppStateType} from "../../../redux/store";

const SignIn: React.FC = (props) => {

    const dispatch = useDispatch();
    const loginThunk = (email: string, password: string, rememberMe: boolean): void => {
        dispatch(login(email, password, rememberMe));
    }

    let [showForm, setShowForm] = useState(false);

    const onSubmitForm = (formData: SignInFormValuesType) => {
        loginThunk(formData.email, formData.password, formData.rememberMe);
    }

    return <div className={s.signInComponent}>
        <div className={s.signInButton + ' ' + (showForm ? s.activeForm : '')} onClick={() => {setShowForm(!showForm)}}>Sign In</div>
        {showForm ? <SignInForm onSubmit={onSubmitForm} setShowForm={setShowForm}/> : ''}
    </div>
}

export default SignIn;