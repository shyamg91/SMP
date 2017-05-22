const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('slugs');

const projectSchema = new Schema({
  name: {
    type: String,
    required: 'Please give your project a name'
  },
  slug: String,
  cover: String,
  photos: [String],
  story: String,
  tagline: String,
  team: [String],
  user: String
});

projectSchema.pre('save', async function (next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);
  const slugRegEx = new RegExp(`^(${this.name})((-[0-9]*$)?)`, 'i');
  const projectWithRegEx = await this.constructor.find({
    'slug': slugRegEx
  });
  if (projectWithRegEx.length) {
    this.slug = `${this.name} - ${projectWithRegEx.length + 1}`;
  }
  next();
})

module.exports = mongoose.model('Project', projectSchema);