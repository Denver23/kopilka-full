import React, {useEffect} from "react";
import s from './AllBrandsComponent.module.scss'
import Preloader from "../common/Preloader/Preloader";
import {useDispatch, useSelector} from "react-redux";
import Breadcrumbs from "../ProductComponent/Breadcrumbs/Breadcrumbs";
import PagesButtonList from "../ProductGroupComponent/PagesButtonList/PagesButtonList";
import {Link, withRouter, RouteComponentProps} from "react-router-dom";
import {uploadAllBrands} from "../../redux/allBrandsReducer";
import {BrandType} from "../../types/types";
import {GetAllBrands, GetBrandsLoading, GetBrandsQuantity} from "../../redux/selectors/allBrandsSelectors";

type AllBrandsComponentProps = RouteComponentProps<{}>;
const AllBrandsComponent: React.FC<AllBrandsComponentProps> = ({...props}) => {
    const loading = useSelector(GetBrandsLoading);
    const quantity = useSelector(GetBrandsQuantity);
    const brands = useSelector(GetAllBrands);
    const dispatch = useDispatch();
    const uploadAllBrandsThunk = (page: number, productOnPageQuantity: number): void => {
        dispatch(uploadAllBrands(page, productOnPageQuantity));
    }

    let productOnPageQuantity = 40;
    let UrlSearchParamsPage = new URLSearchParams(props.location.search).get('page');
    let page = UrlSearchParamsPage !== null ? +UrlSearchParamsPage : 1;

    useEffect(() => {
        uploadAllBrandsThunk(page, productOnPageQuantity)
    },[props.match.url])

    return <div className={s.allBrandsWrapper}>
        {!loading ? <AllBrandsList quantity={quantity} productOnPageQuantity={productOnPageQuantity} brands={brands} activePage={page}/> : (<Preloader background={true}/>)}
    </div>
}

type AllBrandsListProps = {
    brands: Array<BrandType>,
    productOnPageQuantity: number,
    activePage: number,
    quantity: number
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

export default withRouter(AllBrandsComponent);