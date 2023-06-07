import { useState } from "react";
import { useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { createEventThunk } from "../../../store/events";
import './CreateEvent.css'

export default function CreateEvent() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { groupId } = useParams();

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [privateBoolean, setPrivateBoolean] = useState('');
    const [price, setPrice] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [description, setDescription] = useState('');
    const [validationErors, setValidationErrors] = useState({});

    const handleSubmit = async e => {
        e.preventDefault();

        // handle errors
        const errors = {};
        if(name.length < 5) errors.name = "Name must be at least 5 charecters";
        if(!type) errors.type = "Type is required";
        if(!privateBoolean) errors.private = "Private or public is required";
        // what to do about price ?
        if(!startDate) errors.startDate = "Start date is required";
        if(!endDate) errors.endDate = "End date is required";
        if(!imgUrl) errors.imgUrl = "Image URL is requried";
        if(imgUrl && !imgUrl.endsWith('.png') && !imgUrl.endsWith('.jpg') && !imgUrl.endsWith('.jpeg')) errors.imgUrl = "Image URL must end in .png, .jpg or .jpeg";
        if(description.length < 30) errors.description = "Description must be at least 30 charecters";

        if(Object.values(errors).length) {
            setValidationErrors(errors);
            return;
        }

        // make payload
        const payload = {
            name,
            type,
            private: privateBoolean,
            price,
            startDate,
            endDate,
            description
        }

        let event;
        try {
            event = await dispatch(createEventThunk(payload, groupId, imgUrl));

            history.push(`/events/${event.id}`);
        } catch(e) {
            setValidationErrors(e);
            console.log(e);
        }


        // try catch group dispatch
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
                    <p className="validation-errors">{validationErors.name}</p>
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
                    <p className="validation-errors">{validationErors.type}</p>
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
                    <p className="validation-errors">{validationErors.private}</p>
                </label>
                <label>
                    <p>What is the price of your event?</p>
                    <input
                        type="number"
                        min={0}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <p className="validation-errors">{validationErors.price}</p>
                </label>
                <label>
                    <p>When does your event start?</p>
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <p className="validation-errors">{validationErors.startDate}</p>
                </label>
                <label>
                    <p>When does your event end?</p>
                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    <p className="validation-errors">{validationErors.endDate}</p>
                </label>
                <label>
                    <p>Please add an image url for your event below</p>
                    <input
                        placeholder="Image URL"
                        value={imgUrl}
                        onChange={(e) => setImgUrl(e.target.value)}
                    />
                    <p className="validation-errors">{validationErors.imgUrl}</p>
                </label>
                <label>
                    <p>Please describe your event</p>
                    <textarea
                        placeholder="Please provide at least 30 charecters"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <p className="validation-errors">{validationErors.description}</p>
                </label>
                <button>Create Event</button>
            </form>
        </div>
    )
}
