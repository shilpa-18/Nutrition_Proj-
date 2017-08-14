const express = require('express');
const router = express.Router();

// REQUIRE MODEL
const Recipe = require('../models/recipe.js');

router.get('/all', (req, res) => {
	console.log('------------------------------------------');
	console.log('in recipe_controller .get /all');
	console.log('req.user:', req.user);
	Recipe.recipesForUser(parseInt(req.user.id))
		.then(recipes => {
			console.log('recipes retrieved: ', recipes)
			res.json({ recipes })
		})
		.catch(err => console.error(err));
});


router.post('/new', Recipe.useAPI) 

router.delete('/delete/:id', (req, res) => {

	let recipeID = parseInt(req.params.id);

	Recipe.delete(recipeID)
		.then(res.json({ status: true, message: 'Recipe delete' }))
		.catch(err => console.error(err));
});

module.exports = router;