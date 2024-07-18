import { Link } from "@inertiajs/react";
import { BiComment } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import DeleteButton from "../DeleteButton";
import VoteButton from "./VoteButton";

export default function PostCard({
    auth,
    post,
    isSingleHub,
    onVoteChange,
    onDelete,
}) {
    return (
        <div
            key={post.id}
            className="flex flex-col border border-gray-300 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out h-full bg-white"
        >
            <div className="flex flex-row justify-between border-b border-gray-300 pb-1 flex-wrap">
                {/* If showing single hub, don't show hub name */}
                {!isSingleHub ? (
                    <Link
                        href={route("hub.show", post.hub.name)}
                        className="text-lg font-semibold text-blue-800 hover:text-blue-700 transition-colors duration-300"
                    >
                        <span className="flex items-center gap-2">
                            <img
                                src={post.hub.image_url}
                                alt={post.hub.name}
                                className="w-10 h-10 rounded-full"
                            />
                            h/{post.hub.name}
                        </span>
                    </Link>
                ) : post.user ? (
                    <Link
                        href={route("user.show", post.user.name)}
                        className="text-blue-800 hover:text-blue-700 transition-colors duration-300"
                    >
                        u/{post.user.name}
                    </Link>
                ) : (
                    "[deleted]"
                )}

                <div className="flex flex-grow items-center justify-end gap-2">
                    {/* Show username at the end if not single hub */}
                    {!isSingleHub ? (
                        post.user ? (
                            <Link
                                href={route("user.show", post.user.name)}
                                className="text-blue-800 hover:text-blue-700 transition-colors duration-300 "
                            >
                                u/{post.user.name}
                            </Link>
                        ) : (
                            "[deleted]"
                        )
                    ) : null}

                    <div className="flex items-center justify-center gap-2">
                        <div className=" text-gray-500 whitespace-nowrap">
                            {post.created_format}
                        </div>

                        {/* Show delete button if user is admin or if the id matches */}
                        {auth.user?.id === post.user_id ||
                        auth.user?.is_admin ? (
                            <DeleteButton
                                itemId={post.id}
                                userId={post.user_id}
                                onDelete={onDelete}
                                itemType="post"
                                className="w-1/2 flex justify-center"
                            />
                        ) : null}
                        {/* Show edit button if user the id matches not for admin */}
                        {auth.user?.id === post.user_id &&
                        !auth.user?.is_admin ? (
                            <Link
                                href={route("post.edit", {
                                    hub: post.hub.name,
                                    post: post.id,
                                })}
                                className="text-blue-800 hover:text-blue-700 transition-colors duration-300"
                            >
                                <FaEdit />
                            </Link>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* if post has tag, show it if not show no tag(badge) */}
            <div className="flex flex-row flex-wrap gap-1 mt-2">
                {post.tags.length > 0
                    ? post.tags.map((tag) => (
                          <div
                              key={tag.id}
                              // href={route("tag.show", tag.name)}
                              className="  transition-colors duration-300 px-2 py-1 rounded-lg"
                              // style={{ backgroundColor: tag.color }}
                              //same as befor but 50% opacity
                              style={{ backgroundColor: tag.color + "40" }}
                          >
                              {tag.name}
                          </div>
                      ))
                    : null}
            </div>

            {/* Post title */}

            <Link
                href={route("post.show", {
                    hub: post.hub.name,
                    post: post.id,
                })}
                className="text-2xl font-bold pt-2 hover:text-blue-800 transition-colors duration-300"
            >
                {post.title}
            </Link>
            <p className="mt-2 border-b border-gray-300 pb-2">
                {post.content}

                {post.image_url && (
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="mx-auto my-2 rounded-lg"
                    />
                )}
            </p>

            <div className="flex flex-row justify-between pt-2">
                <VoteButton
                    postId={post.id}
                    auth={auth}
                    initialVotes={post.votes_count}
                    userVoted={post.user_vote}
                    onVoteChange={onVoteChange}
                />

                <div className="text-xl font-semibold flex items-center gap-2  rounded-lg p-2 border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white transition-colors duration-300">
                    <Link
                        href={
                            route("post.show", {
                                hub: post.hub.name,
                                post: post.id,
                            }) + "#responses"
                        }
                        className=" flex items-center gap-1"
                    >
                        <BiComment />
                        {post.responses_count}
                    </Link>
                </div>
            </div>
        </div>
    );
}
