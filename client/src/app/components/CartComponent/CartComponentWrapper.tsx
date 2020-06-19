import React, {useEffect} from "react";
import s from "./CartComponent.module.scss";
import Preloader from "../common/Preloader/Preloader";
import {connect} from "react-redux";
import CartComponent from "./CartComponent";
import {loadOptions} from "../../redux/cartReducer";
import {AppStateType} from "../../redux/store";

type MapStateToPropsType = {
    loading: boolean
}

type MapDispatchToPropsType = {
    loadOptions: () => void
}

type CartComponentWrapperPropsType = MapStateToPropsType & MapDispatchToPropsType;

const CartComponentWrapper: React.FC<CartComponentWrapperPropsType> = ({loading, ...props}) => {

    useEffect(() => {
        props.loadOptions();
    }, [])

    return <div className={s.cartComponentWrapper}>
        {!loading ? (<CartComponent {...props}/>) : (<Preloader background={true}/>)}
    </div>
}

let mapStateToProps = (state: AppStateType) => {
    return {
        loading: state.cartReducer.loadingCheckout,
    }
}

export default connect<MapStateToPropsType, MapDispatchToPropsType, {}, AppStateType>(mapStateToProps, {loadOptions})(CartComponentWrapper);