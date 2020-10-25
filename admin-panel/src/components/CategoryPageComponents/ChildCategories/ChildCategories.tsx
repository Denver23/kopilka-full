import React from 'react';
import {Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {
    GetCategoryBestSellers,
    GetCategoryHidden,
    GetCategoryId,
    GetCategoryName, GetCategoryProductsQuantity, GetCategoryRefines, GetCategorySlides,
    GetCategoryUrl,
    GetChildCategories
} from "../../../redux/selectors/categorySelector";
import {CategoryRefineType, ChildCategoryType, productImageTable, ProductInListType} from "../../../types/types";
import {Link} from "react-router-dom";
import generalInfoStyle from "../../ProductPageComponents/GeneralInfo/GeneralInfo.module.scss";
import {DeleteOutlined} from "@ant-design/icons/lib";
import {categoryReducerActions} from "../../../redux/categoryReducer";

const ChildCategories: React.FC = () => {

    const dispatch = useDispatch();

    const deleteChildCategory = (id: string) => {
        dispatch(categoryReducerActions.deleteChildCategory(id));
    };

    const childCategories = useSelector(GetChildCategories);
    const categoryId = useSelector(GetCategoryId);
    const categoryName = useSelector(GetCategoryName);
    const url = useSelector(GetCategoryUrl);
    const slides = useSelector(GetCategorySlides);
    const hidden = useSelector(GetCategoryHidden);
    const refines = useSelector(GetCategoryRefines);
    const bestSellers = useSelector(GetCategoryBestSellers);
    const productsQuantity = useSelector(GetCategoryProductsQuantity);

    const dataSource: Array<ChildCategoryType> = [{
        _id: categoryId as string,
        name: categoryName,
        url: url,
        hidden,
        childCategories: childCategories.map(category => category._id),
        slides: slides,
        refines,
        bestSellers,
        productsQuantity
    }, ...childCategories]

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (value: string, record: ChildCategoryType, index: number) => {
                if(record._id === categoryId) {
                    return `${value} (Main)`;
                }
                return <Link to={`/admin/category/id${record._id}`}>{value}</Link>;
            }
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url'
        },
        {
            title: 'Hidden Status',
            dataIndex: 'hidden',
            key: 'hidden',
            render: (value: boolean, record: ChildCategoryType, index: number) => {
                return value === true ? 'Hidden' : 'Visible';
            }
        },
        {
            title: 'Child Categories Quantity',
            dataIndex: 'childCategories',
            key: 'childCategories',
            render: (value: Array<string>, record: ChildCategoryType, index: number) => {
                return value.length;
            }
        },
        {
            title: 'Products Quantity',
            dataIndex: 'productsQuantity',
            key: 'productsQuantity',
            render: (value: Array<string>, record: ChildCategoryType, index: number) => {
                return record.productsQuantity;
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 50,
            render: (text: string, record: ChildCategoryType, index: number) => {
                if(record._id === categoryId) {
                    return '';
                }
                return <button className={generalInfoStyle.deleteImageButton} onClick={() => {
                    deleteChildCategory(record._id);
                }}><DeleteOutlined/></button>
            }
        }
    ];

    return <><Table dataSource={dataSource} columns={columns} /></>
};

export default ChildCategories;