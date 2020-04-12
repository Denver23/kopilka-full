import React from 'react';
import s from './BurgerMenu.module.scss';

const BurgerMenu = (props) => {

    return <div onClick={() => {props.setBurgerDisplay(!props.burgerDisplay)}}>
        <i className={"material-icons " + s.burgerButton}>menu</i>
    </div>

}

export default BurgerMenu;