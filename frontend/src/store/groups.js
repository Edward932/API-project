import { csrfFetch } from "./csrf";

const GET_ALL_GROUPS = 'groups/getGroups';
const GET_GROUP = 'groups/getGroupById';
const CREATE_GROUP = 'groups/createGroup';
const DELETE_GROUP = 'groups/deleteGroup';
const UPDATE_GROUP = 'groups/updateGroup';
const ADD_IMG = 'groups/addImgURL';
const UPDATE_IMG = 'groupt/updateIMG'

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
};

const createGroup = (group) => {
    return {
        type: CREATE_GROUP,
        group
    }
};

const addImgURL = (groupId, img) => {
    return {
        type: ADD_IMG,
        groupId,
        img
    }
};

const deleteGroup = (groupId) => {
    return {
        type: DELETE_GROUP,
        groupId
    }
}

const updateGroup = (group) => {
    return {
        type: UPDATE_GROUP,
        group
    }
};

const updateIMG = () => {
    return {
        type: UPDATE_IMG
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
        return group;
    } else {
        const error = await res.json();
        return error;
    }
};

export const createGroupThunk = (group, imgURL) => async dispatch => {
    const res = await csrfFetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(group)
    });

    if(res.ok) {
        const group = await res.json();
        await dispatch(addImgURLThunk(group.id, imgURL));

        dispatch(createGroup(group));
        return group;
    } else {
        const error = res.json();
        return error;
    }
};

export const addImgURLThunk = (groupId, imgURL) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imgURL, preview: true })
    });

    if(res.ok) {
        const img = await res.json();
        dispatch(addImgURL(groupId, img));
        return img;
    } else {
        const error = await res.json();
        return error;
    }
};

export const updateIMGThunk = (oldImgId, groupId, newImgURL) => async dispatch => {
    console.log(oldImgId, 'oldImgId');
    console.log('groupId', groupId);
    console.log('newImgURl', newImgURL);
    let res;
    if(oldImgId){
        res = await csrfFetch(`/api/group-images/${oldImgId}`, {
            method: 'DELETE'
        });
    }

    if(res.ok) {
        dispatch(addImgURLThunk(groupId, newImgURL));
    } else {
        const error = await res.json();
        console.log('delteimg fail', error)
        return error;
    }
};

export const deleteGroupThunk = (groupId) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
    });

    if(res.ok) {
        const message = res.json()
        dispatch(deleteGroup(groupId));
        return message;
    } else {
        const error = res.json();
        return error;
    }
};

export const updateGroupThunk = (group, groupId, imgURL) => async dispatch => {
    const res = await csrfFetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(group)
    });

    console.log('first update before img');

    if(res.ok) {
        const group = await dispatch(getGroupByIdThunk(groupId));
        const oldImgURL = group.GroupImages?.find(image => image.preview === true);

        console.log('in update thunk', group);
        await dispatch(updateIMGThunk(oldImgURL.id, group.id, imgURL));

        dispatch(updateGroup(group));
        return group;
    } else {
        const error = res.json();
        console.log('ERRROEROE')
        return error;
    }
};

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
            return { ...state, singleGroup: action.group };
        case CREATE_GROUP:
            return { ...state, singleGroup: action.group};
        case DELETE_GROUP:
            const newAllGroups = { ...state.allGroups };
            delete newAllGroups[action.groupId];
            return { ...state, allGroups: newAllGroups, singleGroup: {} };
        case UPDATE_GROUP:
            const updateAllGroups = { ...state.allGroups };
            updateAllGroups[action.groupId] = action.group;
            return { ...state, allGroups: updateAllGroups, singleGroup: action.group };
        default:
            return state;
    }
}

export default groupsReducer;
