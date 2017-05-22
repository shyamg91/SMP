var mongoose = require('mongoose');
const Project = mongoose.model('Project');
const User = mongoose.model('User');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
aws.config.loadFromPath('./handlers/awsConfig.js'); 
const s3 = new aws.S3();

var upload = multer({
  storage: multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: `${process.env.AWS_BUCKET}/yo`,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname); //use Date.now() for unique file keys
    },
    fileFilter: function (req, file, next) {
      const isPhoto = file.mimetype.startsWith('image/');
      if (isPhoto) {
        next(null, true);
      }
      else {
        next({ message: 'That file type isnt allowed' }, false);
      }
    }
  })
});

exports.getProjectForm = (req, res) => {
  res.render('project', {
    title: 'Tell us more',
    slug: req.params.slug
  })
}

exports.createProject = async (req, res) => {
  const project = await (new Project({
    name: req.body.name,
    tagline: req.body.tagline
  })).save();
  const user = await User.findOne({
    '_id' : req.user._id
  });
  if(!user.projects || user.projects.length === 0){
    user.projects = [];
  }
  user.projects.push(project._id.toString());
  await user.save();
  console.log("project", project);
  res.redirect(`/project/${project.slug}/story`)
  console.log("redirect");
}

exports.addProjectStory = async (req, res) => {
  const project = await Project.findOne({
    slug: req.params.slug
  });

  project.story = req.body.story;
  await project.save();
  res.redirect(`/project/${project.slug}/media`);
}

exports.upload = upload.single('photo');

exports.uploadMedia = async (req, res, next) => {
  const project = await Project.findOne({
    'slug': req.params.slug
  });
  console.log(req.file);
  project.cover = req.file.location;
  await project.save();
  res.redirect(`/project/${project.slug}/team`);
}

exports.addProjectTeam = async (req,res) => {
  const project = await Project.findOne({
    'slug' : req.params.slug
  });

  const team = req.body.team.split(',');
  console.log(team);
  project.team = team;
  await project.save();
  res.redirect('/projects');
}

exports.getProjects = async (req,res) => {
  const projects = await Project.find({});
  console.log(projects);
  res.render('projects',{
    'title' : 'Projects',
    projects
  });
}

exports.editProject = async (req,res) => {
  const project = await Project.findOne({
    '_id' : req.params.id
  });
  console.log(project);
  res.render('editProject',{
    project
  })
}

exports.editProjectInfo = async (req,res) => {
  const project = await Project.findOne({
    '_id' : req.params.id
  });

  project.name = req.body.name;
  project.tagline = req.body.tagline;

  await project.save();
  res.redirect(`/project/${project._id}/edit/story`)
}

exports.editProjectStory = async (req,res) => {
  const project = await Project.findOne({
    '_id' : req.params.id
  });

  project.story = req.body.story;

  await project.save();
  res.redirect(`/project/${project._id}/edit/team`)
}

exports.editProjectMedia = async (req,res) => {
  const project = await Project.findOne({
    '_id' : req.params.id
  });
  res.redirect(`/project/${project._id}/edit/team`)
}
exports.editProjectTeam = async (req,res) => {
  const project = await Project.findOne({
    '_id' : req.params.id
  });

  const team = req.body.team.split(',');
  project.team = team;

  await project.save();
  res.redirect(`/projects`)
}