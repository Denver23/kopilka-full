import React, {useState} from "react";
import {Button, Form, Input, InputNumber, Table, Tag, Tooltip} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {GetChildProducts} from "../../../redux/selectors/productSelector";
import {productReducerActions} from "../../../redux/productReducer";
import {ChildProductType} from "../../../types/types";
import {ColumnsType} from "antd/es/table";
import s from "./ChildProducts.module.scss";
import customFieldsStyle from "../CustomFields/CustomFields.module.scss"

const ChildProducts: React.FC = () => {

    const dispatch = useDispatch();
    const deleteVirtOption = (value: string): void => {
        dispatch(productReducerActions.deleteVirtOption(value));
    }
    const editVirtOption = (oldValue: string, newValue: string): void => {
        dispatch(productReducerActions.editVirtOption(oldValue, newValue));
    }
    const addVirtOption = (value: string): void => {
        dispatch(productReducerActions.addVirtOption(value));
    }
    const [childForm] = Form.useForm();

    const childProductsList = useSelector(GetChildProducts);

    const [editInputIndex, changeInputIndex] = useState<number>(-1);
    const [editInputValue, changeEditInputValue] = useState<string>('');
    const [newTagInputVisible, changeInputVisible] = useState<boolean>(false);
    const [oldTableValue, changeOldTableValue] = useState<string>('');
    const [tempTableValue, changeTempTableValue] = useState<string>('');

    let virtOptionsList = Object.keys(childProductsList[0].options);

    const handleEditInputChange = (e: any) => {
        changeEditInputValue(e.target.value);
    };

    const handleEditInputConfirm = (oldOption: string, newOption: string) => {
        if (editInputValue.length > 0) {
            editVirtOption(oldOption, newOption)//confirm new option func();
        }

        changeInputIndex(-1);
        changeEditInputValue('');
    };

    const handleClose = (removedOption: string): void => {
        deleteVirtOption(removedOption);//delete clicked options;
    };

    const handleInputChange = (e: any) => {
        changeEditInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (editInputValue.length > 0) {
            addVirtOption(editInputValue);
        }
        changeInputVisible(false);
        changeEditInputValue('');
    }

    const onHandleChange = (newValue: string | number, position: string, index: number) => {
        //console.log(newValue);
        //console.log(position);
        //console.log(index);
    }

    const childProductsColumn: ColumnsType<ChildProductType> = [
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
            width: 200,
            render: (key, record, index) => {
                return <Form.Item className={s.childTableRow} name={`sku-${index}`}><Input maxLength={100} placeholder="Basic usage" /></Form.Item>;
            }
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 100,
            render: (keys, record, index) => {
                return <Form.Item
                    className={s.childTableRow}
                    name={`price-${index}`}><InputNumber min={0} max={999999} maxLength={7}/></Form.Item>
            }
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            width: 150,
            render: (keys, record, index) => {
                return <Form.Item className={s.childTableRow} name={`quantity-${index}`}><InputNumber min={0} max={999999} maxLength={6} onChange={() => {}}/></Form.Item>
            }
        }
    ];

    Object.keys(childProductsList[0].options).forEach(item => {
        let newColumn = {
            title: item,
            dataIndex: 'options',
            key: item,
            render: (keys: {[key: string]: string}, record: ChildProductType, index: number) => {
                return <Form.Item className={s.childTableRow} name={`${item}-${index}-option`}><Input placeholder="Basic usage" /></Form.Item>
            }
        }
        childProductsColumn.push(newColumn)
    });

    let checkRowValidator = (childProductsList: Array<ChildProductType>) => {

        let rows = childProductsList.map(item => {
            return Object.keys(item.options).map(elem => { return item.options[elem]}).join('');
        })

        let checkObject: {[key: string]: number} = {};
        let resultArray: Array<number> = [];

        rows.forEach(item => {
            if(checkObject.hasOwnProperty(item)) {
                checkObject[item] = checkObject[item]++;
            } else {
                checkObject[item] = 1;
            }
        })

        Object.keys(checkObject).forEach(objectKey => {
            if(checkObject[objectKey] > 1) {
                rows.forEach((item, index) => {
                    if(item === objectKey) {
                        resultArray.push(index)
                    }
                })
            }
        })

        return resultArray;
    }

    let rowsChecked = checkRowValidator(childProductsList);

    let childTableValues: {[key: string]: string} = {};

    childProductsList.forEach((child, childIndex) => {
        childTableValues[`sku-${childIndex}`] = child.sku;
        childTableValues[`price-${childIndex}`] = `${child.price}`;
        childTableValues[`quantity-${childIndex}`] = `${child.quantity}`;
        Object.keys(child.options).forEach(optionName => {
            childTableValues[`${optionName}-${childIndex}-option`] = child.options[optionName];
        })
    })

    return <>
        <div className={s.virtOptionList}>
            Virtual Options List:
            <div className={s.optionList}>{virtOptionsList.map((item, itemIndex) => {
                if (editInputIndex === itemIndex) {
                    return (
                        <Input
                            key={item}
                            size="small"
                            className={customFieldsStyle.tagInput}
                            value={editInputValue}
                            onChange={handleEditInputChange}
                            onBlur={e => {
                                handleEditInputConfirm(item, editInputValue)
                            }}
                            onPressEnter={e => {
                                handleEditInputConfirm(item, editInputValue)
                            }}
                            autoFocus={true}
                        />
                    );
                }
                const isLongTag = item.length > 20;
                const tagElem = (
                    <Tag
                        className="edit-tag"
                        key={item}
                        closable={true}
                        color={"geekblue"}
                        onClose={() => handleClose(item)}
                        style={{userSelect: 'none'}}
                    >
                            <span onDoubleClick={e => {
                                changeInputIndex(itemIndex);
                                changeEditInputValue(item);
                                e.preventDefault();
                            }}>
                                {isLongTag ? `${item.slice(0, 20)}...` : item}
                            </span>
                    </Tag>);
                return isLongTag ? (
                    <Tooltip title={item} key={item}>
                        {tagElem}
                    </Tooltip>
                ) : (
                    tagElem
                )
            })}
                {
                    newTagInputVisible ? <Input
                        type="text"
                        size="small"
                        key={'newOptionButton'}
                        className={customFieldsStyle.tagInput}
                        value={editInputValue}
                        onChange={handleInputChange}
                        onBlur={() => {
                            handleInputConfirm()
                        }}
                        onPressEnter={() => {
                            handleInputConfirm()
                        }}
                        autoFocus={true}
                    /> : <Tag style={{borderStyle: 'dashed', background: '#fff'}} onClick={() => {
                        changeInputVisible(true)
                    }}>
                        <PlusOutlined/> New Tag
                    </Tag>
                }
            </div>
        </div>
        <Form onValuesChange={(e)=> {console.log(e)}} form={childForm} initialValues={childTableValues}>
            <Table pagination={false} columns={childProductsColumn} rowClassName={(record: ChildProductType, index: number)=> {
                if(rowsChecked.includes(index)) {
                    return `${customFieldsStyle.warningRow} ${s.childTableRow}`;
                } else {
                    return `${s.childTableRow}`;
                }
            }} dataSource={childProductsList}
                   footer={() => {
                       return <Button type="dashed" icon={<PlusOutlined/>}>
                           Add New Child Product
                       </Button>
                   }}/>
        </Form>
    </>
}

export default ChildProducts