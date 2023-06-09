import { Link } from 'react-router-dom';
import './DisplayEvents.css'

export default function GroupCard({ event }) {

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
        <Link to={`/events/${event.id}`} key={event.id} className="event-link">
            <div className="upper-event-card">
                <div className='event-image-div'>
                    {event.previewImage === "No preview image for event" ? "No preview image for event" : <img src={event.previewImage} alt="event" className="event-img"/>}
                </div>
                <div>
                    <p className="event-time">{date} <i className="fa-solid fa-circle"></i> {normalizedFor12}</p>
                    <h3 className="event-title">{event.name}</h3>
                    <p className="event-location">{event.venue && `${event.venue.city}, ${event.venue.state}`}</p>
                </div>
            </div>
            <p className="event-desctiption-short">{event.description}</p>
        </Link>
    )
}
