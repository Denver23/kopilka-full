import {connect} from "react-redux";
import React, {useEffect, useState} from "react";
import s from './ProfileComponent.module.scss';
import Breadcrumbs from "../ProductComponent/Breadcrumbs/Breadcrumbs";
import {Field, reduxForm} from "redux-form";
import Input from "../common/Input/Input";
import {emailType, minLength, requiredField} from "../../utils/validators/validators";
import {changeEditMode, changeProfile, loadProfile} from "../../redux/profileReducer";

const Profile = (props) => {

    let brList = [
        {'url': '/', 'title': 'Home'},
        {'url': '/profile/', 'title': 'Profile'},
    ];

    useEffect(() => {
        props.loadProfile(props.userId);
    }, [props.userId])
    const saveChange = (data) => {
        props.changeProfile(props.userId, data);
    }


    return <div className={s.profile}>
        <Breadcrumbs list={brList}/>
        <div className={s.profileBody}>
            <div><span className={s.title}>Profile</span><button className={s.profileChangeButton} onClick={() => {props.changeEditMode(true)}}>(change)</button></div>
            {props.editMode ? <ProfileFormRedux initialValues={{name: props.name,surname: props.surname,login: props.login,email: props.email,phone: props.phone}} onSubmit={saveChange} /> : <ProfileInfo {...props}/>}
            <span className={s.profileItem}>Number of Purchases: {props.numberOfPurchases}</span>
        </div>
    </div>
}

const ProfileInfo = (props) => {
    return <ul className={s.profileData}>
        <li className={s.profileItem}>Name: {props.name}</li>
        <li className={s.profileItem}>Surname: {props.surname}</li>
        <li className={s.profileItem}>Login: {props.login}</li>
        <li className={s.profileItem}>Email: {props.email}</li>
        <li className={s.profileItem}>Phone: {props.phone}</li>
    </ul>
}

const ProfileForm = (props) => {
    return <form onSubmit={props.handleSubmit}>
        <ul className={s.profileData}>
            {props.error && <div className={s.errorMessage}>{props.error}</div>}
            <li className={s.profileItem}>Name: <Field placeholder={'Name'} component={Input} type={'text'} name={'name'} validate={[requiredField, minLength]}/></li>
            <li className={s.profileItem}>Surname: <Field placeholder={'Surname'} component={Input} type={'text'} name={'surname'} validate={[requiredField, minLength]}/></li>
            <li className={s.profileItem}>Login: <Field placeholder={'Login'} component={Input} type={'text'} name={'login'} validate={[requiredField, minLength]}/></li>
            <li className={s.profileItem}>Email: <Field placeholder={'E-mail'} component={Input} type={'text'} name={'email'} validate={[requiredField, minLength, emailType]}/></li>
            <li className={s.profileItem}>Phone: <Field placeholder={'Phone'} component={Input} type={'text'} name={'phone'} validate={[requiredField, minLength]}/></li>
            <button type={'submit'} className={s.profileSaveButton}>Save</button>
        </ul>
    </form>
}

const ProfileFormRedux = reduxForm({form: 'profileForm', enableReinitialize: true})(ProfileForm);

let mapStateToProps = (state) => {
    return {
        userId: state.authReducer.userId,
        editMode: state.profileReducer.editMode,
        name: state.profileReducer.name,
        surname: state.profileReducer.surname,
        login: state.authReducer.login,
        email: state.authReducer.email,
        phone: state.profileReducer.phone,
        numberOfPurchases: state.profileReducer.numberOfPurchases
    }
}

export default connect(mapStateToProps, {loadProfile, changeProfile, changeEditMode})(Profile);