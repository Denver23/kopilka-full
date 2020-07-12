import React from "react";
import s from './RecommendedProducts.module.scss';
import Product from "../../ProductGroupComponent/ProductList/Product/Product";
import {connect} from "react-redux";
import {ProductInListType} from "../../../types/types";
import {AppStateType} from "../../../redux/store";

type MapStateToPropsType = {
    recommendedProducts: Array<ProductInListType>
}

type PropsType = MapStateToPropsType

const RecommendedProducts: React.FC<PropsType> = (props) => {

    return <div className={s.recommendedProducts}>
        <div className={s.title}>Recommended Products</div>
        <div className={s.productList}>
            {
                props.recommendedProducts.map(item => {
                    return <Product key={item.id} {...item} />
                })
            }
        </div>
    </div>
}

let mapStateToProps = (state: AppStateType): MapStateToPropsType => {
    return {
        recommendedProducts: state.productReducer.recommendedProducts
    }
}

export default connect<MapStateToPropsType, {}, {}, AppStateType>(mapStateToProps, {})(RecommendedProducts);