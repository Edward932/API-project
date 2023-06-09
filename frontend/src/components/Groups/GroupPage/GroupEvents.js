import { getEventsByGroupThunk } from "../../../store/events";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from 'react-router-dom';


export default function GroupEvents({ groupId }) {
    const dispatch = useDispatch();

    const eventsArr = useSelector(state => state.events.groupEvents);
    const upComingEvents = [];
    const pastEvents = [];

    const now = new Date().getTime();
    eventsArr.forEach(event => {
        const startDate = new Date(event.startDate).getTime();
        if(startDate > now) upComingEvents.push(event);
        else pastEvents.push(event);
    });

    useEffect(() => {
        dispatch(getEventsByGroupThunk(groupId))
    }, [dispatch, groupId]);

    let upComingDiv;
    if(upComingEvents.length) {
        upComingDiv = (
            <div>
                <h3>Upcoming Events ({upComingEvents.length})</h3>
                {upComingEvents.map(event => {
                    const time = new Date(event.startDate);
                    const date = time.toDateString();
                    const timeOfDay = time.toTimeString().split(' ')[0];
                    const timeArr = timeOfDay.split(':');
                    if(timeArr[0] > 12) {
                        timeArr[0] -= 12;
                        timeArr[1] += ' PM'
                    } else {
                        timeArr[1] += ' AM'
                    }
                    timeArr.pop();
                    const normalizedFor12 = timeArr.join(':');

                    return (
                        <Link to={`/events/${event.id}`} key={event.id} className="group-event-link">
                            <div className="upper-event-card">
                                <div className="event-preview">
                                    <img src={event.previewImage} alt="event" className="group-event-img"/>
                                </div>
                                <div>
                                    <p className="group-event-time">{date} <i className="fa-solid fa-circle"></i> {normalizedFor12}</p>
                                    <h3 className="event-group-title">{event.name}</h3>
                                    <p id="group-event-location">{event.venue && `${event.venue.city}, ${event.venue.state}`}</p>
                                </div>
                            </div>
                            <p id="group-event-discritpion">{event.description}</p>
                        </Link>
                    );
                })}
            </div>
        )
    } else {
        upComingDiv = null
    }

    let pastDiv;
    if(pastEvents.length) {
        pastDiv = (
            <div>
                <h3>Past Events ({pastEvents.length})</h3>
                {pastEvents.map(event => {
                    const time = new Date(event.startDate);
                    const date = time.toDateString();
                    const timeOfDay = time.toTimeString().split(' ')[0];
                    const timeArr = timeOfDay.split(':');
                    if(timeArr[0] > 12) {
                        timeArr[0] -= 12;
                        timeArr[1] += ' PM'
                    } else {
                        timeArr[0] += ' AM'
                    }
                    timeArr.pop();
                    const normalizedFor12 = timeArr.join(':');

                    return (
                        <Link to={`/events/${event.id}`} key={event.id} className="group-event-link">
                            <div className="upper-event-card">
                                <div className="event-preview">
                                    <img src={event.previewImage} alt="event" className="group-event-img"/>
                                </div>
                                <div>
                                    <p className="group-event-time">{date} <i className="fa-solid fa-circle"></i> {normalizedFor12}</p>
                                    <h3 className="event-group-title">{event.name}</h3>
                                    <p id="group-event-location">{event.venue && `${event.venue.city}, ${event.venue.state}`}</p>
                                </div>
                            </div>
                            <p id="group-event-discritpion">{event.description}</p>
                        </Link>
                    );
                })}
            </div>
        )
    } else {
        pastDiv = null;
    }

    return (
        <>
            {upComingDiv}
            {pastDiv}
        </>
    )
}
