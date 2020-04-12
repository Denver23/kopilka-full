import React, {useEffect, useRef} from "react";
import s from './SignInForm.module.scss';
import {Field, reduxForm} from "redux-form";
import Checkbox from "../../../common/Checkboxes/Checkbox/Checkbox";
import {Link} from "react-router-dom";
import {minLength, requiredField} from "../../../../utils/validators/validators";
import {connect} from "react-redux";
import Preloader from "../../../common/Preloader/Preloader";
import Input from "../../../common/Input/Input";

const SignInForm = (props) => {
    return <form className={s.signInForm} onSubmit={props.handleSubmit}>
        <Field placeholder={'Email'} component={Input} type={'text'} name={'email'} validate={[requiredField, minLength]}/>
        <Field placeholder={'Password'} component={Input} type={'password'} name={'password'} validate={[requiredField, minLength]}/>
        <Field component={Checkbox} name={'rememberMe'} field={'Remember Me'}/>
        {props.error && <div className={s.errorMessage}>{props.error}</div>}
        <button type={'submit'} className={s.submitFormButton}>Submit</button>
        <Link to={'/sign-up'} className={s.loginFormLink}>Sign Up</Link>
    </form>
}

const SignInFormRedux = reduxForm({
    form: 'loginForm'
})(SignInForm);

const SignInPreloader = ({onSubmit, isFetching, ...props}) => {

    let signInFormWrapper = useRef();

    let handleClickOutside = (e) => {
        const domNode = signInFormWrapper;
        if ((!domNode.current || !domNode.current.contains(e.target))) {
            props.setShowForm(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => (document.removeEventListener('click', handleClickOutside))
    }, [])

    return <div ref={signInFormWrapper} className={s.signInFormWrapper}>
        {!isFetching ? (<SignInFormRedux onSubmit={onSubmit} />) : (<div style={{position: 'relative'}}><SignInFormRedux onSubmit={onSubmit} /><Preloader position={'absolute'}/></div>)}
    </div>
}

const mapStateToProps = (state) => {
    return {
        isFetching: state.authReducer.isFetching
    }
}

export default connect(mapStateToProps,{})(SignInPreloader);