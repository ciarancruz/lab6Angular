import { Injectable } from '@angular/core';
import { Recipe } from './recipe';

@Injectable({
  providedIn: 'root'
})
export class FoodRecipesService {

  constructor() { }

  recipeList: Recipe[] = [
    {
      id: 1,
      recipeName: "Carbonara",
      description: "A creamy pasta dish with eggs, cheese, pancetta, and pepper.",
      servings: 4,
      cusineType: "Italian",
      favourite: true
    },
    {
      id: 2,
      recipeName: "Chicken Curry",
      description: "A spicy and flavorful chicken curry with aromatic spices.",
      servings: 6,
      cusineType: "Indian",
      favourite: false
    },
    {
      id: 3,
      recipeName: "Sushi",
      description: "Japanese dish made with vinegared rice, seafood, and vegetables.",
      servings: 2,
      cusineType: "Japanese",
      favourite: true
    },
    {
      id: 4,
      recipeName: "Tacos",
      description: "Mexican dish consisting of a folded or rolled tortilla filled with various fillings.",
      servings: 4,
      cusineType: "Mexican",
      favourite: false
    },
    {
      id: 5,
      recipeName: "Caesar Salad",
      description: "A classic salad with romaine lettuce, croutons, Parmesan, and Caesar dressing.",
      servings: 2,
      cusineType: "American",
      favourite: true
    },
    {
      id: 6,
      recipeName: "Vegetable Stir-fry",
      description: "A healthy stir-fry with mixed vegetables, soy sauce, and sesame oil.",
      servings: 3,
      cusineType: "Chinese",
      favourite: false
    },
    {
      id: 7,
      recipeName: "Beef Stroganoff",
      description: "A rich and creamy beef dish served over noodles or rice.",
      servings: 5,
      cusineType: "Russian",
      favourite: true
    },
    {
      id: 8,
      recipeName: "Falafel",
      description: "Deep-fried balls made from chickpeas and herbs, often served in pita bread.",
      servings: 4,
      cusineType: "Middle Eastern",
      favourite: false
    }
  ];

  getAllRecipes(): Recipe[] {
    return this.recipeList
  }

  getFavouriteRecipes(): Recipe[] {
    return this.recipeList.filter((recipe) => recipe.favourite === true);
  }
}
