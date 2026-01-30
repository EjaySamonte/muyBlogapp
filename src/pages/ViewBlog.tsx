import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase/client";
import "./ViewBlog.css";

export default function ViewBlog() {
    interface Comment {
        content: string;
        created_at: string;
        display_name: string;
    }

    const { id } = useParams();
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = useCallback(async () => {
        const { data, error } = await supabase
        .from("comments")
        .select("content, created_at, display_name")
        .eq("blog_id", id)
        .order("created_at", { ascending: false });

        if (error) {
        console.error("Error fetching comments:", error.message);
        setComments([]);
        } else {
        setComments(data as Comment[]);
        console.log("Fetched comments", data);
        }
    }, [id]);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data: userData, error: userError } = await supabase.auth.getUser();
        const user = userData?.user;
        const displayName =
        `${user?.user_metadata?.first_name ?? ""}`.trim() || "Anonymous";

        if (userError || !user) {
        setError("You must be logged in to comment.");
        return;
        }

        const { error: insertError } = await supabase
        .from("comments")
        .insert([
            {
            blog_id: id,
            content: commentText,
            author_id: user.id,
            display_name: displayName,
            },
        ]);

        if (insertError) {
        setError("Failed to post comment.");
        } else {
        setCommentText("");
        await fetchComments(); // refresh comments after posting
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

        fetchBlog();
        fetchComments();
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

        <form onSubmit={handleCommentSubmit} className="commentBox">
            <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            required
            />
            <button type="submit">Post a comment</button>
        </form>

        <div className="commentList">
            <h3>Comments</h3>
            {comments.length === 0 ? (
            <p>No comments yet.</p>
            ) : (
            comments.map((comment, index) => (
                <div key={index} className="commentItem">
                <p>
                    <strong>{comment.display_name}</strong>: {comment.content}
                </p>
                <span className="commentDate">
                    {new Date(comment.created_at).toLocaleString()}
                </span>
                </div>
            ))
            )}
        </div>
        </div>
    );
}