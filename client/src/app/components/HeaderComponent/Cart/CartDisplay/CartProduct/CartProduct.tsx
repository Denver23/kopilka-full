import s from "./CartProduct.module.scss";
import {Link} from "react-router-dom";
import React, {useState} from "react";
import {useDispatch} from "react-redux";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {cartReducerActions, deleteFromCart} from "../../../../../redux/cartReducer";
import {Formik} from "formik";
import {ProductType, localStorageProductType} from "../../../../../types/types";

type ChangeQuantity = (sku: string, quantity: number) => void

type CartProductPropsType = ProductType

const CartProduct: React.FC<CartProductPropsType> = ({options, ...props}) => {

    const dispatch = useDispatch();
    const deleteFromCartAction = (sku: string): void => {
        dispatch(deleteFromCart(sku));
    }
    const changeQuantityAction = (sku: string, quantity: number): void => {
        dispatch(cartReducerActions.changeQuantity(sku, quantity))
    }

    let localProductsJSON = typeof localStorage.getItem('cartProducts') == 'string' ? localStorage.getItem('cartProducts') : null;
    let localProducts = typeof localProductsJSON == 'string' ? JSON.parse(localProductsJSON) : null;

    let [quantity, changeQuantity] = useState(localProducts.findIndex((item: localStorageProductType) => {return item.sku === props.sku;}) != -1 ? localProducts.find((item: localStorageProductType) => {
        return item.sku === props.sku;
    }).quantity : 0)


    return <div>
        {quantity ?
        <div className={s.cartProduct}>
            <div className={s.productInfo}>
                <Link to={`/brands/${props.brand.toLowerCase()}/id${props.id}`} className={s.productURL}>
                    <img src={props.thumbnail} alt="" className={s.thumbnail}/>
                    <span className={s.productTitle}>{`${props.brand} - ${props.productTitle}`}</span>
                </Link>
                <QuantityForm initialValues={{quantity: props.quantity,sku: props.sku}} changeQuantity={changeQuantityAction}/>
                <ProductPrice price={props.price} name={props.sku} quantity={props.quantity}/>
                <span onClick={(e) => {
                    deleteFromCartAction(props.sku)
                }} className={s.deleteProduct}><DeleteForeverIcon fontSize="large"/></span>
            </div>
            {!!options ? <div className={s.productOptions}>{Object.keys(options).map((item) => {
                return <div className={s.option} key={`${props.sku} - ${item} - ${options[item]}`}>
                    <span className={s.optionTitle}>{item}:</span>
                    <span>{options[item]}</span>
                </div>
            })}</div> : ''}
        </div> : ''}
    </div>
}

type QuantityFormOwnPropsType = {
    initialValues: {quantity: number, sku: string},
    changeQuantity: ChangeQuantity
}

const QuantityForm: React.FC<QuantityFormOwnPropsType> = (props) => {



    const changeLocalQuantity = (sku: string, quantity: number) => {
        if(quantity === undefined) {
            return;
        }
        let localProductsJSON = typeof localStorage.getItem('cartProducts') == 'string' ? localStorage.getItem('cartProducts') : null;
        let localProducts = typeof localProductsJSON == 'string' ? JSON.parse(localProductsJSON) : null;
        localProducts.forEach((item: localStorageProductType) => {
            if (item.sku === sku) {
                item.quantity = quantity;
            }
        })
        props.changeQuantity(sku, quantity);
        localStorage.setItem('cartProducts', JSON.stringify(localProducts));
    }

    return (
        <Formik {...props} enableReinitialize onSubmit={() => {}}>
            {(formik: any) => (
                <form onSubmit={formik.handleSubmit}/*onChange={e=> {changeLocalQuantity(formik.values.sku, e.target.value)}}*/>
                    <input
                        id="quantity"
                        type="number"
                        min={1}
                        onChange={e=> {changeLocalQuantity(formik.values.sku, +e.target.value)}}
                        {...formik.getFieldProps('quantity')}
                        className={s.productQuantityField}
                        />
                </form>
            )}
        </Formik>
    );
};

type ProductPricePropsType = {
    price: number,
    name: string,
    quantity: number
}

const ProductPrice: React.FC<ProductPricePropsType> = (props) => {
    return <span className={s.productPrice}>{props.price * props.quantity}$</span>
}

export default CartProduct;