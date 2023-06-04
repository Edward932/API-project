// import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = 'groups/getGroups';
const GET_GROUP = 'groups/getGroupById'

const getGroups = (groups) => {
    return {
        type: GET_ALL_GROUPS,
        groups
    }
};

const getGroupById = (group) => {
    return {
        type: GET_GROUP,
        group
    }
}

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
};

export const getGroupByIdThunk = (groupId) => async dispatch => {
    const res = await fetch(`/api/groups/${groupId}`);

    if(res.ok) {
        const group = await res.json();
        dispatch(getGroupById(group));
        return group
    } else {
        const error = await res.json();
        return error;
    }
}

const initialState = { allGroups: {}, singleGroup: {} };

const groupsReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_ALL_GROUPS:
            const normalizedGroups = {};
            const groupsArr = action.groups.Groups;
            groupsArr.forEach(group => {
                normalizedGroups[group.id] = group;
            })
            return { ...state, allGroups: normalizedGroups };
        case GET_GROUP:
            return { ...state, singleGroup: action.group }
        default:
            return state;
    }
}

export default groupsReducer;
