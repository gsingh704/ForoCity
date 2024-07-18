import React, { useEffect, useState } from "react";
import axios from "axios";
import { BiSolidUpvote, BiUpvote } from "react-icons/bi";
import LoginFirst from "../LoginFirst";
import VerifyFirst from "../VerifyFirst";

const ResponseVoteButton = ({ votesCount, responseId, auth, userVoted }) => {
    const [votes, setVotes] = useState(votesCount);
    const [userVote, setUserVote] = useState(userVoted);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);

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

        const newVotes = userVote ? votes - 1 : votes + 1;
        setUserVote(!userVote);
        setVotes(newVotes);

        axios
            .post(route("responsevote.store"), {
                response_id: responseId,
                user_id: auth.user.id,
            })
            .then((response) => {
                // Handle the response
            })
            .catch((error) => {
                console.error(error);
                setUserVote(userVote);
                setVotes(votes);
                if (error.response.status === 401) {
                    window.location.href = "/login";
                }
            });
    };

    return (
        <>
            <button
                onClick={vote}
                className="flex items-center text-xl text-blue-900"
            >
                {userVote ? <BiSolidUpvote /> : <BiUpvote />}
                {votes}
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
};

export default ResponseVoteButton;
