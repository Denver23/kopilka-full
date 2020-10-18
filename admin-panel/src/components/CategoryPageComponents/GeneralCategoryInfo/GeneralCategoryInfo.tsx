import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {categorySlideTable} from "../../../types/types";
import {ColumnsType} from "antd/es/table";
import {Button, Checkbox, Form, Input, Table} from "antd";
import s from "./GeneralCategoryInfo.module.scss";
import ChildProductsStyles from "../../ProductPageComponents/ChildProducts/ChildProducts.module.scss";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {categoryReducerActions} from "../../../redux/categoryReducer";
import {
    GetCategoryHidden,
    GetCategoryId,
    GetCategoryName,
    GetCategorySlides,
    GetCategoryUrl
} from "../../../redux/selectors/categorySelector";
import {ValidateStatus} from "antd/es/form/FormItem";

const useURLValidator = (value: string) => {

    const regexp = new RegExp(/\s/i);
    let [url, changeUrl] = useState({
        value,
        validateStatus: regexp.test(value) ? 'error' : 'success' as ValidateStatus,
        errorMsg: regexp.test(value) ? 'Space-symbols must be deleted' : null
    });

    let validateTrigger = (value: string) => {
        console.log(regexp.test(value) ? 'error' : 'success');
        return {
            validateStatus: regexp.test(value) ? 'error' : 'success' as ValidateStatus,
            errorMsg: regexp.test(value) ? 'Space-symbols must be deleted' : null
        }
    };

    return {
        url,
        changeUrl,
        validateTrigger
    }
};

const GeneralCategoryInfo: React.FC<{ generalForm: any, newCategory: boolean }> = (props) => {

    const dispatch = useDispatch();
    const deleteImage = (index: number): void => {
        dispatch(categoryReducerActions.deleteImage(index));
    };
    const changeImage = (oldSrc: string, src: string): void => {
        dispatch(categoryReducerActions.changeImage(oldSrc, src));
    };
    const addImage = (): void => {
        dispatch(categoryReducerActions.addImage());
    };
    const changeHiddenStatus = (value: boolean): void => {
        dispatch(categoryReducerActions.changeHiddenStatus(value));
    };

    const categoryId = useSelector(GetCategoryId);
    const categoryName = useSelector(GetCategoryName);
    const url = useSelector(GetCategoryUrl);
    const slides = useSelector(GetCategorySlides);
    const hidden = useSelector(GetCategoryHidden);

    let urlValidator = useURLValidator(url ? url : '');

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const onChangeImageData = (oldSrc: string, src: string) => {
        changeImage(oldSrc, src);
    };
    const imagesColumns: ColumnsType<categorySlideTable> = [
        {
            title: 'Src',
            dataIndex: 'src',
            key: 'src',
            width: 500,
            render: (text: string, record: categorySlideTable, index: number) => {
                return <Form.Item name={`src-${index}`} className={ChildProductsStyles.childTableRow}
                                  initialValue={text}><Input onBlur={(e) => {onChangeImageData(text, e.target.value)}}/></Form.Item>
            }
        },
        {
            title: 'Show Image',
            dataIndex: 'showImage',
            key: 'showImage',
            width: 100,
            render: (URL: string) => {
                return <div className={s.galleryImage}><img src={URL}/></div>
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            width: 50,
            render: (text: string, record: categorySlideTable, index: number) => {
                return <button className={s.deleteImageButton} onClick={() => {
                    deleteImage(index)
                }}><DeleteOutlined/></button>
            }
        }
    ];

    const dataChange = (data: { [key: string]: string }): void => {
        let newData = {...data};
        if (newData.categoryName !== undefined) {
            dispatch(categoryReducerActions.dataChange({...newData}));
        } else if (newData.url !== undefined) {
            urlValidator.changeUrl({...urlValidator.validateTrigger(newData.url), value: newData.url});
            dispatch(categoryReducerActions.dataChange(newData));
        }
    };

    const onHiddenChange = (value: boolean) => {
        changeHiddenStatus(value);
    };

    useEffect(() => {
        props.generalForm.resetFields();
    }, [slides]);


    return <div>
        <Form
            form={props.generalForm}
            {...layout}
            name="basic"
            initialValues={{
                remember: true,
                categoryId: props.newCategory === false && categoryId !== null ? categoryId : props.newCategory === true ? 'NonID Product' : undefined,
                categoryName: categoryName !== null ? categoryName : undefined,
                url: urlValidator.url.value,
                hidden
            }}
            onValuesChange={e => {
                dataChange(e)
            }}
        >
            <div className={s.generalInfoBlock}>
                <div className={s.generalInfo}>
                    <Form.Item
                        label="Category ID"
                        name="categoryId"
                        rules={[]}
                    >
                        <Input size={"middle"} maxLength={200}
                               disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label="Name"
                        name="categoryName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input brand!',
                            },
                        ]}
                    >
                        <Input size={"middle"} maxLength={200}/>
                    </Form.Item>
                    <Form.Item
                        label="URL"
                        name="url"
                        rules={[
                            {
                                required: true,
                                message: 'Please input product title!',
                            },
                        ]}
                        validateStatus={urlValidator.url.validateStatus}
                        help={urlValidator.url.errorMsg || undefined}
                    >
                        <Input size={"middle"} maxLength={200}/>
                    </Form.Item>
                </div>
                <div className={s.hiddenCheckbox}>
                    <Form.Item name="hidden" valuePropName="checked">
                        <Checkbox onChange={e => onHiddenChange(e.target.checked)}>Hidden</Checkbox>
                    </Form.Item>
                </div>
            </div>
            <Table pagination={false} columns={imagesColumns} dataSource={slides.map((imageObject, index) => {
                return {
                    src: imageObject,
                    showImage: imageObject
                }
            })}
                   footer={() => {
                       return <Button type="dashed" onClick={addImage} icon={<PlusOutlined/>}>
                           Add New Image
                       </Button>
                   }}/>
        </Form>
    </div>
}

export default GeneralCategoryInfo;