import React from "react";
import s from './RecommendedProducts.module.scss';
import Product from "../../ProductGroupComponent/ProductList/Product/Product";
import {connect} from "react-redux";

const RecommendedProducts = (props) => {

    return <div className={s.recommendedProducts}>
        <div className={s.title}>Recommended Products</div>
        <div className={s.productList}>
            {
                props.recommendedProducts.map(item => {
                    return <Product key={item.id} data={item} />
                })
            }
        </div>
    </div>
}

let mapStateToProps = (state) => {
    return {
        "recommendedProducts": state.productReducer.recommendedProducts
    }
}

export default connect(mapStateToProps, {})(RecommendedProducts);