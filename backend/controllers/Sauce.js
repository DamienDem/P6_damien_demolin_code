const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.addSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [' '],
    usersdisLiked: [' '],
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({ 
        error: error 
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
        .then( sauce => {
  switch( req.body.like){
    case 1:
      sauce.usersLiked.push(req.body.userId);
      sauce.likes++;
      console.log('like');
    break;
    case -1:
      sauce.usersDisliked.push(req.body.userId);
      sauce.dislikes++;
      console.log('dislike');
    break;
    case 0:
      if(sauce.usersLiked.includes(req.body.userId)) {
        sauce.usersLiked.pull(req.body.userId);
        sauce.likes--;    
      }
      if(sauce.usersDisliked.includes(req.body.userId)) {
        sauce.usersDisliked.pull(req.body.userId);
        sauce.dislikes--;     
      }
    break;
    default:
      console.log('poukoi');
  }
  sauce.save()
  .then(() => res.status(200).json({ message: 'choice saved'}))
  .catch(error => res.status(400).json({ error }));

})
.catch(error => res.status(400).json({error}));
};