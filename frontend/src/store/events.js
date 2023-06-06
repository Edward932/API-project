// import { csrfFetch } from "./csrf";

const GET_EVENTS_BY_GROUP = 'events/getEventsByGroup';
const GET_EVENTS = 'events/getEvents';

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
}

const initialState = { allEvents: {}, singleEvent: {}, groupEvents: [] };

const eventReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_EVENTS_BY_GROUP:
            return { ...state, groupEvents: action.events.Events };
        case GET_EVENTS:
            console.log("IN REDUCER")
            const normalizedEvents = {};
            const eventArr = action.events.Events;
            eventArr.forEach(event => {
                normalizedEvents[event.id] = event;
            });
            return { ...state, allEvents: normalizedEvents }
        default:
            return state;
    }
}

export default eventReducer;
