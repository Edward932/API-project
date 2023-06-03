import DisplayGroups from "../Groups/DisplayGroups";
import './GroupAndEventDisplay.css'
import { NavLink } from "react-router-dom";

export default function GroupAndEventDisplay({ type }) {

    return (
        <div id="outer-group-and-event">
            <nav>
                <NavLink className="main-link-group-events" activeClassName="selected" to="/events">Events</NavLink>
                <NavLink className="main-link-group-events" activeClassName="selected" to="/groups">Groups</NavLink>
            </nav>
            {type === 'events' ? 'displayEvents' : <DisplayGroups />}
        </div>
    )
}
