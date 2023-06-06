import { Link } from 'react-router-dom';
import './DisplayEvents.css'

export default function GroupCard({ event }) {
    //console.log('event in GroupCard componenent', event)
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


    console.log(event)
    return (
        <Link to={`/events/${event.id}`} key={event.id} className="event-link">
            <div className="upper-event-card">
                <img src={event.previewImage} alt="event" className="event-img"/>
                <div>
                    <p className="event-time">{date} <i className="fa-solid fa-circle"></i> {normalizedFor12}</p>
                    <h3>{event.name}</h3>
                    <p>{event.venue && `${event.venue.city}, ${event.venue.state}`}</p>
                </div>
            </div>
            <p>{event.description}</p>
        </Link>
    )
}
