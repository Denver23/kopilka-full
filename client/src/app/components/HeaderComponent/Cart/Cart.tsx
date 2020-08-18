import React, {useEffect, useState} from "react";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import s from './Cart.module.scss';
import CartDisplay from "./CartDisplay/CartDisplay";
import {connect, useDispatch, useSelector} from "react-redux";
import {initializeProducts} from "../../../redux/cartReducer";
import {InitializeProductsType, ProductType} from "../../../types/types";
import {AppStateType} from "../../../redux/store";
import {GetCartProducts} from "../../../redux/selectors/cartReducerSelectors";

const Cart: React.FC = ({...props}) => {

    const products = useSelector(GetCartProducts);
    const dispatch = useDispatch();
    const initializeProductsThunk = (cartProducts: Array<InitializeProductsType>): void => {
        dispatch(initializeProducts(cartProducts));
    }

    let [cartDisplay, changeDisplay] = useState(false);

    let cartProductsQuantity: number = products.length;

    useEffect(() => {
        let localProductsJSON = typeof localStorage.getItem('cartProducts') == 'string' ? localStorage.getItem('cartProducts') : null;
        let localProducts = typeof localProductsJSON == 'string' ? JSON.parse(localProductsJSON) : null;

        if (Array.isArray(localProducts)) {
            initializeProductsThunk(localProducts);
        }
    }, [])


    useEffect(() => {
        function updateProducts() {
            let localProductsJSON = typeof localStorage.getItem('cartProducts') == 'string' ? localStorage.getItem('cartProducts') : null;
            let localProducts = typeof localProductsJSON == 'string' ? JSON.parse(localProductsJSON) : null;
            initializeProductsThunk(localProducts);
        }

        window.addEventListener('storage', updateProducts);
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

export default Cart;