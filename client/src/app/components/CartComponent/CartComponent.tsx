import React from "react";
import s from './CartComponent.module.scss'
import Breadcrumbs from "../ProductComponent/Breadcrumbs/Breadcrumbs";
import Checkout from "./Checkout/Checkout";

const CartComponent: React.FC = () => {

    let brList = [
        {'url': '/', 'title': 'Home'},
        {'url': '/cart/', 'title': 'Cart'},
    ];

    return <div className={s.cartWrapper}>
        <div className={s.cartComponent}>
            <Breadcrumbs list={brList}/>
            <Checkout/>
        </div>
    </div>
}

export default CartComponent;