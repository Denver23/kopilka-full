import React, {useEffect} from "react";
import s from './AllBrandsComponent.module.scss'
import Preloader from "../common/Preloader/Preloader";
import {connect} from "react-redux";
import Breadcrumbs from "../ProductComponent/Breadcrumbs/Breadcrumbs";
import PagesButtonList from "../ProductGroupComponent/PagesButtonList/PagesButtonList";
import {compose} from "redux";
import {Link, withRouter} from "react-router-dom";
import {uploadAllBrands} from "../../redux/allBrandsReducer";

const AllBrandsComponent = ({loading, ...props}) => {

    useEffect(() => {
        let productOnPageQuantity = 30;
        let startItem = (props.match.params.page - 1) * productOnPageQuantity + 1;
        let endItem = props.match.params.page * productOnPageQuantity;

        props.uploadAllBrands(startItem, endItem)
    },[props.match.url])

    return <div className={s.allBrandsWrapper}>
        {!loading ? <AllBrandsList brands={props.brands} activePage={props.match.params.page} categoryURL={props.match.params.category} {...props}/> : (<Preloader background={'true'}/>)}
    </div>
}
const AllBrandsList = (props) => {

    let brList = [
        {'url': '/', 'title': 'Home'}
    ];

    return <div className={s.allBrands}>
        <div className={s.breadcrumbsWrapper}><Breadcrumbs list={brList}/></div>
        <span className={s.pageTitle}>Brand List:</span>
            <ul className={s.brandsList}>
                {props.brands.map(brand => {
                    return <li><Link to={`/brands/${brand.url}/`} className={s.brandUrl}><div className={s.brandFirstChart}>{brand.name[0]}</div>{brand.name}</Link></li>
                })}
            </ul>
        <PagesButtonList itemsCount={150} activePage={props.match.params.page} activeURL={'all-brands'} type={'custom'}/>
    </div>
}

let mapStateToProps = (state) => {
    return {
        loading: state.allBrandsReducer.loading,
        quantity: state.allBrandsReducer.quantity,
        brands: state.allBrandsReducer.brands
    }
}

export default compose(withRouter, connect(mapStateToProps, {uploadAllBrands}))(AllBrandsComponent);