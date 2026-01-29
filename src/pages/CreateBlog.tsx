import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase/client";
import './CreateBlog.css'

export default function CreateBlog() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    // const user = supabase.auth.getUser();
    const navigate = useNavigate();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        let imageURL = null;

        if(imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`;
            const { error: uploadError} = await supabase.storage.from('blog-images').upload(fileName, imageFile);

            if (uploadError) {
                console.error("Upload error:", uploadError.message)
                setError(`Image Upload Failed: ${uploadError.message}`);
                return;
            }
            const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
            imageURL = data.publicUrl;
        }
        const {data: { user }, error: userError, } = await supabase.auth.getUser();

        if (userError || !user) {
            setError("User not Authenticated");
            return;
        }
        const { error: insertError } = await supabase
        .from('blogs').insert([{ title, content, image_url: imageURL, author_id: user.id }]);

        if (insertError) {
            setError("Failed to create a blog");
            setSuccess(null);
        } else {
            setSuccess("Blog created successfullly");
            setError(null);
            setTimeout(() => navigate('/dashboard'), 1500);
        }
        
    };
    return (
        <div className="headblog">
            <div className="createBlogSection">
                <h2>Create a Blog</h2>
                <form onSubmit={handleCreate} className="createBlogForm">
                    <input type="text" placeholder="Blog Title" value={title} onChange={e => setTitle(e.target.value)} required/>
                    <textarea placeholder="Blog Content" value={content} onChange={e => setContent(e.target.value)} required/>
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
                    <button type="submit">Publish</button>
                </form>
                <button className="backButton" onClick={() => navigate(-1)}>← Back</button>
                {error && <p className="errorMessage">{error}</p>}
                {success && <p className="successMessage">{success}</p>}
            </div>
        </div>
    )
}