import React, {useEffect} from "react";
import s from "./CartComponent.module.scss";
import Preloader from "../common/Preloader/Preloader";
import { useDispatch, useSelector} from "react-redux";
import CartComponent from "./CartComponent";
import {loadOptions} from "../../redux/cartReducer";
import {GetLoadingCheckout} from "../../redux/selectors/cartReducerSelectors";

const CartComponentWrapper: React.FC = ({...props}) => {

    const loading = useSelector(GetLoadingCheckout);
    const dispatch = useDispatch();
    const loadOptionsThunk = (): void => {
        dispatch(loadOptions());
    }

    useEffect(() => {
        loadOptionsThunk();
    }, [])

    return <div className={s.cartComponentWrapper}>
        {!loading ? (<CartComponent {...props}/>) : (<Preloader background={true}/>)}
    </div>
}

export default CartComponentWrapper;