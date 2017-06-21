const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const projectController = require('../controllers/projectController');

// Do work here
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Support My Project'
  })
});

router.get('/register', userController.registerForm)
router.post('/register',
  userController.validateRegister,
  userController.register,
  authController.login);

router.get('/login', userController.getLogin);
router.post('/login', authController.login);
router.get('/auth/facebook', authController.facebookLogin);
// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback', authController.facebookLoginCallback);
router.get('/logout', authController.logout);
router.get('/dashboard', userController.getDashboard);
router.get('/project/:slug', projectController.getProjectPage);
router.get('/project/create/new', authController.isLoggedIn, projectController.getProjectForm);
router.post('/project/new', projectController.createProject);
router.get('/project/:slug/story', projectController.getProjectForm);
router.post('/project/:slug/story', projectController.addProjectStory);
router.get('/project/:slug/media', projectController.getProjectForm);
router.post('/project/:slug/media', projectController.upload, projectController.uploadMedia);
router.get('/project/:slug/team', projectController.getProjectForm);
router.post('/project/:slug/team', projectController.addProjectTeam);
router.get('/projects', projectController.getProjects);
router.get('/projects/:tag', projectController.getProjects);
// Edit Routes
router.get('/project/:id/edit/info', projectController.editProject);
router.post('/project/:id/edit/info', projectController.editProjectInfo);
router.get('/project/:id/edit/story', projectController.editProject);
router.post('/project/:id/edit/story', projectController.editProjectStory);
router.get('/project/:id/edit/media', projectController.editProject);
router.post('/project/:id/edit/media', projectController.editProjectMedia);
router.get('/project/:id/edit/team', projectController.editProject);
router.post('/project/:id/edit/team', projectController.editProjectTeam);
// API

router.get('/api/search', projectController.searchProjects);

module.exports = router;
