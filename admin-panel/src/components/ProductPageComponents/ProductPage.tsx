import React, {useEffect} from 'react';
import {Button, Form, Tabs} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {GetProductId, GetProductLoading} from "../../redux/selectors/productSelector";
import {loadProduct, saveProduct} from "../../redux/productReducer";
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {ProductRouteType} from "../../types/types";
import Preloader from "../common/Preloader/Preloader";
import s from './ProductPage.module.scss';
import GeneralInfo from "./GeneralInfo/GeneralInfo";
import CustomFields from "./CustomFields/CustomFields";
import ChildProducts from "./ChildProducts/ChildProducts";
import {SaveOutlined} from "@ant-design/icons/lib";

const ProductPage: React.FC<RouteComponentProps<ProductRouteType>> = (props) => {

    const dispatch = useDispatch();
    const loadProductThunk = (id: string): void => {
        dispatch(loadProduct(id));
    };
    const saveProductThunk = (): void => {
        dispatch(saveProduct());
    };
    const [generalForm] = Form.useForm();
    const [childForm] = Form.useForm();

    const productId = useSelector(GetProductId);
    const loading = useSelector(GetProductLoading);

    useEffect(() => {
        if (productId == null) {
            loadProductThunk(props.match.params.id);
        }
    }, [productId]);

    const SaveButton = <Button icon={<SaveOutlined />} type="primary" onClick={async ()=> {await saveProductThunk();childForm.resetFields();generalForm.resetFields()}}>Save</Button>

    return <>
        {loading ? <Preloader/> : <div className={s.wrapper}>
            <Tabs defaultActiveKey="ProductTab1" type="card" size={"middle"} tabBarExtraContent={SaveButton}>
                <Tabs.TabPane tab="General Info" key="ProductTab1">
                    <GeneralInfo generalForm={generalForm}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Custom Fields" key="ProductTab2">
                    <CustomFields/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Child Products" key="ProductTab3">
                    <ChildProducts childForm={childForm}/>
                </Tabs.TabPane>
            </Tabs>
            {SaveButton}
        </div>
        }

    </>
}

export default withRouter(ProductPage);