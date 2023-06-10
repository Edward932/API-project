import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal"
import { useHistory } from "react-router-dom";
import { deleteEventThunk } from "../../../store/events";

export default function DeleteEventModal({ eventId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleDelete = async() => {
        const res = await dispatch(deleteEventThunk(eventId));

        if(res.message === "Successfully deleted") {
            closeModal();
            return history.push('/events');
        } else {
            alert(res.message)
        }
    }

    return (
        <div id="delete-group-modal">
            <h2 id="confirm-text">Confirm Delete</h2>
            <p id="are-you-sure">Are you sure you want to remove this event?</p>
            <div id="delete-group-button-div">
                <button id="delete-button" onClick={handleDelete}>Yes (Confirm Delete)</button>
                <button id="not-delete-button" onClick={closeModal}>No (Keep Event)</button>
            </div>
        </div>
    )
}
