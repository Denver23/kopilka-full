import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {loadCategoryRefines, productReducerActions} from "../../../redux/productReducer";
import {productImage, productImageTable} from "../../../types/types";
import {
    GetProductBrand,
    GetProductCategory, GetProductFeatures, GetProductHidden,
    GetProductId, GetProductImages,
    GetProductShortDescription, GetProductSpecifications, GetProductTitle
} from "../../../redux/selectors/productSelector";
import {ColumnsType} from "antd/es/table";
import {AutoComplete, Button, Checkbox, Form, Input, Table} from "antd";
import s from "./GeneralInfo.module.scss";
import ChildProductsStyles from "../ChildProducts/ChildProducts.module.scss"
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {onBrandChange} from "../../../utils/autoCompleteFunc/brands";
import {onCategoryChange} from "../../../utils/autoCompleteFunc/categories";
import {FormInstance} from "antd/lib/form";

const useSelectProduct = (name: string, initial: string | null = '', onChange: (value: string, setStateFunc: (array: Array<{value: string}>) => void) => void, actionsForm: FormInstance, loadThunk?: (item: string) => void) => {

    let [autocompleteList, setList] = useState<Array<any>>([]);
    let [tempString, changeTempString] = useState(initial !== null ? initial : '');
    const dispatch = useDispatch();

    const setDefaultValue = () => {
        let action: {[key: string]: string} = {};
        action[name] = initial !== null ? initial : '';
        actionsForm.setFieldsValue(action)
    };

    const onBrandBlur = () => {
        let itemsForCheck = autocompleteList.map(item => {
            return item.value
        });
        if (tempString !== initial && autocompleteList.length !== 0 && itemsForCheck.includes(tempString)) {
            dispatch(productReducerActions.dataChange({brand: tempString}));
        } else {
            setDefaultValue();
        }
    };

    const onCategoryBlur = () => {
        let itemsForCheck = autocompleteList.map(item => {
            return item.value
        });
        if (tempString !== initial && autocompleteList.length !== 0 && itemsForCheck.includes(tempString)) {
            if(loadThunk !== undefined) {
                loadThunk(tempString);
            }
        } else {
            setDefaultValue();
        }
    };

    const onBrandSelect = (value: string) => {
        let action: {[key: string]: string} = {};
        action[name] = value;
        dispatch(productReducerActions.dataChange(action));
    };

    const onCategorySelect = (value: string) => {
        if(loadThunk !== undefined) {
            loadThunk(value);
        }
    };

    return {
        inputData: {
            options: autocompleteList,
            onSearch: (value: string) => {
                onChange(value, setList)
            },
            onBlur: name === 'brand' ? onBrandBlur : name === 'category' ? onCategoryBlur : undefined,
            onSelect: (value: string) => {
                if(name === 'brand') {
                    onBrandSelect(value)
                } else if(name === 'category') {
                    onCategorySelect(value)
                }
            }
        },
        changeTempString
    }
};

