const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const { body, validationResult } = require('express-validator');

const getBlogs = async (req, res) => {
    try {
        const { status } = req.query;
        const where = status ? { status } : {};
        
        const blogs = await prisma.blog.findMany({
            where,
            include: { author: { select: { name: true, email: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await prisma.blog.findUnique({
            where: { id },
            include: { author: { select: { name: true, email: true } } }
        });
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createBlog = async (req, res) => {
    try {
        const { title, slug, content, excerpt, coverImage, status } = req.body;
        
        const blog = await prisma.blog.create({
            data: {
                title,
                slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                content,
                excerpt,
                coverImage,
                status: status || 'DRAFT',
                publishedAt: status === 'PUBLISHED' ? new Date() : null,
                authorId: req.user?.id
            }
        });
        
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, slug, content, excerpt, coverImage, status } = req.body;
        
        const updateData = {
            title,
            slug,
            content,
            excerpt,
            coverImage,
            status
        };
        
        if (status === 'PUBLISHED') {
            const existing = await prisma.blog.findUnique({ where: { id } });
            if (!existing.publishedAt) {
                updateData.publishedAt = new Date();
            }
        }
        
        const blog = await prisma.blog.update({
            where: { id },
            data: updateData
        });
        
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.blog.delete({ where: { id } });
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog
};
