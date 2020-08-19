import React from "react";
import s from './RecommendedProducts.module.scss';
import Product from "../../ProductGroupComponent/ProductList/Product/Product";
import {useSelector} from "react-redux";
import {GetRecommendedProducts} from "../../../redux/selectors/productSelectors";

const RecommendedProducts: React.FC = () => {

    const recommendedProducts = useSelector(GetRecommendedProducts);

    return <div className={s.recommendedProducts}>
        <div className={s.title}>Recommended Products</div>
        <div className={s.productList}>
            {
                recommendedProducts.map(item => {
                    return <Product key={item.id} {...item} />
                })
            }
        </div>
    </div>
}

export default RecommendedProducts;