import React, {useEffect} from 'react';
import {Tabs} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {GetProductId, GetProductLoading} from "../../redux/selectors/productSelector";
import {loadProduct} from "../../redux/productReducer";
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {ProductRouteType} from "../../types/types";
import Preloader from "../common/Preloader/Preloader";
import s from './ProductPage.module.scss';
import GeneralInfo from "./GeneralInfo/GeneralInfo";
import CustomFields from "./CustomFields/CustomFields";
import ChildProducts from "./ChildProducts/ChildProducts";

const ProductPage: React.FC<RouteComponentProps<ProductRouteType>> = (props) => {

    const dispatch = useDispatch();
    const loadProductThunk = (id: string): void => {
        dispatch(loadProduct(id));
    };

    const productId = useSelector(GetProductId);
    const loading = useSelector(GetProductLoading);

    useEffect(() => {
        if (productId == null) {
            loadProductThunk(props.match.params.id);
        }
    }, [productId]);

    return <>
        {loading ? <Preloader/> : <div className={s.wrapper}>
            <Tabs defaultActiveKey="1" type="card" size={"middle"}>
                <Tabs.TabPane tab="General Info" key="1">
                    <GeneralInfo/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Custom Fields" key="2">
                    <CustomFields/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Child Products" key="3">
                    <ChildProducts/>
                </Tabs.TabPane>
            </Tabs>
        </div>
        }

    </>
}

export default withRouter(ProductPage);