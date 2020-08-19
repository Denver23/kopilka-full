import React from "react";
import s from './SignUpComponent.module.scss'
import Breadcrumbs from "../ProductComponent/Breadcrumbs/Breadcrumbs";
import {Field, InjectedFormProps, reduxForm} from "redux-form";
import Input from "../common/Input/Input";
import {emailType, minLength, requiredField} from "../../utils/validators/validators";
import RadioButton from "../common/RadioButtons/RadioButton/RadioButton";
import {useDispatch} from "react-redux";
import {signUp, SignUpDataType} from "../../redux/authReducer";

const SignUpComponent: React.FC = () => {

    const dispatch = useDispatch();
    const signUpThunk = (data: SignUpDataType): void => {
        dispatch(signUp(data));
    }

    let brList = [
        {'url': '/', 'title': 'Home'},
        {'url': '/sign-up/', 'title': 'Sign Up'},
    ];

    const SignUpSubmit = (data: SignUpDataType) => {
        signUpThunk(data);
    }



    return <div className={s.signUpComponent}>
            <Breadcrumbs list={brList}/>
            <span className={s.warning}>If you are already registered, go to the login page.</span>
            <span className={s.signUpTitle}>General Information</span>
            <SignUpFormRedux onSubmit={SignUpSubmit}/>
        </div>
}

type SignUpFormValuesType = SignUpDataType

type SignUpOwnPropsType = {}

const SignUpForm: React.FC<InjectedFormProps<SignUpFormValuesType, SignUpOwnPropsType> & SignUpOwnPropsType> = (props) => {
    return <form className={s.signUpForm} onSubmit={props.handleSubmit}>
        {props.error && <div className={s.errorMessage}>{props.error}</div>}
        <Field placeholder={'Login'} component={Input} type={'text'} name={'login'} validate={[requiredField, minLength]}/>
        <Field placeholder={'Password'} component={Input} type={'password'} name={'password'} validate={[requiredField, minLength]}/>
        <Field placeholder={'Name'} component={Input} type={'text'} name={'name'} validate={[requiredField, minLength]}/>
        <Field placeholder={'Surname'} component={Input} type={'text'} name={'surname'} validate={[requiredField, minLength]}/>
        <Field placeholder={'Phone'} component={Input} type={'text'} name={'phone'} validate={[]}/>
        <Field placeholder={'E-Mail'} component={Input} type={'text'} name={'email'} validate={[requiredField, minLength, emailType]}/>
        <span className={s.subTitle}>Subscribe to our news:</span>
        <Field name={'subscribeToNews'} component={RadioButton} field={{name: 'yes',placeholder: 'Yes'}} props={{'value': 'yes'}} key={'Yes'} validate={[requiredField]} />
        <Field name={'subscribeToNews'} component={RadioButton} field={{name: 'no',placeholder: 'No'}} props={{'value': 'no'}} key={'No'} validate={[requiredField]} />
        <button type={'submit'} className={s.signUpButton}>Sign Up</button>
    </form>
}

const SignUpFormRedux = reduxForm<SignUpFormValuesType, SignUpOwnPropsType>({
    form: 'signUpForm'
})(SignUpForm);

export default SignUpComponent;