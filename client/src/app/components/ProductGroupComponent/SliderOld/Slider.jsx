import React from "react";
import s from './Slider.module.scss';
import {connect} from "react-redux";

class Slider extends React.Component {

    constructor(props) {
        super(props);
        this.delay = 1000;
        this.status = false;
        this.moveLeft = this.moveLeft.bind(this);
        this.moveRight = this.moveRight.bind(this);
    }

    imageResize() {
        let newSize = document.documentElement.clientWidth;
        let images = document.getElementsByClassName(s.sliderImage);
        for(let i = 0; i < images.length; i++) {
            images[i].style.width = newSize + "px";
        }
    }

    moveLeft() {
        if(this.status === false) {
            this.status = true;
            let sliderList = document.getElementsByClassName(s.imagesList)[0];
            let Images = document.getElementsByClassName(s.sliderItem);
            let newLastImage = Images[0].cloneNode(true)
            sliderList.appendChild(newLastImage);
            sliderList.classList.add(s.onMove);
            sliderList.style.left = `-${Images[0].offsetWidth}px`;
            setTimeout(() => {
                sliderList.classList.remove(s.onMove);
                sliderList.removeChild(Images[0]);
                sliderList.style.left = '0';
                this.status = false;
            }, this.delay);
        } else return;
    }
    moveRight() {
        if(this.status === false) {
            this.status = true;
            let sliderList = document.getElementsByClassName(s.imagesList)[0];
            let Images = document.getElementsByClassName(s.sliderItem);
            let newFirstImage = Images[Images.length - 1].cloneNode(true)
            sliderList.insertBefore(newFirstImage, Images[0]);
            sliderList.classList.add(s.onMove);
            sliderList.style.marginLeft = `-${Images[0].offsetWidth}px`;
            sliderList.style.left = `${Images[0].offsetWidth}px`;
            setTimeout(() =>{
                sliderList.classList.remove(s.onMove);
                sliderList.removeChild(Images[Images.length - 1]);
                sliderList.style.marginLeft = `0`;
                sliderList.style.left = '0';
                this.status = false;
            }, this.delay);
        } else return;
    }
    componentDidMount() {
        this.imageResize();
    }
    render() {
        window.onresize = () => {this.imageResize()};
        return (
            <div className={s.slider}>
                <div className={s.viewport}>
                    <ul className={s.imagesList}>
                        {this.props.slides.map((slide) => {
                            return <li className={s.sliderItem}><img src={slide} alt="" className={s.sliderImage} /></li>
                        })}
                    </ul>
                </div>
                <div className={`${s.arrow} ${s.directionLeft}`} onClick={this.moveRight}>&#60;</div>
                <div className={`${s.arrow} ${s.directionRight}`} onClick={this.moveLeft}>&#62;</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        slides: state.sliderReducer.slides
    }
}

export default connect(mapStateToProps)(Slider);