import s from "./CartProduct.module.scss";
import {Link} from "react-router-dom";
import {Field, formValueSelector, reduxForm} from "redux-form";
import React from "react";
import {connect} from "react-redux";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {deleteFromCart} from "../../../../../redux/cartReducer";

const CartProductReduxForm = ({options, ...props}) => {

    let localProducts = JSON.parse(localStorage.getItem('cartProducts'));
    let initialValues = {};
    initialValues['quantity'] = localProducts.find(item => {
        return item.sku == props.sku;
    }).quantity;

    const changeLocalQuantity = (sku, quantity) => {
        if(quantity == undefined) {
            return;
        }
        let localProducts = JSON.parse(localStorage.getItem('cartProducts'));
        localProducts.forEach(item => {
            if (item.sku == sku) {
                item.quantity = quantity;
            }
        })
        localStorage.setItem('cartProducts', JSON.stringify(localProducts));
    }

    return <div className={s.cartProduct}>
        <div className={s.productInfo}>
            <Link to={`/brands/${props.brand.toLowerCase()}/id${props.id}`} className={s.productURL}>
                <img src={props.thumbnail} alt="" className={s.thumbnail}/>
                <span className={s.productTitle}>{`${props.brand} - ${props.productTitle}`}</span>
            </Link>
            <ProductQuantityForm onChange={(e) => {
                changeLocalQuantity(props.sku, e.quantity)
            }} form={props.sku} fields={[{'name': 'quantity'}]} initialValues={initialValues}/>
            <ProductPriceWrapper price={props.price} name={props.sku}/>
            <span onClick={(e) => {
                props.deleteFromCart(props.sku)
            }} className={s.deleteProduct}><DeleteForeverIcon fontSize="large"/></span>
        </div>
        {Object.keys(options) ? <div className={s.productOptions}>{Object.keys(options).map(item => {
            return <div className={s.option}>
                <span className={s.optionTitle}>{item}:</span>
                <span>{options[item]}</span>
            </div>
        })}</div> : ''}
    </div>
}

const ProductPrice = (props) => {
    return <span className={s.productPrice}>{props.price * props.quantity}$</span>
}

let mapStateToProps = (state, ownProps) => {
    return {
        'quantity': formValueSelector(ownProps.name)(state, 'quantity')
    }
}

const ProductPriceWrapper = connect(mapStateToProps, {})(ProductPrice);

const ProductQuantity = (props) => {
    return <form onSubmit={props.handleSubmit}>
        <Field component={ProductQuantityField} type={'number'} name={props.fields[0].name}
               className={s.productQuantityField}></Field>
    </form>
}

const ProductQuantityField = ({input, meta: {touched, error}, ...props}) => {
    return <input {...input} {...props} className={s.productQuantityField} min={1} max={10}/>
}

const ProductQuantityForm = reduxForm({destroyOnUnmount: false})(ProductQuantity);

export default connect((state) => ({}), {deleteFromCart})(CartProductReduxForm);