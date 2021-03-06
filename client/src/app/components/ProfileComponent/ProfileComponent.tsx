import React from "react";
import s from './ProfileComponent.module.scss'
import {connect} from "react-redux";
import Profile from "./Profile";
import PageNotFoundComponent from "../PageNotFoundComponent/PageNotFoundComponent";
import Preloader from "../common/Preloader/Preloader";
import {AppStateType} from "../../redux/store";

type MapStateToPropsType = {
    isAuth: boolean,
    isFetchingProfile: boolean
}

type PropsType = MapStateToPropsType;

const ProfileComponent: React.FC<PropsType> = (props) => {
    return <div className={s.profileWrapper}>
        {props.isAuth ? (!props.isFetchingProfile ? <Profile/> : <Preloader background={true}/>) : <PageNotFoundComponent/>}
    </div>
}

let mapStateToProps = (state: AppStateType): MapStateToPropsType => {
    return {
        isAuth: state.authReducer.isAuth,
        isFetchingProfile: state.profileReducer.isFetchingProfile
    }
}

export default connect<MapStateToPropsType, {}, {}, AppStateType>(mapStateToProps, {})(ProfileComponent);