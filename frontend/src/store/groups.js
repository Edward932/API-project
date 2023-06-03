import { csrfFetch } from "./csrf";

const GET_GROUPS = 'groups/getGroups';

const getGroups = (groups) => {
    return {
        type: GET_GROUPS,
        groups
    }
};

export const getGroupsThunk = () => async dispatch => {
    const res = await fetch('/api/groups');

    if(res.ok) {
        const groups = await res.json();
        dispatch(getGroups(groups));
        //console.log(groups);
        return groups;
    } else {
        const error = await res.json();
        return error;
    }
}

const initialState = { groups: { allGroups: {}, singleGroup: {}, }, };

const groupsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_GROUPS:
            const normalizedGrops = {};
            const groupsArr = action.groups.Groups;
            groupsArr.forEach(group => {
                normalizedGrops[group.id] = group;
            })
            return { ...state, allGroups: normalizedGrops };
        default:
            return state;
    }
}

export default groupsReducer;
