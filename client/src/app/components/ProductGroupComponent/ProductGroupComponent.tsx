import React, {ReactText, useEffect} from 'react';
import Slider from './Slider/Slider';
import Refines from './Refines/Refines';
import ProductList from './ProductList/ProductList';
import PagesButtonList from './PagesButtonList/PagesButtonList';
import BestSellers from './BestSellers/BestSellers';
import Reviews from './Reviews/Reviews';
import s from './ProductGroupComponent.module.scss';
import Preloader from "../common/Preloader/Preloader";
import PageNotFoundComponent from "../PageNotFoundComponent/PageNotFoundComponent";
import {useDispatch, useSelector} from "react-redux";
import CategoriesBlock from "./Refines/CategoriesBlock/CategoriesBlock";
import {ProductGroupRouteType} from "../../types/types";
import {loadPrGroup, loadProducts} from "../../redux/productGroupReducer";
import {RouteComponentProps, withRouter} from "react-router";
import {
    GetProductGroupCategoriesList,
    GetProductGroupProductsLoading, GetProductGroupName,
    GetProductGroupProductsCount,
    GetProductGroupRefines,
    GetSlides, GetProductGroupLoading, GetURL, GetProductGroupBestSellers, GetProductGroupReviews, GetProductsOnPage
} from "../../redux/selectors/productGroupSelectors";

type PropsType = {
    type: string,
    activePage: ReactText,
    activeURL: string | undefined,
    query: string,
    productsOnPage: number,
    loading: boolean,
    url: string | null
};

const ProductGroupComponent: React.FC<PropsType> = (props) => {

    const productsLoading = useSelector(GetProductGroupProductsLoading);
    const refines = useSelector(GetProductGroupRefines);
    const productCount = useSelector(GetProductGroupProductsCount);
    const categoriesList = useSelector(GetProductGroupCategoriesList);
    const name = useSelector(GetProductGroupName) ;
    const slides = useSelector(GetSlides);
    const bestSellers = useSelector(GetProductGroupBestSellers);
    const reviews = useSelector(GetProductGroupReviews);

    return (
        <div className={s.CategoryComponent}>
            <Slider slides={slides}/>
            <div className={s.productsGrid}>
                <div className={s.refineBlock}>
                    {categoriesList.length > 0 ? (<CategoriesBlock type={props.type} brandName={name} categoriesList={categoriesList}/>) : ''}
                    <Refines fields={refines}/>
                </div>
                {!productsLoading ? <ProductList/> : (<div className={s.productListWrapper}><ProductList /><Preloader position={'absolute'} borderRadius={4}/></div>)}
            </div>
            <PagesButtonList
                itemsCount={productCount}
                productsOnPage={props.productsOnPage}
                activePage={props.activePage as number}
                activeURL={props.activeURL}
                type={props.type}
                query={props.query}
            />
            {bestSellers !== undefined && bestSellers.length > 0 ? <BestSellers bestSellers={bestSellers}/> : ''}
            {reviews !== undefined && reviews.length > 0 ? <Reviews reviews={reviews}/> : ''}
        </div>
    )
}

type WrapperPropsType = RouteComponentProps<ProductGroupRouteType>

const ProductGroupComponentWrapper: React.FC<WrapperPropsType> = ({...props}) => {

    const loading = useSelector(GetProductGroupLoading);
    const url = useSelector(GetURL);
    const productsOnPage = useSelector(GetProductsOnPage);
    const dispatch = useDispatch();
    const loadPrGroupThunk = (type: string, queryURL: string, query: string, productsOnPage: number): void => {
        dispatch(loadPrGroup(type, queryURL, query, productsOnPage));
    }
    const loadProductsThunk = (type: string, queryURL: string, query: string, productsOnPage: number): void => {
        dispatch(loadProducts(type, queryURL, query, productsOnPage));
    }

    let type = props.match.params.brand ? 'brand' : 'category';
    let searchParamsPage = new URLSearchParams(props.location.search).get("page");
    let activePage = searchParamsPage !== null ? searchParamsPage : 1;
    let query = props.location.search.slice(1);
    let queryURL: string;
    if (props.match.params.category !== undefined) {
        queryURL = props.match.params.category
    } else if (props.match.params.brand !== undefined) {
        queryURL = props.match.params.brand;
    } else {
        queryURL = 'home';
    }

    useEffect(() => {
        if(queryURL === url){
            loadProductsThunk(type, queryURL, query, productsOnPage);
        } else {
            loadPrGroupThunk(type, queryURL, query, productsOnPage);
        }
    }, [props.match])



    return <div className={s.productGroupWrapper}>
        {
            (!loading ? (
                    url !== null ?
                        <ProductGroupComponent
                            type={type}
                            activePage={activePage}
                            activeURL={props.match.params.brand ? props.match.params.brand : props.match.params.category}
                            query={query}
                            productsOnPage={productsOnPage}
                            {...props}
                            loading={loading}
                            url={url}
                        /> :
                        <PageNotFoundComponent/>
                ) : (<Preloader background={true}/>)
            )
        }
    </div>
}

export default withRouter(ProductGroupComponentWrapper);