import React, { useState } from 'react';
import {Button, Table, Tag, Tooltip, Input, Select} from "antd";
import {ColumnsType} from "antd/es/table";
import {PlusOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {GetNewCategoryProductCustomFields, GetProductCustomFields} from "../../../redux/selectors/productSelector";
import {productCustomField, RefineType} from "../../../types/types";
import 'antd/dist/antd.css';
import s from './CustomFields.module.scss';
import {productReducerActions} from "../../../redux/productReducer";

const CustomFields: React.FC = () => {

    const dispatch = useDispatch();
    const deleteCustomFieldTag = (removedTag: string, customFieldName: string): void => {
        dispatch(productReducerActions.deleteCustomFieldTag(removedTag, customFieldName))
    };
    const changeCustomFieldTag = (oldTag: string, newTag: string, customFieldName: string): void => {
        dispatch(productReducerActions.changeCustomFieldTag(oldTag, newTag, customFieldName));
    };
    const addNewCustomFieldTag = (newTag: string, customFieldName: string): void => {
        dispatch(productReducerActions.addNewCustomFieldTag(newTag, customFieldName))
    }

    const [editInputIndex, changeInputIndex] = useState<{[key: string]: number}>({row: -1, item: -1});
    const [editInputValue, changeEditInputValue] = useState<string>('');
    const [newTagInputVisible, changeInputVisible] = useState<number>(-1);

    const customFields = useSelector(GetProductCustomFields);
    const newCategoryCustomFields = useSelector(GetNewCategoryProductCustomFields);

    const refinesCheck = (name: string): boolean => {
        let result = false;
        newCategoryCustomFields.forEach((item: RefineType) => {
            if(item.title === name) {
                result = true;
            }
        });
        return result;
    }

    let customFieldsTableData = customFields.map(field => {
        const customFieldName = Object.keys(field)[0]
        return {
            customFieldName: customFieldName,
            customFieldTags: field[customFieldName],
            warningStyle: refinesCheck(customFieldName)
        }
    });

    const handleClose = (removedTag: string, customFieldName: string): void => {
        deleteCustomFieldTag(removedTag, customFieldName);
    };

    const handleInputChange = (e: any) => {
        changeEditInputValue(e.target.value);
    };

    const handleInputConfirm = (customFieldName: string) => {
        if(editInputValue.length > 0) {
            addNewCustomFieldTag(editInputValue, customFieldName);
        }
        changeInputVisible(-1);
        changeEditInputValue('');
    }

    const handleEditInputChange = (e: any) => {
        changeEditInputValue(e.target.value);
    };

    const handleEditInputConfirm = (oldTag: string, newTag: string, customFieldName: string) => {
        changeCustomFieldTag(oldTag, newTag, customFieldName);
        changeInputIndex({row: -1, item: -1});
        changeEditInputValue('');
    };

    const customFieldsColumns: ColumnsType<productCustomField> = [
        {
            title: 'Custom Field Name',
            dataIndex: 'customFieldName',
            key: 'customFieldName',
            width: 200
        },
        {
            title: 'Custom Field Tags',
            dataIndex: 'customFieldTags',
            key: 'customFieldTags',
            render: (keys: Array<string>, record, index) => {
                return <div key={`customField${index}`}>{keys.map((item, itemIndex) => {
                    if (editInputIndex.item === itemIndex && editInputIndex.row == index) {
                        return (
                            /*<Input
                                key={item}
                                size="small"
                                className={s.tagInput}
                                value={editInputValue}
                                onChange={handleEditInputChange}
                                onBlur={e => {handleEditInputConfirm(item, editInputValue, record.customFieldName)}}
                                onPressEnter={e => {handleEditInputConfirm(item, editInputValue, record.customFieldName)}}
                                autoFocus={true}
                            />*/
                            <Select size={"small"} defaultValue="lucy" style={{ width: 120 }}
                                    autoFocus={true}
                                    onChange={(value) => {handleEditInputConfirm(item, value, record.customFieldName)}}>
                                {newCategoryCustomFields.filter((categoryRefine: RefineType) => {
                                    return categoryRefine.title === record.customFieldName;
                                })[0].items.map(item => {
                                    if(record.customFieldTags.includes(item)) {
                                        return <Select.Option value={item} disabled={true}>{item}</Select.Option>
                                    }
                                    return <Select.Option value={item}>{item}</Select.Option>
                                })}
                            </Select>
                        );
                    }
                    const isLongTag = item.length > 20;
                    const tagElem = (record.warningStyle ?
                        <Tag
                            className="edit-tag"
                            key={item}
                            closable={true}
                            color={"geekblue"}
                            onClose={() => handleClose(item, record.customFieldName)}
                        >
                            <span onDoubleClick={e => {
                                changeInputIndex({row: index, item: itemIndex});
                                changeEditInputValue(item);
                                e.preventDefault();
                            }}>
                                {isLongTag ? `${item.slice(0, 20)}...` : item}
                            </span>
                        </Tag> : <Tag
                            className="edit-tag"
                            key={item}
                            color={"red"}
                        >
                            <span>
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
                        newTagInputVisible === index ? <Input
                            type="text"
                            size="small"
                            className={s.tagInput}
                            value={editInputValue}
                            onChange={handleInputChange}
                            onBlur={() => {handleInputConfirm(record.customFieldName)}}
                            onPressEnter={() => {handleInputConfirm(record.customFieldName)}}
                            autoFocus={true}
                        /> : record.warningStyle ? <Tag style={{borderStyle: 'dashed', background: '#fff'}} onClick={() => {changeInputVisible(index)}}>
                            <PlusOutlined/> New Tag
                        </Tag> : ''
                    }

                </div>
            }
        }
    ]

    return <div>
        <Table pagination={false} columns={customFieldsColumns} dataSource={customFieldsTableData}
               rowClassName={(record: productCustomField, index: number): string => {
                   if(record.warningStyle === false) {
                       return s.warningRow
                   } else return '';
               }}
               footer={() => {
                   return <Button type="dashed" icon={<PlusOutlined/>}>
                       Add New Custom Field
                   </Button>
               }}/>
    </div>
}

export default CustomFields;