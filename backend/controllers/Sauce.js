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
  switch( req.body.like ){
    case 1:
      Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 }})
      .then(() => res.status(200).json({ message: 'Like !'}))
      .catch(error => res.status(400).json({ error }));
      console.log('like');
      break;
    case -1:
      Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 }})
      .then(() => res.status(200).json({ message: 'Dislike !'}))
      .catch(error => res.status(400).json({ error }));
      console.log('dislike');
      break;
    case 0:
      Sauce.findOne({ _id: req.params.id })
    .then((sauce =>
      {
      if(sauce.usersLiked.includes(req.body.userId))  
      {
        Sauce.updateOne({ _id: req.params.id}, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 }})
        .then(() => res.status(200).json({ message: 'Remove Like !'}))
        .catch((error) => res.status(400).json({ error }))
      }
      if(sauce.usersDisliked.includes(req.body.userId))
      {
        Sauce.updateOne({_id: req.params.id}, { $pull: { usersdisLiked: req.body.userId }, $inc : {dislikes: -1}})
        .then(() => res.status(200).json({ message: 'Remove Dislike !'}))
        .catch((error) => res.status(400).json({ error }))
      }
    }))
    .catch((error) => res.status(404).json({ error }))
      break;
    default:
      console.log(error);
  }
};