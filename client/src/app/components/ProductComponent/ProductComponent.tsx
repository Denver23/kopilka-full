import React, {useState} from "react";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";
import s from './ProductComponent.module.scss';
import ProductGallery from "./ProductGallery/ProductGallery";
import Options from "./Options/Options";
import {Link} from "react-router-dom";
import DetailedInfo from "./DetailedInfo/DetailedInfo";
import RecommendedProducts from "./RecommendedProducts/RecommendedProducts";
import {connect} from "react-redux";
import {compose} from "redux";
import {addToCart} from "../../redux/cartReducer";
import {ChildProductType} from "../../types/types";
import {AppStateType} from "../../redux/store";

type MapStateToPropsType = {
    brand: string,
    category: string,
    productTitle: string,
    childProducts: Array<ChildProductType>
}

type MapDispatchToPropsType = {
    addToCart: (brand: string, id: string, sku: string) => void
}

type OwnPropsType = {
    params: {[key: string]: string}
}

type PropsType = OwnPropsType & MapStateToPropsType & MapDispatchToPropsType;

const ProductComponent: React.FC<PropsType> = (props) => {

    let brList = [
        {'url': '/', 'title': 'Home'},
        {'url': '/all-brands', 'title': 'All Brands'},
        {'url': `/brands/${props.params.brand}`, 'title': props.brand}
    ];

    let [currentProduct, changeProduct] = useState(props.childProducts.length > 1 ? undefined : props.childProducts.length === 1 ? props.childProducts[0] : undefined);
    let [activeOptions, changeOptions] = useState(props.childProducts.length > 1 ? Object.keys(props.childProducts[0].options).map(option => {
        return {'name': option, 'key': ''};
    }) : []);

    let dataOption = (options: any) => {
        let result = activeOptions;
        let keys = Object.keys(options);

        result.forEach(item => {
            keys.indexOf(item.name, 0) !== -1 ? item.key = options[item.name] : item.key = '';
        })

        return result;
    };

    const updateProduct = (options: any) => {
        changeOptions(dataOption(options));
        let newProduct = props.childProducts.find(product => {
            return activeOptions.every(option => {
                return option.key === product.options[option.name];
            })
        })

        changeProduct(newProduct);
    };

    return <div className={s.productContainer}>
            <div className={s.ProductComponent}>
                <Breadcrumbs list={brList}/>
                <span className={s.productTitle}>{props.brand}® - {props.productTitle}</span>
                <div className={s.mainInfo}>
                    <ProductGallery/>
                    <div className={s.priceInfo}>
                        <Options onChange={(e)=>{updateProduct(e)}} options={props.childProducts}/>
                        <div className={s.productActions}>
                            <button className={currentProduct === undefined || currentProduct.quantity === 0 ? `${s.addToCartButton} ${s.disabled}` : s.addToCartButton} onClick={() => {
                                if(currentProduct !== undefined) {
                                    props.addToCart(props.brand, props.params.id, currentProduct.sku)
                                }
                            }} disabled={currentProduct === undefined || currentProduct.quantity === 0}>Add to Cart
                            </button>
                            <Link to={`/${props.category}-category`} className={s.viewSimilar}>View Similar</Link>
                        </div>
                    </div>
                </div>
                <div className={s.detailedInfo}>
                    <DetailedInfo productTitle={props.productTitle} brand={props.brand}/>
                    <RecommendedProducts/>
                </div>
            </div>
        </div>
}

let mapStateToProps = (state: AppStateType): MapStateToPropsType => {
    return {
        brand: state.productReducer.brand,
        category: state.productReducer.category,
        productTitle: state.productReducer.productTitle,
        childProducts: state.productReducer.childProducts
    }
}

export default compose(connect<MapStateToPropsType, MapDispatchToPropsType, {}, AppStateType>(mapStateToProps, {addToCart}))(ProductComponent);