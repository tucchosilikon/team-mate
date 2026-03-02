import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '../store/useStore';
import api from '../api/axios';

const BlogEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useStore();
    
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [status, setStatus] = useState('DRAFT');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (id) {
            loadBlog();
        }
    }, [id]);

    const loadBlog = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/blogs/${id}`);
            setTitle(data.title);
            setSlug(data.slug);
            setContent(data.content);
            setExcerpt(data.excerpt || '');
            setCoverImage(data.coverImage || '');
            setStatus(data.status);
        } catch (error) {
            alert('Failed to load blog');
            navigate('/blogs');
        }
        setLoading(false);
    };

    const generateSlug = (text) => {
        return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!slug || slug === generateSlug(title)) {
            setSlug(generateSlug(newTitle));
        }
    };

    const handleSave = async (publish = false) => {
        setSaving(true);
        const blogData = {
            title,
            slug,
            content,
            excerpt,
            coverImage,
            status: publish ? 'PUBLISHED' : status
        };

        try {
            if (id) {
                await api.put(`/blogs/${id}`, blogData);
            } else {
                await api.post('/blogs', blogData);
            }
            navigate('/blogs');
        } catch (error) {
            alert('Failed to save blog');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <div style={{ background: 'white', padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                        ←
                    </button>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                        {id ? 'Edit Blog Post' : 'New Blog Post'}
                    </h1>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={() => handleSave(false)} 
                        disabled={saving}
                        style={{ padding: '8px 20px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
                    >
                        {saving ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button 
                        onClick={() => handleSave(true)} 
                        disabled={saving}
                        style={{ padding: '8px 20px', border: 'none', borderRadius: '6px', background: '#2563eb', color: 'white', cursor: 'pointer' }}
                    >
                        {saving ? 'Publishing...' : 'Publish'}
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ background: 'white', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="Enter blog title"
                        style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '1.1rem' }}
                    />
                </div>

                <div style={{ background: 'white', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Slug</label>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="blog-url-slug"
                        style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontFamily: 'monospace' }}
                    />
                </div>

                <div style={{ background: 'white', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Cover Image URL</label>
                    <input
                        type="text"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                    />
                    {coverImage && (
                        <img src={coverImage} alt="Preview" style={{ marginTop: '12px', maxWidth: '100%', borderRadius: '6px', maxHeight: '200px', objectFit: 'cover' }} />
                    )}
                </div>

                <div style={{ background: 'white', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Excerpt</label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief summary of the blog post"
                        rows={3}
                        style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }}
                    />
                </div>

                <div style={{ background: 'white', borderRadius: '8px', padding: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your blog content here..."
                        rows={15}
                        style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default BlogEditor;
