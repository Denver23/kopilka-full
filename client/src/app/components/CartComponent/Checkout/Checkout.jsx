import React, {useState} from "react";
import s from './Checkout.module.scss'
import {Field, reduxForm} from "redux-form";
import RadioButton from "../../common/RadioButtons/RadioButton/RadioButton";
import {connect} from "react-redux";
import { submit } from 'redux-form'
import CartProduct from "../../HeaderComponent/Cart/CartDisplay/CartProduct/CartProduct";
import {checkoutProducts} from "../../../redux/cartReducer";
import {requiredField, phoneType} from "../../../utils/validators/validators";
import Input from "../../common/Input/Input";
import CheckoutStatus from "../CheckoutStatus/CheckoutStatus";

const Checkout = (props) => {

    let [deliveryCost, changeCost] = useState(0);

    let totalPrice = 0;

    props.products.forEach(product => {
        totalPrice += product.price * product.quantity;
    })

    const checkoutSubmit = (options) => {
        let products = props.products.map(product => {
            return {productId: product.id, sku: product.sku, quantity: product.quantity}
        })

        props.checkoutProducts(products, options);

    }

    return <div>
        {
            props.message === '' ? <div className={s.checkout}>
                <CustomerFormRedux fields={[...props.checkoutOptions]} onSubmit={checkoutSubmit}/>
                <div className={s.productsInfo}>
                    {props.products.length ? props.products.map(product => {
                        return <CartProduct {...product} key={product.sku} />
                    }) : <span className={s.message}>Your cart is empty</span>}
                    {props.products.length ? <div className={s.priceInfo}>
                        <div className={s.priceItem}><span className={s.priceTitle}>Sum:</span>{totalPrice}$</div>
                        <div className={s.priceItem}><span className={s.priceTitle}>Delivery:</span>{deliveryCost}$</div>
                        <div className={s.priceItem}><span className={s.priceTitle}>Total Price:</span>{totalPrice + deliveryCost}$</div>
                    </div> : ''}
                    {props.products.length ? <RemoveSubmitButtonConnect /> : ''}
                </div>
            </div> : <CheckoutStatus />
        }
    </div>
}

const CutomerForm = ({ handleSubmit, fields, ...props }) => {

    return <form className={s.customerInfo} onSubmit={handleSubmit}>
        <div className={s.customerForm}>
            <div className={s.checkoutTitle}>Customer</div>
            <span className={s.inputTitle}>Name:</span>
            <Field name='customerName' component={Input} type='text' validate={[requiredField]}/>
            <span className={s.inputTitle}>Phone Number:</span>
            <Field name='customerPhone' component={Input} type='text' validate={[requiredField, phoneType]}/>
        </div>
        <div className={s.customerForm}>
            <div className={s.checkoutTitle}>Delivery Method</div>
            <div className={s.checkoutList}>
                {fields.map(field => (
                    field.forType === 'deliveryMethod' ? <Field name={'deliveryMethod'} component={RadioButton}
                                                                field={field}
                                                                props={{'value': field.name.replace('.', '{:dot:}').replace(/ /g, '+')}}
                                                                key={field.name}
                                                                validate={[requiredField]}
                    /> : ''
                ))}
            </div>
            <span className={s.inputTitle}>Address:</span>
            <Field name='address' component={Input} type='text' validate={[requiredField]}/>
        </div>
        <div className={s.customerForm}>
            <div className={s.checkoutTitle}>Payment method</div>
            <div className={s.checkoutList}>
                {fields.map(field => (
                    field.forType === 'paymentMethod' ? <Field name={'paymentMethod'} component={RadioButton}
                                                               field={field}
                                                               props={{'value': field.name.replace('.', '{:dot:}').replace(/ /g, '+')}}
                                                               key={field.name}
                                                               validate={[requiredField]} /> : ''
                ))}
            </div>
        </div>
    </form>
}

const CustomerFormRedux = reduxForm({form: 'CustomerForm',enableReinitialize: true})(CutomerForm)

const RemoveSubmitButton = ({ dispatch }) => {
    return <button type={'button'} className={s.submitButton} onClick={() => dispatch(submit('CustomerForm'))}>Checkout</button>
}

const RemoveSubmitButtonConnect = connect()(RemoveSubmitButton);

let mapStateToProps = (state) => {
    return {
        products: state.cartReducer.products,
        checkoutOptions: state.cartReducer.checkoutOptions,
        message: state.cartReducer.checkoutMessage
    }
}

export default connect(mapStateToProps, {checkoutProducts})(Checkout);