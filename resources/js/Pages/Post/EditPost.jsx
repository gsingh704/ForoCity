import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextArea from "@/Components/TextArea";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import EditForm from "@/Components/Post/EditForm";

export default function EditPost({ auth, hub, tags, post }) {
    const HeaderComponent = () => (
        <h2 className="font-semibold text-2xl text-gray-800 leading-tight flex items-center justify-between">
            <span>
                h/
                <span className="text-blue-800 uppercase">{hub.name}</span>
            </span>
            <p>New Post</p>
        </h2>
    );

    return auth.user?.is_admin ? (
        <AdminLayout user={auth.user} header={<HeaderComponent />}>
            <Head title="Edit Post" />
            <EditForm hub={hub} tags={tags} currentPost={post} />
        </AdminLayout>
    ) : (
        <AuthenticatedLayout user={auth.user} header={<HeaderComponent />}>
            <Head title="Edit Post" />
            <EditForm hub={hub} tags={tags} currentPost={post} />
        </AuthenticatedLayout>
    );
}
