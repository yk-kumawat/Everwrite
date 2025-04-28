import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import axios from "axios";
import DeleteNote from "../components/DeleteNote";
import Button from "@mui/material/Button";
import IosShareIcon from "@mui/icons-material/IosShare";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ViewNotes from "./ViewNotes";
import jsPDF from "jspdf";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "start",
  display: "grid",
  color: "white",
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function MyNotes() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail"); // Get user email from storage
    if (email) {
      fetchNotes(email);
    }
  }, []);

  const fetchNotes = async (email) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/notes/getNotes?email=${email}`);
      setNotes(response.data.notes); // Store fetched notes
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleView = (title) => {
    navigate(`/allNotes/${encodeURIComponent(title)}`);
  };

  const handleBack = () => {
    setSelectedNote(null);
  };

  const handleDelete = (title) => {
    setNotes(notes.filter((note) => note.title !== title));
  };

  const handleDownloadPDF = async (noteData) => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(noteData.title, 10, 10);
    pdf.setFontSize(12);
    let y = 20;
  
    for (const element of noteData.elements) {
      if (element.type === "page") {
        // Add text content
        const lines = pdf.splitTextToSize(element.content || "", 180);
        lines.forEach((line) => {
          if (y > 280) {
            pdf.addPage();
            y = 10;
          }
          pdf.text(line, 10, y);
          y += 8;
        });
      } else if (element.type === "canvas") {
        // Locate the canvas
        const canvas = document.getElementById(`canvas-${element.id}`);
        if (canvas) {
          await new Promise((resolve) => setTimeout(resolve, 500)); // Ensure canvas is loaded
          const imgData = canvas.toDataURL("image/png");
  
          if (y > 220) {
            pdf.addPage();
            y = 10;
          }
  
          pdf.addImage(imgData, "PNG", 10, y, 180, 80);
          y += 90;
        }
      }
    }
  
    pdf.save(`${noteData.title}.pdf`);
  };
  
  const handleShare = (title) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check this out!',
        text: 'Here is something interesting for you!',
        url: window.location.href + `/` + title, // Or any specific URL
      })
        .then(() => console.log('Content shared successfully!'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Sharing not supported on this browser.');
    }
  };

  return (
    <Box sx={{ width: "100%", p: "50px" }}>
      {selectedNote ? (
        <>
          <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
            Back to Notes
          </Button>
          <ViewNotes note={selectedNote} />
        </>
      ) : (
        <>
          <p className="text-4xl mb-5 text-[#90caf9]">All Notes</p>
          <div className="flex flex-row flex-wrap gap-13">
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <Item
                  className="h-100 w-[330px] text-2xl hover:border-1 border-white"
                  key={index}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex flex-col text-2xl relative">
                    {note.title}
                    {hoveredIndex === index && (
                      <DeleteNote title={note.title} onDelete={handleDelete} />
                    )}
                    <Button
                      sx={{ mt: 3, height: "230px" }}
                      variant="outlined"
                      onClick={() => handleView(note.title)}
                    >
                      <RemoveRedEyeIcon sx={{ fontSize: 20, mr: 1 }} />
                      View
                    </Button>
                    <Button
                      sx={{
                        position: "absolute",
                        right: "0px",
                        bottom: "0px",
                      }}
                      variant="contained"
                      onClick={() => handleShare(note.title)}
                    >
                      <IosShareIcon sx={{ fontSize: 20, mr: 1 }} />
                      Share
                    </Button>
                    <Button
                      sx={{
                        position: "absolute",
                        left: "0px",
                        bottom: "0px",
                      }}
                      variant="outlined"
                      onClick={() => handleDownloadPDF(note)} // Download button
                    >
                      <DownloadIcon sx={{ fontSize: 20, mr: 1 }} />
                      Download
                    </Button>
                  </div>
                </Item>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center w-full mt-30">
                <img src="empty-box.png" className="h-50 w-50 mb-10" />
                <p className="text-2xl">No notes found</p>
              </div>
            )}
          </div>
        </>
      )}
    </Box>
  );
}
