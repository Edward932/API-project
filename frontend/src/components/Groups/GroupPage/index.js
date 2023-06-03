import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import GroupCard from "../DisplayGroups/GroupCard";
import { useEffect } from "react";
import { getGroupByIdThunk } from "../../../store/groups";

export default function GroupPage() {
    const { groupId } = useParams();
    const dispatch = useDispatch();
    const group = useSelector(state => state.groups.singleGroup);

    useEffect(() => {
        dispatch(getGroupByIdThunk(groupId))
    }, [dispatch]);

    let groupPage = (<h3 className="loading">Loading ....</h3>);

    if(group) {
        groupPage = (
            <div id="group-page">
                <div id="group-display">
                    <div className="group-img-div">
                        {group.previewImage === "No preview image for group" ? 'No preview image for group' : <img className="group-img" src={group.previewImage} />}
                    </div>
                    <div>
                        <h3>{group.name}</h3>
                        <p>{group.city}, {group.state}</p>
                        <p>{group.about}</p>
                        <div className="num-private">
                            <p>ADD NUMBER OF EVENTS</p>
                            <i className="fa-solid fa-circle"></i>
                            <p>{group.private ? 'Private' : 'Public'}</p>
                        </div>
                    </div>
                </div>
            <div id="group-events-display">
                ADD EVENTS PART
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
