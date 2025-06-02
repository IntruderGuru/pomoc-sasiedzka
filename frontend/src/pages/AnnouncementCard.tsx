import {getuserId, fetchUsername} from "../services/api.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";


export default function AnnouncementCard({ a, handleDelete }) {
    const loggeduserId = getuserId();
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const inputDate = a.createdAt;
    const date = new Date(inputDate as string);
    const dateString = date.toLocaleDateString();

    const getUser = async () => {
        const username = await fetchUsername(a.userId);
        setUsername(username.data.username);
    }

    useEffect(() => {
        getUser();
    }, [])



    return (
      <div className="p-2 m-2 min-w-3/12 max-h-fit bg-gradient-to-br from-whiteGradientStart to-whiteGradientEnd text-blue placeholder-gray rounded-2xl">
          <div className="px-4 py-2 m-2 max-h-fit bg-gradient-to-br from-blueGradientStart to-blueGradientEnd text-white placeholder-gray rounded-2xl">
              <p>{username} ({dateString})</p>
              <p>{a.category}-{a.type}</p>
          </div>
          <h3 className="font-bold text-xl">{a.title}</h3>
          <p className="overflow-auto">{a.content}</p>

          {a.userId == loggeduserId && (
              <>
                  <button className="font-bold px-4 m-2 py-2 rounded-2xl bg-red-600 text-white" onClick={(e) => {e.stopPropagation();handleDelete();}}>Usuń</button>
                  <button className="font-bold px-4 py-2 rounded-2xl bg-gradient-to-br from-pinkGradientStart to-pinkGradientEnd text-blue" onClick={(e) => {e.stopPropagation();navigate(`/announcements/${a.id}`);}}>Edytuj</button>
              </>
          )}
      </div>
    );
}