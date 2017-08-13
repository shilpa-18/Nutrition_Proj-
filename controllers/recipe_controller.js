const express = require('express');
const router = express.Router();

// REQUIRE MODEL
const Recipe = require('../models/recipe.js');

router.get('/all', (req, res) => {
	Recipe.get()
		.then(recipes => res.json({ recipes }))
		.catch(err => console.error(err));
});

// ROUTE FOR GETTING RECIPES BY USER

router.post('/new', Recipe.useAPI) 

router.delete('/delete/:id', (req, res) => {

	let recipeID = parseInt(req.params.id);

	Recipe.delete(recipeID)
		.then(res.json({ status: true, message: 'Recipe delete' }))
		.catch(err => console.error(err));
});

module.exports = router;