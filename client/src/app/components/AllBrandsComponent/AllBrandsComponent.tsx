import React, {useEffect} from "react";
import s from './AllBrandsComponent.module.scss'
import Preloader from "../common/Preloader/Preloader";
import {connect} from "react-redux";
import Breadcrumbs from "../ProductComponent/Breadcrumbs/Breadcrumbs";
import PagesButtonList from "../ProductGroupComponent/PagesButtonList/PagesButtonList";
import {compose} from "redux";
import {Link, withRouter, RouteComponentProps} from "react-router-dom";
import {uploadAllBrands} from "../../redux/allBrandsReducer";
import {BrandType} from "../../types/types";
import { AppStateType } from "../../redux/store";

type AllBrandsComponentMapStatePropsType = {
    loading: boolean,
    quantity: number | null,
    brands: Array<BrandType>
}
type AllBrandsComponentMapDispatchPropsType = {
    uploadAllBrands: (page: number, productOnPageQuantity: number) => void
}

type AllBrandsComponentProps = AllBrandsComponentMapStatePropsType & AllBrandsComponentMapDispatchPropsType & RouteComponentProps<{}>;
const AllBrandsComponent: React.FC<AllBrandsComponentProps> = ({loading, ...props}) => {
    let productOnPageQuantity = 40;
    let UrlSearchParamsPage = new URLSearchParams(props.location.search).get('page');
    let page = UrlSearchParamsPage !== null ? +UrlSearchParamsPage : 1;

    useEffect(() => {
        props.uploadAllBrands(page, productOnPageQuantity)
    },[props.match.url])

    return <div className={s.allBrandsWrapper}>
        {!loading ? <AllBrandsList quantity={props.quantity} productOnPageQuantity={productOnPageQuantity} brands={props.brands} activePage={page}/> : (<Preloader background={'true'}/>)}
    </div>
}

type AllBrandsListProps = {
    brands: Array<BrandType>,
    productOnPageQuantity: number,
    activePage: number,
    quantity: number | null
}
const AllBrandsList: React.FC<AllBrandsListProps> = (props) => {

    let brList = [
        {'url': '/', 'title': 'Home'}
    ];

    return <div className={s.allBrands}>
        <div className={s.breadcrumbsWrapper}><Breadcrumbs list={brList}/></div>
        <span className={s.pageTitle}>Brand List:</span>
            <ul className={s.brandsList}>
                {props.brands.map((brand: BrandType) => {
                    return <li key={brand.name}><Link to={`/brands/${brand.url}/`} className={s.brandUrl}><div className={s.brandFirstChart}>{brand.name[0]}</div>{brand.name}</Link></li>
                })}
            </ul>
        <PagesButtonList itemsCount={props.quantity} productsOnPage={props.productOnPageQuantity} activePage={props.activePage} activeURL={'all-brands'} type={'custom'}/>
    </div>
}

let mapStateToProps = (state: AppStateType): AllBrandsComponentMapStatePropsType => {
    return {
        loading: state.allBrandsReducer.loading,
        quantity: state.allBrandsReducer.quantity,
        brands: state.allBrandsReducer.brands
    }
}

export default compose(withRouter, connect<AllBrandsComponentMapStatePropsType, AllBrandsComponentMapDispatchPropsType, {}, AppStateType>(mapStateToProps, {uploadAllBrands}))(AllBrandsComponent);