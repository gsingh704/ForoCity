import List from "@/Components/Hub/List";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GuestLayout from "@/Layouts/GuestLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";

export default function ListHub({ auth, hubs, listName }) {
    const Header = () => (
        <h2 className="font-semibold text-2xl text-gray-800 leading-tight ">
            {listName}
        </h2>
    );
    //admin, auth, guest

    return auth.user?.is_admin ? (
        <AdminLayout user={auth.user} header={<Header />}>
            <Head title="Home" />
            <List hubs={hubs} auth={auth} listName={listName} />
        </AdminLayout>
    ) : auth.user ? (
        <AuthenticatedLayout user={auth.user} header={<Header />}>
            <Head title="Home" />
            <List hubs={hubs} auth={auth} listName={listName} />
        </AuthenticatedLayout>
    ) : (
        <GuestLayout header={<Header />}>
            <Head title="Home" />
            <List hubs={hubs} auth={auth} listName={listName} />
        </GuestLayout>
    );
}
