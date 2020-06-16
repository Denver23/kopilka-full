import React, {useEffect, useRef} from "react";
import s from './BurgerDisplay.module.scss'
import {Link} from "react-router-dom";
import {MainMenuItem} from "../../../../types/types";


type BurgerDisplayAllProps = {
    mainMenu: Array<MainMenuItem>,
    burgerDisplay: boolean,
    setBurgerDisplay: (e: boolean) => void
}

const BurgerDisplay: React.FC<BurgerDisplayAllProps> = (props) => {

    let burgerDisplayRef = useRef<HTMLDivElement>(null);

    let handleClickOutside = (e: Event) => {
        const domNode = burgerDisplayRef;
        if ((!domNode.current || !domNode.current.contains(e.target as Node))) {
            if(props.burgerDisplay) {
                props.setBurgerDisplay(false);
            }
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => (document.removeEventListener('click', handleClickOutside))
    }, [props.burgerDisplay])

    return <div ref={burgerDisplayRef} className={props.burgerDisplay ? `${s.burgerDisplay} ${s.active}` : s.burgerDisplay}>
        <div className={s.title}>Menu:</div>
        <ul className={s.itemList}>
            {props.mainMenu.map(item => {
                return <li className={s.item} key={item.title}><Link to={item.url} className={s.itemLink}>{item.title}</Link></li>
            })}
        </ul>
        <div className={s.closeButton} onClick={()=>{props.setBurgerDisplay(false)}}>&#10006; Close</div>
    </div>
}

export default BurgerDisplay;