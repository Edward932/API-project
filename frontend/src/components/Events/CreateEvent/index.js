import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { createEventThunk } from "../../../store/events";
import './CreateEvent.css'
import { getGroupByIdThunk } from "../../../store/groups";

export default function CreateEvent() {
    const dispatch = useDispatch();
    const history = useHistory();
    const { groupId } = useParams();
    const group = useSelector(state => state.groups.singleGroup);


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
        const start = new Date(startDate);
        const end = new Date(endDate);
        if(start > end) errors.endDate = "End date must be after start date";
        if(!imgUrl) errors.imgUrl = "Image URL is requried";
        if(imgUrl && !imgUrl.endsWith('.png') && !imgUrl.endsWith('.jpg') && !imgUrl.endsWith('.jpeg')) errors.imgUrl = "Image URL must end in .png, .jpg or .jpeg";
        if(description.length < 30) errors.description = "Description must be at least 30 charecters";

        if(Object.values(errors).length) {
            setValidationErrors(errors);
            return;
        }

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
            const data = await e.json();
            setValidationErrors(data.errors);
        }
    };

    useEffect(() => {
        dispatch(getGroupByIdThunk(groupId));
    }, [dispatch, groupId]);

    return (
        <div id="create-event-div">
            <h1 id="event-form-title">Create a new event for {group?.name}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>What is the name of your event</p>
                    <input
                        className="wide-label"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Event Name"
                        maxLength={250}
                    />
                    <p className="validation-errors">{validationErors.name}</p>
                </label>
                <label>
                    <p className="grey-bar-event">Is this an in person or an online event?</p>
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
                        max={1000}
                        value={price}
                        step={0.01}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <p className="validation-errors">{validationErors.price}</p>
                </label>
                <label>
                    <p className="grey-bar-event">When does your event start?</p>
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min="2023-01-01T00:00"
                        max="2050-01-01T00:00"
                    />
                    <p className="validation-errors">{validationErors.startDate}</p>
                </label>
                <label>
                    <p>When does your event end?</p>
                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min="2023-01-01T00:00"
                        max="2050-01-01T00:00"
                    />
                    <p className="validation-errors">{validationErors.endDate}</p>
                </label>
                <label>
                    <p className="grey-bar-event">Please add an image url for your event below</p>
                    <input
                        className="wide-label"
                        placeholder="Image URL"
                        value={imgUrl}
                        onChange={(e) => setImgUrl(e.target.value)}
                        maxLength={250}
                    />
                    <p className="validation-errors">{validationErors.imgUrl}</p>
                </label>
                <label className="grey-bar-event">
                    <p>Please describe your event</p>
                    <textarea
                        placeholder="Please provide at least 30 charecters"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        maxLength={2000}
                    />
                    <p className="validation-errors">{validationErors.description}</p>
                </label>
                <button id="event-form-button">Create Event</button>
            </form>
        </div>
    )
}
