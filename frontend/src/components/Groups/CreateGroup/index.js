import { useState } from 'react';

export default function CreateGroup() {
    const [cityState, setCityState] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [privateBoolean, setPrivateBoolean] = useState('');
    //const [imgURL, setImgURL] = useState('');

    const handleSubmit = e => {
        e.preventDefault();
    }

    return (
        <div>
            <h1>Start a new group</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <h3>Set your group's location.</h3>
                    <p>Meetup groups meet locally, in person and online. We'll connect you with people in your area.</p>
                    <input
                        placeholder="City, STATE"
                        value={cityState}
                        onChange={(e) => setCityState(e.target.value)}
                        />
                </label>
                <label>
                    <h3>What will your group's name be?</h3>
                    <p>Choose a name that will give peopoe a clear idea of what the group is abouts. Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input
                        placeholder="What is your groups's name ?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <label>
                    <h3>Describe the purpose of your group</h3>
                    <p>People wil see this when we promote your group, but you'll be able to add to it later, too.</p>
                    <ol>
                        <li>What's the purpose of the group?</li>
                        <li>Who should join?</li>
                        <li>What will you do at your events?</li>
                    </ol>
                    <textarea
                        placeholder="Please write at least 30 characters"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                </label>
                <h3>Final Steps</h3>
                <label>
                    <p>Is this an in person or online group?</p>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option>Select one</option>
                        <option>In person</option>
                        <option>Online</option>
                    </select>
                </label>
                <label>
                    <p>Is this group public or private?</p>
                    <select
                        value={privateBoolean}
                        onChange={(e) => setPrivateBoolean(e.target.value)}
                    >
                        <option>Select one</option>
                        <option>Public</option>
                        <option>Private</option>
                    </select>
                </label>
                <label>
                    <p>Please add an image url for your group below</p>
                    <input placeholder="image URL"/>
                </label>
                <button type="submit">Create group</button>
            </form>
        </div>
    )
}
