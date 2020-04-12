import React, {useEffect} from "react";
import s from "./CartComponent.module.scss";
import Preloader from "../common/Preloader/Preloader";
import {connect} from "react-redux";
import CartComponent from "./CartComponent";
import {loadOptions} from "../../redux/cartReducer";

const CartComponentWrapper = ({loading, ...props}) => {

    useEffect(() => {
        props.loadOptions();
    }, [])

    return <div className={s.cartComponentWrapper}>
        {!loading ? (<CartComponent props={props}/>) : (<Preloader background={'true'}/>)}
    </div>
}

let mapStateToProps = (state) => {
    return {
        loading: state.cartReducer.loadingCheckout,
    }
}

export default connect(mapStateToProps, {loadOptions})(CartComponentWrapper);