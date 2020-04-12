import React from 'react';
import s from './Preloader.module.scss';
import preloader from '../../../assets/images/preloader.svg';

const Preloader = (props) => {
    return <div style={{position: props.position, borderRadius: props.borderRadius}} className={s.preloaderContainer + ' ' + (props.background ? s.fill : "")}><img src={preloader} alt=""/></div>
}

export default Preloader;