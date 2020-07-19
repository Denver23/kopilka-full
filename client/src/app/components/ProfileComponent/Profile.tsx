import {connect} from "react-redux";
import React, {useEffect, useState} from "react";
import s from './ProfileComponent.module.scss';
import Breadcrumbs from "../ProductComponent/Breadcrumbs/Breadcrumbs";
import {Field, InjectedFormProps, reduxForm} from "redux-form";
import Input from "../common/Input/Input";
import {emailType, minLength, requiredField} from "../../utils/validators/validators";
import {profileReducerActions, changeProfile, loadProfile} from "../../redux/profileReducer";
import {AppStateType} from "../../redux/store";
import {ChangeProfileDataType} from "../../types/types";

type MapDispatchToProps = {
    loadProfile: (id: string) => void,
    changeProfile: (userId: string, data: ChangeProfileDataType) => void,
    changeEditMode: (value: boolean) => void
}

type MapStateToPropsType = {
    userId: string | null,
    editMode: boolean,
    name: string | null,
    surname: string | null,
    login: string | null,
    email: string | null,
    phone: string | null,
    numberOfPurchases: number | null
}

type PropsType = MapStateToPropsType & MapDispatchToProps;

const Profile: React.FC<PropsType> = (props) => {

    let brList = [
        {'url': '/', 'title': 'Home'},
        {'url': '/profile/', 'title': 'Profile'},
    ];

    useEffect(() => {
        if(props.userId !== null) {
            props.loadProfile(props.userId);
        }
    }, [props.userId])
    const saveChange = (data: ChangeProfileDataType) => {
        if(props.userId !== null) {
            props.changeProfile(props.userId, data);
        }
    }


    return <div className={s.profile}>
        <Breadcrumbs list={brList}/>
        <div className={s.profileBody}>
            <div><span className={s.title}>Profile</span><button className={s.profileChangeButton} onClick={() => {props.changeEditMode(true)}}>(change)</button></div>
            {props.editMode ? <ProfileFormRedux initialValues={
                {
                    name: props.name !== null ? props.name : undefined,
                    surname: props.surname !== null ? props.surname : undefined,
                    login: props.login !== null ? props.login : undefined,
                    email: props.email !== null ? props.email : undefined,
                    phone: props.phone !== null ? props.phone : undefined
                }} onSubmit={saveChange} /> : <ProfileInfo {...props}/>}
            <span className={s.profileItem}>Number of Purchases: {props.numberOfPurchases}</span>
        </div>
    </div>
}

const ProfileInfo: React.FC<PropsType> = (props) => {
    return <ul className={s.profileData}>
        <li className={s.profileItem}>Name: {props.name}</li>
        <li className={s.profileItem}>Surname: {props.surname}</li>
        <li className={s.profileItem}>Login: {props.login}</li>
        <li className={s.profileItem}>Email: {props.email}</li>
        <li className={s.profileItem}>Phone: {props.phone}</li>
    </ul>
}

type ProfileFormValuesType = {
    name: string,
    surname: string,
    login: string,
    email: string,
    phone: string
}

type ProfileFormOwnPropsType = {

}

const ProfileForm: React.FC<InjectedFormProps<ProfileFormValuesType, ProfileFormOwnPropsType> & ProfileFormOwnPropsType> = (props) => {
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

const ProfileFormRedux = reduxForm<ProfileFormValuesType, ProfileFormOwnPropsType>({form: 'profileForm', enableReinitialize: true})(ProfileForm);

let mapStateToProps = (state: AppStateType): MapStateToPropsType => {
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

export default connect<MapStateToPropsType, MapDispatchToProps, {}, AppStateType>(mapStateToProps, {loadProfile, changeProfile, changeEditMode: profileReducerActions.changeEditMode})(Profile);