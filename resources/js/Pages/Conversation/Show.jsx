import React from "react";
import "./Show.css";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import TextArea from "@/Components/TextArea";
import { BiSend } from "react-icons/bi";
import InputError from "@/Components/InputError";

export default function Show({ auth, conversations, otheruser }) {
    //other user name is the name of the other user different than auth.user.name

    const { data, setData, post, processing, errors, reset } = useForm({
        content_body: "",
        receiver_id: otheruser.id,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("conversation.store"));
    };

    const BodyComponent = () => (
        <>
            {conversations.map((conversation) => {
                const isSender = conversation.sender_id === auth.user.id;
                const bubbleClass = isSender
                    ? "sent-bubble"
                    : "received-bubble";
                const arrowClass = isSender ? "sent-arrow" : "received-arrow";

                return (
                    <div
                        key={conversation.id}
                        className={`chat-bubble ${bubbleClass} ${arrowClass} max-w-2/3 `}
                    >
                        <p>{conversation.content}</p>
                        <p className=" text-gray-800 text-right">
                            {conversation.created_at_human}
                        </p>
                    </div>
                );
            })}
            {/* If no show no messages */}
            {conversations.length === 0 && (
                <div className="text-blue-800 text-lg font-semibold flex flex-col space-y-2 justify-center items-center p-8">
                    No Messages, Try to send a new message
                </div>
            )}

            <div className="h-20 " id="bottom" />
            <form
                className="flex-grow flex items-center fixed bottom-0  bg-white w-full p-2"
                onSubmit={handleSubmit}
            >
                <TextArea
                    className="flex-grow   mr-4 resize-none w-full"
                    placeholder="Type a message..."
                    name="content_body"
                    value={data.content_body}
                    id="content_body"
                    onChange={(e) => setData("content_body", e.target.value)}
                    isFocused={true}
                    aria-label="Type a message..."
                />
                <button
                    type="submit"
                    aria-label="Send"
                    className={`bg-blue-900 text-white font-bold py-2 px-4 rounded h-12
                ${
                    data.content_body
                        ? "hover:bg-blue-800"
                        : "bg-gray-500 cursor-not-allowed"
                }`}
                    disabled={!data.content_body}
                >
                    <BiSend />
                    <InputError
                        message={errors.content_body}
                        className="mt-2"
                    />
                </button>
            </form>
        </>
    );

    const HeaderComponent = () => (
        <h2 className="font-semibold  text-gray-600 md:text-2xl leading-tight flex flex-wrap items-center justify-between">
            <span className="text-blue-800 text-2xl md:text-3xl">
                u/{otheruser.name}
            </span>
        </h2>
    );

    return auth.user?.is_admin ? (
        <AdminLayout user={auth.user} header={<HeaderComponent />}>
            <Head title={`u/${otheruser.name}`} />
            <BodyComponent />
        </AdminLayout>
    ) : (
        <AuthenticatedLayout user={auth.user} header={<HeaderComponent />}>
            <Head title={`u/${otheruser.name}`} />
            <BodyComponent />
        </AuthenticatedLayout>
    );
}
