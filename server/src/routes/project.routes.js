const express = require('express');
const router = express.Router();
const {
    getProjects,
    createProject,
    updateProject,
    updateProjectStatus,
    updateProjectPriority,
    deleteProject,
    getProjectById,
    createSubProject,
    updateSubProject,
    deleteSubProject,
    addNote,
    deleteNote
} = require('../controllers/project.controller');
const { protect } = require('../middleware/auth.middleware');

router.route('/')
    .get(protect, getProjects)
    .post(protect, createProject);

router.route('/:id')
    .put(protect, updateProject)
    .delete(protect, deleteProject);

router.get('/:id', protect, getProjectById);

router.post('/:id/subprojects', protect, createSubProject);
router.put('/subprojects/:subProjectId', protect, updateSubProject);
router.delete('/subprojects/:subProjectId', protect, deleteSubProject);

router.post('/:id/notes', protect, addNote);
router.delete('/notes/:noteId', protect, deleteNote);

router.patch('/:id/status', protect, updateProjectStatus);
router.patch('/:id/priority', protect, updateProjectPriority);

module.exports = router;
