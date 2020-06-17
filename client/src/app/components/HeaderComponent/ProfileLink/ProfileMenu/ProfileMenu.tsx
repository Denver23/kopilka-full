import React, {useEffect, useRef} from "react";
import s from './ProfileMenu.module.scss'
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {signOut} from "../../../../redux/authReducer";
import {AppStateType} from "../../../../redux/store";

type ProfileMenuMapStateToPropsType = {
    userId: string | null;
}

type ProfileMenuMapDispatchToPropsType = {
    signOut: (userId: string) => void;
}

type ProfileMenuPropsType = ProfileMenuMapStateToPropsType & ProfileMenuMapDispatchToPropsType & {setShowMenu: (value: boolean) => void};


const ProfileMenu: React.FC<ProfileMenuPropsType> = (props) => {
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
        <button className={s.profileMenuLink} onClick={e => {if(props.userId !== null) {props.signOut(props.userId)}}}>Sign Out</button>
    </div>
}

let mapStateToProps = (state: AppStateType): ProfileMenuMapStateToPropsType => {
    return {
        userId: state.authReducer.userId
    }
}

export default connect<ProfileMenuMapStateToPropsType, ProfileMenuMapDispatchToPropsType, {}, AppStateType>(mapStateToProps, {signOut})(ProfileMenu);