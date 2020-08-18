import React, {useEffect, useRef} from "react";
import s from './ProfileMenu.module.scss'
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {signOut} from "../../../../redux/authReducer";
import {GetUserId} from "../../../../redux/selectors/authSelectors";

type ProfileMenuPropsType = {setShowMenu: (value: boolean) => void};


const ProfileMenu: React.FC<ProfileMenuPropsType> = (props) => {

    const userId = useSelector(GetUserId);
    const dispatch = useDispatch();
    const signOutThunk = (userId: string): void => {
        dispatch(signOut(userId));
    }

    let profileMenu = useRef<HTMLDivElement>(null);

    let handleClickOutside = (e: Event) => {
        const domNode = profileMenu;
        const eventNode = e.target as Node;
        if ((!domNode.current || !domNode.current.contains(eventNode))) {
            props.setShowMenu(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => (document.removeEventListener('click', handleClickOutside))
    }, [])

    return <div ref={profileMenu} className={s.profileMenu}>
        <Link to={'/profile'} onClick={(e) => {props.setShowMenu(false)}} className={s.profileMenuLink}>Profile</Link>
        <button className={s.profileMenuLink} onClick={e => {if(userId !== null) {signOutThunk(userId)}}}>Sign Out</button>
    </div>
}

export default ProfileMenu;