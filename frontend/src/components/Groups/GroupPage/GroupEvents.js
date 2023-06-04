import { getEventsByGroupThunk } from "../../../store/events";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";


export default function GroupEvents({ groupId }) {
    const dispatch = useDispatch();

    const events = useSelector(state => state.events.groupEvents);
    const upComingEvents = [];
    const pastEvents = [];
    const eventsArr = Object.values(events);

    const now = new Date();
    eventsArr.forEach(event => {
        const startDate = new Date(event.startDate);
        if(startDate > now) upComingEvents.push(event);
        else pastEvents.push(event);
    });

    useEffect(() => {
        dispatch(getEventsByGroupThunk(groupId))
    }, [dispatch, groupId]);

    console.log(upComingEvents);

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
                        timeArr[0] += ' AM'
                    }
                    timeArr.pop();
                    const normalizedFor12 = timeArr.join(':');

                    return (
                    <div key={event.id} className="group-event-card">
                        <img src={event.previewImage} alt="event image" className="group-event-img"/>
                        <div>
                            <p className="group-event-time">{date} <i className="fa-solid fa-circle"></i> {normalizedFor12}</p>
                            <h3>{event.name}</h3>
                            <p>{event.venue && `${event.venue.city}, ${event.venue.state}`}</p>
                        </div>
                    </div>
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
                {pastEvents.map(event => (
                    <div key={event.id}>
                        {event.name}
                    </div>
                ))}
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
