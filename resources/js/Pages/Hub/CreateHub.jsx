import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import CreateForm from "@/Components/Hub/CreateForm";

export default function CreateHub({ auth }) {
    const HeaderComponent = () => (
        <h2 className="font-semibold text-2xl text-gray-800 leading-tight ">
            Create Hub
        </h2>
    );

    return auth.user?.is_admin ? (
        <AdminLayout user={auth.user} header={<HeaderComponent />}>
            <Head title="Create Hub" />
            <CreateForm />
        </AdminLayout>
    ) : (
        <AuthenticatedLayout user={auth.user} header={<HeaderComponent />}>
            <Head title="Create Hub" />
            <CreateForm />
        </AuthenticatedLayout>
    );
}
