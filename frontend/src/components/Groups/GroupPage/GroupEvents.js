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

    let upComingDiv;
    if(upComingEvents.length) {
        upComingDiv = (
            <div>
                <h3>Upcoming Events ({upComingEvents.length})</h3>
                {upComingEvents.map(event => (
                    <div key={event.id}>
                        {event.name}
                    </div>
                ))}
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
