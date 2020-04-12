import React from "react";
import s from './DetailedInfo.module.scss';
import InfoList from "./InfoList/InfoList";
import ProductsInfo from "./ProductsInfo/ProductsInfo";
import {connect} from "react-redux";

const DetailedInfo = (props) => {
    return <div className={s.detailedInfo}>
        <span className={s.title}>Product Details</span>
        <img src={props.productBrandImage} alt="" className={s.productBrandImage}/>
        <span className={s.shortDescription}>{`${props.productTitle} by ${props.brand}®. ${props.shortDescription}`}</span>
        {props.specifications ? <InfoList title={'Specifications'} items={props.specifications} type={'specs'} /> : ''}
        {props.features ? <InfoList title={'Features'} items={props.features} type={'features'} /> : ''}
        <ProductsInfo brand={props.brand}/>
    </div>
}

let mapStateToProps = (state) => {
    return {
        "productBrandImage": state.productReducer.productBrandImage,
        "shortDescription": state.productReducer.shortDescription,
        "features": state.productReducer.features,
        "specifications": state.productReducer.specifications
    }
}

export default connect(mapStateToProps, {})(DetailedInfo);