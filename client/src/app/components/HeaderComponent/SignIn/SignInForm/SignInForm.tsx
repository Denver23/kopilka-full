import React, {useEffect, useRef} from "react";
import s from './SignInForm.module.scss';
import {Field, InjectedFormProps, reduxForm} from "redux-form";
import Checkbox from "../../../common/Checkboxes/Checkbox/Checkbox";
import {Link} from "react-router-dom";
import {minLength, requiredField} from "../../../../utils/validators/validators";
import {connect} from "react-redux";
import Preloader from "../../../common/Preloader/Preloader";
import Input from "../../../common/Input/Input";
import {AppStateType} from "../../../../redux/store";

export type SignInFormValuesType = {
    email: string,
    password: string,
    rememberMe: boolean
}
type SignInFormOwnPropsType = {
}

const SignInForm: React.FC<InjectedFormProps<SignInFormValuesType, SignInFormOwnPropsType> & SignInFormOwnPropsType> = (props) => {
    return <form className={s.signInForm} onSubmit={props.handleSubmit}>
        <Field placeholder={'Email'} component={Input} type={'text'} name={'email'} validate={[requiredField, minLength]}/>
        <Field placeholder={'Password'} component={Input} type={'password'} name={'password'} validate={[requiredField, minLength]}/>
        <Field component={Checkbox} name={'rememberMe'} field={'Remember Me'}/>
        {props.error && <div className={s.errorMessage}>{props.error}</div>}
        <button type={'submit'} className={s.submitFormButton}>Submit</button>
        <Link to={'/sign-up'} className={s.loginFormLink}>Sign Up</Link>
    </form>
}

const SignInFormRedux = reduxForm<SignInFormValuesType, SignInFormOwnPropsType>({
    form: 'loginForm'
})(SignInForm);

type MapStateToPropsType = {
    isFetching: boolean
}

type OwnProps = {
    onSubmit: (formData: SignInFormValuesType) => void,
    setShowForm: (showMenu: boolean) => void
}

type PropsType = MapStateToPropsType & OwnProps;

const SignInPreloader: React.FC<PropsType> = ({onSubmit, isFetching, ...props}) => {

    let signInFormWrapper = useRef<HTMLDivElement>(null);

    let handleClickOutside = (e: Event) => {
        const domNode = signInFormWrapper;
        const eventNode = e.target as Node;
        if ((!domNode.current || !domNode.current.contains(eventNode))) {
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

const mapStateToProps = (state: AppStateType) => {
    return {
        isFetching: state.authReducer.isFetching
    }
}

export default connect<MapStateToPropsType, {}, {}, AppStateType>(mapStateToProps,{})(SignInPreloader);