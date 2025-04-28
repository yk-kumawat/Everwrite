import React from "react";
import { useNavigate } from "react-router-dom";
import CreateIcon from '@mui/icons-material/Create';
import FolderIcon from '@mui/icons-material/Folder';
import Groups3Icon from '@mui/icons-material/Groups3';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col py-10 px-20 w-[100%] h-[710px] items-center">
      <div className="flex flex-col items-center p-10 mb-10">
        <h1 className="text-6xl mb-5 font-semibold tracking-wide">
          Welcome to <span className="text-blue-400">Everwrite</span>
        </h1>
        <p className="italic">What do you want to do today?</p>
      </div>
      <div className="flex items-center justify-between w-[100%]">
        <div className="border p-9 h-[300px] w-[300px] rounded flex flex-col justify-center items-center gap-3 bg-[#1e1e1e] transition-transform duration-300 transform hover:scale-105 hover:shadow-[5px_5px_20px_#3b82f6] cursor-pointer" onClick={() => navigate('/newNote')}>
          <CreateIcon sx={{ fontSize: 40, color: '#52a1f8' }} />
          <p className="text-[20px]">Create New Note</p>
          <p className="text-[15px] italic text-gray-400">Start writing a fresh note instantly. Capture your thoughts, ideas, or plans with ease.</p>
        </div>
        <div className="border p-9 h-[300px] w-[300px] rounded flex flex-col justify-center items-center gap-3 bg-[#1e1e1e] transition-transform duration-300 transform hover:scale-105 hover:shadow-[5px_5px_20px_#3b82f6] cursor-pointer" onClick={() => navigate('/allNotes')}>
          <FolderIcon sx={{ fontSize: 42, color: '#52a1f8' }} />
          <p className="text-[20px]">View My Notes</p>
          <p className="text-[15px] italic text-gray-400">Browse and manage all your saved notes in one place. Edit, organize, or delete as needed.</p>
        </div>
        <div className="border p-8 h-[300px] w-[300px] rounded flex flex-col justify-center items-center gap-3 bg-[#1e1e1e] transition-transform duration-300 transform hover:scale-105 hover:shadow-[4px_4px_20px_#3b82f6] cursor-pointer" onClick={() => navigate('/collab')}>
          <Groups3Icon sx={{ fontSize: 45, color: '#52a1f8' }} />
          <p className="text-[20px]">Collaborate with Friends</p>
          <p className="text-[15px] italic text-gray-400">Share your notes and work together in real-time. Collaborate, brainstorm, and create better.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
