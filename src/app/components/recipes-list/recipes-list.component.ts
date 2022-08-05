import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/models/recipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {

  recipes?: Recipe[];
  currentRecipe: Recipe = {};
  newRecipe: Recipe ={};
  currentIndex = -1;
  title = '';
  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.retrieveRecipes();
  }

  retrieveRecipes(): void {
    this.recipeService.getAll()
      .subscribe({
        next: (data) => {
          this.recipes = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }
  refreshList(): void {
    this.retrieveRecipes();
    this.currentRecipe = {};
    this.currentIndex = -1;
  }
  setActiveRecipe(recipe: Recipe, index: number): void {
    this.currentRecipe = recipe;
    this.currentIndex = index;
  }
 
  searchTitle(): void {
    this.currentRecipe = {};
    this.currentIndex = -1;
    this.recipeService.findByTitle(this.title)
      .subscribe({
        next: (data) => {
          this.recipes = data;
          console.log("find by title " + this.title + this.recipes)
          console.log(data);
          // console.log("Find by titile" + this.title)
        },
        error: (e) => console.error(e)
      });
  }

  saveRecipe(): void {
    // const data = {
    //   title: this.selectedRecipes.title,
    //   numberOfServings: this.recipe.numberOfServings,
    //   totalTime: this.recipe.totalTime,
    //   rating: this.recipe.rating
    // };

    this.recipeService.create(this.newRecipe)
      .subscribe({
        next: (res: any) => {
          console.log("New recipe id:" + res);
        },
        error: (e: any) => console.error(e)
      });
  }
  // page = 1;
  // handlePageChange(event) {
  //   this.page = event;
  // }

}
