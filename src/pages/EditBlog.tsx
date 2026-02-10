import React, { useEffect, useState} from "react";
import { supabase } from "../supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import './EditBlog.css';

export default function EditBlog() {
    const { id } = useParams();
    console.log("Editlog ID:", id)
    const navigate = useNavigate();
    const [ , setError] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState ("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [removeImage, setRemoveImage] = useState(false);
    const [imageURL, setImageURL] = useState<string | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    

    useEffect(() => {
        const fetchBlog = async() => {
            const { data, error } = await supabase
            .from('blogs')
            .select("*")
            .eq("id", id)
            .single();

            if (!error && data) {
                setTitle(data.title);
                setContent(data.content);
                setImageURL(data.image_url);
            }
        };
        fetchBlog();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        let imageURL: string | null = null;

        if(imageFile) {
            const fileName = `${Date.now()}-${imageFile.name}`;
            const {error: uploadError} = await supabase.storage.from("blog-images").upload(fileName, imageFile);

            if (uploadError) {
                console.error("Upload error", uploadError.message)
                setError(`Image upload failed: ${uploadError.message}`)
            }

            const {data} = supabase.storage.from("blog-images").getPublicUrl(fileName);
            imageURL = data.publicUrl;
        }

        if(removeImage) {
            imageURL = null;
        }
        
        const { error } = await supabase
            .from("blogs")
            .update({ title, content, ...(imageURL !== null ? { image_url: imageURL } : removeImage ? { image_url: null } : {}),})
            .eq("id", id);
        if (error) {
            console.error("Error updating blog:", error.message);
            setError("Failed to update blog.");
        } else {
            navigate(`/blog/${id}`);
        }
        };

        const handleCancel = () => {
            navigate("/my-blogs")
        }
        

    return (
        <div className="editBlogHeader">
            <div className="editBlog">
                <form onSubmit={handleUpdate} className="editBlogForm">
                    <button className="backButton" onClick={() => navigate(-1)}>← Back</button>
                    <h2>Edit blog</h2>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                    placeholder="Blog Title" />
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type here." />
                    {!removeImage && (
                    <div className="imagePreview">
                        {previewURL ? (
                        <img src={previewURL} alt="New preview" className="previewImage" />
                        ) : (
                        imageURL && <img src={imageURL} alt="Current blog image" className="previewImage" />
                        )}
                    </div>
                    )}  
                    <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setImageFile(file);
                        if (file) {
                            setPreviewURL(URL.createObjectURL(file));
                        } else {
                            setPreviewURL(null);
                        }
                    }}></input>
                    <label className="tickedbox">
                        <p className="ticked-name">Remove Image? </p>
                        <input type="checkbox" checked={removeImage} onChange={(e) => setRemoveImage(e.target.checked)} />
                    </label>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={handleCancel} className="cancelButton">Cancel</button>
                </form>
            </div>
        </div>
    )
}