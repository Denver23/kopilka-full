import React, {useState} from "react";
import s from "./SignIn.module.scss";
import SignInForm, { SignInFormValuesType } from "./SignInForm/SignInForm";
import {connect} from "react-redux";
import {login} from "../../../redux/authReducer";
import {AppStateType} from "../../../redux/store";

type MapDispatchToPropsType = {
    login: (email: string, password: string, rememberMe: boolean) => void
}

const SignIn: React.FC<MapDispatchToPropsType> = (props) => {
    let [showForm, setShowForm] = useState(false);

    const onSubmitForm = (formData: SignInFormValuesType) => {
        props.login(formData.email, formData.password, formData.rememberMe);
    }

    return <div className={s.signInComponent}>
        <div className={s.signInButton + ' ' + (showForm ? s.activeForm : '')} onClick={() => {setShowForm(!showForm)}}>Sign In</div>
        {showForm ? <SignInForm onSubmit={onSubmitForm} setShowForm={setShowForm}/> : ''}
    </div>
}

export default connect<{}, MapDispatchToPropsType, {}, AppStateType>((state)=>{return {}},{login})(SignIn);