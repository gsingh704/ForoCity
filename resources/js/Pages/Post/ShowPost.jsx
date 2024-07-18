import DeleteButton from "@/Components/DeleteButton";
import InputError from "@/Components/InputError";
import LoginFirst from "@/Components/LoginFirst";
import PostCard from "@/Components/Post/PostCard";
import PrimaryButton from "@/Components/PrimaryButton";
import ResponseVoteButton from "@/Components/Response/VoteButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextArea from "@/Components/TextArea";
import ToggleButton from "@/Components/ToggleButton";
import VerifyFirst from "@/Components/VerifyFirst";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { BiSolidUpvote, BiTime } from "react-icons/bi";
import { FaCompressAlt, FaExpandAlt, FaReply } from "react-icons/fa";

/**
 * Renders the component to display a single post.
 *
 * @param {Object} auth - The authentication information.
 * @param {Object} post - The post object to be displayed.
 * @returns {JSX.Element} The JSX element representing the ShowPost component.
 */
export default function ShowPost({ auth, post }) {
    const authUserId = auth.user ? auth.user.id : null;
    const [currentPost, setCurrentPost] = useState(post);
    const [sortOption, setSortOption] = useState("top");
    const [highlightedResponse, setHighlightedResponse] = useState(null);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [showPostReplyBox, setShowPostReplyBox] = useState(false); // State to manage showing reply box for the post
    const [replyingTo, setReplyingTo] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);

    // Function to handle post delete, redirect to hub page
    const handlePostDelete = () => {
        window.location.href = `/h/${currentPost.hub.name}`;
    };

    //----------------------------------Reply Box----------------------------------//
    const {
        data,
        setData,
        post: sendReply,
        processing,
        errors,
        reset,
    } = useForm({
        content_body: "",
        user_id: authUserId,
        post_id: currentPost.id,
        parent_id: null,
        hub_name: currentPost.hub.name,
    });

    const submit = (e) => {
        e.preventDefault();
        setShowReplyBox(false);
        sendReply(route("response.store"));
    };

    const cancel = () => {
        setShowReplyBox(false);
        setShowPostReplyBox(false);
        setReplyingTo(null);
        reset();
    };

    const ReplyToPost = () => {
        if (!auth.user) {
            setShowLoginModal(true);
            return;
        }
        if (!auth.user.email_verified_at) {
            setShowVerifyModal(true); // Show verify modal if email is not verified
            return;
        }
        setShowPostReplyBox(!showPostReplyBox); // Toggle the post reply box
        setShowReplyBox(false); // Ensure that reply box for responses is closed
        setReplyingTo(null); // Reset replying to response
    };

    const handleReplyClick = (responseID) => {
        if (!auth.user) {
            setShowLoginModal(true);
            return;
        }
        if (!auth.user.email_verified_at) {
            setShowVerifyModal(true); // Show verify modal if email is not verified
            return;
        }

        setReplyingTo(responseID);
        setData({ ...data, parent_id: responseID });
        setShowReplyBox(true);
        setShowPostReplyBox(false); // Ensure that reply box for the post is closed
    };

    const handleReplyDelete = () => {
        window.location.reload();
    };

    const ReplyBox = ({ responseId }) => (
        <form
            className="border border-gray-300 p-2 my-2 bg-white rounded-lg shadow-md"
            onSubmit={submit}
        >
            <TextArea
                id={`content_body_${responseId}`}
                name="content_body"
                value={data.content_body}
                className="mt-1 block w-full bg-gray-100"
                autoComplete="content_body"
                isFocused={true}
                onChange={(e) => setData("content_body", e.target.value)}
                aria-label="Reply"
                // required
            />
            <InputError message={errors.content_body} className="mt-2" />
            <div className="flex justify-end mt-2 gap-2">
                <SecondaryButton onClick={() => cancel()}>
                    Cancel
                </SecondaryButton>
                <PrimaryButton className="flex items-center" type="submit">
                    <FaReply className="mr-2" /> Reply
                </PrimaryButton>
            </div>
        </form>
    );
    // ----------------------------------End Reply Box----------------------------------//

    // Function to toggle sort option
    const toggleSortOption = (option) => {
        setSortOption(option);
    };

    const handleVoteChange = (postId, newVoteCount, newUserVote) => {
        if (postId === currentPost.id) {
            setCurrentPost((prevPost) => ({
                ...prevPost,
                votes_count: newVoteCount,
                user_vote: newUserVote,
            }));
        }
    };

    // State to track visibility of responses, initialize all to true
    const [responsesVisibility, setResponsesVisibility] = useState(() => {
        const initialVisibility = {};
        currentPost.responses.forEach((response) => {
            initialVisibility[response.id] = true;
        });
        return initialVisibility;
    });

    //------------------------------Resonses-------------------------------------//
    useEffect(() => {
        const responseId = window.location.hash.replace("#", ""); // Get the response ID from the URL hash
        if (responseId) {
            setHighlightedResponse(responseId);
        }
    }, []);

    // Define color classes for different depths
    const colorClasses = {
        0: "border-indigo-500",
        1: "border-emerald-500",
        2: "border-amber-500",
        3: "border-cyan-500",
        4: "border-violet-500",
        5: "border-rose-500",
    };

    // Build the tree structure of responses
    function buildResponseTree(responses, sortOption) {
        let responseMap = new Map();
        let tree = [];

        // Initialize response map
        responses.forEach((response) => {
            response.children = [];
            responseMap.set(response.id, response);
        });

        // Sort function based on the sort option
        const sortFunction = (a, b) => {
            if (sortOption === "top") {
                return b.votes_count - a.votes_count; // Sort by votes count
            } else if (sortOption === "new") {
                return new Date(b.created_at) - new Date(a.created_at); // Sort by creation date
            }
            // Add more sort options if needed
        };

        // Build tree structure with sorting
        try {
            responses.forEach((response) => {
                if (response.parent_id) {
                    responseMap
                        .get(response.parent_id)
                        .children.push(responseMap.get(response.id));
                } else {
                    tree.push(responseMap.get(response.id));
                }
            });
        } catch (error) {
            console.error(
                "An error occurred while building the response tree:",
                error
            );
        }

        // Sort parent responses
        tree.sort(sortFunction);
        // Recursively sort child responses
        const sortChildren = (response) => {
            if (response.children.length > 0) {
                response.children.sort(sortFunction);
                response.children.forEach(sortChildren); // Recursive call
            }
        };
        tree.forEach(sortChildren);

        return tree;
    }

    // Toggle visibility of responses
    const toggleResponseVisibility = (id) => {
        setResponsesVisibility((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    function renderResponse(response, depth = 0) {
        const isHighlighted = response.id.toString() === highlightedResponse;
        const highlightClass = isHighlighted ? "bg-yellow-200" : "";

        const responseClass =
            depth === 0
                ? `pl-2 mt-2 bg-white shadow-md border-l-4 border-red-500 border-t rounded-lg shadow-md ${highlightClass}`
                : `border-l-4 ${
                      colorClasses[depth % Object.keys(colorClasses).length]
                  } pl-2 border-t ${highlightClass}`;

        return (
            <div key={response.id} className={responseClass} id={response.id}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ResponseVoteButton
                            votesCount={response.votes_count}
                            responseId={response.id}
                            auth={auth}
                            userVoted={response.user_vote !== null}
                        />

                        <span className=" text-gray-500">
                            {response.user ? (
                                <Link
                                    href={route(
                                        "user.show",
                                        response.user.name
                                    )}
                                    //highlight the response by current  user in green and of the post author in blue
                                    className={`${
                                        response.user.name ===
                                        currentPost.user.name
                                            ? "bg-blue-900 text-white px-2 py-1 rounded-lg hover:bg-blue-700  hover:text-white transition-colors duration-300 m-2"
                                            : response.user.name ===
                                              auth.user?.name
                                            ? "bg-green-700 text-white px-2 py-1 rounded-lg hover:bg-green-700  hover:text-white transition-colors duration-300 m-2"
                                            : "text-blue-900 hover:text-blue-700 transition-colors duration-300 m-2"
                                    } hover:text-blue-700 transition-colors duration-300 m-2`}
                                >
                                    u/{response.user.name}
                                </Link>
                            ) : (
                                "[deleted] "
                            )}
                            {response.created_format}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Conditionally render delete button and null */}
                        {auth.user?.id === response.user_id ||
                        auth.user?.is_admin ? (
                            <DeleteButton
                                itemId={response.id}
                                userId={response.user_id}
                                onDelete={handleReplyDelete}
                                itemType="response"
                            />
                        ) : null}

                        <button
                            onClick={() => handleReplyClick(response.id)}
                            className="flex items-center px-3 hover:text-blue-900 transition duration-150 ease-in-out"
                            title="Reply to this message"
                        >
                            <FaReply />
                        </button>
                        <button
                            onClick={() =>
                                toggleResponseVisibility(response.id)
                            }
                            className="flex items-center px-3  hover:text-red-500 transition duration-150 ease-in-out"
                            title="Toggle visibility of responses"
                        >
                            {responsesVisibility[response.id] ? (
                                <FaCompressAlt />
                            ) : (
                                <>
                                    <FaExpandAlt className="text-blue-900" />
                                    <span className="ml-1 text-blue-900">
                                        {response.children.length}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
                <p className="p-2 pt-0 text-lg">{response.content}</p>

                {/* Conditionally render the reply box */}
                {replyingTo === response.id && showReplyBox && <ReplyBox />}
                {/* Render child responses */}
                {responsesVisibility[response.id] &&
                    response.children.map((child) =>
                        renderResponse(child, depth + 1)
                    )}
            </div>
        );
    }

    const responseTree = buildResponseTree(currentPost.responses, sortOption);

    const PostComponent = () => (
        <div className="max-w-4xl mx-auto">
            <LoginFirst
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
            <VerifyFirst
                isOpen={showVerifyModal}
                onClose={() => setShowVerifyModal(false)}
            />
            <PostCard
                auth={auth}
                key={currentPost.id}
                post={currentPost}
                showHubName={false}
                onVoteChange={handleVoteChange}
                onDelete={handlePostDelete}
            />
            {/* Render responses */}
            <div id="responses">
                <div className="flex justify-between items-center mt-2">
                    <div className="flex   items-center text-blue-900 bg-white border border-gray-300 rounded-lg  overflow-hidden shadow-md w-48">
                        <ToggleButton
                            isActive={sortOption === "top"}
                            onClick={() => toggleSortOption("top")}
                            icon={BiSolidUpvote}
                            label="Top"
                            className="w-1/2 flex justify-center"
                        />
                        <ToggleButton
                            isActive={sortOption === "new"}
                            onClick={() => toggleSortOption("new")}
                            icon={BiTime}
                            label="New"
                            isLast={true}
                            className="w-1/2 flex justify-center"
                        />
                    </div>
                    <button
                        className="flex items-center border font-semibold bg-white border-blue-900 text-blue-900 rounded-lg p-2 hover:bg-blue-900 hover:text-white transition-colors duration-300 gap-2 shadow-md"
                        onClick={() => ReplyToPost()}
                    >
                        <FaReply />
                        <span>Reply</span>
                    </button>
                </div>
                {showPostReplyBox && <ReplyBox responseId={null} />}

                {/* SHOW NO REPSONSE IF NOT  */}
                {responseTree.length === 0 && (
                    <div className="text-blue-800 text-lg font-semibold flex flex-col space-y-2 justify-center items-center p-8">
                        No Responses, Be the first to respond
                    </div>
                )}

                {/* Render reply box for the post */}
                {responseTree.map((response) => renderResponse(response))}
            </div>
        </div>
    );

    const HeaderComponent = () => (
        <h2 className="font-semibold text-2xl text-gray-800 leading-tight ">
            h/
            <span className="text-blue-800 uppercase">
                {currentPost.hub.name}
            </span>
        </h2>
    );

    //admin, auth, guest
    return auth.user?.is_admin ? (
        <AdminLayout user={auth.user} header={<HeaderComponent />}>
            <PostComponent />
        </AdminLayout>
    ) : auth.user ? (
        <AuthenticatedLayout user={auth.user} header={<HeaderComponent />}>
            <PostComponent />
        </AuthenticatedLayout>
    ) : (
        <GuestLayout header={<HeaderComponent />}>
            <PostComponent />
        </GuestLayout>
    );
}
