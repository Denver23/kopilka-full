import React from "react";
import s from './SignUpComponent.module.scss'
import {connect} from "react-redux";
import SignUpComponent from "./SignUpComponent";
import {Redirect} from "react-router-dom";
import {AppStateType} from "../../redux/store";

type MapStateToPropsType = {
    isAuth: boolean
}

const SignUpComponentWrapper: React.FC<MapStateToPropsType> = (props) => {
    return <div className={s.signUpComponentWrapper}>
        {!props.isAuth ? <SignUpComponent/> : <Redirect to={'/'}/>}
    </div>
}

let mapStateToProps = (state: AppStateType): MapStateToPropsType => {
    return {
        isAuth: state.authReducer.isAuth
    }
}

export default connect<MapStateToPropsType, {}, {}, AppStateType>(mapStateToProps, {})(SignUpComponentWrapper);