import React, {useEffect} from "react";
import s from './CheckoutStatus.module.scss'
import {connect} from "react-redux";
import {cartReducerActions} from "../../../redux/cartReducer";
import Preloader from "../../common/Preloader/Preloader";
import {AppStateType} from "../../../redux/store";

type CheckoutStatusMapStateToPropsType = {
    message: string
}

type CheckoutStatusMapDispatchToPropsType = {
    setCheckOutMessage: (message: string) => void
}

type CheckoutStatusPropsType = CheckoutStatusMapStateToPropsType & CheckoutStatusMapDispatchToPropsType

const CheckoutStatus: React.FC<CheckoutStatusPropsType> = (props) => {

    useEffect(() => {
        return () => {
            props.setCheckOutMessage('')
        };
    });

    return <div className={s.checkoutStatusWrapper}>
        {props.message !== '' ? props.message : (<Preloader background={true}/>)}
    </div>
}

let mapStateToProps = (state: AppStateType) => {
    return {
        message: state.cartReducer.checkoutMessage
    };
}

export default connect(mapStateToProps,{setCheckOutMessage: cartReducerActions.setCheckOutMessage})(CheckoutStatus);