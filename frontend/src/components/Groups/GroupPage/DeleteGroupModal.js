import { useModal } from "../../../context/Modal";

export default function DeleteGroupModal({ groupId }) {
    const { closeModal } = useModal();

    const handleDelete = async() => {

        return;
    }

    return (
        <div id="delete-group-modal">
            <h2 id="confirm-text">Confirm Delete</h2>
            <p id="are-you-sure">Are you sure you want to remove this group?</p>
            <div id="delete-group-button-div">
                <button id="delete-button" onClick={handleDelete}>Confirm Delete</button>
                <button id="not-delete-button" onClick={closeModal}>No (Keep Group)</button>
            </div>
        </div>
    )
}
