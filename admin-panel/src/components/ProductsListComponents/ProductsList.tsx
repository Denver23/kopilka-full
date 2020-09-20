import React, {useEffect, useRef, useState} from "react";
import {Button, Input, Space, Table} from "antd";
import s from './ProductsList.module.scss';
import {SearchOutlined} from "@ant-design/icons/lib";
import {FilterDropdownProps} from "antd/es/table/interface";
import Highlighter from 'react-highlight-words';
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {ProductListItemType, ProductsListRouteType} from "../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {getProductsList} from "../../redux/productsListReducer";
import Preloader from "../common/Preloader/Preloader";
import {GetProductsList, GetProductsListLoading, GetProductsQuantity} from "../../redux/selectors/productsListSelector";

const ProductsList: React.FC<RouteComponentProps<ProductsListRouteType>> = (props) => {

    let loading = useSelector(GetProductsListLoading);
    let productsList = useSelector(GetProductsList);
    let productsQuantity = useSelector(GetProductsQuantity);
    const productsOnPage = 5;
    let page = new URLSearchParams(props.location.search).get("page");
    let brand = new URLSearchParams(props.location.search).get("brand");
    let productTitle = new URLSearchParams(props.location.search).get("productTitle");
    let category = new URLSearchParams(props.location.search).get("category");

    const dispatch = useDispatch();
    const getProductsListThunk = (page: number, productsOnPage: number) => {
        dispatch(getProductsList(page, productsOnPage));
    };

    useEffect(() => {
        getProductsListThunk(page !== null ? +page : 1, productsOnPage);
    }, []);

    let [selectedRows, setSelectedRows] = useState<Array<string>>([]);
    let [searchText, setSearchText] = useState('');
    let [searchedColumn, setSearchColumn] = useState('');
    let InputRef = useRef(null);

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}: FilterDropdownProps) => (
            <div style={{padding: 8}}>
                <Input
                    ref={InputRef}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{width: 188, marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{width: 90}}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: string) => <SearchOutlined style={{color: filtered ? '#1890ff' : undefined}}/>,
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => {
                    let temp: any = InputRef.current;
                    if (temp !== null) {
                        temp.select()
                    }
                }, 100);
            }
        },
        render: (text: string) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys: React.Key[], confirm: () => void, dataIndex: string) => {
        if(selectedKeys.length > 0) {
            props.history.push({pathname: '/admin/products', search: `?page=1&${dataIndex}=${selectedKeys[0]}${brand !== null && dataIndex !== 'brand' ? `&brand=${brand}` : ''}${productTitle !== null && dataIndex !== 'productTitle' ? `&productTitle=${productTitle}` : ''}${category !== null && dataIndex !== 'category' ? `&category=${category}` : ''}`});
            confirm();
            setSearchText(selectedKeys[0].toString());
            setSearchColumn(dataIndex);
        } else {
            props.history.push({pathname: '/admin/products', search: `?page=1${brand !== null && dataIndex !== 'brand' ? `&brand=${brand}` : ''}${productTitle !== null && dataIndex !== 'productTitle' ? `&productTitle=${productTitle}` : ''}${category !== null && dataIndex !== 'category' ? `&category=${category}` : ''}`});
            confirm();
            setSearchText('');
            setSearchColumn(dataIndex);
        }
    };

    const handleReset = (clearFilters: (() => void) | undefined) => {
        if (clearFilters !== undefined) {
            clearFilters();
        }
        setSearchText('');
    };


    const rowSelection = {
        onChange: (selectedRowKeys: any, tableSelectedRows: any) => {
            setSelectedRows(selectedRowKeys);
        }
    };

    const columns = [
        {
            title: 'Brand',
            dataIndex: 'brand',
            ...getColumnSearchProps('brand')
        },
        {
            title: 'Product Title',
            dataIndex: 'productTitle',
            ...getColumnSearchProps('productTitle'),
            render: (text: string, record: ProductListItemType, index: number) => <Link to={`/admin/product/id${record._id}`}>{text}</Link>

        },
        {
            title: 'Category',
            dataIndex: 'category',
            ...getColumnSearchProps('category')
        },
        {
            title: 'Hidden',
            dataIndex: 'hidden',
            render: (key: boolean, record: any, index: number) => {
                return key === false ? 'Visible' : 'Hidden';
            }
        }
    ];

    const onPageChange = (newPage: number, pageSize: number | undefined) => {
        let currentPage = page ? +page : 1;
        if(currentPage !== newPage) {
            props.history.push({search: `?page=${newPage}${brand !== null ? `&brand=${brand}` : ''}${productTitle !== null ? `&productTitle=${productTitle}` : ''}${category !== null ? `&category=${category}` : ''}`});
            getProductsListThunk(newPage, productsOnPage);
        }
    };

    return <>
        {loading ? <Preloader/> : <div className={s.wrapper}>
            <Table
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection
                }}
                columns={columns}
                dataSource={productsList}
                pagination={{position: ['bottomCenter'], current: page !== null ? +page : 1, defaultPageSize: productsOnPage, hideOnSinglePage: true, total: productsQuantity, onChange: onPageChange}}
            />
        </div>}
    </>
};

export default withRouter(ProductsList);