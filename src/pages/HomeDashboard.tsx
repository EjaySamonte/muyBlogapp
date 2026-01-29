import React, { useState, useEffect} from "react";
// import { logoutUser } from "../features/auth/authService";
import { useNavigate } from "react-router-dom";
import './HomeDashboard.css';
import { supabase } from "../supabase/client";

export default function HomeDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = async () => {
            setLoading(true);

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

        if (userError || !user) {
            setError("User not authenticated");
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.from("blogs").select("*").order('created_at', { ascending: false });

        if (error) {
            setError("Failed to load blogs")
        } else {
            setBlogs(data || []);
            console.log("Fetched blogs:", data[0]);
        }
        setLoading(false);
    };

    useEffect(() => {
    fetchBlogs();
    }, []);

    return (
        <div className="thisbody">
            <section className="home" id="home">
                <div className="home-content">
                    <h2 className="headingblog">Blogs</h2>
                    { loading && <p>Loading...</p>}
                    {error && <p className="errorMessage">{error}</p>}
                    <div className="bloglist">
                        {blogs.length === 0 && !loading && <p>No blogs posted yet. Create first!</p>}
                        {blogs.map((blog) => (
                            blog.id ? (
                            <div key={blog.id} className="blogCard">
                                {blog.image_url ? (<img src={blog.image_url} alt={blog.title} className="blogImage" />
                                ) : (
                                <div className="blogImagePlaceholder">No image</div>
                                )}
                                <h3 className="blogTitle">{blog.title}</h3>
                                <p className="blogDate">
                                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </p>
                                <p className="blogContent">
                                    {blog.content.length > 100 ? blog.content.substring(0, 100) + "...": blog.content}
                                </p>
                                <button className="viewblogbutton" onClick={() => navigate(`/blog/${blog.id}`)}>View Blog</button>
                            </div>
                            ) : null
                        ))}
                    </div>
                </div>
            </section>           
        </div>
    )
}
        
