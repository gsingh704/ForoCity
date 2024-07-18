import Pagination from "@/Components/Pagination";
import PostCard from "@/Components/Post/PostCard";
import PostList from "@/Components/Post/PostList";
import SearchButton from "@/Components/SearchButton";
import ToggleButton from "@/Components/ToggleButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { BiComment, BiSolidUpvote, BiTime } from "react-icons/bi";
import { FaFilter } from "react-icons/fa";
import { TbLayoutList, TbLayoutRows } from "react-icons/tb";
import Select from "react-select";

export default function ShowHub({ hub, auth, isSingleHub, tags }) {
    const [selectedTags, setSelectedTags] = useState([]);

    const [posts, setPosts] = useState();
    // Initialize sortOption and ViewType with values from sessionStorage or default values
    const [sortOption, setSortOption] = useState(
        sessionStorage.getItem("SortOption") || "new"
    );
    const [ViewType, setViewType] = useState(
        sessionStorage.getItem("ViewType") || "card"
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, [sortOption, hub.name]);

    // Update fetchPosts to include the search query
    const fetchPosts = async (pageNumber = 1, query = "") => {
        //ids only
        const selectedTagsIds = selectedTags.map((tag) => tag.value);
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/h/${hub.name}/post`, {
                params: {
                    sort: sortOption,
                    page: pageNumber,
                    query: query, // Send the search query to the server
                    tags: selectedTagsIds,
                },
            });
            setPosts(response.data.posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
        setIsLoading(false);
    };

    // Function to toggle view type
    const toggleViewType = (type) => {
        sessionStorage.setItem("ViewType", type);
        setViewType(type);
    };

    // Function to toggle sort option
    const toggleSortOption = (option) => {
        sessionStorage.setItem("SortOption", option);
        setSortOption(option);
    };

    const handleVoteChange = (postId, newVoteCount, newUserVote) => {
        if (postId === posts.id) {
            setPosts((prevPost) => ({
                ...prevPost,
                votes_count: newVoteCount,
                user_vote: newUserVote,
            }));
        }
    };
    const handleDeletePost = (deletedPostId) => {
        setPosts((prevPosts) => ({
            ...prevPosts,
            data: prevPosts.data.filter((post) => post.id !== deletedPostId),
        }));
    };

    const handlePageChange = (newPage) => {
        fetchPosts(newPage);
    };

    // Function to handle search from the SearchButton component
    const onSearch = (query) => {
        fetchPosts(1, query);
    };

    const tagOptions = tags.map((tag) => ({ value: tag.id, label: tag.name }));

    return (
        <div className="flex flex-col max-w-4xl mx-auto gap-2 ">
            <div className="flex flex-row justify-between items-center flex-wrap">
                <div className="flex flex-row gap-2">
                    <Select
                        isMulti
                        options={tagOptions}
                        className="basic-multi-select w-64"
                        classNamePrefix="select"
                        value={selectedTags}
                        onChange={setSelectedTags}
                        placeholder="Filter by Tags"
                        //on enter key press
                        onKeyDown={(e) => {
                            if (e.key === "Enter") fetchPosts(1);
                        }}
                        aria-label="Filter by Tags"
                    />
                    <button
                        onClick={() => fetchPosts(1)}
                        className="bg-blue-900 hover:bg-blue-950 text-white  px-3 rounded-lg shadow-lg"
                        aria-label="Filter"
                    >
                        <FaFilter />
                    </button>
                </div>
                <SearchButton onSearch={onSearch} />
            </div>

            <div className="flex flex-row justify-between items-center">
                <div className="bg-white border border-gray-300 rounded-lg flex flex-row overflow-hidden shadow-md">
                    <ToggleButton
                        isActive={sortOption === "new"}
                        onClick={() => toggleSortOption("new")}
                        icon={BiTime}
                        label="New"
                    />
                    <ToggleButton
                        isActive={sortOption === "top"}
                        onClick={() => toggleSortOption("top")}
                        icon={BiSolidUpvote}
                        label="Top"
                    />
                    <ToggleButton
                        isActive={sortOption === "hot"}
                        onClick={() => toggleSortOption("hot")}
                        icon={BiComment}
                        label="Hot"
                        isLast={true}
                    />
                </div>

                {/* Toggle Buttons for ViewType */}
                <div className="bg-white border border-gray-300 rounded-lg flex flex-row  overflow-hidden shadow-md">
                    <ToggleButton
                        isActive={ViewType === "card"}
                        onClick={() => toggleViewType("card")}
                        icon={TbLayoutRows}
                        label="Card"
                    />
                    <ToggleButton
                        isActive={ViewType === "list"}
                        onClick={() => toggleViewType("list")}
                        icon={TbLayoutList}
                        label="List"
                        isLast={true}
                    />
                </div>
            </div>

            {/* Display Posts */}
            {isLoading ? (
                <div className="text-blue-800 text-lg font-semibold flex flex-col space-y-2 justify-center items-center p-8">
                    Loading...
                </div>
            ) : posts.data && posts.data.length > 0 ? (
                posts.data.map((post) =>
                    ViewType === "card" ? (
                        <PostCard
                            auth={auth}
                            key={post.id}
                            post={post}
                            isSingleHub={isSingleHub}
                            onVoteChange={handleVoteChange}
                            onDelete={handleDeletePost}
                        />
                    ) : (
                        <PostList
                            auth={auth}
                            key={post.id}
                            post={post}
                            isSingleHub={isSingleHub}
                            onVoteChange={handleVoteChange}
                            onDelete={handleDeletePost}
                        />
                    )
                )
            ) : (
                <div className="text-blue-800 text-lg font-semibold flex flex-col space-y-2 justify-center items-center p-8">
                    No Posts, Try to create a new Post, or change the filter
                </div>
            )}
            {/* Pagination */}
            {posts && (
                <Pagination
                    currentPage={posts.current_page}
                    totalPages={posts.last_page}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}
