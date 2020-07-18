import React, {useLayoutEffect, useState} from "react";
import s from './Slider.module.scss';
import {connect} from "react-redux";
import {AppStateType} from "../../../redux/store";

type MapStateToPropsType = {
    slides: Array<string>
}

const Slider: React.FC<MapStateToPropsType> = (props) => {

    let [delay, changeDelay] = useState(1000);
    let [status, changeStatus] = useState(false);
    let [selectImage, changeImage] = useState(0);
    let imageWidth = useWindowSize();

    function useWindowSize() {
        let [windowWidth, changeWidth] = useState(document.documentElement.clientWidth);

        useLayoutEffect(() => {
            function updateSize() {
                changeWidth(document.documentElement.clientWidth > 500 ? document.documentElement.clientWidth : 500);
            }
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
        }, []);
        return windowWidth;
    }

    const moveLeft = () => {
        if (status === false) {
            changeStatus(true);
            selectImage < props.slides.length - 1 ? changeImage(selectImage + 1) : changeImage(0);
            setTimeout(() => {
                changeStatus(false);
            }, delay);
        } else return;
    }

    const moveRight = () => {
        if (status === false) {
            changeStatus(true);
            selectImage > 0 ? changeImage(selectImage - 1) : changeImage(props.slides.length - 1);
            setTimeout(() => {
                changeStatus(false);
            }, delay);
        } else return;
    }

    return (
        <div className={s.slider}>
            <ul className={s.imagesList}>
                {props.slides.map((slide, i) => {
                    return <li
                        className={i === selectImage ? `${s.sliderItem} ${s.active}` : `${s.sliderItem}`} key={'slide-' + i}><img
                        src={slide} alt=""
                        style={{width: imageWidth}}
                        className={s.sliderImage}/></li>
                })}
            </ul>
            {props.slides.length > 1 ? (<div className={`${s.arrow} ${s.directionLeft}`} onClick={moveRight}>&#60;</div>) : ('')}
            {props.slides.length > 1 ? (<div className={`${s.arrow} ${s.directionRight}`} onClick={moveLeft}>&#62;</div>) : ('')}
        </div>
    )
}

const mapStateToProps = (state: AppStateType): MapStateToPropsType => {
    return {
        slides: state.productGroupReducer.slides
    }
}

export default connect<MapStateToPropsType, {}, {}, AppStateType>(mapStateToProps)(Slider);