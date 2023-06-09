import { Link } from 'react-router-dom'
import './GroupCard.css'

export default function GroupCard({ group }) {

    return (
        <Link to={`/groups/${group.id}`} className="group-card">
            <div className="group-img-div">
                {group.previewImage === "No preview image for group" ? 'No preview image for group' : <img className="group-img" src={group.previewImage} alt='previewIMg'/>}
            </div>
            <div className="lower-groups-display">
                <h2 className="groups-titles">{group.name}</h2>
                <p className="groups-location">{group.city}, {group.state}</p>
                <p className="groups-about">{group.about}</p>
                <div className="num-private">
                    <p>{group.numMembers} members</p>
                    <i className="fa-solid fa-circle"></i>
                    <p>{group.private ? 'Private' : 'Public'}</p>
                </div>
            </div>
        </Link>
    )
}
