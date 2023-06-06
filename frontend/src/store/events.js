// import { csrfFetch } from "./csrf";

const GET_EVENTS_BY_GROUP = 'events/getEventsByGroup';

const getEventsByGroup = events => {
    return {
        type: GET_EVENTS_BY_GROUP,
        events
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
}

const initialState = { allEvents: {}, singleEvent: {}, groupEvents: [] };

const eventReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_EVENTS_BY_GROUP:
            return { ...state, groupEvents: action.events.Events };
        default:
            return state;
    }
}

export default eventReducer;
