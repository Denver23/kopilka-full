import React, {useLayoutEffect, useState} from "react";
import s from "./ProductGallery.module.scss";
import {connect} from "react-redux";

const ProductGallery = (props) => {

    let [activeImage, changeActiveImage] = useState(0);

    return <div className={s.gallery}>
        <ul className={s.galleryThumbnailImages}>
            {props.images.map((item, i) => {
                return <li className={s.galleryThumb} key={i} ><img src={item.thumbnail} alt={item.alt ? item.alt : ''} onClick={() => {changeActiveImage(i)}}/></li>
            })}
        </ul>
        <ul className={s.galleryMainImages}>
            {props.images.map((item, i) => {
                return <li className={s.galleryItem + (i === activeImage ? ` ${s.active}` : '')} key={i}><img src={item.original} alt={item.alt ? item.alt : ''}/></li>
            })}
        </ul>
    </div>
}

let mapStateToProps = (state) => {
    return {
        "images": state.productReducer.images
    }
}

export default connect(mapStateToProps, {})(ProductGallery);