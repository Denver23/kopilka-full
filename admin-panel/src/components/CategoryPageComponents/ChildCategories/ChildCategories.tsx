import React, {useState} from 'react';
import {AutoComplete, Button, Select, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {
    GetCategoryBestSellers,
    GetCategoryHidden,
    GetCategoryId,
    GetCategoryName, GetCategoryProductsQuantity, GetCategoryRefines, GetCategorySlides,
    GetCategoryUrl,
    GetChildCategories, GetChildCategoriesLoadingStatus
} from "../../../redux/selectors/categorySelector";
import {CategoryType} from "../../../types/types";
import {Link} from "react-router-dom";
import generalInfoStyle from "../../ProductPageComponents/GeneralInfo/GeneralInfo.module.scss";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {addNewChildCategory, categoryReducerActions} from "../../../redux/categoryReducer";
import {onCategoryChange} from "../../../utils/autoCompleteFunc/categories";

const ChildCategories: React.FC = () => {

    const dispatch = useDispatch();

    const deleteChildCategory = (id: string): void => {
        dispatch(categoryReducerActions.deleteChildCategory(id));
    };
    const addNewChildCategoryThunk = (name: string): void => {
        dispatch(addNewChildCategory(name));
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
    const childCategoriesLoadingStatus = useSelector(GetChildCategoriesLoadingStatus)

    let [autocompleteCategoriesList, newCategoriesList] = useState<Array<{value: string}>>([]);
    let [tempNewCategoryString, changeTempCategory] = useState<string>('');

    const dataSource: Array<CategoryType> = [{
        _id: categoryId as string,
        name: categoryName,
        url: url,
        hidden,
        childCategories: childCategories.map(category => category._id),
        slides: slides,
        refines,
        bestSellers,
        productsQuantity
    }, ...childCategories];

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (value: string, record: CategoryType, index: number) => {
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
            render: (value: boolean, record: CategoryType, index: number) => {
                return value === true ? 'Hidden' : 'Visible';
            }
        },
        {
            title: 'Child Categories Quantity',
            dataIndex: 'childCategories',
            key: 'childCategories',
            render: (value: Array<string>, record: CategoryType, index: number) => {
                return value.length;
            }
        },
        {
            title: 'Products Quantity',
            dataIndex: 'productsQuantity',
            key: 'productsQuantity',
            render: (value: Array<string>, record: CategoryType, index: number) => {
                return record.productsQuantity;
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 50,
            render: (text: string, record: CategoryType, index: number) => {
                if(record._id === categoryId) {
                    return '';
                }
                return <button className={generalInfoStyle.deleteImageButton} onClick={() => {
                    deleteChildCategory(record._id as string);
                }}><DeleteOutlined/></button>
            }
        }
    ];

    return <><Table
        dataSource={dataSource}
        columns={columns}
        loading={childCategoriesLoadingStatus}
        footer={() => {
            return <>
                <AutoComplete
                    options={autocompleteCategoriesList}
                    onSearch={(value: string) => {onCategoryChange(value, newCategoriesList);}}
                    onChange={(value: string) => {changeTempCategory(value)}}
                    onSelect={(value: string) => {changeTempCategory(value)}}
                    placeholder="Input Category Name"
                    defaultActiveFirstOption={true}
                    style={{minWidth: '200px'}}
                />
                <Button
                    type="dashed"
                    icon={<PlusOutlined/>}
                    onClick={() => {addNewChildCategoryThunk(tempNewCategoryString)}}
                    disabled={
                        tempNewCategoryString == '' ||
                        !autocompleteCategoriesList.map(category => category.value).includes(tempNewCategoryString) ||
                        dataSource.map(category => category.name).includes(tempNewCategoryString)
                    }>
                    Add New Child Category
                </Button>
            </>
        }}
    /></>
};

export default ChildCategories;
