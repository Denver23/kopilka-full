import React from 'react';
import Product from "./Product/Product";
import s from './ProductList.module.scss';
import {useSelector} from "react-redux";
import {GetProductGroupProducts, GetURL} from "../../../redux/selectors/productGroupSelectors";

const ProductList: React.FC = (props) => {

    const products = useSelector(GetProductGroupProducts);

    return (
        <div className={s.productList}>
            {products.map((prod) => {
                return <Product {...prod} style={'categoryList'} key={`${prod.id}`}/>
            })}
        </div>
    )
}

export default ProductList;