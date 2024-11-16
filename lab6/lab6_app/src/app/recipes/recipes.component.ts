import { Component, input, Input} from '@angular/core';
import { Recipe } from '../recipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent {
  @Input() recipe!: Recipe;
}
