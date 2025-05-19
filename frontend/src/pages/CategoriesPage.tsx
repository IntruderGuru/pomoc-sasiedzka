import { useEffect, useState } from "react";
import {createCategory, fetchCategories, removeCategory, updateCategory} from "../services/AdminService";
import { useForm } from "react-hook-form";
import {Toast} from "../components/Toast.tsx";
import {Spinner} from "../components/Spinner.tsx";
import {ConfirmModal} from "../components/ConfirmModal.tsx";

export const CategoriesPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const { register, handleSubmit, reset } = useForm({ defaultValues: { name: "" } });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const _categories = await fetchCategories();
        setCategories(_categories.data);
        setLoading(false);
    }


    const onSubmit = async (data) => {
        if (editing) {
            await updateCategory(editing.id, data);
            Toast.success("Category updated");
        } else {
            await createCategory(data);
            Toast.success("Category added");
        }

        reset();
        setEditing(null);
        loadCategories();
    };

    const handleDelete = async () => {
        await removeCategory(editing.id);
        Toast.success("Category deleted");
        setShowConfirm(false);
        setEditing(null);
        loadCategories();
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Categories</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 mb-4">
                <input
                    {...register("name", { required: true })}
                    placeholder="Category name"
                    className="border p-2 rounded w-full"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 rounded">
                    {editing ? "Update" : "Add"}
                </button>
                {editing && (
                    <button
                        type="button"
                        className="text-gray-600 underline"
                        onClick={() => {
                            reset();
                            setEditing(null);
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <ul className="space-y-2">
                {categories.map((cat) => (
                    <li
                        key={cat.id}
                        className="bg-white p-3 flex justify-between items-center rounded shadow"
                    >
                        <span>{cat.name}</span>
                        <div className="space-x-2">
                            <button onClick={() => { setEditing(cat); reset({ name: cat.name }); }}>
                                Edit
                            </button>
                            <button
                                onClick={() => { setEditing(cat); setShowConfirm(true); }}
                                className="text-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {showConfirm && (
                <ConfirmModal
                    title="Delete category?"
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirm(false)}
                >
                    Are you sure you want to delete "{editing.name}"?
                </ConfirmModal>
            )}
        </div>
    );
};
