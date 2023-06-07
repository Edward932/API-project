import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupsThunk } from '../../../store/groups';
import GroupCard from './GroupCard';
import './GroupsDisplay.css'

export default function DisplayGroups() {
    const dispatch = useDispatch();
    const groupsObj = useSelector(state => state.groups.allGroups);
    const groupsArr = Object.values(groupsObj ?? {});
    //console.log('groups in DisplayGroups component', groupsArr);

    useEffect(() => {
        dispatch(getGroupsThunk())
    }, [dispatch])

    return (
        <div>
            <p id='groups-in-meetup'>Groups in Meetup</p>
            {groupsArr.map(group => (
                <GroupCard group={group} key={group.id}/>
            ))}
        </div>
    )
}
