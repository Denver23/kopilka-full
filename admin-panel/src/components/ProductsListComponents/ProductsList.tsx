import React, {useEffect, useRef, useState} from "react";
import {AutoComplete, Button, Col, Form, Input, Row, Select, Space, Table} from "antd";
import s from './ProductsList.module.scss';
import {FileAddOutlined, SearchOutlined} from "@ant-design/icons/lib";
import {FilterDropdownProps} from "antd/es/table/interface";
import Highlighter from 'react-highlight-words';
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {
    categoryRequestObjectType,
    changeProductsParamsTypes,
    ProductListItemType,
    ProductsListRouteType
} from "../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {changeProductsProps, getProductsList} from "../../redux/productsListReducer";
import {GetProductsList, GetProductsListLoading, GetProductsQuantity} from "../../redux/selectors/productsListSelector";
import {onBrandChange} from "../../utils/autoCompleteFunc/brands";
import {productReducerActions} from "../../redux/productReducer";
import {onCategoryChange} from "../../utils/autoCompleteFunc/categories";
import {FormInstance} from "antd/lib/form";

const useSelect = (name: string, onChange: (value: string, setStateFunc: (array: Array<{ value: string }>) => void) => void, actionsForm: FormInstance) => {

    let [autocompleteList, setList] = useState<Array<{ value: string }>>([]);
    let [tempString, setTempString] = useState<string>('');
    let [actionName, setActionName] = useState<string>('');

    const onBlur = () => {
        let itemsForCheck = autocompleteList.map(item => {
            return item.value
        });
        if (tempString !== '' && autocompleteList.length !== 0 && itemsForCheck.includes(tempString)) {
            setActionName(tempString);
        } else {
            let action: { [key: string]: string } = {};
            action[name] = '';
            actionsForm.setFieldsValue(action);
        }
    };

    const onSelect = (value: string) => {
        setActionName(value);
    };

    return {
        inputData: {
            options: autocompleteList,
            onSearch: (value: string) => {
                onChange(value, setList)
            },
            onBlur: onBlur,
            onSelect: (value: string) => {
                onSelect(value)
            }
        },
        setTempString,
        actionName
    };
};

