import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import api from '../api/axios';
import { ArrowLeft } from 'lucide-react';

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const { data } = await api.get(`/blogs/${id}`);
                if (data.status === 'PUBLISHED' || data.status === 'DRAFT') {
                    setBlog(data);
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <PublicLayout>
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </PublicLayout>
        );
    }

    if (!blog) {
        return (
            <PublicLayout>
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <p style={{ color: '#666', marginBottom: '20px' }}>Blog post not found.</p>
                    <Link to="/blog" style={{ color: 'var(--landing-primary)' }}>← Back to Blog</Link>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
                <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', marginBottom: '32px' }}>
                    <ArrowLeft size={20} /> Back to Blog
                </Link>

                {blog.coverImage && (
                    <img
                        src={blog.coverImage}
                        alt={blog.title}
                        style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '32px' }}
                    />
                )}

                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '16px', color: 'var(--landing-navy)', lineHeight: '1.2' }}>
                    {blog.title}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', color: '#666', fontSize: '0.9rem' }}>
                    <span>{blog.author?.name || 'Admin'}</span>
                    <span>•</span>
                    <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                </div>

                <div style={{ lineHeight: '1.8', fontSize: '1.1rem', color: '#333' }} dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
        </PublicLayout>
    );
};

export default BlogDetail;
