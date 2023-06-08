import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div id="nav-div">
      <ul id="nav-bar">
        <li>
          <NavLink className="nav-link-home" exact to="/"><h2 id="nav-bar-home-link">CodingMeetup</h2></NavLink>
        </li>
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
      <hr id="nav-bar-hr"/>
    </div>
  );
}

export default Navigation;
