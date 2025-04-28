import React from "react";

const CollabClients = ({ socketID, username }) => {

  const capitalizeFirstLetter = (username) => {
    if (!username) return '';
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className="h-[100%] w-[200px] flex gap-3 items-center">
      <div className="h-[65px] w-[65px] bg-blue-400 rounded flex justify-center items-center text-3xl font-semibold">{capitalizeFirstLetter(username)}</div>
      <div className="text-2xl">{username}</div>
    </div>
  );
};

export default CollabClients;
