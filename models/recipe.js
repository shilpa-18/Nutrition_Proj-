const db = require('../config/config');
const axios = require('axios');

const Recipe = {};

// CREATES A RECIPE
// INSERTS INTO DATABASE
Recipe.create = (recipe) => {
	return db.none(`INSERT into recipes(name, recipe_id, unit, protein, sugar, calories) 
		VALUES($1, $2, $3, $4, $5, $6)`, [recipe.name, recipe.userId, recipe.unit, recipe.protein, recipe.sugar, recipe.calories]);
}

// RETURN RECIPES BY USER ID (RECIPE_)

// GET ALL RECIPES
Recipe.get = () => {
	return db.any('SELECT * FROM recipes ORDER BY id DESC LIMIT 5');
}

Recipe.recipesForUser = (userId) => {
	return db.any('SELECT * FROM recipes WHERE recipe_id = $1 ORDER BY id DESC LIMIT 5', [userId]);
}

// DELETE A RECIPE
Recipe.delete = (id) => {
	return db.one('DELETE FROM recipes WHERE id = $1', id);
}


// useAPI
Recipe.useAPI = (req, res) => {

	console.log(req.body);

	axios.get('https://api.edamam.com/api/nutrition-data', {
		params: {
			"app_id": process.env.EDAMAM_API_ID,
			"app_key": process.env.EDAMAM_API_KEY,
			"ingr": req.body.ingr
		}
	})
	.then(response => { 
		let recipe = { 
			name: req.body.ingr,
			protein: response.data.totalNutrients.PROCNT.quantity,
			unit: response.data.totalNutrients.PROCNT.unit,
			sugar: response.data.totalNutrients.SUGAR.quantity,
			calories: response.data.calories,
			userId: req.body.userId
		};

		Recipe.create(recipe)
		.then(res.json({ status: true, message: 'recipe'}))
		.catch(err => console.error(err));
		
	})
	.catch(err => console.error(err));
}

module.exports = Recipe;