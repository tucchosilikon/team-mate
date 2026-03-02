import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';
import { Plus, Edit, Trash2, Globe, FileText, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const AdminBlogs = () => {
    const { blogs, fetchBlogs, deleteBlog, updateBlogStatus } = useStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs().finally(() => setLoading(false));
    }, [fetchBlogs]);

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            await deleteBlog(id);
        }
    };

    const handleToggleStatus = async (blog) => {
        const newStatus = blog.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
        await updateBlogStatus(blog.id, newStatus);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">Blog Posts</h1>
                <Link
                    to="/admin/blogs/new"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    <Plus size={20} />
                    New Post
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold tracking-wide">
                            <tr>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Author</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : blogs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        No blogs found. Go create one!
                                    </td>
                                </tr>
                            ) : (
                                blogs.map((blog) => (
                                    <tr key={blog.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {blog.title}
                                            <div className="text-xs text-slate-400 font-normal mt-1">/{blog.slug}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {blog.author?.name || 'Admin'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleToggleStatus(blog)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition hover:opacity-80 ${
                                                    blog.status === 'PUBLISHED' 
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                }`}
                                            >
                                                {blog.status === 'PUBLISHED' ? <Globe size={12} /> : <FileText size={12} />}
                                                {blog.status}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {format(new Date(blog.createdAt), 'MMM d, yyyy')}
                                            {blog.status === 'PUBLISHED' && blog.publishedAt && (
                                                <div className="text-xs text-green-600 mt-1">
                                                    Pub: {format(new Date(blog.publishedAt), 'MMM d, yyyy')}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link 
                                                    to={`/admin/blogs/${blog.id}`}
                                                    className="text-slate-400 hover:text-blue-600 transition"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(blog.id, blog.title)}
                                                    className="text-slate-400 hover:text-red-500 transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminBlogs;
