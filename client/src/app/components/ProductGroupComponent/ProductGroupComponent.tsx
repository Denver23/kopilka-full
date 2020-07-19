import React, {ComponentType, ReactText, useEffect} from 'react';
import Slider from './Slider/Slider';
import Refines from './Refines/Refines';
import ProductList from './ProductList/ProductList';
import PagesButtonList from './PagesButtonList/PagesButtonList';
import BestSellers from './BestSellers/BestSellers';
import Reviews from './Reviews/Reviews';
import s from './ProductGroupComponent.module.scss';
import Preloader from "../common/Preloader/Preloader";
import PageNotFoundComponent from "../PageNotFoundComponent/PageNotFoundComponent";
import {connect} from "react-redux";
import CategoriesBlock from "./Refines/CategoriesBlock/CategoriesBlock";
import {ChildCategoryType, ProductGroupRouteType, ProductInListType, RefineType} from "../../types/types";
import {loadPrGroup, loadProducts} from "../../redux/productGroupReducer";
import {compose} from "redux";
import {RouteComponentProps, withRouter} from "react-router";
import {AppStateType} from "../../redux/store";

type ProductGroupContainerMapDispatchToPropsType = {
    loadPrGroup: (type: string, queryURL: string, query: string, productsOnPage: number) => void,
    loadProducts: (type: string, queryURL: string, query: string, productsOnPage: number) => void
}

type ProductGroupContainerMapStateToPropsType = {
    loading: boolean,
    url: string | null,
    bestSellers: Array<ProductInListType> | undefined,
    reviews: Array<{[key: string]: string}> | undefined,
    productsOnPage: number
}

type ProductGroupMapStateToPropsType = {
    productsLoading: boolean,
    refines: Array<RefineType>,
    productCount: number | null,
    categoriesList: Array<ChildCategoryType>,
    name: string | null
}

type PropsType = {
    type: string,
    activePage: ReactText,
    activeURL: string | undefined,
    query: string
} & ProductGroupMapStateToPropsType & ProductGroupContainerMapStateToPropsType;

const ProductGroup: React.FC<PropsType> = (props) => {

    return (
        <div className={s.CategoryComponent}>
            <Slider/>
            <div className={s.productsGrid}>
                <div className={s.refineBlock}>
                    {props.categoriesList.length > 0 ? (<CategoriesBlock type={props.type} brandName={props.name} categoriesList={props.categoriesList}/>) : ''}
                    <Refines fields={props.refines}/>
                </div>
                {!props.productsLoading ? <ProductList/> : (<div className={s.productListWrapper}><ProductList /><Preloader position={'absolute'} borderRadius={4}/></div>)}
            </div>
            <PagesButtonList
                itemsCount={props.productCount}
                productsOnPage={props.productsOnPage}
                activePage={props.activePage as number}
                activeURL={props.activeURL}
                type={props.type}
                query={props.query}
            />
            {props.bestSellers !== undefined && props.bestSellers.length > 0 ? <BestSellers bestSellers={props.bestSellers}/> : ''}
            {props.reviews !== undefined && props.reviews.length > 0 ? <Reviews reviews={props.reviews}/> : ''}
        </div>
    )
}

const mapStateToProps = (state: AppStateType): ProductGroupMapStateToPropsType => {
    return {
        productsLoading: state.productGroupReducer.productsLoading,
        refines: state.productGroupReducer.refines,
        productCount: state.productGroupReducer.productCount,
        categoriesList: state.productGroupReducer.childCategories,
        name: state.productGroupReducer.name
    }
}

const ProductGroupComponent = connect<ProductGroupMapStateToPropsType, {}, {}, AppStateType>(mapStateToProps, {})(ProductGroup);

type WrapperPropsType = ProductGroupContainerMapStateToPropsType & ProductGroupContainerMapDispatchToPropsType & RouteComponentProps<ProductGroupRouteType>

const ProductGroupComponentWrapper: React.FC<WrapperPropsType> = ({loading, url, ...props}) => {

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
            props.loadProducts(type, queryURL, query, props.productsOnPage);
        } else {
            props.loadPrGroup(type, queryURL, query, props.productsOnPage);
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

let wrapperMapStateToProps = (state: AppStateType): ProductGroupContainerMapStateToPropsType => {
    return {
        loading: state.productGroupReducer.loading,
        url: state.productGroupReducer.url,
        bestSellers: state.productGroupReducer.bestSellers,
        reviews: state.productGroupReducer.reviews,
        productsOnPage: state.productGroupReducer.productsOnPage
    }
}

const ProductGroupContainer = compose<ComponentType>(withRouter, connect<ProductGroupContainerMapStateToPropsType, ProductGroupContainerMapDispatchToPropsType, {}, AppStateType>(wrapperMapStateToProps, {loadPrGroup, loadProducts}))(ProductGroupComponentWrapper);

export default ProductGroupContainer;