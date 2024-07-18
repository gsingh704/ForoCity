import { Link } from "@inertiajs/react";
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { FaCheck } from "react-icons/fa";

export default function List({ auth, conversations }) {
    const BodyComponent = () => (
        <div className="flex flex-col space-y-2 max-w-3xl mx-auto m-2">
            {Object.keys(conversations).map((key) => {
                //is current user sender of the last message
                const isSender = conversations[key].sender_id === auth.user.id;

                //set theother user name
                const otheruser = isSender
                    ? conversations[key].receiver_name
                    : conversations[key].sender_name;

                const conversation = conversations[key];
                return (
                    <Link
                        key={key}
                        href={`/u/${auth.user.name}/c/${otheruser}#bottom`}
                        className=" p-4  bg-white rounded-md shadow-sm flex flex-col space-y-2 hover:bg-blue-50 hover:border hover:border-blue-900"
                    >
                        <span className="text-blue-800 text-lg font-semibold hover:text-blue-900">
                            u/{otheruser}
                        </span>

                        <div className=" text-gray-500 overflow-hidden whitespace-nowrap overflow-ellipsis">
                            <span className="text-gray-500  font-semibold">
                                {conversation.content}
                            </span>
                            <div className="flex flex-row items-center justify-end gap-2">
                                {isSender && (
                                    <FaCheck className=" text-blue-900" />
                                )}
                                {conversation.created_at_human}
                            </div>
                        </div>
                    </Link>
                );
            })}

            {/* check the length of the conversation if it is no conversation show this no conversation */}
            {Object.keys(conversations).length === 0 && (
                <div className="p-4  bg-white rounded-md shadow-sm flex flex-col space-y-2 justify-center items-center">
                    <span className="text-blue-800 text-lg font-semibold">
                        No Conversations, Try to send a message to someone
                    </span>
                </div>
            )}
        </div>
    );

    const HeaderComponent = () => (
        <h2 className="font-semibold  text-gray-600 md:text-2xl leading-tight flex flex-wrap items-center justify-between">
            <span className="text-blue-800 text-2xl md:text-3xl">
                Conversations
            </span>
        </h2>
    );

    return auth.user?.is_admin ? (
        <AdminLayout user={auth.user} header={<HeaderComponent />}>
            <Head title="Conversations" />
            <BodyComponent />
        </AdminLayout>
    ) : (
        <AuthenticatedLayout user={auth.user} header={<HeaderComponent />}>
            <Head title="Conversations" />
            <BodyComponent />
        </AuthenticatedLayout>
    );
}
