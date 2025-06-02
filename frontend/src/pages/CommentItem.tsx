
import {useEffect, useState} from "react";
import {fetchUsername} from "../services/api.ts";

export default function CommentItem({ comment, showDelete, onDelete }) {
    const inputDate = comment.sent_at;
    const date = new Date(inputDate as string);
    const dateString = date.toLocaleDateString();

    const [username, setUsername] = useState("");

    const getUser = async () => {
        const username = await fetchUsername(comment.announcementId);
        setUsername(username.data.username);
    }

    useEffect(() => {
        getUser();
    }, [])

    return (
        <div className="p-2 m-2 min-w-fit bg-gradient-to-br from-whiteGradientStart to-whiteGradientEnd text-blue placeholder-gray rounded-2xl">
            <div className="flex justify-between text-sm text-gray-600">
                <span>{username}</span>
                <span>{dateString}</span>
            </div>
            <p className="text-blue">{comment.content}</p>
        </div>
    );
}
