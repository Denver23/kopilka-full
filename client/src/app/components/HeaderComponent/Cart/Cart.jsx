import React, {useEffect, useState} from "react";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import s from './Cart.module.scss';
import CartDisplay from "./CartDisplay/CartDisplay";
import {connect} from "react-redux";
import {initializeProducts} from "../../../redux/cartReducer";

const Cart = ({products, ...props}) => {

    let [cartDisplay, changeDisplay] = useState(false);

    let cartProductsQuantity = products.length;

    useEffect(() => {
        let loadProducts = JSON.parse(localStorage.getItem('cartProducts'));

        if (loadProducts !== null) {
            props.initializeProducts(loadProducts);
        }
    }, [])


    useEffect(() => {
        function updateProducts() {
            props.initializeProducts(JSON.parse(localStorage.getItem('cartProducts')));
        }

        window.addEventListener('storage', updateProducts);
        updateProducts();
        return () => window.removeEventListener('storage', updateProducts);
    }, []);


    return (
        <div className={s.cartWrapper}>
            <div className={s.cartItem} onClick={() => {
                changeDisplay(!cartDisplay)
            }}>
                <ShoppingCartIcon/>
                <span className={s.title}>Cart</span>
                <div className={s.productNumber}>{cartProductsQuantity}</div>
            </div>
            {cartDisplay ? <CartDisplay products={products} changeDisplay={changeDisplay}/> : ''}
        </div>
    )
}

let mapStateToProps = (state) => {
    return {
        products: state.cartReducer.products
    }
}

export default connect(mapStateToProps, {initializeProducts})(Cart)