import React from "react";
import Product from '../ProductList/Product/Product';
import s from './BestSellers.module.scss';
import {ProductInListType} from "../../../types/types";

type PropsType = {
    bestSellers: any | undefined
}

const BestSellers: React.FC<PropsType> = ({bestSellers, ...props}) => {
    return (
        <div className={s.bestSellersWrapper}>
            <div className={s.bestSellersBlock}>
                <span className={s.title}>Best Sellers</span>
                <div className={s.productList}>
                    {bestSellers !== undefined ? bestSellers.map((prod: ProductInListType) => {
                        return <Product {...prod} key={`${prod.brand} ${prod.productTitle}`}/>
                    }) : ''}
                </div>
            </div>
        </div>
    )
}

export default BestSellers;