import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getEventByIdThunk } from "../../../store/events";
import './EventPage.css'
import { getGroupByIdThunk } from "../../../store/groups";
import OpenModalButton from "../../OpenModalButton";
import DeleteEventModal from "./DeleteEventModal";

export default function EventPage() {
    const { eventId } = useParams();
    const dispatch = useDispatch();

    const event = useSelector(state => state.events.singleEvent);
    const group = useSelector(state => state.groups.singleGroup);
    const user = useSelector(state => state.session.user);


    const [showMenu, setShowMenu] = useState(false);
    const closeMenu = () => setShowMenu(false);

    const previewImage = event.EventImages?.find(image => image.preview === true);
    const previewUrl = previewImage?.url;
    const groupPreviewImage = group.GroupImages?.find(image => image.preview === true);
    const groupPreviewUrl = groupPreviewImage?.url;

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

    const timeEnd = new Date(event.endDate);
    const dateEnd = timeEnd.toDateString();
    const timeOfDayEnd = timeEnd.toTimeString().split(' ')[0];
    const timeArrEnd = timeOfDayEnd.split(':');
    if(timeArrEnd[0] > 12) {
        timeArrEnd[0] -= 12;
        timeArrEnd[1] += ' PM'
    } else {
        timeArrEnd[0] += ' AM'
    }
    timeArrEnd.pop();
    const normalizedFor12End = timeArr.join(':');

    useEffect(() => {
        (async () => {
            const currEvent = await dispatch(getEventByIdThunk(eventId));
            const groupId = currEvent.Group?.id;
            dispatch(getGroupByIdThunk(groupId));
        })()

    }, [dispatch, eventId]);

    let hostButtons = null;
    if(user && user.id === group.Organizer?.id) {
        console.log('eventID', eventId);
        hostButtons = (
            <div id="event-host-buttons">
                <button onClick={() => alert('feature coming soon')}>Update</button>
                <OpenModalButton
                    buttonText="Delete"
                    onButtonClick={closeMenu}
                    modalComponent={<DeleteEventModal eventId={eventId}/>}
                />
            </div>
        )
    }


    let eventPage = (<h3 className="loading">Loading ....</h3>);

    if(event && +eventId === event?.id) {
        eventPage = (
            <div className="event-page-div">
                <div id="upper-event-div">
                    <Link id="back-to-events" to="/events">{'< Events'}</Link>
                    <h1>{event.name}</h1>
                    <p id="host-name-event">{group.Organizer?.firstName ? `Hosted by ${group.Organizer?.firstName} ${group?.Organizer?.lastName}` : 'No host registered for group'}</p>
                </div>
                <div id="event-main-div">
                    <div id="image-div-event">
                        {previewImage ? <img src={previewUrl} id="event-preview-img" alt="preview"/> : <p id="event-preview-img">No preview image available</p>}
                    </div>
                    <div id="event-right-div">
                        <div id='event-group-display'>
                            {groupPreviewUrl ? <img src={groupPreviewUrl} id="event-group-small" alt="group"/> : <p id="event-group-small">No preview image available</p>}
                            <div id="event-group-title">
                                <h4>{event.Group?.name}</h4>
                                <p>{event.Group?.private ? 'Private' : 'Public'}</p>
                            </div>
                        </div>
                        <div id="event-info">
                            <div id="event-time">
                               <i className="fa-regular fa-clock"></i>
                                <div id='event-start-end'>
                                    <div>
                                        <p className="event-times">START </p>
                                        <p className="event-times">END </p>
                                    </div>
                                    <div>
                                        <p id="event-time-color">{date} <i className="fa-solid fa-circle"></i> {normalizedFor12}</p>
                                        <p id="event-time-color">{dateEnd} <i className="fa-solid fa-circle"></i> {normalizedFor12End}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="event-money-type">
                                <i className="fa-solid fa-dollar-sign"></i>
                                <p>{event.price > 0 ? `PRICE: $${event.price}` : 'FREE'}</p>
                            </div>
                            <div className="event-money-type">
                                <i className="fa-solid fa-location-dot"></i>
                                <p>{event.type}</p>
                            </div>
                        </div>
                        {hostButtons}
                    </div>
                </div>
                <h3 id="event-description-title">Details</h3>
                <p>{event.description}</p>
            </div>
        )
    };

    return (
        <>
            {eventPage}
        </>
    )
}
