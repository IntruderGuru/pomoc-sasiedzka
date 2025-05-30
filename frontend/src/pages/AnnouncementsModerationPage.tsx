import { useEffect, useState } from "react";
import { fetchAnnouncementsMod } from "../services/AdminService";
import { Spinner } from "../components/Spinner.tsx";

export const AnnouncementsModerationPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadAnnouncements = async () => {
        const _announcements = await fetchAnnouncementsMod();
        setAnnouncements(_announcements.data);
        setLoading(false);
    }

    useEffect(() => {
        loadAnnouncements();
    }, []);

    // const handleAction = async (id, approved) => {
    //     if (approved) {
    //         await AdminService.approveAnnouncement(id);
    //         Toast.success("Announcement approved");
    //     } else {
    //         await AdminService.rejectAnnouncement(id);
    //         Toast.success("Announcement rejected");
    //     }
    //     setAnnouncements(prev => prev.filter(a => a.id !== id));
    // };

    if (loading) return <Spinner />;

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Moderate Announcements</h1>

            <table className="w-full bg-white shadow rounded">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {announcements.map((a) => (
                        <tr key={a.id} className="border-t">
                            <td>{a.title}</td>
                            <td>{a.author}</td>
                            <td>{new Date(a.date).toLocaleDateString()}</td>
                            {/* <td>
                                <button
                                    onClick={() => handleAction(a.id, true)}
                                    className="text-green-600 mr-2"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(a.id, false)}
                                    className="text-red-600"
                                >
                                    Reject
                                </button>
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
