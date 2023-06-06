import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createGroupThunk } from '../../../store/groups';
import './CreateGroup.css'

export default function CreateGroup() {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(state => state.session.user);

    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [type, setType] = useState('');
    const [privateBoolean, setPrivateBoolean] = useState('');
    const [validationErors, setValidationErrors] = useState({});
    const [imgURL, setImgURL] = useState('');

    const handleSubmit = async e => {
        e.preventDefault();

        const errors = {};
        if(!city) errors.city = "City is required";
        if(!state) errors.state = "State is required";
        if(!name) errors.name = "Name is required";
        if(about.length < 50) errors.about = "About must be 50 charectors or more";
        if(privateBoolean === '') errors.privateBoolean = "private or public is required";
        if(!type) errors.type = "Type is required";
        if(!imgURL) errors.imgURL = "Img URL is required";
        if(!imgURL.endsWith('.png') && !imgURL.endsWith('.jpg') && !imgURL.endsWith('.jpeg')) errors.imgURL = "Image URL must end in .png, .jpg or .jpeg";

        if(Object.values(errors).length) {
            setValidationErrors(errors);
            return;
        }

        const payload = {
            name,
            about,
            type,
            private: privateBoolean,
            city,
            state
        }

        let group;
        try{
            group = await dispatch(createGroupThunk(payload, imgURL));

            history.push(`/groups/${group.id}`)
        } catch(e) {
            setValidationErrors(e);
            console.log(validationErors)
        }
    }

    if(!user) {
        setTimeout(() => history.push('/'), 5000);

        return (
            <div>
                <h1>Login in to create group</h1>
                <h3>Redirecting to home page in 5 seconds</h3>
            </div>
        );
    };


    return (
        <div>
            <h1>Start a new group</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <h3>Set your group's location.</h3>
                    <p>Meetup groups meet locally, in person and online. We'll connect you with people in your area.</p>
                    <input
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <p className='errors-group-create'>{validationErors.city}</p>
                    State: <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    >
                        <option value="">Select one</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                    </select>
                    <p className='errors-group-create'>{validationErors.state}</p>
                </label>
                <label>
                    <h3>What will your group's name be?</h3>
                    <p>Choose a name that will give peopoe a clear idea of what the group is abouts. Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input
                        placeholder="What is your groups's name ?"
                        value={name}
                        maxLength={60}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <p className='errors-group-create'>{validationErors.name}</p>
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
                        placeholder="Please write at least 50 characters"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                    />
                    <p className='errors-group-create'>{validationErors.about}</p>
                </label>
                <h3>Final Steps</h3>
                <label>
                    <p>Is this an in person or online group?</p>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Select one</option>
                        <option value="In person">In person</option>
                        <option value="Online">Online</option>
                    </select>
                    <p className='errors-group-create'>{validationErors.type}</p>
                </label>
                <label>
                    <p>Is this group public or private?</p>
                    <select
                        value={privateBoolean}
                        onChange={(e) => setPrivateBoolean(e.target.value)}
                    >
                        <option value="">Select one</option>
                        <option value="false">Public</option>
                        <option value="true">Private</option>
                    </select>
                    <p className='errors-group-create'>{validationErors.privateBoolean}</p>
                </label>
                <label>
                    <p>Please add an image url for your group below</p>
                    <input
                        placeholder="image URL"
                        value={imgURL}
                        onChange={(e) => setImgURL(e.target.value)}
                    />
                    <p className='errors-group-create'>{validationErors.imgURL}</p>
                </label>
                <button type="submit">Create group</button>
            </form>
        </div>
    )
}
