import ProductGroupComponentWrapper from './ProductGroupComponent';
import {connect} from "react-redux";
import {loadPrGroup, loadProducts} from "../../redux/productGroupReducer";
import {compose} from "redux";
import {withRouter} from "react-router-dom";

let mapStateToProps = (state) => {
    return {
        loading: state.productGroupReducer.loading,
        url: state.productGroupReducer.url,
        bestSellers: state.productGroupReducer.bestSellers,
        reviews: state.productGroupReducer.reviews,
        productsOnPage: state.productGroupReducer.productsOnPage
    }
}

const ProductGroupContainer = compose(withRouter, connect(mapStateToProps, {loadPrGroup, loadProducts}))(ProductGroupComponentWrapper);

export default ProductGroupContainer;