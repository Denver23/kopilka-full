import React, {useEffect} from "react";
import s from "./ProductComponent.module.scss";
import Preloader from "../common/Preloader/Preloader";
import {connect} from "react-redux";
import {loadProduct} from "../../redux/productReducer";
import {withRouter} from "react-router-dom";
import ProductComponent from "./ProductComponent";
import {compose} from "redux";
import PageNotFoundComponent from "../PageNotFoundComponent/PageNotFoundComponent";

const ProductComponentWrapper = ({loading, id, ...props}) => {

    useEffect(() => {
        let id = props.match.params.id;
        let brand = props.match.params.brand;
        props.loadProduct(id, brand);
    }, [props.match.url])

    return <div className={s.productWrapper}>
        {!loading ? (id != null ? <ProductComponent props={props}/> : <PageNotFoundComponent/>) : (<Preloader background={'true'}/>)}
    </div>
}

let mapStateToProps = (state) => {
    return {
        loading: state.productReducer.loading,
        id: state.productReducer.id
    }
}

export default compose(withRouter, connect(mapStateToProps, {loadProduct}))(ProductComponentWrapper);