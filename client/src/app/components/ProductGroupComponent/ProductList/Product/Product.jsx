import React from 'react';
import {Link} from "react-router-dom";
import s from './Product.module.scss';

const Product = (props) => {
    return (
        <Link to={`/brands/${props.brandUrl}/id${props.id}`} className={`${s.product} ${s[props.style]}`}>
            <div className={s.productImage}><img
                src={props.imageUrl}
                alt=""/></div>
            <span className={s.productTitle}>{props.productTitle}</span>
            <span className={s.productAdditionalText}>{props.additional}</span>
            <span className={s.price}>${props.price}</span>
        </Link>
    )
}

export default Product;