import React from 'react';
import Product from "./Product/Product";
import s from './ProductList.module.scss';
import {connect} from "react-redux";

const ProductList = (props) => {
    return (
        <div className={s.productList}>
            {props.products.map((prod) => {
                return <Product {...prod} style={'categoryList'} key={`${prod.id}`}/>
            })}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        products: state.productGroupReducer.products,
        url: state.productGroupReducer.url
    }
}

export default connect(mapStateToProps)(ProductList);