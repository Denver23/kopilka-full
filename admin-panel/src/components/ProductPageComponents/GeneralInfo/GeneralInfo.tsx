import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {loadCategoryRefines, productReducerActions} from "../../../redux/productReducer";
import {productImage, productImageTable} from "../../../types/types";
import {
    GetProductBrand,
    GetProductCategory, GetProductFeatures, GetProductHidden,
    GetProductId, GetProductImages,
    GetProductShortDescription, GetProductSpecifications, GetProductTitle
} from "../../../redux/selectors/productSelector";
import {productAPI} from "../../../api/api";
import {ColumnsType} from "antd/es/table";
import {AutoComplete, Button, Checkbox, Form, Input, Table} from "antd";
import s from "./GeneralInfo.module.scss";
import ChildProductsStyles from "../ChildProducts/ChildProducts.module.scss"
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";

const GeneralInfo: React.FC<{ generalForm: any }> = (props) => {

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

    let [brands, setBrands] = useState<Array<any>>([]);
    let [categories, setCategories] = useState<Array<any>>([]);
    let [tempCategory, changeTempCategory] = useState(category !== null ? category : '');
    let [tempBrand, changeTempBrand] = useState(brand !== null ? brand : '');

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
        }
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
                                  initialValue={text}><Input onChange={(e) => {
                    onChangeImageData(record.src, e.target.value, record)
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
            changeTempCategory(newData.category);
        } else if (newData.brand !== undefined) {
            changeTempBrand(newData.brand);
        }
    };

    const onBrandChange = async (value: string) => {
        if (value !== '') {
            const result = await productAPI.getBrandsList(value);

            const brands = result.data.brands.map(brand => {
                return {value: brand.name};
            });
            setBrands(brands);
        } else {
            setBrands([]);
        }
    };
    const onCategoryChange = async (value: string) => {
        if (value !== '') {
            const result = await productAPI.getCategoriesList(value);

            const categories = result.data.categories.map(category => {
                return {value: category.name};
            });
            setCategories(categories);
        } else {
            setCategories([]);
        }
    };
    const onCategoryBlur = () => {
        let categoriesForCheck = categories.map(item => {
            return item.value
        });
        if (tempCategory !== category && categories.length !== 0 && categoriesForCheck.includes(tempCategory)) {
            loadCategoryRefinesThunk(tempCategory);
        } else {
            props.generalForm.setFieldsValue({category})
        }
    };
    const onCategorySelect = (value: string) => {
        loadCategoryRefinesThunk(value);
    };
    const onBrandBlur = () => {
        let brandsForCheck = brands.map(item => {
            return item.value
        });
        if (tempBrand !== brand && brands.length !== 0 && brandsForCheck.includes(tempCategory)) {
            dispatch(productReducerActions.dataChange({brand: tempBrand}));
        } else {
            props.generalForm.setFieldsValue({brand})
        }
    };
    const onBrandSelect = (value: string) => {
        dispatch(productReducerActions.dataChange({brand: value}));
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
                productId: productId !== null ? productId : undefined,
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
                            options={brands}
                            onSearch={onBrandChange}
                            onBlur={onBrandBlur}
                            onSelect={(value) => {
                                onBrandSelect(value)
                            }}
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
                            options={categories}
                            onSearch={onCategoryChange}
                            placeholder="Input Category Name"
                            defaultActiveFirstOption={true}
                            onBlur={onCategoryBlur}
                            onSelect={(value) => {
                                onCategorySelect(value)
                            }}
                        />
                    </Form.Item>
                </div>
                <div className={s.hiddenCheckbox}>
                    <Form.Item name="hidden" valuePropName="checked">
                        <Checkbox onChange={e=>onHiddenChange(e.target.checked)}>Hidden</Checkbox>
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