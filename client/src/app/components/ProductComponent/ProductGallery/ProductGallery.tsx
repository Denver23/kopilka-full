import React, {useState} from "react";
import s from "./ProductGallery.module.scss";
import {useSelector} from "react-redux";
import {GetProductImages} from "../../../redux/selectors/productSelectors";

const ProductGallery: React.FC = (props) => {

    const images = useSelector(GetProductImages);

    let [activeImage, changeActiveImage] = useState(0);

    return <div className={s.gallery}>
        <ul className={s.galleryThumbnailImages}>
            {images.map((item, i) => {
                return <li className={s.galleryThumb} key={i} ><img src={item.thumbnail} alt={item.alt ? item.alt : ''} onClick={() => {changeActiveImage(i)}}/></li>
            })}
        </ul>
        <ul className={s.galleryMainImages}>
            {images.map((item, i) => {
                return <li className={s.galleryItem + (i === activeImage ? ` ${s.active}` : '')} key={i}><img src={item.original} alt={item.alt ? item.alt : ''}/></li>
            })}
        </ul>
    </div>
}

export default ProductGallery;