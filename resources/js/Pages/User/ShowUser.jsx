import DeleteButton from "@/Components/DeleteButton";
import Pagination from "@/Components/Pagination";
import ToggleButton from "@/Components/ToggleButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { BiComment, BiSolidUpvote, BiTime, BiUpvote } from "react-icons/bi";
import { TbLayoutList } from "react-icons/tb";
import { LuMessagesSquare } from "react-icons/lu";
import ShowHub from "../Hub/ShowHub";

export default function ShowUser({ auth, user, tags }) {
    const hub = {
        name: `u_${user.name}`,
    };

    const [tab, setTab] = useState(sessionStorage.getItem("tab") || "posts");

    const [ResponseSortOption, setResponseSortOption] = useState(
        sessionStorage.getItem("ResponseSortOption") || "new"
    );
    const [isLoading, setIsLoading] = useState(true);
    const [responses, setResponses] = useState([]);

    const toggleTab = (tab) => {
        setTab(tab);
        sessionStorage.setItem("tab", tab);
    };
    // Function to toggle sort option
    const toggleResponseSortOption = (option) => {
        sessionStorage.setItem("ResponseSortOption", option);
        setResponseSortOption(option);
    };

    useEffect(() => {
        fetchResponses();
    }, [ResponseSortOption, user.name]);

    const fetchResponses = async (pageNumber = 1) => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/u/${user.name}/responses`, {
                params: {
                    sort: ResponseSortOption,
                    page: pageNumber, // Include page number in the request
                },
            });
            setResponses(response.data.responses);
        } catch (error) {
            console.error("Error fetching responses:", error);
        }
        setIsLoading(false);
    };

    const handlePageChange = (pageNumber) => {
        fetchResponses(pageNumber);
    };

    const handleDeleteResponse = (deletedResponseId) => {
        setResponses((prevResponses) => ({
            ...prevResponses,
            data: prevResponses.data.filter(
                (response) => response.id !== deletedResponseId
            ),
        }));
    };

    const HeaderChild = ({ userName }) => (
        <h2 className="font-semibold  text-gray-600 md:text-2xl leading-tight flex flex-wrap items-center justify-between">
            <span className="text-blue-800 text-2xl md:text-3xl">
                u/{userName}
            </span>
            <div className="flex gap-4 items-center">
                All posts and responses by u/{userName}
                {auth.user?.email_verified_at ? (
                    <Link
                        href={`/u/${auth.user.name}/c/${user.name}#bottom`}
                        className="text-blue-800 text-xl hover:text-blue-900 hover:scale-125 transition-transform duration-300"
                        aria-label="Message"
                    >
                        <LuMessagesSquare />
                    </Link>
                ) : null}
            </div>
        </h2>
    );

    // body children that have toggle buttons and show responses or posts based on the tab state
    const BodyChild = () => (
        <>
            <div className="flex items-center  text-blue-900 bg-white border border-gray-300 rounded-lg  overflow-hidden shadow-md max-w-4xl mx-auto mb-2">
                <ToggleButton
                    isActive={tab === "posts"}
                    icon={TbLayoutList}
                    onClick={() => toggleTab("posts")}
                    label="Posts"
                    className="w-1/2 flex justify-center"
                />
                <ToggleButton
                    isActive={tab === "responses"}
                    icon={BiComment}
                    label="Responses"
                    onClick={() => toggleTab("responses")}
                    isLast={true}
                    className="w-1/2 flex justify-center"
                />
            </div>
            {tab === "posts" ? (
                <ShowHub hub={hub} auth={auth} showHubName={true} tags={tags} />
            ) : (
                <div className="flex flex-col max-w-4xl mx-auto gap-2 my-2">
                    <div className="flex   items-center text-blue-900 bg-white border border-gray-300 rounded-lg  overflow-hidden shadow-md w-48">
                        <ToggleButton
                            isActive={ResponseSortOption === "new"}
                            onClick={() => toggleResponseSortOption("new")}
                            icon={BiTime}
                            label="New"
                            className="w-1/2 flex justify-center"
                        />
                        <ToggleButton
                            isActive={ResponseSortOption === "top"}
                            onClick={() => toggleResponseSortOption("top")}
                            icon={BiSolidUpvote}
                            label="Top"
                            isLast={true}
                            className="w-1/2 flex justify-center"
                        />
                    </div>

                    {isLoading ? (
                        <div>Loading...</div>
                    ) : // list of responses
                    responses.data && responses.data.length > 0 ? (
                        responses.data.map((response) => (
                            <div
                                className="flex flex-col border-b border-gray-300 bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                                key={response.id}
                            >
                                <p className="p-2 pt-0 text-lg">
                                    <Link
                                        href={
                                            route("post.show", {
                                                hub: response.hub_name,
                                                post: response.post_id,
                                            }) + `#${response.id}`
                                        }
                                        className=" hover:text-blue-700 transition-colors duration-300"
                                    >
                                        {response.content}
                                    </Link>
                                </p>
                                <div className="p-2 pt-0  gap-2 flex flex-row items-center text-gray-500">
                                    <span className="text-lg flex items-center gap-1">
                                        <BiUpvote className="text-blue-900" />
                                        {response.votes_count}
                                    </span>
                                    <span>{response.created_format} in</span>
                                    <span className="text-blue-800 hover:text-blue-700 transition-colors duration-300">
                                        h/{response.hub_name}
                                    </span>
                                    {(auth.user?.id === response.user_id ||
                                        auth.user?.is_admin) && (
                                        <DeleteButton
                                            itemId={response.id}
                                            userId={response.user_id}
                                            onDelete={handleDeleteResponse}
                                            itemType="response"
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No responses yet</div>
                    )}

                    {responses.links && (
                        <Pagination
                            currentPage={responses.current_page}
                            totalPages={responses.last_page}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            )}
        </>
    );

    return auth.user?.is_admin ? (
        <AdminLayout
            user={auth.user}
            header={<HeaderChild userName={user.name} />}
        >
            <Head title={user.name} />
            <BodyChild />
        </AdminLayout>
    ) : auth.user ? (
        <AuthenticatedLayout
            user={auth.user}
            header={<HeaderChild userName={user.name} />}
        >
            <Head title={user.name} />
            <BodyChild />
        </AuthenticatedLayout>
    ) : (
        <GuestLayout header={<HeaderChild userName={user.name} />}>
            <Head title={user.name} />
            <BodyChild />
        </GuestLayout>
    );
}
