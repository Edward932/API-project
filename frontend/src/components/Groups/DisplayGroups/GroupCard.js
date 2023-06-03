import './GroupCard.css'

export default function GroupCard({ group }) {
    console.log('group in GroupCard componenent', group)

    return (
        <div className="group-card">
            <div className="group-img-div">
                <p>place holder img</p>
                <img className="group-img" src={group.previewImg} />
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
    )
}
