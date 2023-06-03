import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from "react";
import { getGroupByIdThunk } from "../../../store/groups";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import './GroupPage.css'

export default function GroupPage() {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.singleGroup);
    const previewImage = group?.GroupImages.find(image => image.preview === true);
    const previewUrl = previewImage?.url;

    //console.log(group)

    useEffect(() => {
        dispatch(getGroupByIdThunk(groupId))
    }, [dispatch]);

    let groupPage = (<h3 className="loading">Loading ....</h3>);

    if(group) {
        groupPage = (
            <div id="group-page">
                <div id="group-display">
                    <div className="group-img-div-large">
                        <Link to ="/groups">{"< Groups"}</Link>
                        {previewImage ? <img src={previewUrl} id="group-preview-img" alt="preview img"/> : <p id="group-preview-img">No preview image available</p>}
                    </div>
                    <div>
                        <div>
                            <h3>{group.name}</h3>
                            <p>{group.city}, {group.state}</p>
                            <div className="num-private">
                                <p>ADD NUMBER OF EVENTS</p>
                                <i className="fa-solid fa-circle"></i>
                                <p>{group.private ? 'Private' : 'Public'}</p>
                            </div>
                            {group.Organizer ? <p>Organized by {group.Organizer.firstName} {group.Organizer.lastName}</p> : "No group organizer"}
                        </div>
                        <button>Join this group</button>
                    </div>
                </div>
                <div id="group-events-display">
                    <div>
                        <h3>Organizer</h3>
                        {group.Organizer ? <p>{group.Organizer.firstName} {group.Organizer.lastName}</p> : "No group organizer"}
                    </div>
                    <div>
                        <h3>Whate we're about</h3>
                        <p>{group.about}</p>
                    </div>
                    <div>
                        ADD EVENT PART !!!!!!!!
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
