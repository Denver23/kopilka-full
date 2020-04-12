import React from "react";
import Product from './../ProductList/Product/Product';
import s from './BestSellers.module.scss';
import {connect} from "react-redux";

const BestSellers = (props) => {
    return (
        <div className={s.bestSellersWrapper}>
            <div className={s.bestSellersBlock}>
                <span className={s.title}>Best Sellers</span>
                <div className={s.productList}>
                    {props.bestSellers.map((prod) => {
                        return <Product data={prod} key={`${prod.brand} ${prod.title}`}/>
                    })}
                </div>
            </div>
        </div>
    )
}

export default BestSellers;