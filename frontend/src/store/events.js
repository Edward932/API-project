import { csrfFetch } from "./csrf";

const GET_EVENTS_BY_GROUP = 'events/getEventsByGroup';
const GET_EVENTS = 'events/getEvents';
const GET_EVENT_BY_ID = 'events/getEventById';
const DELETE_EVENT = 'events/delteEvent';

const getEventsByGroup = events => {
    return {
        type: GET_EVENTS_BY_GROUP,
        events
    }
};

const getEvents = (events) => {
    return {
        type: GET_EVENTS,
        events
    }
};

const getEventById = (event) => {
    return {
        type: GET_EVENT_BY_ID,
        event
    }
};

const deleteEvent = (eventId) => {
    return {
        type: DELETE_EVENT,
        eventId
    }
}

export const getEventsByGroupThunk = groupId => async dispatch => {
    const res = await fetch(`/api/groups/${groupId}/events`);

    if(res.ok) {
        const events = await res.json();
        dispatch(getEventsByGroup(events));
        return events;
    } else {
        const error = await res.json();
        return error;
    }
};

export const getEventsThunk = () => async dispatch => {
    const res = await fetch('/api/events');

    if(res.ok) {
        const events = await res.json();
        dispatch(getEvents(events));
        return events;
    } else {
        const error = await res.json();
        return error;
    }
};

export const getEventByIdThunk = eventId => async dispatch => {
    const res = await fetch(`/api/events/${eventId}`);

    if(res.ok) {
        const event = await res.json();
        dispatch(getEventById(event));
        return event;
    } else {
        const error = await res.json();
        return error;
    }
};

export const deleteEventThunk = eventId => async dispatch => {
    console.log(eventId);
    const res = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE'
    });

    if(res.ok) {
        const message = await res.json();
        dispatch(deleteEvent(eventId));
        return message;
    } else {
        const error = await res.json();
        return error;
    }
}

const initialState = { allEvents: {}, singleEvent: {}, groupEvents: [] };

const eventReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_EVENTS_BY_GROUP:
            return { ...state, groupEvents: action.events.Events };
        case GET_EVENTS:
            const normalizedEvents = {};
            const eventArr = action.events.Events;
            eventArr.forEach(event => {
                normalizedEvents[event.id] = event;
            });
            return { ...state, allEvents: normalizedEvents };
        case GET_EVENT_BY_ID:
            return { ...state, singleEvent: action.event};
        case DELETE_EVENT:
            const newAllEvents = { ...state.allEvents};
            delete newAllEvents[action.eventId];
            return { ...state, allEvents: newAllEvents, singleEvent: {} }
        default:
            return state;
    }
}

export default eventReducer;
