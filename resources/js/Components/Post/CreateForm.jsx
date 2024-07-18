import React from "react";

import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm } from "@inertiajs/react";
import CountrySelector from "@/Components/CountrySelector";
import TextArea from "@/Components/TextArea";
import Select from "react-select";

export default function CreateForm({ hub, tags }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        content_body: "",
        hub_id: hub.id,
        img: null,
        tags: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("post.store"));
    };

    const tagOptions = tags.map((tag) => ({ value: tag.id, label: tag.name }));

    return (
        <form onSubmit={submit}>
            <div className="space-y-6 max-w-3xl mx-auto py-10 bg-white p-4">
                {/* Title */}
                <div>
                    <InputLabel htmlFor="title" value="Title" />

                    <TextInput
                        id="title"
                        name="title"
                        value={data.title}
                        className="mt-1 block w-full"
                        autoComplete="title"
                        isFocused={true}
                        onChange={(e) => setData("title", e.target.value)}
                        // required
                    />

                    <InputError message={errors.title} className="mt-2" />
                </div>

                {/* content_body */}
                <div>
                    <InputLabel htmlFor="content_body" value="content_body" />

                    <TextArea
                        id="content_body"
                        name="content_body"
                        value={data.content_body}
                        className="mt-1 block w-full"
                        autoComplete="content_body"
                        isFocused={true}
                        onChange={(e) =>
                            setData("content_body", e.target.value)
                        }
                        // required
                    />

                    <InputError
                        message={errors.content_body}
                        className="mt-2"
                    />
                </div>
                <div>
                    <InputLabel htmlFor="tags" value="Tags" />
                    <Select
                        name="tags"
                        id="tags"
                        isMulti
                        className="basic-multi-select"
                        classNamePrefix="select"
                        options={tagOptions}
                        onChange={(selectedOptions) =>
                            setData(
                                "tags",
                                selectedOptions.map((option) => option.value)
                            )
                        }
                        aria-label="Tags"
                    />
                    <InputError message={errors.tags} className="mt-2" />
                </div>

                {/* imgae upload */}
                <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4">
                    <InputLabel htmlFor="img" value="Image" />
                    {data.img && (
                        <img
                            src={URL.createObjectURL(data.img)}
                            className="h-28 object-cover"
                            alt="uploaded image"
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

                <div className="flex justify-end">
                    <PrimaryButton className="ml-4" type="submit">
                        Create Post
                    </PrimaryButton>
                </div>
            </div>
        </form>
    );
}
