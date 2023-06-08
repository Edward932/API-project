import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEventsThunk } from '../../../store/events';
import EventCard from './EventCard';
import './DisplayEvents.css'

export default function DisplayEvents() {
    const dispatch = useDispatch();
    const eventsObj = useSelector(state => state.events.allEvents);
    const eventsArr = Object.values(eventsObj ?? {});

    // change this since it is given as an array in order to begin with.
    eventsArr.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))

    useEffect(() => {
        dispatch(getEventsThunk())
    }, [dispatch]);


    console.log(eventsArr);

    return (
        <div>
            <p id="text-up-top-events">Events in CodingMeetup</p>
            {eventsArr.map(event => (
                <EventCard event={event} key={event.id}/>
            ))}
        </div>
    )
}
