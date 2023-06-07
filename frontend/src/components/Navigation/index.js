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
          <NavLink exact to="/"><img id="home-button" src="https://www.meetup.com/mu_static/en-US/logo--script.257d0bb1.svg" alt="meetup-logo"/></NavLink>
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
