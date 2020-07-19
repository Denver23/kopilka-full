import React, {ComponentType, useEffect} from "react";
import s from "./ProductComponent.module.scss";
import Preloader from "../common/Preloader/Preloader";
import {connect} from "react-redux";
import {loadProduct} from "../../redux/productReducer";
import {RouteComponentProps, withRouter} from "react-router-dom";
import {compose} from "redux";
import PageNotFoundComponent from "../PageNotFoundComponent/PageNotFoundComponent";
import {ProductRouteType} from "../../types/types";
import {AppStateType} from "../../redux/store";
import ProductComponent from "./ProductComponent";

type MapStateToPropsType = {
    loading: boolean,
    id: string | null
}

type MapDispatchToPropsType = {
    loadProduct: (id: string, brand: string) => void
}

type PropsType = MapStateToPropsType & MapDispatchToPropsType & RouteComponentProps<ProductRouteType>;

const ProductComponentWrapper: React.FC<PropsType> = ({loading, id, ...props}) => {

    useEffect(() => {
        let id = props.match.params.id;
        let brand = props.match.params.brand;
        props.loadProduct(id, brand);
    }, [props.match.url])

    return <div className={s.productWrapper}>
        {!loading ? (id != null ? <ProductComponent params={props.match.params}/> : <PageNotFoundComponent/>) : (<Preloader background={true}/>)}
    </div>
}

let mapStateToProps = (state: AppStateType): MapStateToPropsType => {
    return {
        loading: state.productReducer.loading,
        id: state.productReducer.id
    }
}

export default compose<ComponentType>(withRouter, connect<MapStateToPropsType, MapDispatchToPropsType, {}, AppStateType>(mapStateToProps, {loadProduct}))(ProductComponentWrapper);