const ProductsList: React.FC<RouteComponentProps<ProductsListRouteType>> = (props) => {

    let loading = useSelector(GetProductsListLoading);
    let productsList = useSelector(GetProductsList);
    let productsQuantity = useSelector(GetProductsQuantity);
    const productsOnPage = 20;
    let page = new URLSearchParams(props.location.search).get("page");
    let brand = useRef(new URLSearchParams(props.location.search).get("brand"));
    let productTitle = useRef(new URLSearchParams(props.location.search).get("productTitle"));
    let category = useRef(new URLSearchParams(props.location.search).get("category"));

    const dispatch = useDispatch();
    const getProductsListThunk = (page: number, productsOnPage: number, requestObject: categoryRequestObjectType): void => {
        dispatch(getProductsList(page, productsOnPage, requestObject));
    };
    const changeProductsPropsThunk = (items: Array<string>, params: changeProductsParamsTypes): void => {
        dispatch(changeProductsProps(items, params));
    };

    const loadProductsFunc = () => {
        let requestObject: categoryRequestObjectType = {};
        let brandRequets = new URLSearchParams(props.location.search).get("brand");
        let productTitleRequets = new URLSearchParams(props.location.search).get("productTitle");
        let categoryRequets = new URLSearchParams(props.location.search).get("category");
        if (brandRequets !== null) {
            requestObject.brand = brandRequets;
        }
        if (productTitleRequets !== null) {
            requestObject.productTitle = productTitleRequets;
        }
        if (categoryRequets !== null) {
            requestObject.category = categoryRequets;
        }
        setSelectedRows([]);
        getProductsListThunk(page !== null ? +page : 1, productsOnPage, requestObject);
    };

    useEffect(() => {
        let requestObject: categoryRequestObjectType = {};
        let brandRequets = new URLSearchParams(props.location.search).get("brand");
        let productTitleRequets = new URLSearchParams(props.location.search).get("productTitle");
        let categoryRequets = new URLSearchParams(props.location.search).get("category");
        if (brandRequets !== null) {
            requestObject.brand = brandRequets;
        }
        if (productTitleRequets !== null) {
            requestObject.productTitle = productTitleRequets;
        }
        if (categoryRequets !== null) {
            requestObject.category = categoryRequets;
        }
        setSelectedRows([]);
        getProductsListThunk(page !== null ? +page : 1, productsOnPage, requestObject);
    }, [props.location.search]);

    const [actionsForm] = Form.useForm();

    let [selectedRows, setSelectedRows] = useState<Array<string>>([]);
    let [searchText, setSearchText] = useState('');
    let [searchedColumn, setSearchColumn] = useState('');
    let [action, setAction] = useState<string | undefined>(undefined);
    let InputRef = useRef(null);
    let brandSelect = useSelect('brand', onBrandChange, actionsForm);
    let categorySelect = useSelect('category', onCategoryChange, actionsForm);
    let [hidden, setHidden] = useState<boolean>(false);
    const newProductButton = <Link to={'/admin/new-product'}><Button type="primary" icon={<FileAddOutlined />}>New Product</Button></Link>;

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
                    <Button onClick={() => handleReset(clearFilters, dataIndex)} size="small" style={{width: 90}}>
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
        if (selectedKeys.length > 0) {
            switch (dataIndex) {
                case 'brand':
                    brand.current = `${selectedKeys[0]}`;
                    break;
                case 'productTitle':
                    productTitle.current = `${selectedKeys[0]}`;
                    break;
                case 'category':
                    category.current = `${selectedKeys[0]}`;
                    break;
            }
            props.history.push({
                pathname: '/admin/products',
                search: `?page=1&${dataIndex}=${selectedKeys[0]}${brand.current !== null && dataIndex !== 'brand' ? `&brand=${brand.current}` : ''}${productTitle.current !== null && dataIndex !== 'productTitle' ? `&productTitle=${productTitle.current}` : ''}${category.current !== null && dataIndex !== 'category' ? `&category=${category.current}` : ''}`
            });
            confirm();
            setSearchText(selectedKeys[0].toString());
            setSearchColumn(dataIndex);
        } else {
            props.history.push({
                pathname: '/admin/products',
                search: `?page=1${brand.current !== null && dataIndex !== 'brand' ? `&brand=${brand.current}` : ''}${productTitle.current !== null && dataIndex !== 'productTitle' ? `&productTitle=${productTitle.current}` : ''}${category.current !== null && dataIndex !== 'category' ? `&category=${category.current}` : ''}`
            });
            confirm();
            setSearchText('');
            setSearchColumn(dataIndex);
        }
    };

    const handleReset = (clearFilters: (() => void) | undefined, dataIndex: string) => {
        switch (dataIndex) {
            case 'brand':
                brand.current = null;
                break;
            case 'productTitle':
                productTitle.current = null;
                break;
            case 'category':
                category.current = null;
                break;
        }
        if (clearFilters !== undefined) {
            clearFilters();
        }
        setSearchText('');
        props.history.push({search: `?page=1${brand.current !== null ? `&brand=${brand.current}` : ''}${productTitle.current !== null ? `&productTitle=${productTitle.current}` : ''}${category.current !== null ? `&category=${category.current}` : ''}`});
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
            render: (text: string, record: ProductListItemType, index: number) => <Link
                to={`/admin/product/id${record._id}`}>{text}</Link>

        },
        {
            title: 'Category',
            dataIndex: 'category',
            ...getColumnSearchProps('category')
        },
        {
            title: 'Hidden Status',
            dataIndex: 'hidden',
            render: (key: boolean, record: any, index: number) => {
                return key === false ? 'Visible' : 'Hidden';
            }
        }
    ];

    const onPageChange = (newPage: number, pageSize: number | undefined) => {
        let currentPage = page !== null ? +page : 1;
        if (currentPage !== newPage) {
            props.history.push({search: `?page=${newPage}${brand.current !== null ? `&brand=${brand.current}` : ''}${productTitle.current !== null ? `&productTitle=${productTitle.current}` : ''}${category.current !== null ? `&category=${category.current}` : ''}`});
        }
    };

    const onActionSelect = (value: string) => {
        setAction(value);
    };

    const dataChange = (data: { [key: string]: string }): void => {
        let newData = {...data};
        if (newData.brand !== undefined) {
            brandSelect.setTempString(newData.brand);
        } else if (newData.category !== undefined) {
            categorySelect.setTempString(newData.category);
        } else if (newData.productTitle !== undefined) {
            dispatch(productReducerActions.dataChange({...newData}));
        }
    };

    const onFinish = async () => {
        if (action === 'changeBrand' && brandSelect.actionName !== '') {
            changeProductsPropsThunk(selectedRows, {brand: brandSelect.actionName})
        } else if (action === 'changeCategory' && categorySelect.actionName !== '') {
            changeProductsPropsThunk(selectedRows, {category: categorySelect.actionName})
        } else if(action === 'changeVisibility') {
            changeProductsPropsThunk(selectedRows, {hidden: hidden})
        } else if(action === 'deleteProducts') {
            await changeProductsPropsThunk(selectedRows, {delete: true});
            loadProductsFunc();
        }
    };

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const onChangeVisibility = (value: string) => {
        if(value === 'visible') {
            setHidden(false);
        } else {
            setHidden(true);
        }

    };

    return <>
        <div className={s.wrapper}>
            {
                selectedRows.length > 0 ? <div className={s.actionList}>
                    <Select defaultValue={action} style={{width: '15%', height: '32px', marginBottom: '8px'}} placeholder={'Actions'}
                            onSelect={onActionSelect}>
                        <Select.Option value="changeBrand">Change Brand</Select.Option>
                        <Select.Option value="changeCategory">Change Category</Select.Option>
                        <Select.Option value="changeVisibility">Change Visible</Select.Option>
                        <Select.Option value='deleteProducts'>Delete Products</Select.Option>
                    </Select>
                    <Form
                        layout={"horizontal"}
                        {...layout}
                        form={actionsForm}
                        name="actions"
                        onValuesChange={e => {
                            dataChange(e)
                        }}
                        className={s.actionsForm}
                        onFinish={onFinish}
                    >
                        <Row gutter={[16, 16]}>
                            {
                                action === 'changeBrand' ?
                                    <Col span={16}>
                                        <Form.Item
                                            label="Brand"
                                            name="brand"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Please input brand name!',
                                                },
                                            ]}
                                        >
                                            <AutoComplete
                                                {...brandSelect.inputData}
                                                autoFocus={true}
                                                placeholder="Input Brand Name"
                                                defaultActiveFirstOption={true}
                                            />
                                        </Form.Item></Col> : action === 'changeCategory' ? <Col span={16}><Form.Item
                                        label="Category"
                                        name="category"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input category name!',
                                            },
                                        ]}
                                    >
                                        <AutoComplete
                                            {...categorySelect.inputData}
                                            placeholder="Input Category Name"
                                            defaultActiveFirstOption={true}
                                            autoFocus={true}
                                        />
                                    </Form.Item></Col> : action === 'changeVisibility' ?
                                    <Col span={16}><Form.Item
                                        label="Hidden Status"
                                        name="hiddenStatus"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please choise status!',
                                            },
                                        ]}
                                    >
                                        <Select defaultValue={'visible'} style={{height: '32px'}}
                                                placeholder={'Hidden Status'}
                                                onSelect={onChangeVisibility}
                                                >
                                            <Select.Option value="visible">Visible</Select.Option>
                                            <Select.Option value="hidden">Hidden</Select.Option>
                                        </Select>
                                    </Form.Item></Col> : ''
                            }
                            {
                                action !== undefined ? <Col span={8}><Form.Item>
                                    <Button type="primary" loading={loading} className={s.submitButton}
                                            htmlType={"submit"}>Submit</Button>
                                </Form.Item></Col> : ''
                            }
                        </Row>
                    </Form>
                    <span className={s.selectedRowsSpan}>Selected Products: {selectedRows.length}</span>
                    {newProductButton}
                </div> : <div className={s.actionList}>{newProductButton}</div>
            }
            <Table
                loading={loading}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection
                }}
                columns={columns}
                dataSource={productsList}
                pagination={{
                    position: ['bottomCenter'],
                    current: page !== null ? +page : 1,
                    defaultPageSize: productsOnPage,
                    hideOnSinglePage: true,
                    total: productsQuantity,
                    onChange: onPageChange
                }}
                style={{marginTop: selectedRows.length > 0 ? 10 : 18}}
            />
        </div>
    </>
};

export default withRouter(ProductsList);