import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteGroupThunk } from "../../../store/groups";
import { useHistory } from "react-router-dom";

export default function DeleteGroupModal({ groupId }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleDelete = async() => {
        const res = await dispatch(deleteGroupThunk(groupId));

        if(res.message === "Successfully deleted") {
            closeModal()
            return history.push('/groups');
        } else {
            alert(res.message);
        }
    }

    return (
        <div id="delete-group-modal">
            <h2 id="confirm-text">Confirm Delete</h2>
            <p id="are-you-sure">Are you sure you want to remove this group?</p>
            <div id="delete-group-button-div">
                <button id="delete-button" onClick={handleDelete}>Yes (Confirm Delete)</button>
                <button id="not-delete-button" onClick={closeModal}>No (Keep Group)</button>
            </div>
        </div>
    )
}
