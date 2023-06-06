import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getEventsThunk } from '../../../store/events';
import EventCard from './EventCard';
import './DisplayEvents.css'

export default function DisplayEvents() {
    const dispatch = useDispatch();
    const eventsObj = useSelector(state => state.events.allEvents);
    const eventsArr = Object.values(eventsObj ?? {});

    useEffect(() => {
        dispatch(getEventsThunk())
    }, [dispatch]);


    console.log(eventsArr);

    return (
        <div>
            <p>Events in Meetup</p>
            {eventsArr.map(event => (
                <EventCard event={event} key={event.id}/>
            ))}
        </div>
    )
}
