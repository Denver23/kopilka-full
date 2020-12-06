import React, {useEffect} from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import {ProductRouteType} from "../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {Button, Form, Popconfirm, Tabs} from "antd";
import {SaveOutlined} from "@ant-design/icons/lib";
import Preloader from "../common/Preloader/Preloader";
import s from "../ProductPageComponents/ProductPage.module.scss";
import {categoryReducerActions, loadCategory, saveCategory} from "../../redux/categoryReducer";
import {GetCategoryId, GetCategoryLoading} from "../../redux/selectors/categorySelector";
import GeneralCategoryInfo from "./GeneralCategoryInfo/GeneralCategoryInfo";
import CategoreRefines from "./CategoryRefines/CategoryRefines";
import ChildCategories from "./ChildCategories/ChildCategories";

const CategoryPageComponent: React.FC<RouteComponentProps<ProductRouteType>> = (props) => {
    const dispatch = useDispatch();
    const loadCategoryThunk = (id: string): void => {
        dispatch(loadCategory(id));
    };
    const saveCategoryThunk = (): void => {
        dispatch(saveCategory());
    };

    const [generalForm] = Form.useForm();
    const [childForm] = Form.useForm();

    const categoryId = useSelector(GetCategoryId);
    const loading = useSelector(GetCategoryLoading);

    useEffect(() => {
        if(props.match.path !== '/admin/new-category' && props.match.params.id) {
            loadCategoryThunk(props.match.params.id);
        } else if(props.match.path == '/admin/new-category' && categoryId !== null) {
            props.history.push(`/admin/product/id${categoryId}`);
        }
    }, [categoryId, props.match.params.id]);

    useEffect(() => {
        return () => {
            dispatch(categoryReducerActions.setCategory({
                _id: null,
                name: null,
                url: null,
                hidden: false,
                childCategories: [],
                slides: [],
                refines: [],
                bestSellers: [],
                productsQuantity: 0
            }))
        }
    }, []);

    const saveCategoryClick = async () => {
        //await saveCategoryThunk(); ADD VALIDATE FUNCTIONS ON THUNC BEFORE SAVE
        childForm.resetFields();
        generalForm.resetFields()
    };
    const addNewCategoryClick = async () => {
        //await addNewProductThunk();
    };

    const SaveButton = <Button icon={<SaveOutlined />} type="primary" onClick={props.match.path === '/admin/new-product' ? addNewCategoryClick : saveCategoryClick}>Save</Button>
    const DeleteButton = <Popconfirm
        placement="bottomRight"
        title={'Are you sure to delete this product?'}
        onConfirm={() => {/*deleteProductThunk()*/;console.log('DELETING AWAIT FUNCTION HERE!!!');props.history.push('/admin/categories')}}
        okText="Yes"
        cancelText="No"
    ><Button icon={<SaveOutlined />} type="primary" danger>Delete</Button></Popconfirm>

    return <>
        {loading ? <Preloader/> : <div className={s.wrapper}>
            <Tabs defaultActiveKey="ProductTab1" type="card" size={"middle"} tabBarExtraContent={<div>{props.match.path !== '/admin/new-product' ? DeleteButton : ''}{SaveButton}</div>}>
                <Tabs.TabPane tab="General Info" key="CategoryTab1">
                    <GeneralCategoryInfo newCategory={props.match.path === '/admin/new-product' ? true : false} generalForm={generalForm}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Refines" key="CategoryTab2">
                    <CategoreRefines/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Child Categories" key="CategoryTab3">
                    <ChildCategories/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Best Sellers" key="CategoryTab4">

                </Tabs.TabPane>
            </Tabs>
            {SaveButton}
            {props.match.path !== '/admin/new-product' ? DeleteButton : ''}
        </div>
        }

    </>
};

export default withRouter(CategoryPageComponent);
