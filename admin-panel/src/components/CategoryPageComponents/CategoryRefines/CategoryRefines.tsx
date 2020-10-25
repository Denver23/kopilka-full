import React, {ChangeEvent, useState} from 'react';
import {CategoryRefineType, productCustomField, RefineType} from "../../../types/types";
import {Button, Input, Select, Table, Tag, Tooltip} from "antd";
import {ColumnsType} from "antd/es/table";
import generalInfoStyle from "../../ProductPageComponents/GeneralInfo/GeneralInfo.module.scss";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons/lib";
import {categoryReducerActions} from "../../../redux/categoryReducer";
import {useDispatch, useSelector} from "react-redux";
import s from './CategoryRefines.module.scss';
import {GetCategoryRefines} from "../../../redux/selectors/categorySelector";

const CategoreRefines: React.FC = () => {

    const refines = useSelector(GetCategoryRefines);

    const dispatch = useDispatch();

    const deleteCategoryRefine = (title: string): void => {
        dispatch(categoryReducerActions.deleteCategoryRefine(title));
    };

    const deleteRefineTag = (tag: string, refineName: string) => {
        dispatch(categoryReducerActions.deleteRefineTag(tag, refineName));
    };

    const changeRefineTag = (oldTag: string, newTag: string, refineName: string) => {
        dispatch(categoryReducerActions.changeRefineTag(oldTag, newTag, refineName));
    };

    const addNewRefineTag = (newTag: string, refineName: string) => {
      dispatch(categoryReducerActions.addNewRefineTag(newTag, refineName))
    };

    const addNewRefine = (value: string) => {
        dispatch(categoryReducerActions.addNewRefine(value));
    };

    let [editInputIndex, changeInputIndex] = useState<{ [key: string]: number }>({row: -1, item: -1});
    let [newTagInputVisible, changeInputVisible] = useState<number>(-1);
    let [newRefineInput, changeNewRefineInput] = useState<string>('');

    const handleClose = (removedTag: string, customFieldName: string): void => {
        deleteRefineTag(removedTag, customFieldName);
    };

    const handleInputBlur = () => {
        changeInputIndex({row: -1, item: -1});
    };

    const handleAddNewRefine = (value: string) => {
        if(!refines.map(item => item.title.toLowerCase()).includes(value.toLowerCase()) && value !== '') {
            addNewRefine(value);
        }
    };

    const handleInputNewRefine = (input: ChangeEvent<HTMLInputElement>) => {
        changeNewRefineInput(input.target.value);
    };

    const customFieldsColumns: ColumnsType<CategoryRefineType> = [
        {
            title: 'Refine Name',
            dataIndex: 'title',
            key: 'title',
            width: 200
        },
        {
            title: 'Refines Tags',
            dataIndex: 'items',
            key: 'items',
            render: (keys: Array<string>, record, index) => {
                return <div key={`tag${index}`}>{keys.map((item, itemIndex) => {
                    if (editInputIndex.item === itemIndex && editInputIndex.row == index) {
                        return (
                            <Input size={'small'} defaultValue={item} style={{width: 120}} autoFocus={true} onBlur={(elem) => {
                                changeRefineTag(item, elem.target.value, record.title);
                                handleInputBlur();
                            }}/>
                        );
                    }
                    const isLongTag = item.length > 20;
                    const tagElem = (<Tag
                        className="edit-tag"
                        key={item}
                        closable={true}
                        color={"geekblue"}
                        onClose={() => handleClose(item, record.title)}
                        style={{userSelect: 'none'}}
                    >
                            <span onDoubleClick={e => {
                                changeInputIndex({row: index, item: itemIndex});
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
                        newTagInputVisible === index ? <Input size={'small'} style={{width: 120}} autoFocus={true} onBlur={(elem) => {
                            addNewRefineTag(elem.target.value, record.title);
                            changeInputVisible(-1);
                        }}/> : <Tag style={{borderStyle: 'dashed', background: '#fff'}} onClick={() => {
                                changeInputVisible(index)
                            }}>
                                <PlusOutlined/> New Tag
                            </Tag>
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
                    deleteCategoryRefine(record.title)
                }}><DeleteOutlined/></button>
            }
        }
    ];

    return <>
        <Table className={s.refinesTable} pagination={false} columns={customFieldsColumns} dataSource={refines}
               footer={() => {
                   return <>
                       <Input size={"middle"} style={{width: 200}} placeholder={'Enter New Refine Name'} onChange={handleInputNewRefine}/>
                       <Button type="dashed" icon={<PlusOutlined/>} onClick={() => {handleAddNewRefine(newRefineInput)}}>
                           Add New Custom Field
                       </Button>
                   </>
               }}/>
    </>
};

export default CategoreRefines;