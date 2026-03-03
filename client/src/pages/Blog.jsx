import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import PublicLayout from '../layouts/PublicLayout';

const Blog = () => {
    const { blogs, fetchBlogs } = useStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
        setLoading(false);
    }, []);

    const publishedBlogs = blogs.filter(b => b.status === 'PUBLISHED');

    return (
        <PublicLayout>
            <div className="landing-container" style={{ padding: '60px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '16px', color: 'var(--landing-navy)' }}>
                        Our Blog
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                        Latest news, tips, and insights from our property management experts
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : publishedBlogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: '#f9fafb', borderRadius: '8px' }}>
                        <p style={{ color: '#666', marginBottom: '20px' }}>No blog posts yet.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
                        {publishedBlogs.map(blog => (
                            <Link to={`/blog/${blog.id}`} key={blog.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <article style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'transform 0.2s', cursor: 'pointer' }}>
                                    {blog.coverImage && (
                                        <img 
                                            src={blog.coverImage} 
                                            alt={blog.title}
                                            style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <div style={{ padding: '24px' }}>
                                        <h2 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '12px', color: 'var(--landing-navy)' }}>
                                            {blog.title}
                                        </h2>
                                        {blog.excerpt && (
                                            <p style={{ color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
                                                {blog.excerpt}
                                            </p>
                                        )}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: '#888' }}>
                                            <span>{blog.author?.name || 'Admin'}</span>
                                            <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
};

export default Blog;
