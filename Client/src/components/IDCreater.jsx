import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

const IDCreater = () => {
  const [roomID, setRoomID] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  const generateRoomID = (e) => {
    e.preventDefault();
    const id = uuid();
    setRoomID(id);
  };

  const joinRoom = () => {
    if(!roomID || !nickname){
      return;
    }
    navigate(`room/${roomID}`, {
      state: {nickname},
    })
  }

  return (
    <div className="flex justify-center mt-25">
      <div className="h-[500px] w-[800px] shadow-2xl bg-[#1e1e1e] rounded-lg flex flex-col items-center p-15">
        <div className="mb-7 text-[20px] text-blue-300">
          Everwrite Collaborate
        </div>
        <h1 className="mb-7 text-3xl">Enter the ROOM ID</h1>
        <div className="flex flex-col gap-5 mb-7">
          <Box sx={{ width: 500, maxWidth: "100%" }}>
            <TextField
              value={roomID}
              onChange={(e) => setRoomID(e.target.value)}
              fullWidth
              label="Room ID"
              id="fullWidth"
            />
          </Box>
          <Box sx={{ width: 500, maxWidth: "100%" }}>
            <TextField
              onChange={(e) => setNickname(e.target.value)}
              fullWidth
              label="Nickname"
              id="fullWidth"
            />
          </Box>
        </div>
        <div className="mb-7">
          <Button onClick={joinRoom} variant="contained">Join</Button>
        </div>
        <div>
          <span>Don't have a Room ID?</span>
          <span>
            {" "}
            Create{" "}
            <a
              onClick={generateRoomID}
              className="text-blue-300 cursor-pointer hover:underline underline-offset-3"
            >
              New Room
            </a>{" "}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IDCreater;
