import React from "react";

interface DeleteModalProps {
    setDeleteConfirm: React.Dispatch<React.SetStateAction<boolean>>;
    handleDelete: () => void;
  }

const DeleteModal: React.FC<DeleteModalProps> = ({setDeleteConfirm, handleDelete})=> {

    return(
        <>
            <div className="blur-background" />
            <div className="delete-modal-wrapper">
                <div>Are you sure you want to delete this item?</div>
                <div className="delete-confirm-buttons">
                <button onClick={()=> setDeleteConfirm(false)}>RETURN</button>
                <button onClick={handleDelete}>Yes</button>
                </div>
            </div>
        </>
    )
};

export default DeleteModal;