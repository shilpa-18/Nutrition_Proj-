const db = require('../config/config');
const axios = require('axios');

const Recipe = {};

// CREATES A RECIPE
// INSERTS INTO DATABASE
Recipe.create = (recipe) => {
	return db.none(`INSERT into recipes(name, recipe_id, unit, protein, sugar, calories) 
		VALUES($1, $2, $3, $4, $5, $6)`, [recipe.name, recipe.user_id, recipe.unit, recipe.protein, recipe.sugar, recipe.calories]);
}

// RETURN RECIPES BY USER ID (RECIPE_)

// GET ALL RECIPES
Recipe.get = () => {
	return db.any('SELECT * FROM recipes ORDER BY id DESC LIMIT 5');
}

// DELETE A RECIPE
Recipe.delete = (id) => {
	return db.one('DELETE FROM recipes WHERE id = $1', id);
}

// Recipe.post = (recipe) => {
// 	return db.any(`INSERT INTO * FROM recipies(name, recipe_id, unit, protein, sugar, calories) 
// 		VALUES($1, $2, $3, $4, $5, $6)`, [recipe.name, recipe.user_id, recipe.unit, recipe.protein, recipe.sugar, recipe.calories]);
// }

// useAPI
Recipe.useAPI = (req, res) => {

	//console.log(req.body);

	axios.get('https://api.edamam.com/api/nutrition-data', {
		params: {
			"app_id": "4560ff21",
			"app_key": "093d305bc6f9cce6eee7f26c445670ea",
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
			user_id: req.body.user_id
		};

		Recipe.create(recipe)
		.then(res.json({ status: true, message: 'recipe'}))
		.catch(err => console.error(err));
		
	})
	.catch(err => console.error(err));
}

module.exports = Recipe;