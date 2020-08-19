import React, {useState} from "react";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";
import s from './ProductComponent.module.scss';
import ProductGallery from "./ProductGallery/ProductGallery";
import Options from "./Options/Options";
import {Link} from "react-router-dom";
import DetailedInfo from "./DetailedInfo/DetailedInfo";
import RecommendedProducts from "./RecommendedProducts/RecommendedProducts";
import {useDispatch, useSelector} from "react-redux";
import {addToCart} from "../../redux/cartReducer";
import {GetBrand, GetCategory, GetChildProducts, GetProductTitle} from "../../redux/selectors/productSelectors";

type OwnPropsType = {
    params: {[key: string]: string}
}

type PropsType = OwnPropsType;

const ProductComponent: React.FC<PropsType> = (props) => {

    const brand = useSelector(GetBrand);
    const category = useSelector(GetCategory);
    const productTitle = useSelector(GetProductTitle);
    const childProducts = useSelector(GetChildProducts);
    const dispatch = useDispatch();
    const addToCartAction = (brand: string, id: string, sku: string): void => {
        dispatch(addToCart(brand, id, sku));
    }

    let brList = [
        {'url': '/', 'title': 'Home'},
        {'url': '/all-brands', 'title': 'All Brands'},
        {'url': `/brands/${props.params.brand}`, 'title': brand}
    ];

    let [currentProduct, changeProduct] = useState(childProducts.length > 1 ? undefined : childProducts.length === 1 ? childProducts[0] : undefined);
    let [activeOptions, changeOptions] = useState(childProducts.length > 1 ? Object.keys(childProducts[0].options).map(option => {
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
        let newProduct = childProducts.find(product => {
            return activeOptions.every(option => {
                return option.key === product.options[option.name];
            })
        })

        changeProduct(newProduct);
    };

    return <div className={s.productContainer}>
            <div className={s.ProductComponent}>
                <Breadcrumbs list={brList}/>
                <span className={s.productTitle}>{brand}® - {productTitle}</span>
                <div className={s.mainInfo}>
                    <ProductGallery/>
                    <div className={s.priceInfo}>
                        <Options onChange={(e)=>{updateProduct(e)}} options={childProducts}/>
                        <div className={s.productActions}>
                            <button className={currentProduct === undefined || currentProduct.quantity === 0 ? `${s.addToCartButton} ${s.disabled}` : s.addToCartButton} onClick={() => {
                                if(currentProduct !== undefined) {
                                    addToCartAction(brand, props.params.id, currentProduct.sku)
                                }
                            }} disabled={currentProduct === undefined || currentProduct.quantity === 0}>Add to Cart
                            </button>
                            <Link to={`/${category}-category`} className={s.viewSimilar}>View Similar</Link>
                        </div>
                    </div>
                </div>
                <div className={s.detailedInfo}>
                    <DetailedInfo productTitle={productTitle} brand={brand}/>
                    <RecommendedProducts/>
                </div>
            </div>
        </div>
}

export default ProductComponent;