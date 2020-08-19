import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import s from './ProfileComponent.module.scss';
import Breadcrumbs from "../ProductComponent/Breadcrumbs/Breadcrumbs";
import {Field, InjectedFormProps, reduxForm} from "redux-form";
import Input from "../common/Input/Input";
import {emailType, minLength, requiredField} from "../../utils/validators/validators";
import {profileReducerActions, changeProfile, loadProfile} from "../../redux/profileReducer";
import {ChangeProfileDataType} from "../../types/types";
import {GetUserEmail, GetUserId, GetUserLogin} from "../../redux/selectors/authSelectors";
import {
    GetEditMode,
    GetUserName,
    GetUserNumberOfPurchases,
    GetUserPhone,
    GetUserSurname
} from "../../redux/selectors/profileSelectors";

const Profile: React.FC = () => {

    const userId = useSelector(GetUserId);
    const editMode = useSelector(GetEditMode);
    const name = useSelector(GetUserName);
    const surname = useSelector(GetUserSurname);
    const login = useSelector(GetUserLogin);
    const email = useSelector(GetUserEmail);
    const phone = useSelector(GetUserPhone);
    const numberOfPurchases = useSelector(GetUserNumberOfPurchases);
    const dispatch = useDispatch();
    const loadProfileThunk = (id: string): void => {
        dispatch(loadProfile(id));
    }
    const changeProfileThunk = (userId: string, data: ChangeProfileDataType): void => {
        dispatch(changeProfile(userId, data));
    }
    const changeEditMode = (value: boolean): void => {
        dispatch(profileReducerActions.changeEditMode(value))
    }

    let brList = [
        {'url': '/', 'title': 'Home'},
        {'url': '/profile/', 'title': 'Profile'},
    ];

    useEffect(() => {
        if(userId !== null) {
            loadProfileThunk(userId);
        }
    }, [userId])
    const saveChange = (data: ChangeProfileDataType) => {
        if(userId !== null) {
            changeProfileThunk(userId, data);
        }
    }


    return <div className={s.profile}>
        <Breadcrumbs list={brList}/>
        <div className={s.profileBody}>
            <div><span className={s.title}>Profile</span><button className={s.profileChangeButton} onClick={() => {changeEditMode(true)}}>(change)</button></div>
            {editMode ? <ProfileFormRedux initialValues={
                {
                    name: name !== null ? name : undefined,
                    surname: surname !== null ? surname : undefined,
                    login: login !== null ? login : undefined,
                    email: email !== null ? email : undefined,
                    phone: phone !== null ? phone : undefined
                }} onSubmit={saveChange} /> : <ProfileInfo name={name} surname={surname} login={login} email={email} phone={phone}/>}
            <span className={s.profileItem}>Number of Purchases: {numberOfPurchases}</span>
        </div>
    </div>
}

type ProfileInfoPropsType = {
    name: string | null,
    surname: string | null,
    login: string | null,
    email: string | null,
    phone: string | null,
}

const ProfileInfo: React.FC<ProfileInfoPropsType> = (props) => {
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

export default Profile;