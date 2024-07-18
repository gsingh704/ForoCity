import React from "react";
import { Link } from "@inertiajs/react";
import UserDeleteUser from "@/Components/User/DeleteButton";
import { BiComment } from "react-icons/bi";
import { LuMessagesSquare } from "react-icons/lu";
import { RiAdminFill } from "react-icons/ri";
import { TbLayoutList } from "react-icons/tb";
import AdminLayout from "@/Layouts/AdminLayout";

export default function UserList({ auth, users }) {
    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-blue-800 leading-tight">
                    User List
                </h2>
            }
        >
            <div className="flex flex-col space-y-2 max-w-3xl mx-auto m-2">
                {users.map((user) => {
                    return (
                        <div
                            key={user.id}
                            className=" p-4  bg-white rounded-md shadow-sm flex justify-between items-center hover:bg-blue-50 hover:border hover:border-blue-900 flex-wrap gap-4"
                        >
                            <Link
                                href={route("user.show", user.name)}
                                className="text-blue-800 text-lg font-semibold hover:text-blue-900"
                            >
                                u/{user.name}
                            </Link>
                            <div className="flex gap-4 items-center">
                                <div className="flex border border-blue-300 bg-blue-50 rounded-md p-2 w-28 justify-between">
                                    {/* <div className="text-blue-800 flex items-center">
                                        <BiUpvote />
                                        {user.total_votes}
                                    </div> */}
                                    <div className="text-blue-800 flex items-center">
                                        <BiComment />
                                        {user.response_count}
                                    </div>
                                    <div className="text-blue-800 flex items-center">
                                        <TbLayoutList />
                                        {user.post_count}
                                    </div>
                                </div>

                                <Link
                                    href={`/u/${auth.user.name}/c/${user.name}#bottom`}
                                    className="text-blue-800 text-xl hover:text-blue-900 hover:scale-125 transition-transform duration-300"
                                    aria-label="Message"
                                >
                                    <LuMessagesSquare />
                                </Link>
                                {/* dont show delete button for admin */}
                                {user.is_admin ? (
                                    <RiAdminFill className="text-blue-800 text-xl" />
                                ) : (
                                    <UserDeleteUser user={user} />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AdminLayout>
    );
}
