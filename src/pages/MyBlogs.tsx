import React, { useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { useNavigate } from "react-router-dom";
import "./MyBlogs.css";

export default function MyBlogs() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [pendingDelete, setPendingDelete] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyBlogs = async () => {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;

        if (!user) {
            setError("There is something wrong.");
            return;
        }

        const { data, error } = await supabase
            .from("blogs")
            .select("*")
            .eq("author_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            setError("Failed to load your blog. Try again.");
        } else {
            setBlogs(data ?? []);
        }
        };
        fetchMyBlogs();
    }, []);

    const markForDelete = (id: string) => {
        setPendingDelete(id); // you need confirmation to delete
    };

    const cancelDelete = () => {
        setPendingDelete(null); // cancel delete
    };

    const confirmDelete = async (id: string) => {
        const { error } = await supabase.from("blogs").delete().eq("id", id);

        if (error) {
        setError("Failed to delete blog. Please try again.");
        } else {
        setBlogs((prev) => prev.filter((b) => b.id !== id));
        }

        setPendingDelete(null); // will not delete if there is an error
    };

    if (error) return <p className="errorMessage">{error}</p>;

    return (
        <div className="MyBlogsHeader">
        <div className="myBlogsPage">
            <h2>Your Blogs</h2>
            <div className="bloglists">
            {blogs.length === 0 ? (
                <p>You haven't posted any blogs yet.</p>
            ) : (
                blogs.map((blog) => (
                <div key={blog.id} className="blogCard">
                    {blog.image_url ? (
                    <img
                        src={blog.image_url}
                        alt={blog.title}
                        className="blogImage"
                    />
                    ) : (
                    <div className="blogImagePlaceholder">No image</div>
                    )}
                    <div className="blogContent">
                    <h3 className="blogTitle">{blog.title}</h3>
                    <p className="blogDate">
                        {new Date(blog.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        })}
                    </p>
                    <p className="blogSnippet">
                        {blog.content.length > 100
                        ? blog.content.substring(0, 100) + "..."
                        : blog.content}
                    </p>
                    <button
                        onClick={() => navigate(`/edit/${blog.id}`)}
                        className="btn"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => navigate(`/blog/${blog.id}`)}
                        className="btn"
                    >
                        View
                    </button>

                    {pendingDelete === blog.id ? (
                        <div className="deleteConfirm">
                        <span>✅ Confirm delete?</span>
                        <button
                            onClick={() => confirmDelete(blog.id)}
                            className="btn danger"
                        >
                            Yes
                        </button>
                        <button onClick={cancelDelete} className="btn">
                            Cancel
                        </button>
                        </div>
                    ) : (
                        <button
                        onClick={() => markForDelete(blog.id)}
                        className="btn danger"
                        >
                        Delete
                        </button>
                    )}
                    </div>
                </div>
                ))
            )}
            </div>
        </div>
        </div>
    );
}