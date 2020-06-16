import React from 'react';
import s from './BurgerMenu.module.scss';

type BurgerMenuPropsType = {
    burgerDisplay: boolean,
    setBurgerDisplay: (e: boolean) => void
}

const BurgerMenu: React.FC<BurgerMenuPropsType> = (props) => {

    return <div onClick={() => {props.setBurgerDisplay(!props.burgerDisplay)}}>
        <i className={"material-icons " + s.burgerButton}>menu</i>
    </div>

}

export default BurgerMenu;