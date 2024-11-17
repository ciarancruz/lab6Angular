import { Component, inject } from '@angular/core';
import { RecipesComponent } from '../recipes/recipes.component';
import { CommonModule } from '@angular/common';
import { Recipe } from '../recipe';
import { FoodRecipesService } from '../food-recipes.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RecipesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  foodRecipeService: FoodRecipesService = inject(FoodRecipesService);

  recipeList: Recipe[] = [];
  filteredRecipeList: Recipe[] = [];

  constructor() {
    this.recipeList = this.foodRecipeService.getAllRecipes();
    this.filteredRecipeList = this.recipeList;
  }

  filterResults(isFavourite: string) {
    if (isFavourite === "False") {
      this.filteredRecipeList = this.recipeList
      return
    }

    this.filteredRecipeList = this.foodRecipeService.getFavouriteRecipes();

  }
}
