import { FaTrash } from "react-icons/fa";
import { useContext } from "react";
import { AlertContext } from "@/Context/AlertContext";

export default function DeleteButton({ itemId, userId, onDelete, itemType }) {
    const { showAlert } = useContext(AlertContext);

    const handleDelete = (itemId) => {
        if (
            window.confirm(`Are you sure you want to delete this ${itemType}?`)
        ) {
            axios
                .delete(route(`${itemType}.destroy`), {
                    data: {
                        id: itemId,
                        user_id: userId,
                    },
                })
                .then((response) => {
                    if (response.data.success) {
                        showAlert(
                            "success",
                            `${itemType} deleted successfully`
                        );
                        onDelete(itemId);
                    } else {
                        console.error(`Failed to delete the ${itemType}`);
                        showAlert("error", `Failed to delete the ${itemType}`);
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    };

    return (
        <button
            className="text-red-500 hover:text-red-700 transition-colors duration-300 hover:scale-125"
            onClick={() => handleDelete(itemId)}
            aria-label="Delete"
        >
            <FaTrash />
        </button>
    );
}
