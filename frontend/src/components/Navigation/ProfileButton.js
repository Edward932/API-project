import { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/');
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div id="nav-bar-outer">
      <div id="profile-inner">
        {user && <Link to="/groups/new" className="new-groups-link">Start a new group</Link>}
        {user && <i onClick={openMenu} class="fa-solid fa-circle-user"></i>}
      </div>
      {!user && (<div id="log-sign-div">
            <li id="log-in-button">
              <OpenModalButton
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li id="sign-in-button">
              <OpenModalButton
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </li>
          </div>
      )}

      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div className="user-info">
            <li>Hello: {user.firstName} {user.lastName}</li>
            <li>{user.username}</li>
            <li>{user.email}</li>
            <li id="nav-logout-li">
              <button id="nav-logout" onClick={logout}>Log Out</button>
            </li>
          </div>
        ) : (
          null
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
