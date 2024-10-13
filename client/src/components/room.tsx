import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from '../socket/socketContext.ts';

const Room = () => {
  const { roomId } = useParams(); // Get the roomId from the URL
  const [players, setPlayers] = useState<{ username: string; id: string }[]>([]);
  const [host, setHost] = useState<string>("");

  useEffect(() => {
    // Listen for playersUpdate event
    socket.on("playersUpdate", (playersList) => {
      setPlayers(playersList);
      if (playersList.length > 0) {
        setHost(playersList[0].username); // First player in the list is the host
      }
    });

    return () => {
      socket.off("playersUpdate");
    };
  }, []);

  return (
    <div className="flex flex-col items-center my-4">
      <h1 className="text-2xl font-bold">Room ID: {roomId}</h1>
      <h2 className="text-xl">Host: {host}</h2>
      <div className="relative flex justify-center items-center w-72 h-72 border-2 border-gray-300 rounded-full">
        {players.map((player, index) => (
          <div
            key={index}
            className={`absolute w-12 h-12 flex justify-center items-center rounded-full bg-blue-300 transition-transform duration-300 ${player.username === host ? "bg-yellow-300" : ""}`}
            style={{
              transform: `rotate(${(index * 360) / players.length}deg) translate(90px) rotate(${-(index * 360) / players.length}deg)`
            }}
          >
            {player.username} {player.username === host ? "(Host)" : ""}
          </div>
        ))}
      </div>
      <p className="mt-2">{players.length} / 6 players joined.</p>
      {players.length < 2 && <p className="text-red-500">Waiting for more players...</p>}
    </div>
  );
};

export default Room;
