import React, {useEffect, useRef} from "react";
import s from './CartDisplay.module.scss'
import CartProduct from "./CartProduct/CartProduct";
import {Link} from "react-router-dom";

const CartDisplay = (props) => {

    let cartDisplay = useRef();

    let handleClickOutside = (e) => {
        const domNode = cartDisplay;
        if ((!domNode.current || !domNode.current.contains(e.target))) {
            if(e.target.nodeName != 'path' && e.target.nodeName != 'svg' && e.target.nodeName != 'SPAN') {
                props.changeDisplay(false);
            }
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => (document.removeEventListener('click', handleClickOutside))
    }, [])

    let totalPrice = 0;

    props.products.forEach(product => {
        totalPrice += product.price * product.quantity;
    })

    return <div ref={cartDisplay} className={s.cartDisplay}>
        {props.products.length ? props.products.map(product => {
            return <CartProduct {...product} key={product.sku} />
            }) : <span className={s.message}>Your cart is empty</span>}
        {props.products.length ? <div className={s.checkoutForm}><span className={s.totalPrice}>Total Price: {totalPrice}</span><Link to={'/cart'} className={s.checkoutButton} onClick={()=>{props.changeDisplay(false)}}>Checkout</Link></div> : ''}
    </div>
}



export default CartDisplay;