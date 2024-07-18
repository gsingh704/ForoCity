import { Link } from "@inertiajs/react";
import { useState } from "react";
import { FaUser, FaEdit } from "react-icons/fa";
import SubscribeButton from "./SubscribeButton";
import DeleteButton from "../DeleteButton";

export default function ListHub({ hubs, auth, listName }) {
    const [hubList, setHubList] = useState(hubs);
    const handleSubscribe = (hubId, newSubscribed) => {
        setHubList(
            hubList.map((hub) => {
                if (hub.id === hubId) {
                    return { ...hub, isSubscribed: newSubscribed };
                }
                return hub;
            })
        );
    };

    // Remove hub from list if it is unsubscribed from My Hubs
    const removeHubFromList = (hubId) => {
        setHubList(hubList.filter((hub) => hub.id !== hubId));
    };

    const handleDeleteHub = () => {
        //reload the page
        window.location.reload();
    };

    return (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto my-4">
            {hubList.length === 0 && (
                <div className="text-blue-800 text-lg font-semibold flex flex-col space-y-2 justify-center items-center p-8">
                    No Hubs, Try to create a new Hub or subscribe to a Hub
                </div>
            )}

            {hubList.map((hub) => (
                <div
                    key={hub.id}
                    className={`bg-white rounded-lg border-2 p-6 flex flex-row items-center gap-6`}
                    style={{
                        borderColor: hub.color,
                        // Apply box-shadow with custom color
                        //boxShadow: `0 4px 8px 0 ${hub.color}33, 0 6px 20px 0 ${hub.color}1A`, // Adjust the shadow's spread and blur as needed
                    }}
                >
                    <div className="flex flex-col items-center gap-2">
                        <SubscribeButton
                            isSubscribed={hub.isSubscribed}
                            hubId={hub.id}
                            auth={auth}
                            onSubscribeChange={handleSubscribe}
                            listName={listName}
                            removeHubFromList={removeHubFromList}
                        />
                        {/* user count  */}
                        <div className=" bg-white flex  gap-1 text-blue-900 hover:text-white hover:bg-blue-900 rounded-md p-2 h-10 w-10 justify-center items-center border border-blue-900 transition duration-300">
                            {hub.user_count} <FaUser />
                        </div>
                    </div>
                    <img
                        src={hub.image_url}
                        alt="hub image"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex flex-col gap-1 justify-center w-full">
                        <div className="flex flex-row justify-between items-center">
                            <Link
                                href={route("hub.show", hub.name)}
                                className="text-xl font-semibold text-blue-800 hover:text-blue-800 transition duration-300"
                            >
                                h/{hub.name}
                            </Link>
                            {auth.user?.id === hub.user_id ||
                            auth.user?.is_admin ? (
                                <div className="flex flex-row gap-2 text-2xl">
                                    <Link
                                        href={route("hub.edit", hub.name)}
                                        className="text-blue-900 hover:text-blue-900 transition duration-300"
                                        aria-label="Edit"
                                    >
                                        <FaEdit />
                                    </Link>
                                    <DeleteButton
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex flex-row items-center gap-2 text-lg"
                                        onDelete={handleDeleteHub}
                                        itemId={hub.id}
                                        userId={hub.user_id}
                                        itemType={"hub"}
                                    >
                                        Delete
                                    </DeleteButton>
                                </div>
                            ) : null}
                        </div>
                        <p className="text-base text-gray-500 mt-1">
                            {hub.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
