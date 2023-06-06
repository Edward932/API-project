import { Link } from 'react-router-dom'
import './GroupCard.css'

export default function GroupCard({ group }) {
    //console.log('group in GroupCard componenent', group)

    return (
        <Link to={`/groups/${group.id}`} className="group-card">
            <div className="group-img-div">
                {group.previewImage === "No preview image for group" ? 'No preview image for group' : <img className="group-img" src={group.previewImage} />}
            </div>
            <div>
                <h3>{group.name}</h3>
                <p>{group.city}, {group.state}</p>
                <p>{group.about}</p>
                <div className="num-private">
                    <p>{group.numMembers} members</p>
                    <i className="fa-solid fa-circle"></i>
                    <p>{group.private ? 'Private' : 'Public'}</p>
                </div>
            </div>
        </Link>
    )
}
