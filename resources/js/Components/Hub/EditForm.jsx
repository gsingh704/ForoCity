import React from "react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import CountrySelector from "@/Components/CountrySelector";
import TextArea from "@/Components/TextArea";

export default function EditForm({ hub }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        id: hub.id,
        description: hub.description,
        country: hub.country,
        img: null,
        color: hub.color,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("hub.update", hub.id));
    };

    return (
        <form
            onSubmit={submit}
            className="space-y-6 max-w-3xl mx-auto py-10 bg-white p-4"
        >
            <h1 className="text-2xl font-semibold text-gray-800 leading-tight">
                {hub.name}
            </h1>
            {/* Description */}
            <div>
                <InputLabel htmlFor="description" value="Description" />

                <TextArea
                    id="description"
                    name="description"
                    value={data.description}
                    className="mt-1 block w-full h-32 overflow-y-auto"
                    autoComplete="description"
                    onChange={(e) => setData("description", e.target.value)}
                    // required
                />
                <InputError message={errors.description} className="mt-2" />
            </div>

            {/* Country */}
            <div>
                <InputLabel htmlFor="country" value="Country" />
                <CountrySelector
                    id="country"
                    name="country"
                    value={data.country}
                    className="mt-1 block w-full"
                    autoComplete="country"
                    onChange={(e) => setData("country", e.target.label)}
                    // required
                />
                <InputError message={errors.country} className="mt-2" />
            </div>

            {/* Image */}
            <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4">
                <InputLabel htmlFor="img" value="Image" />
                {data.img ? (
                    <img
                        src={URL.createObjectURL(data.img)}
                        alt="hub image"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <img
                        src={hub.image_url}
                        alt="hub image"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                )}

                <input
                    type="file"
                    name="img"
                    onChange={(e) => setData("img", e.target.files[0])}
                    className="border-gray-300 focus:border-blue-900 focus:ring-blue-900 rounded-md shadow-sm mt-1 block w-full"
                    aria-label="Image"
                />
                <InputError message={errors.image} className="mt-2" />
            </div>

            {/* Color */}
            <div>
                <InputLabel htmlFor="color" value="Color" />

                <input
                    type="color"
                    name="color"
                    value={data.color ?? "#ffffff"}
                    onChange={(e) => setData("color", e.target.value)}
                    className="w-32 h-10 rounded-md shadow-sm mt-1 block"
                    aria-label="Color"
                />

                <InputError message={errors.color} className="mt-2" />
            </div>
            <div className="flex items-center justify-end mt-4">
                <PrimaryButton className="ml-4" type="submit">
                    Edit
                </PrimaryButton>
            </div>
        </form>
    );
}
