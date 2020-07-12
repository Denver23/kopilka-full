import React from 'react';
import Product from "./Product/Product";
import s from './ProductList.module.scss';
import {connect} from "react-redux";
import {ProductInListType} from "../../../types/types";
import {AppStateType} from "../../../redux/store";

type MapStateToPropsType = {
    products: Array<ProductInListType>,
    url: string | null
}

const ProductList: React.FC<MapStateToPropsType> = (props) => {
    return (
        <div className={s.productList}>
            {props.products.map((prod) => {
                return <Product {...prod} style={'categoryList'} key={`${prod.id}`}/>
            })}
        </div>
    )
}

const mapStateToProps = (state: AppStateType): MapStateToPropsType => {
    return {
        products: state.productGroupReducer.products,
        url: state.productGroupReducer.url
    }
}

export default connect<MapStateToPropsType, {}, {}, AppStateType>(mapStateToProps)(ProductList);