const GeneralInfo: React.FC<{ generalForm: any, newProduct: boolean }> = (props) => {

    const dispatch = useDispatch();
    const deleteImage = (_id: string): void => {
        dispatch(productReducerActions.deleteImage(_id));
    };
    const changeImage = (imageObject: productImage): void => {
        dispatch(productReducerActions.changeImage(imageObject));
    };
    const addImage = (): void => {
        dispatch(productReducerActions.addImage());
    };
    const loadCategoryRefinesThunk = (category: string): void => {
        dispatch(loadCategoryRefines(category));
    };
    const changeHiddenStatus = (value: boolean): void => {
        dispatch(productReducerActions.changeHiddenStatus(value));
    };

    const productId = useSelector(GetProductId);
    const brand = useSelector(GetProductBrand);
    const category = useSelector(GetProductCategory);
    const productTitle = useSelector(GetProductTitle);
    const images = useSelector(GetProductImages);
    const shortDescription = useSelector(GetProductShortDescription);
    const specifications = useSelector(GetProductSpecifications);
    const features = useSelector(GetProductFeatures);
    const hidden = useSelector(GetProductHidden);
    let imageAltInputIndex = useRef<number>(-1);

    let brandSelector = useSelectProduct('brand', brand, onBrandChange, props.generalForm);
    let categorySelector = useSelectProduct('category', category, onCategoryChange, props.generalForm, loadCategoryRefinesThunk);

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const layoutFullWidth = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 20,
        },
    };

    const onChangeImageData = (src: string, alt: string, record: productImageTable) => {
        let newImageObject = {
            _id: record._id,
            original: src,
            thumbnail: record.thumbnail,
            alt: alt
        };
        changeImage(newImageObject);
    };
    const imagesColumns: ColumnsType<productImageTable> = [
        {
            title: 'Src',
            dataIndex: 'src',
            key: 'src',
            width: 500,
            render: (text: string, record: productImageTable, index: number) => {
                return <Form.Item name={`src-${index}`} className={ChildProductsStyles.childTableRow}
                                  initialValue={text}><Input onChange={(e) => {
                    onChangeImageData(e.target.value, record.alt, record)
                }}/></Form.Item>
            }
        },
        {
            title: 'Alt',
            dataIndex: 'alt',
            key: 'alt',
            width: 300,
            render: (text: string, record: productImageTable, index: number) => {
                return <Form.Item name={`alt-${index}`} className={ChildProductsStyles.childTableRow}
                                  initialValue={text}><Input onBlur={() => {imageAltInputIndex.current = -1}} onFocus={() => {imageAltInputIndex.current = index}} autoFocus={imageAltInputIndex.current === index} onChange={(e) => {
                    onChangeImageData(record.src, e.target.value, record);
                }}/></Form.Item>
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
            render: (text: string, record: productImageTable, index: number) => {
                return <button className={s.deleteImageButton} onClick={() => {
                    deleteImage(record._id)
                }}><DeleteOutlined/></button>
            }
        }
    ];

    const dataChange = (data: { [key: string]: string }): void => {
        let newData = {...data};
        if (newData.specifications !== undefined) {
            newData.specifications = newData.specifications.replace(RegExp(/\n/g), '[:os:]');
            dispatch(productReducerActions.dataChange(newData));
        } else if (newData.features !== undefined) {
            newData.features = newData.features.replace(RegExp(/\n/g), '[:os:]');
            dispatch(productReducerActions.dataChange(newData));
        } else if (newData.productTitle !== undefined) {
            dispatch(productReducerActions.dataChange({...newData}));
        } else if (newData.shortDescription !== undefined) {
            dispatch(productReducerActions.dataChange(newData));
        } else if (newData.category !== undefined) {
            categorySelector.changeTempString(newData.category);
        } else if (newData.brand !== undefined) {
            brandSelector.changeTempString(newData.brand);
        }
    };

    const onHiddenChange = (value: boolean) => {
        changeHiddenStatus(value);
    };

    useEffect(() => {
        props.generalForm.resetFields();
    }, [images]);


    return <div>
        <Form
            form={props.generalForm}
            {...layout}
            name="basic"
            initialValues={{
                remember: true,
                productId: props.newProduct === false && productId !== null ? productId : props.newProduct === true ? 'NonID Product' : undefined,
                brand: brand !== null ? brand : undefined,
                productTitle: productTitle !== null ? productTitle : undefined,
                category: category !== null ? category : undefined,
                shortDescription: shortDescription !== null ? shortDescription : undefined,
                specifications: specifications !== null ? specifications.replace(RegExp(/\[:os:\]/g), `\n`) : undefined,
                features: features !== null ? features.replace(RegExp(/\[:os:\]/g), `\n`) : undefined,
                hidden
            }}
            onValuesChange={e => {
                dataChange(e)
            }}
        >
            <div className={s.generalInfoBlock}>
                <div className={s.generalInfo}>
                    <Form.Item
                        label="Product ID"
                        name="productId"
                        rules={[]}
                    >
                        <Input size={"middle"} maxLength={200}
                               disabled={true}/>
                    </Form.Item>
                    <Form.Item
                        label="Brand"
                        name="brand"
                        rules={[
                            {
                                required: true,
                                message: 'Please input brand!',
                            },
                        ]}
                    >
                        <AutoComplete
                            {...brandSelector.inputData}
                            placeholder="Input Brand Name"
                            defaultActiveFirstOption={true}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Product Title"
                        name="productTitle"
                        rules={[
                            {
                                required: true,
                                message: 'Please input product title!',
                            },
                        ]}
                    >
                        <Input size={"middle"} maxLength={200}/>
                    </Form.Item>
                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[
                            {
                                required: true,
                                message: 'Please input category!',
                            },
                        ]}
                    >
                        <AutoComplete
                            {...categorySelector.inputData}
                            placeholder="Input Category Name"
                            defaultActiveFirstOption={true}
                        />
                    </Form.Item>
                </div>
                <div className={s.hiddenCheckbox}>
                    <Form.Item name="hidden" valuePropName="checked">
                        <Checkbox onChange={e => onHiddenChange(e.target.checked)}>Hidden</Checkbox>
                    </Form.Item>
                </div>
            </div>
            <Table pagination={false} columns={imagesColumns} dataSource={images.map((imageObject, index) => {
                return {
                    _id: imageObject._id,
                    key: index,
                    src: imageObject.original,
                    alt: imageObject.alt,
                    showImage: imageObject.original,
                    thumbnail: imageObject.thumbnail
                }
            })}
                   footer={() => {
                       return <Button type="dashed" onClick={addImage} icon={<PlusOutlined/>}>
                           Add New Image
                       </Button>
                   }}/>
            <div className={s.additionalInfo}>
                <Form.Item
                    label="Short Description"
                    name="shortDescription"
                    rules={[]}
                    {...layoutFullWidth}
                >
                    <Input.TextArea style={{resize: 'none'}} rows={5}/>
                </Form.Item>
                <Form.Item
                    label="Specifications"
                    name="specifications"
                    rules={[]}
                    {...layoutFullWidth}
                >
                    <Input.TextArea style={{resize: 'none'}} rows={5}/>
                </Form.Item>
                <Form.Item
                    label="Features"
                    name="features"
                    rules={[]}
                    {...layoutFullWidth}
                >
                    <Input.TextArea style={{resize: 'none'}} rows={5}/>
                </Form.Item>
            </div>
        </Form>
    </div>
}

export default GeneralInfo;