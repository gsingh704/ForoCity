import { useEffect, useState } from "react";
import axios from "axios";
import { BiUpvote } from "react-icons/bi";
import LoginFirst from "../LoginFirst";
import VerifyFirst from "../VerifyFirst";

export default function VoteButton({
    postId,
    auth,
    initialVotes,
    userVoted,
    onVoteChange,
}) {
    const [votesCount, setVotesCount] = useState(initialVotes);
    const [userVote, setUserVote] = useState(userVoted);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false); // State to control verify modal visibility

    useEffect(() => {
        setUserVote(userVoted);
    }, [userVoted]);

    const vote = () => {
        if (!auth.user) {
            setShowLoginModal(true);
            return;
        }
        if (!auth.user.email_verified_at) {
            setShowVerifyModal(true); // Show verify modal if email is not verified
            return;
        }

        const newVotesCount = userVote ? votesCount - 1 : votesCount + 1;
        const newUserVote = !userVote;

        // Optimistically update UI
        setVotesCount(newVotesCount);
        setUserVote(newUserVote);

        // Notify parent component of the vote change
        onVoteChange(postId, newVotesCount, newUserVote);

        // Make the request to the server
        axios
            .post(route("postvote.store"), {
                post_id: postId,
                user_id: auth.user.id,
            })
            .then((response) => {
                // Handle the response if needed
            })
            .catch((error) => {
                console.error(error);
                // Revert the UI in case of an error
                setVotesCount(votesCount);
                setUserVote(userVote);
                if (error.response.status === 401) {
                    window.location.href = "/login";
                }
            });
    };

    const voteButtonStyle = userVote
        ? "bg-blue-900 text-white hover:bg-white hover:text-blue-900 transition-colors duration-300 border-blue-800"
        : "text-blue-800 hover:bg-blue-800 hover:text-white transition-colors duration-300 border-blue-800";

    return (
        <>
            <button
                onClick={vote}
                className={`${voteButtonStyle} flex items-center gap-1 focus:outline-none text-xl font-semibold rounded-lg p-2 border-2`}
            >
                <BiUpvote />
                {votesCount}
            </button>
            <LoginFirst
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
            <VerifyFirst
                isOpen={showVerifyModal}
                onClose={() => setShowVerifyModal(false)}
            />
        </>
    );
}
