import React, {useEffect} from "react";
import s from './CheckoutStatus.module.scss'
import {useDispatch, useSelector} from "react-redux";
import {cartReducerActions} from "../../../redux/cartReducer";
import Preloader from "../../common/Preloader/Preloader";
import {GetCheckoutMessage} from "../../../redux/selectors/cartReducerSelectors";

const CheckoutStatus: React.FC = (props) => {

    const message = useSelector(GetCheckoutMessage);
    const dispatch = useDispatch();
    const setCheckOutMessage = (message: string): void => {
        dispatch(cartReducerActions.setCheckOutMessage(message));
    }

    useEffect(() => {
        return () => {
            setCheckOutMessage('')
        };
    });

    return <div className={s.checkoutStatusWrapper}>
        {message !== '' ? message : (<Preloader background={true}/>)}
    </div>
}
export default CheckoutStatus;