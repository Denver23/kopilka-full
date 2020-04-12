import React, {useState} from "react";
import s from './ProfileLink.module.scss';
import ProfileMenu from "./ProfileMenu/ProfileMenu";

const ProfileLink = ({profile, ...props}) => {

    let [showMenu, setShowMenu] = useState(false);

    return (
        <div className={s.profileBlock}>
            <button className={s.profileButton + ' ' + (showMenu ? s.activeForm : '')}  onClick={() => {setShowMenu(!showMenu)}}>{profile.login}</button>
            {showMenu ? <ProfileMenu setShowMenu={setShowMenu}/> : ''}
        </div>
    )
}

export default ProfileLink