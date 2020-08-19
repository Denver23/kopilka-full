import React from "react";
import s from './DetailedInfo.module.scss';
import InfoList from "./InfoList/InfoList";
import {useSelector} from "react-redux";
import ProductsInfo from "./ProductsInfo/ProductsInfo";
import {
    GetProductBrandImage,
    GetProductFeatures,
    GetProductShortDescription, GetProductSpecifications
} from "../../../redux/selectors/productSelectors";

type PropsType = {
    productTitle: string,
    brand: string
};

const DetailedInfo: React.FC<PropsType> = (props) => {

    const productBrandImage = useSelector(GetProductBrandImage);
    const shortDescription = useSelector(GetProductShortDescription);
    const features = useSelector(GetProductFeatures);
    const specifications = useSelector(GetProductSpecifications);

    return <div className={s.detailedInfo}>
        <span className={s.title}>Product Details</span>
        <img src={productBrandImage} alt="" className={s.productBrandImage}/>
        <span className={s.shortDescription}>{`${props.productTitle} by ${props.brand}®. ${shortDescription}`}</span>
        {specifications ? <InfoList title={'Specifications'} items={specifications} type={'specs'} /> : ''}
        {features ? <InfoList title={'Features'} items={features} type={'features'} /> : ''}
        <ProductsInfo brand={props.brand}/>
    </div>
}

export default DetailedInfo;