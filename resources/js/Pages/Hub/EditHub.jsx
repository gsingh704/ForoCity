import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import EditForm from "@/Components/Hub/EditForm";

export default function EditHub({ auth, hub }) {
    const HeaderComponent = () => (
        <h2 className="font-semibold text-2xl text-gray-800 leading-tight ">
            Edit Hub
        </h2>
    );

    return auth.user?.is_admin ? (
        <AdminLayout user={auth.user} header={<HeaderComponent />}>
            <Head title="Edit Hub" />
            <EditForm hub={hub} />
        </AdminLayout>
    ) : (
        <AuthenticatedLayout user={auth.user} header={<HeaderComponent />}>
            <Head title="Edit Hub" />
            <EditForm hub={hub} />
        </AuthenticatedLayout>
    );
}
