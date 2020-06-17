import React, {useEffect, useState} from "react";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import s from './Cart.module.scss';
import CartDisplay from "./CartDisplay/CartDisplay";
import {connect} from "react-redux";
import {initializeProducts} from "../../../redux/cartReducer";
import {InitializeProductsType, ProductType} from "../../../types/types";
import {AppStateType} from "../../../redux/store";

type MapStateToPropsType = {
    products: Array<ProductType>
}
type MapDispatchToPropsType = {
    initializeProducts: (cartProducts: Array<InitializeProductsType>) => void
}

type PropsType = MapStateToPropsType & MapDispatchToPropsType

const Cart: React.FC<PropsType> = ({products, ...props}) => {

    let [cartDisplay, changeDisplay] = useState(false);

    let cartProductsQuantity: number = products.length;

    useEffect(() => {
        let localProductsJSON = typeof localStorage.getItem('cartProducts') == 'string' ? localStorage.getItem('cartProducts') : null;
        let localProducts = typeof localProductsJSON == 'string' ? JSON.parse(localProductsJSON) : null;

        if (Array.isArray(localProducts)) {
            props.initializeProducts(localProducts);
        }
    }, [])


    useEffect(() => {
        function updateProducts() {
            let localProductsJSON = typeof localStorage.getItem('cartProducts') == 'string' ? localStorage.getItem('cartProducts') : null;
            let localProducts = typeof localProductsJSON == 'string' ? JSON.parse(localProductsJSON) : null;
            props.initializeProducts(localProducts);
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

let mapStateToProps = (state: AppStateType): MapStateToPropsType => {
    return {
        products: state.cartReducer.products
    }
}

export default connect<MapStateToPropsType, MapDispatchToPropsType, {}, AppStateType>(mapStateToProps, {initializeProducts})(Cart)