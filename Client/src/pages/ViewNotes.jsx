import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import CreateNotes from "./CreateNotes";

export default function ViewNote() {
  const { title } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    if (email) {
      fetchNote(email, title);
    }
  }, [title]);

  const fetchNote = async (email, title) => {
    try {
      const response = await axios.get(`https://py.inventorysolutions.in/notes/getNotes?email=${email}`);
      const foundNote = response.data.notes.find((note) => note.title === title);
      setNote(foundNote || null);
    } catch (error) {
      console.error("Error fetching note:", error);
    }
  };

  return (
    <Box sx={{ width: "100%", p: "0px" }}>
      <CreateNotes note={note} />
    </Box>
  );
}
