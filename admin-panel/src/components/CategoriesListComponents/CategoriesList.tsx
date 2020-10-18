import React, {useEffect, useRef, useState} from "react";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {FormInstance} from "antd/lib/form";
import {
    categoriesListRequestObjectType,
    changeProductsParamsTypes,
    ProductListItemType,
    ProductsListRouteType
} from "../../types/types";
import {useDispatch, useSelector} from "react-redux";
import {AutoComplete, Button, Col, Form, Input, Row, Select, Space, Table} from "antd";
import {onBrandChange} from "../../utils/autoCompleteFunc/brands";
import {onCategoryChange} from "../../utils/autoCompleteFunc/categories";
import {FileAddOutlined, SearchOutlined} from "@ant-design/icons/lib";
import {FilterDropdownProps} from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import {productReducerActions} from "../../redux/productReducer";
import s from "../ProductsListComponents/ProductsList.module.scss";
import {
    GetCategoriesList,
    GetCategoriesListLoading,
    GetCategoriesQuantity
} from "../../redux/selectors/categoriesListSelector";
import {changeCategoriesProps, getCategoriesList} from "../../redux/categoriesListReducer";

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

const CategoriesList: React.FC<RouteComponentProps<ProductsListRouteType>> = (props) => {

    let loading = useSelector(GetCategoriesListLoading);
    let categoriesList = useSelector(GetCategoriesList);
    let categoriesQuantity = useSelector(GetCategoriesQuantity);
    const categoriesOnPage = 20;
    let page = new URLSearchParams(props.location.search).get("page");
    let name = useRef(new URLSearchParams(props.location.search).get("category"));
    let url = useRef(new URLSearchParams(props.location.search).get("url"));

    const dispatch = useDispatch();
    const getCategoriesListThunk = (page: number, productsOnPage: number, requestObject: categoriesListRequestObjectType): void => {
        dispatch(getCategoriesList(page, productsOnPage, requestObject));
    };
    const changeCategoriesPropsThunk = (items: Array<string>, params: changeProductsParamsTypes): void => {
        dispatch(changeCategoriesProps(items, params));
    };

    const loadCategoriesFunc = () => {
        let requestObject: categoriesListRequestObjectType = {};
        let nameRequest = new URLSearchParams(props.location.search).get("name");
        let urlRequest = new URLSearchParams(props.location.search).get("url");

        if (nameRequest !== null) {
            requestObject.name = nameRequest;
        };
        if (urlRequest !== null) {
            requestObject.url = urlRequest;
        };
        setSelectedRows([]);
        getCategoriesListThunk(page !== null ? +page : 1, categoriesOnPage, requestObject);
    };

    useEffect(() => {
        let requestObject: categoriesListRequestObjectType = {};
        let nameRequest = new URLSearchParams(props.location.search).get("name");
        let urlRequest = new URLSearchParams(props.location.search).get("url");
        console.log(urlRequest);

        if (nameRequest !== null) {
            requestObject.name = nameRequest;
        };
        if (urlRequest !== null) {
            requestObject.url = urlRequest;
        };
        console.log(requestObject);
        setSelectedRows([]);
        getCategoriesListThunk(page !== null ? +page : 1, categoriesOnPage, requestObject);
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
    const newCategoryButton = <Link to={'/admin/new-category'}><Button type="primary" icon={<FileAddOutlined />}>New Category</Button></Link>;

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
        filterIcon: (filtered: string) => <SearchOutlined style={{color: filtered || new URLSearchParams(props.location.search).get(dataIndex) !== null ? '#1890ff' : undefined}}/>,
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
                case 'name':
                    name.current = `${selectedKeys[0]}`;
                    break;
                case 'url':
                    url.current = `${selectedKeys[0]}`;
                    break;
            }
            props.history.push({
                pathname: '/admin/categories',
                search: `?page=1&${dataIndex}=${selectedKeys[0]}${url.current !== null && dataIndex !== 'url' ? `&url=${url.current}` : ''}${name.current !== null && dataIndex !== 'name' ? `&name=${name.current}` : ''}`
            });
            confirm();
            setSearchText(selectedKeys[0].toString());
            setSearchColumn(dataIndex);
        } else {
            props.history.push({
                pathname: '/admin/categories',
                search: `?page=1${name.current !== null && dataIndex !== 'name' ? `&name=${name.current}` : ''}${url.current !== null && dataIndex !== 'url' ? `&url=${url.current}` : ''}`
            });
            confirm();
            setSearchText('');
            setSearchColumn(dataIndex);
        }
    };

    const handleReset = (clearFilters: (() => void) | undefined, dataIndex: string) => {
        switch (dataIndex) {
            case 'name':
                name.current = null;
                break;
            case 'url':
                url.current = null;
                break;
        }
        if (clearFilters !== undefined) {
            clearFilters();
        }
        setSearchText('');
        props.history.push({search: `?page=1${name.current !== null ? `&name=${name.current}` : ''}${url.current !== null ? `&url=${url.current}` : ''}`});
    };


    const rowSelection = {
        onChange: (selectedRowKeys: any, tableSelectedRows: any) => {
            setSelectedRows(selectedRowKeys);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
            render: (text: string, record: ProductListItemType, index: number) => <Link
                to={`/admin/category/id${record._id}`}>{text}</Link>
        },
        {
            title: 'URL',
            dataIndex: 'url',
            ...getColumnSearchProps('url'),
            render: (text: string, record: ProductListItemType, index: number) => <Link
                to={`/admin/product/id${record._id}`}>{text}</Link>

        },
        {
            title: 'Childs Quantity',
            dataIndex: 'childsQuantity'
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
            props.history.push({search: `?page=${newPage}${name.current !== null ? `&name=${name.current}` : ''}`});
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
            changeCategoriesPropsThunk(selectedRows, {brand: brandSelect.actionName})
        } else if (action === 'changeCategory' && categorySelect.actionName !== '') {
            changeCategoriesPropsThunk(selectedRows, {category: categorySelect.actionName})
        } else if(action === 'changeVisibility') {
            changeCategoriesPropsThunk(selectedRows, {hidden: hidden})
        } else if(action === 'deleteProducts') {
            await changeCategoriesPropsThunk(selectedRows, {delete: true});
            loadCategoriesFunc();
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
                    <span className={s.selectedRowsSpan}>Selected Categories: {selectedRows.length}</span>
                    {newCategoryButton}
                </div> : <div className={s.actionList}>{newCategoryButton}</div>
            }
            <Table
                loading={loading}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection
                }}
                columns={columns}
                dataSource={categoriesList}
                pagination={{
                    position: ['bottomCenter'],
                    current: page !== null ? +page : 1,
                    defaultPageSize: categoriesOnPage,
                    hideOnSinglePage: true,
                    total: categoriesQuantity,
                    onChange: onPageChange
                }}
                style={{marginTop: selectedRows.length > 0 ? 10 : 18}}
            />
        </div>
    </>
};

export default withRouter(CategoriesList);