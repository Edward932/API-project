import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { getGroupByIdThunk } from "../../../store/groups";
import OpenModalButton from '../../OpenModalButton';
import './GroupPage.css'

import GroupEvents from "./GroupEvents";
import DeleteGroupModal from "./DeleteGroupModal";

export default function GroupPage() {
    const { groupId } = useParams();
    const [showMenu, setShowMenu] = useState(false);
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.singleGroup);
    const previewImage = group.GroupImages?.find(image => image.preview === true);
    const previewUrl = previewImage?.url;

    useEffect(() => {
        dispatch(getGroupByIdThunk(groupId))
    }, [dispatch, groupId]);

    const handleJoin = () => alert('Feature coming soon');

    const closeMenu = () => setShowMenu(false);

    const user = useSelector(state => state.session.user);

    let joinButton = null;
    if(user && user.id !== group.Organizer?.id) {
        joinButton = (
            <button id="join-group" onClick={handleJoin}>Join this group</button>
        );
    }

    let organizerButtons = null;
    if(user && user.id === group.Organizer?.id) {
        organizerButtons = (
            <div id="organizer-buttons">
                <Link to={`/groups/${groupId}/new-event`}><button>Create Event</button></Link>
                <Link to={`/groups/${groupId}/update`}><button>Update</button></Link>
                <OpenModalButton
                    buttonText="Delete"
                    onButtonClick={closeMenu}
                    modalComponent={<DeleteGroupModal groupId={groupId}/>}
                />
            </div>
        )
    }

    let groupPage = (<h3 className="loading">Loading ....</h3>);

    if(group && +groupId === group?.id) {
        groupPage = (
            <div id="group-page">
                <div id="group-display">
                    <div className="group-img-div-large">
                        <Link to ="/groups">{"< Groups"}</Link>
                        {previewImage ? <img src={previewUrl} id="group-preview-img" alt="preview img"/> : <p id="group-preview-img">No preview image available</p>}
                    </div>
                    <div id="group-info">
                        <div>
                            <h3 id="group-name">{group.name}</h3>
                            <div id="group-info-smaller">
                                <p id="group-location">{group.city}, {group.state}</p>
                                <div className="num-private-group">
                                    <p>{group.numMembers} members</p>
                                    <i className="fa-solid fa-circle"></i>
                                    <p>{group.private ? 'Private' : 'Public'}</p>
                                </div>
                                {group.Organizer ? <p id="group-organizer">Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p> : <p id="group-organizer">No group organizer</p>}
                            </div>
                        </div>
                        {joinButton}
                        {organizerButtons}
                    </div>
                </div>
                <div id="group-events-display">
                    <div>
                        <h3>Organizer</h3>
                        {group.Organizer ? <p>{group.Organizer.firstName} {group.Organizer.lastName}</p> : "No group organizer"}
                    </div>
                    <div>
                        <h3>What we're about</h3>
                        <p>{group.about}</p>
                    </div>
                    <div>
                        <GroupEvents groupId={groupId}/>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {groupPage}
        </>
    )
}
