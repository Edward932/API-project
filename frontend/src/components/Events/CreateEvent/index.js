import { useState } from "react"

export default function CreateEvent() {
    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [privateBoolean, setPrivateBoolean] = useState('');
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();
    }

    return (
        <div>
            <h1>Create a new event for (GROUP NAME)</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>What is the namae of your event</p>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Event Name"
                    />
                </label>
                <label>
                    <p>Is this an in person or an online event?</p>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Select one</option>
                        <option value="In person">In person</option>
                        <option value="Online">Online</option>
                    </select>
                </label>
                <label>
                    <p>Is this event private or public?</p>
                    <select
                        value={privateBoolean}
                        onChange={(e) => setPrivateBoolean(e.target.value)}
                    >
                        <option value="">Select One</option>
                        <option value="false">Public</option>
                        <option value="true">Private</option>
                    </select>
                </label>
                <label>
                    <p>What is the price of your event?</p>
                    <input
                        type="number"
                        min={0}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </label>
                <label>
                    <p>When does your event start?</p>
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>
                <label>
                    <p>When does your event end?</p>
                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
                <label>
                    <p>Please add an image url for your event below</p>
                    <input
                        placeholder="Image URL"
                        value={imgUrl}
                        onChange={(e) => setImgUrl(e.target.value)}
                    />
                </label>
                <label>
                    <p>Please describe your event</p>
                    <textarea
                        placeholder="Please provide at least 30 charecters"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
                <button>Create Event</button>
            </form>
        </div>
    )
}
