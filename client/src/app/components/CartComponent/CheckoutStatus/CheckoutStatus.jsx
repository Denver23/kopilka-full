import React, {useEffect} from "react";
import s from './CheckoutStatus.module.scss'
import {connect} from "react-redux";
import {setCheckOutMessage, toggleCheckoutStatus} from "../../../redux/cartReducer";
import Preloader from "../../common/Preloader/Preloader";

const CheckoutStatus = (props) => {

    useEffect(() => {
        return () => {
            props.setCheckOutMessage('')
        };
    });

    return <div className={s.checkoutStatusWrapper}>
        {props.message !== '' ? props.message : (<Preloader background={'true'}/>)}
    </div>
}

let mapStateToProps = (state) => {
    return {
        message: state.cartReducer.checkoutMessage
    };
}

export default connect(mapStateToProps,{setCheckOutMessage})(CheckoutStatus);