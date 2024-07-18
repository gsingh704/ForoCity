import { useEffect, useState } from "react";
import { FaCheck, FaPlus } from "react-icons/fa";
import LoginFirst from "../LoginFirst";

export default function SubscribeButton({
    hubId,
    isSubscribed,
    auth,
    onSubscribeChange,
    listName,
    removeHubFromList,
}) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isUserSubscribed, setIsUserSubscribed] = useState(isSubscribed);

    useEffect(() => {
        setIsUserSubscribed(isSubscribed);
    }, [isSubscribed]);

    const subscribe = () => {
        if (!auth.user) {
            setShowLoginModal(true);
            return;
        }

        const newSubscribed = !isSubscribed;

        if (isSubscribed) {
            const confirm = window.confirm(
                "Are you sure you want to unsubscribe from this hub?"
            );
            if (!confirm) {
                setIsUserSubscribed(isSubscribed);
                return;
            }
        }

        // Optimistically update UI
        setIsUserSubscribed(newSubscribed);

        // Notify parent component of the vote change
        onSubscribeChange(hubId, newSubscribed);
        //Remove hub from list if it is unsubscribed from My Hubs
        if (listName === "My Hubs" && !newSubscribed) {
            removeHubFromList(hubId);
        }

        // Make the request to the server
        axios
            .post(route("userhub.store"), {
                hub_id: hubId,
                user_id: auth.user.id,
            })
            .then((response) => {
                // Handle the response if needed
            })
            .catch((error) => {
                console.error(error);
                setIsUserSubscribed(isSubscribed);
                // Revert the UI in case of an error
                if (error.response.status === 401) {
                    window.location.href = "/login";
                }
            });
    };

    const className = isUserSubscribed
        ? "bg-blue-900 text-white hover:bg-blue-800 hover:text-white"
        : "bg-white text-blue-900 hover:bg-blue-900 hover:text-white border-blue-900";

    return (
        <>
            <button
                className={`flex items-center justify-center gap-1 rounded-md p-2 h-10 w-10 border transition duration-300 ${className}`}
                onClick={subscribe}
            >
                {/* {isSubscribed ? <FaCheck /> : <FaPlus />} */}
                {isUserSubscribed ? <FaCheck /> : <FaPlus />}
            </button>
            <LoginFirst
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </>
    );
}
