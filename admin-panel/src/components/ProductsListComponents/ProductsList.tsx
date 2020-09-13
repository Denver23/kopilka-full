import React, {useRef, useState} from "react";
import {Button, Input, Space, Table} from "antd";
import s from './ProductsList.module.scss';
import {SearchOutlined} from "@ant-design/icons/lib";
import {FilterDropdownProps} from "antd/es/table/interface";
import Highlighter from 'react-highlight-words';

const ProductsList: React.FC = () => {

    let [searchText, setSearchText] = useState('');
    let [searchedColumn, setSearchColumn] = useState('');
    let InputRef = useRef(null);

    const getColumnSearchProps = (dataIndex: string) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: FilterDropdownProps) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={InputRef}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: string) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible: boolean) => {
            if (visible) {
                setTimeout(() => {let temp: any = InputRef.current;if(temp !== null){temp.select()}}, 100);
            }
        },
        render: (text: string) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys: React.Key[], confirm: () => void, dataIndex: string) => {
        confirm();
        setSearchText(selectedKeys[0].toString());
        setSearchColumn(dataIndex);
    };

    const handleReset = (clearFilters: (() => void) | undefined) => {
        if(clearFilters !== undefined) {
            clearFilters();
        }
        setSearchText('');
    };



    const rowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record: any) => ({
            disabled: record.name === 'Disabled User',
            name: record.name,
        }),
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
            ...getColumnSearchProps('product title'),
            render: (text: string) => <a>{text}</a>

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
                return 'Visible'
            }
        }
    ];
    const data = [
        {
            key: '1',
            productTitle: 'John Brown',
            brand: 32,
            category: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            productTitle: 'Jim Green',
            brand: 42,
            category: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            productTitle: 'Joe Black',
            brand: 32,
            category: 'Sidney No. 1 Lake Park',
        },
        {
            key: '4',
            productTitle: 'Disabled User',
            brand: 99,
            category: 'Sidney No. 1 Lake Park',
        },
    ];


    return <div className={s.wrapper}>
        Products List
        <Table
            rowSelection={{
                type: 'checkbox',
                ...rowSelection,
            }}
            columns={columns}
            dataSource={data}
        />
    </div>
};

export default ProductsList;