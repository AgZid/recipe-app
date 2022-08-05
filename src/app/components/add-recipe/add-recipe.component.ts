import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css']
})
export class AddRecipeComponent implements OnInit {

  recipe: Recipe = {
    // title: '',
    // numberOfServings: 1,
    // totalTime: '',
    // rating: 0,
    // ingredients: []
  };
  
  submitted = false;
  // recipeService: any;
  constructor( private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
  }

  saveRecipe(): void {
    const data = {
      title: this.recipe.title,
      numberOfServings: this.recipe.numberOfServings,
      totalTime: this.recipe.totalTime,
      rating: this.recipe.rating
    };

    this.recipeService.create(data)
      .subscribe({
        next: (res: any) => {
          console.log("New recipe id:" + res);
          this.submitted = true;
          this.router.navigate(['/recipes/', res.id]);
        },
        error: (e: any) => console.error(e)
      });
  }

  newRecipe(): void {
    this.submitted = false;
    this.recipe = {
      title: '',
      numberOfServings: 1,
      totalTime:'',
      rating:0,
      ingredients: []
    };
  }

  isValid(): boolean {
    if (this.recipe.title?.trim().length === 0 || 
    Number(this.recipe.numberOfServings) < 0 || 
    this.recipe.numberOfServings == null ||
    Number(this.recipe.numberOfServings) % 1 > 0) {
      return false;
    } else {
      return true;
    }
  }


}
