import React, {useState} from "react";
import s from "./SignIn.module.scss";
import SignInForm from "./SignInForm/SignInForm";
import {connect} from "react-redux";
import {login} from "../../../redux/authReducer";

const SignIn = (props) => {
    let [showForm, setShowForm] = useState(false);

    const onSubmitForm = (formData) => {
        props.login(formData.email, formData.password, formData.rememberMe);
    }

    return <div className={s.signInComponent}>
        <div className={s.signInButton + ' ' + (showForm ? s.activeForm : '')} onClick={() => {setShowForm(!showForm)}}>Sign In</div>
        {showForm ? <SignInForm onSubmit={onSubmitForm} setShowForm={setShowForm}/> : ''}
    </div>
}

export default connect((state)=>{return {}},{login})(SignIn);