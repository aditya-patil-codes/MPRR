import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; 
import socket from '../socket/socketContext.ts';

const avatars = [
  "../assets/avatars/player0.png",
  "../assets/avatars/player1.png",
  "../assets/avatars/player2.png",
  "../assets/avatars/player3.png",
  "../assets/avatars/player4.png",
];

const UserForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);
  const navigate = useNavigate(); // React Router's navigate function

  useEffect(() => {
    // Listen for room creation
    socket.on("roomCreated", (roomId) => {
      toast.success(`Room created with ID: ${roomId}`);
      navigate(`/${roomId}`); // Redirect to /roomId
    });

    socket.on("userJoined", (message) => {
      toast.info(message);
    });

    socket.on("error", (message) => {
      toast.error(message); // Display error messages
    });

    return () => {
      socket.off("roomCreated");
      socket.off("userJoined");
      socket.off("error"); // Cleanup the error listener
    };
  }, [navigate]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setRoomId("");
  };

  const handleRoomIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomId(e.target.value);
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleCreateRoom = (): void => {
    if (!username) {
      toast.error("Please enter a username.");
      return;
    }
    // Emit the createRoom event with the username
    socket.emit("createRoom", { username });
  };

  const handleJoinRoom = (): void => {
    if (!username) {
      toast.error("Please enter a username.");
      return;
    }
    if (!roomId) {
      toast.error("Please enter a Room ID.");
      return;
    }
    // Emit the joinRoom event with both roomId and username
    socket.emit("joinRoom", { roomId, username });
  };

  const nextAvatar = () => {
    setCurrentAvatarIndex((prevIndex) => (prevIndex + 1) % avatars.length);
  };

  const prevAvatar = () => {
    setCurrentAvatarIndex((prevIndex) => (prevIndex - 1 + avatars.length) % avatars.length);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label className="font-semibold text-lg mt-4 text-gray-700 flex items-center justify-center">
            Select Avatar
          </label>
          <div className="flex items-center justify-center gap-5 py-4">
            <button className="p-2 bg-gray-500 rounded-lg" onClick={prevAvatar}>
              {"<"}
            </button>
            <img
              src={avatars[currentAvatarIndex]}
              alt="Avatar"
              className="h-28 w-28 rounded-full object-cover bg-red-100"
            />
            <button className="p-2 bg-gray-500 rounded-lg" onClick={nextAvatar}>
              {">"}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold text-lg mt-4">Username</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className="mt-1 p-2 border border-gray-300 rounded w-full"
            placeholder="Username"
            required
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleCreateRoom}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Create Room
          </button>
          <button
            onClick={openModal}
            className="bg-green-500 text-white p-2 rounded"
          >
            Join Room
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
              <h2 className="font-semibold text-lg mb-4">Enter Room ID</h2>
              <input
                type="text"
                value={roomId}
                onChange={handleRoomIdChange}
                className="mt-1 p-2 border border-gray-300 rounded w-full"
                placeholder="Room ID"
                required
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={closeModal}
                  className="mr-2 bg-gray-300 text-black p-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinRoom}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default UserForm;
