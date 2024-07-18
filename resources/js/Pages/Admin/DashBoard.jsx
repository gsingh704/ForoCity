import React from "react";
import {Link} from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";

export default function DashBoard({auth, userCount, hubCount, postCount}) {
    return (
        <AdminLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Admin Dashboard
                </h2>
            }
        >
            <div className="flex flex-col space-y-2 max-w-3xl mx-auto m-2">
                <Link
                    href={route("user.index")}
                    className="text-blue-800 text-lg font-semibold hover:text-blue-900 bg-white rounded-md shadow-sm flex justify-between space-y-2 hover:bg-blue-50 hover:border hover:border-blue-900 p-4"
                >
                    User List
                    <span>{userCount}</span>
                </Link>
                <Link
                    href="h/all"
                    className="text-blue-800 text-lg font-semibold hover:text-blue-900  bg-white rounded-md shadow-sm flex justify-between space-y-2 hover:bg-blue-50 hover:border hover:border-blue-900 p-4"
                >
                    All Posts (h/all)
                    <span>{postCount}</span>
                </Link>
                <Link
                    href={route("hub.index")}
                    className="text-blue-800 text-lg font-semibold hover:text-blue-900  bg-white rounded-md shadow-sm flex justify-between space-y-2 hover:bg-blue-50 hover:border hover:border-blue-900 p-4"
                >
                    Hub List
                    <span>{hubCount}</span>
                </Link>
            </div>
        </AdminLayout>
    );
}
