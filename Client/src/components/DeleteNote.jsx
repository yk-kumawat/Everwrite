import React from "react";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const DeleteNote = ({ title, onDelete }) => {
  const handleDelete = async () => {
    const email = localStorage.getItem("userEmail"); // Retrieve email from local storage

    if (!email) {
      console.error("User email not found in local storage.");
      return;
    }

    try {
      await axios.delete(`http://127.0.0.1:8000/notes/deleteNote`, {
        data: { email, title }, // Pass email and title in request body
      });
      onDelete(title); // Update the UI after successful deletion
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <Button
      variant="outlined"
      color="error"
      onClick={handleDelete}
      sx={{
        position: "absolute",
        right: "0px",
        minWidth: "unset",
        width: "20px",
        height: "40px",
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <DeleteIcon sx={{ fontSize: 18 }} />
    </Button>
  );
};

export default DeleteNote;
