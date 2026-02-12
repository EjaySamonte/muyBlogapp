import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "./ViewBlog.css";

export default function ViewBlog() {
    interface Comment {
        id: string;
        content: string;
        created_at: string;
        display_name: string;
        author_id: string;
        image_url?: string;
    }

    const { id } = useParams();
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentImage, setCommentImage] = useState<File | null>(null);
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [editCommentId, setEditCommentId] = useState<string | null>(null);
    const [content, setContent] = useState("");

    const startEdit = (comment: Comment) => {
        console.log("Editing comment: ", comment.id);
        setEditCommentId(comment.id);
        setContent(comment.content);
    };

    const fetchComments = useCallback(async () => {
        const { data, error } = await supabase
        .from("comments")
        .select("id, content, created_at, display_name, author_id, image_url")
        .eq("blog_id", id)
        .order("created_at", { ascending: false });

        if (error) {
        console.error("Error fetching comments:", error.message);
        setComments([]);
        } else {
        setComments(data as Comment[]);
        }
    }, [id]);

    const handleNewCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data: userData, error: userError } = await supabase.auth.getUser();
        const user = userData?.user;
        const displayName =
        `${user?.user_metadata?.first_name ?? ""}`.trim() || "Anonymous";

        if (userError || !user) {
        setError("You must be logged in to comment.");
        return;
        }

        let imageUrl = null;
        if (commentImage) {
        const fileName = `${Date.now()}-${commentImage.name}`;

        const { error: uploadError } = await supabase.storage
            .from("blog-images")
            .upload(fileName, commentImage);

        if (uploadError) {
            console.error("Upload error:", uploadError.message);
            setError(`Image Upload Failed: ${uploadError.message}`);
            return;
        }

        const { data } = supabase.storage.from("blog-images").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
        }

        const { error: insertError } = await supabase.from("comments").insert([
        {
            blog_id: id,
            content: commentText,
            author_id: user.id,
            display_name: displayName,
            image_url: imageUrl,
        },
        ]);

        if (insertError) {
        setError("Failed to post comment.");
        } else {
        setCommentText("");
        setCommentImage(null);
        await fetchComments();
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editCommentId) return;

        const { error } = await supabase
        .from("comments")
        .update({ content})
        .eq("id", editCommentId)
        .select();


        if (error) {
        setError("Failed to update comment.");
        } else {
        console.log("Update comment: ", editCommentId, content);
        setEditCommentId(null);
        // setContent("");
        await fetchComments();
        }
    };

    const handleDelete = async (commentId: string) => {
        const {error} = await supabase.from("comments").delete().eq("id", commentId);
        if (error) {
        setError("Failed to delete blog. Please try again.");
        } else {
            await fetchComments();
        }
    };

    useEffect(() => {
        const fetchBlog = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("blogs")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            setError("Failed to load a blog. Please try again.");
        } else {
            setBlog(data);
        }
        setLoading(false);
        };

        const fetchUser = async () => {
        const { data } = await supabase.auth.getUser();
        setUserId(data?.user?.id ?? null);
        };

        fetchBlog();
        fetchComments();
        fetchUser();
    }, [id, fetchComments]);

    if (loading) return <p>Please wait...</p>;
    if (error) return <p className="errorMessage">{error}</p>;
    if (!blog) return <p>No blog found</p>;

    return (
        <div className="viewBlogHeader">
        <div className="viewBlogPage">
            <h2>{blog.title}</h2>
            <p className="blogDate">
            {new Date(blog.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })}
            </p>
            {blog.image_url ? (
            <img src={blog.image_url} alt={blog.title} className="blogImage" />
            ) : (
            <div className="noBlogImage"></div>
            )}
            <p className="blogContent">{blog.content}</p>
        </div>

        <form onSubmit={handleNewCommentSubmit} className="commentBox">
            <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
            }}
            placeholder="Write your comment..."
            required />
            <input
            type="file"
            accept="image/*"
            onChange={(e) => setCommentImage(e.target.files?.[0] ?? null)} />
            <button type="submit">Post a comment</button>
        </form>

        <div className="commentList">
            <h3>Comments</h3>
            {comments.length === 0 ? (
            <p>No comments yet.</p>
            ) : (
            comments.map((comment) => (
                <div key={comment.id} className="commentItem">
                {editCommentId === comment.id ? (
                    <form onSubmit={handleEditSubmit} className="editCommentForm">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Edit your comment"
                    />
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditCommentId(null)}>
                        Cancel
                    </button>
                    </form>
                ) : (
                    <>
                    <p>
                        <strong>{comment.display_name}</strong>: {comment.content}
                    </p>
                    <div className="imageShow">
                        {comment.image_url && (
                            <img
                            src={comment.image_url}
                            alt="comment attachment"
                            className="commentImage"
                            />
                        )}
                    </div>
                    <span className="commentDate">
                        {new Date(comment.created_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                    {comment.author_id === userId && (
                        <div className="commentActions">
                        <button onClick={() => handleDelete(comment.id)}>
                            Delete
                        </button>
                        <button onClick={() => startEdit(comment)}>Edit</button>
                        </div>
                    )}
                    </>
                )}
                </div>
            ))
            )}
        </div>
        </div>
    );
}