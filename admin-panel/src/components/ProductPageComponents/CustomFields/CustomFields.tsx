import React, {useState} from 'react';
import {Button, Table, Tag, Tooltip, Select} from "antd";
import {ColumnsType} from "antd/es/table";
import {PlusOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {GetNewCategoryProductCustomFields, GetProductCustomFields} from "../../../redux/selectors/productSelector";
import {productCustomField, RefineType} from "../../../types/types";
import 'antd/dist/antd.css';
import generalInfoStyle from '../GeneralInfo/GeneralInfo.module.scss';
import s from './CustomFields.module.scss';
import {productReducerActions} from "../../../redux/productReducer";
import {DeleteOutlined} from "@ant-design/icons/lib";

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
    };
    const deleteProductRefine = (name: string): void => {
        dispatch(productReducerActions.deleteProductRefine(name));
    };
    const addNewPrRefine = (value: string): void => {
        dispatch(productReducerActions.addNewPrRefine(value));
    };

    const [editInputIndex, changeInputIndex] = useState<{ [key: string]: number }>({row: -1, item: -1});
    const [newTagInputVisible, changeInputVisible] = useState<number>(-1);
    const [newPrRefine, changeNewPrRefine] = useState<string>('');

    const customFields = useSelector(GetProductCustomFields);
    const newCategoryCustomFields = useSelector(GetNewCategoryProductCustomFields);

    const refinesCheck = (name: string): boolean => {
        let result = false;
        newCategoryCustomFields.forEach((item: RefineType) => {
            if (item.title === name) {
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

    const handleInputConfirm = (value: string, customFieldName: string) => {
        addNewCustomFieldTag(value, customFieldName);
        changeInputVisible(-1);
    }
    const handleNewSelectBlur = () => {
        changeInputVisible(-1);
    }

    const handleEditInputConfirm = (oldTag: string, newTag: string, customFieldName: string) => {
        changeCustomFieldTag(oldTag, newTag, customFieldName);
        changeInputIndex({row: -1, item: -1});
    };
    const hangleSelectBlur = () => {
        changeInputIndex({row: -1, item: -1});
    };

    const handleAddNewPrRefine = (value: string) => {
        let result = true;
        customFields.forEach(refine => {
            if(Object.keys(refine)[0] === value) result = false
        })
        if(newPrRefine !== '' && result) addNewPrRefine(value);
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
                            <Select size={"small"} defaultValue={item} style={{width: 120}}
                                    autoFocus={true}
                                    onBlur={() => {
                                        hangleSelectBlur()
                                    }}
                                    onChange={(value) => {
                                        handleEditInputConfirm(item, value, record.customFieldName)
                                    }}>
                                {newCategoryCustomFields.filter((categoryRefine: RefineType) => {
                                    return categoryRefine.title === record.customFieldName;
                                })[0].items.map(selectItem => {
                                    if (record.customFieldTags.includes(selectItem) && selectItem !== item) {
                                        return <Select.Option value={selectItem}
                                                              disabled={true}>{selectItem}</Select.Option>
                                    }
                                    return <Select.Option value={selectItem}>{selectItem}</Select.Option>
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
                            style={{userSelect: 'none'}}
                        >
                            <span onDoubleClick={e => {
                                changeInputIndex({row: index, item: itemIndex});
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
                        newTagInputVisible === index ? <Select size={"small"} style={{width: 120}}
                                                               autoFocus={true}
                                                               onBlur={() => {
                                                                   handleNewSelectBlur()
                                                               }}
                                                               onChange={(value) => {
                                                                   handleInputConfirm(`${value}`, record.customFieldName)
                                                               }}>
                            {newCategoryCustomFields.filter((categoryRefine: RefineType) => {
                                return categoryRefine.title === record.customFieldName;
                            })[0].items.map(selectItem => {
                                if (record.customFieldTags.includes(selectItem)) {
                                    return <Select.Option value={selectItem}
                                                          disabled={true}>{selectItem}</Select.Option>
                                }
                                return <Select.Option value={selectItem}>{selectItem}</Select.Option>
                            })}
                        </Select> : record.warningStyle ?
                            <Tag style={{borderStyle: 'dashed', background: '#fff'}} onClick={() => {
                                changeInputVisible(index)
                            }}>
                                <PlusOutlined/> New Tag
                            </Tag> : ''
                    }

                </div>
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 50,
            render: (item, record, index) => {
                return <button className={generalInfoStyle.deleteImageButton} onClick={() => {
                    deleteProductRefine(record.customFieldName)
                }}><DeleteOutlined/></button>
            }
        }
    ]

    return <div>
        <Table className={s.customFieldTable} pagination={false} columns={customFieldsColumns} dataSource={customFieldsTableData}
               rowClassName={(record: productCustomField, index: number): string => {
                   if (record.warningStyle === false) {
                       return s.warningRow
                   } else return '';
               }}
               footer={() => {
                   return <>
                       <Select size={"middle"} style={{width: 120}} onChange={value => {changeNewPrRefine(`${value}`)}}>
                           {newCategoryCustomFields.filter((categoryRefine: RefineType) => {
                               let result = true;
                               customFields.forEach(oldFilter => {
                                   if(Object.keys(oldFilter)[0] === categoryRefine.title) {
                                       result = false;
                                   }
                               })
                               return result;
                           }).map(categoryRefine => {
                               return <Select.Option value={categoryRefine.title}>{categoryRefine.title}</Select.Option>
                           })}
                       </Select>
                       <Button type="dashed" icon={<PlusOutlined/>} onClick={() => {handleAddNewPrRefine(newPrRefine)}}>
                           Add New Custom Field
                       </Button>
                   </>
               }}/>
    </div>
}

export default CustomFields;