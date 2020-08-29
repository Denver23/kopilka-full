import React from 'react';
import s from './Preloader.module.scss';
import preloader from '../../../assets/images/preloader.svg';

type PreloaderPropsType = {
    position?: "-moz-initial" | "inherit" | "initial" | "revert" | "unset" | "-webkit-sticky" | "absolute" | "fixed" | "relative" | "static" | "sticky" | undefined,
    borderRadius?: number,
    background?: boolean
}

const Preloader: React.FC<PreloaderPropsType> = ({position = "static", borderRadius = 0, background = false}) => {
    return <div style={{position: position, borderRadius: borderRadius}} className={s.preloaderContainer + ' ' + (background ? s.fill : "")}><img src={preloader} alt=""/></div>
}

export default Preloader;