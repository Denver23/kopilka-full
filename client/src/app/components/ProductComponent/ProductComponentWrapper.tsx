import React, {useEffect} from "react";
import s from "./ProductComponent.module.scss";
import Preloader from "../common/Preloader/Preloader";
import {useDispatch, useSelector} from "react-redux";
import {loadProduct} from "../../redux/productReducer";
import {RouteComponentProps, withRouter} from "react-router-dom";
import PageNotFoundComponent from "../PageNotFoundComponent/PageNotFoundComponent";
import {ProductRouteType} from "../../types/types";
import ProductComponent from "./ProductComponent";
import {GetProductId, GetProductLoading} from "../../redux/selectors/productSelectors";

type PropsType =  RouteComponentProps<ProductRouteType>;

const ProductComponentWrapper: React.FC<PropsType> = ({...props}) => {

    const loading = useSelector(GetProductLoading);
    const id = useSelector(GetProductId);
    const dispatch = useDispatch();
    const loadProductThunk = (id: string, brand: string): void => {
        dispatch(loadProduct(id, brand));
    }

    useEffect(() => {
        let id = props.match.params.id;
        let brand = props.match.params.brand;
        loadProductThunk(id, brand);
    }, [props.match.url])

    return <div className={s.productWrapper}>
        {!loading ? (id != null ? <ProductComponent params={props.match.params}/> : <PageNotFoundComponent/>) : (<Preloader background={true}/>)}
    </div>
}

export default withRouter(ProductComponentWrapper);