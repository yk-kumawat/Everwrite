import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LogoutIcon from '@mui/icons-material/Logout';
import CreateNotes from "../pages/CreateNotes";
import CollabClients from "./CollabClients";
import { initSocket } from "../socket";
import {
  useNavigate,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";
import toast from "react-hot-toast";

const Room = () => {
  const [clients, setClients] = useState([]);
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomID } = useParams();
  const navigate = useNavigate();
  console.log("Room ID:", roomID);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleError(err));
      socketRef.current.on("connect_failed", (err) => handleError(err));
      const handleError = (e) => {
        console.log("Socket Error : ", e);
        navigate("/");
      };
      socketRef.current.emit("join", {
        roomID,
        nickname: location.state?.nickname,
      });
      socketRef.current.on("joined", ({ clients, nickname, socketID }) => {
        if (nickname !== location.state?.nickname) {
          toast.success(`${nickname} joined`);
        }
        setClients(clients);
      });
      socketRef.current.on("disconnected", ({ socketID, nickname }) => {
        toast.error(`${nickname} left!`);
        setClients((prev) => {
          return prev.filter((client) => client.socketID != socketID);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off('joined');
      socketRef.current.off('disconnected');
    }
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomID);
    toast.success("Room ID copied to clipboard!");
  };
  const leaveRoom = () => {
    socketRef.current.disconnect();
    navigate("/collab");
    toast.success("You Left!");
  }

  return (
    <div className="w-[100%]">
      <div className="flex ml-8 mt-8 h-[100px] w-[94.5%] border rounded">
        <div className="w-[90%] h-[100px] p-3 flex gap-3 items-center">
          {clients.map((clients) => (
            <CollabClients
              socketID={clients.socketID}
              username={clients.nickname}
            />
          ))}
        </div>
        <div className="flex flex-col gap-3 justify-center items-center h-full w-[10%]">
          <Button onClick={copyRoomId} variant="contained"><ContentCopyIcon sx={{ fontSize: 18 }} /></Button>
          <Button onClick={leaveRoom} variant="outlined"><LogoutIcon sx={{ fontSize: 18 }} /></Button>
        </div>
      </div>
      <CreateNotes socket={socketRef.current} roomID={roomID} />
    </div>
  );
};

export default Room;
