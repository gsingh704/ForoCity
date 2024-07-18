import DeleteButton from "@/Components/DeleteButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";
import { FaPlus, FaEdit } from "react-icons/fa";
import ShowHub from "./Hub/ShowHub";

export default function Home({ auth, hub, tags }) {
    const isSingleHub = hub.name !== "all" && hub.name !== "me";

    const handleDeleteHub = () => {
        window.location.href = "/";
    };

    const HeaderWithPostButton = () => (
        <div className="font-semibold text-2xl text-gray-800 leading-tight flex flex-col">
            <span className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                    <img
                        src={hub.image_url}
                        alt="hub image"
                        className="w-10 h-10 rounded-full mr-2"
                    />
                    h/
                    <Link
                        href={route("hub.show", hub.name)}
                        className="text-blue-800 uppercase"
                    >
                        {hub.name}
                    </Link>
                </div>
                {auth.user?.email_verified_at && isSingleHub && (
                    <div className="flex flex-row items-center gap-2">
                        <Link href={route("post.create", hub.name)}>
                            <button className="bg-blue-900 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex flex-row items-center gap-2 text-lg">
                                <FaPlus /> Post
                            </button>
                        </Link>
                        {/* if the aut user is same as hub owner(user_id) show delete button or if the user is admin */}
                        {auth.user?.id === hub.user_id ||
                        auth.user?.is_admin ? (
                            <>
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
                                    itemType={"hub"}
                                >
                                    Delete
                                </DeleteButton>
                            </>
                        ) : null}
                    </div>
                )}
            </span>
            <p className=" text-gray-600 m-2">{hub.description}</p>
        </div>
    );

    //return admin, authenticated or guest layout
    return auth.user?.is_admin ? (
        <AdminLayout user={auth.user} header={<HeaderWithPostButton />}>
            <Head title="Home" />
            <ShowHub
                hub={hub}
                auth={auth}
                isSingleHub={isSingleHub}
                tags={tags}
            />
        </AdminLayout>
    ) : auth.user ? (
        <AuthenticatedLayout user={auth.user} header={<HeaderWithPostButton />}>
            <Head title="Home" />
            <ShowHub
                hub={hub}
                auth={auth}
                isSingleHub={isSingleHub}
                tags={tags}
            />
        </AuthenticatedLayout>
    ) : (
        <GuestLayout
            header={
                <h2 className="font-semibold text-2xl text-gray-800 leading-tight flex flex-col justify-between">
                    <span className="flex flex-row items-center">
                        <img
                            src={hub.image_url}
                            alt="hub image"
                            className="w-10 h-10 rounded-full mr-2"
                        />
                        h/
                        <Link
                            href={route("hub.show", hub.name)}
                            className="text-blue-800 uppercase"
                        >
                            {hub.name}
                        </Link>
                    </span>
                    <p className=" text-gray-600 m-2 text-lg">
                        {hub.description}
                    </p>
                </h2>
            }
        >
            <Head title="Home" />
            <ShowHub
                hub={hub}
                auth={auth}
                isSingleHub={isSingleHub}
                tags={tags}
            />
        </GuestLayout>
    );
}
