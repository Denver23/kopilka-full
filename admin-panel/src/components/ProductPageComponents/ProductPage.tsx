import React, {useEffect} from 'react';
import {Button, Form, Popconfirm, Tabs} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {GetProductId, GetProductLoading} from "../../redux/selectors/productSelector";
import {
    addNewProduct,
    deleteProduct,
    loadProduct,
    productReducerActions,
    saveProduct
} from "../../redux/productReducer";
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
    const addNewProductThunk = (): void => {
        dispatch(addNewProduct());
    };
    const deleteProductThunk = (): void => {
        dispatch(deleteProduct());
    };

    const [generalForm] = Form.useForm();
    const [childForm] = Form.useForm();

    const productId = useSelector(GetProductId);
    const loading = useSelector(GetProductLoading);

    useEffect(() => {
        if(props.match.path !== '/admin/new-product' && props.match.params.id) {
            loadProductThunk(props.match.params.id);
        } else if(props.match.path == '/admin/new-product' && productId !== null) {
            props.history.push(`/admin/product/id${productId}`);
        }
    }, [productId, props.match.params.id]);

    useEffect(() => {
        return () => {
            dispatch(productReducerActions.setProduct({
                id: null,
                brand: null,
                category: null,
                productTitle: null,
                hidden: false,
                childProducts: [],
                images: [],
                customFields: [],
                shortDescription: null,
                specifications: null,
                features: null,
                recommendedProducts: [],
                productCategoryCustomFields: []
            }))
        }
    }, []);

    const saveProductClick = async () => {
        await saveProductThunk();
        childForm.resetFields();
        generalForm.resetFields()
    };
    const addNewProductClick = async () => {
        await addNewProductThunk();
    };

    const SaveButton = <Button icon={<SaveOutlined />} type="primary" onClick={props.match.path === '/admin/new-product' ? addNewProductClick : saveProductClick}>Save</Button>
    const DeleteButton = <Popconfirm
        placement="bottomRight"
        title={'Are you sure to delete this product?'}
        onConfirm={() => {deleteProductThunk();props.history.push('/admin/products')}}
        okText="Yes"
        cancelText="No"
    ><Button icon={<SaveOutlined />} type="primary" danger>Delete</Button></Popconfirm>

    return <>
        {loading ? <Preloader/> : <div className={s.wrapper}>
            <Tabs defaultActiveKey="ProductTab1" type="card" size={"middle"} tabBarExtraContent={<div>{props.match.path !== '/admin/new-product' ? DeleteButton : ''}{SaveButton}</div>}>
                <Tabs.TabPane tab="General Info" key="ProductTab1">
                    <GeneralInfo newProduct={props.match.path === '/admin/new-product' ? true : false} generalForm={generalForm}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Custom Fields" key="ProductTab2">
                    <CustomFields/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Child Products" key="ProductTab3">
                    <ChildProducts childForm={childForm}/>
                </Tabs.TabPane>
            </Tabs>
            {SaveButton}
            {props.match.path !== '/admin/new-product' ? DeleteButton : ''}
        </div>
        }

    </>
}

export default withRouter(ProductPage);