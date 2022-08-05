import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Ingredient } from 'src/app/models/ingredient.model';
import { Recipe } from 'src/app/models/recipe.model';
import { Selectedrecipe } from 'src/app/models/selectedrecipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-selected-list',
  templateUrl: './selected-list.component.html',
  styleUrls: ['./selected-list.component.css'],
  providers: [DatePipe]
})

export class SelectedListComponent implements OnInit {
  private isButtonVisible = false;
   deleteMsg:string = "";
   selectedRecipes: Selectedrecipe[] = [];
   aggregatedIngredients = new Map<string, number>(); 


  constructor( private recipeService: RecipeService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.loadRecipesAndIngredients();
      
  }

  loadRecipesAndIngredients(): void{
    console.log("Show all selected ricipes");
    this.recipeService.getAllSelectedRecipes()
      .subscribe(data => {
        console.log(data);
        this.selectedRecipes = data;
        this.selectedRecipes.forEach(selR => this.loadSelectedRecipe(selR));
        this.loadIngredientsForSelectedRecipes();
      })
  }

  loadSelectedRecipe(selectedRecipe:Selectedrecipe): void {
    this.recipeService.get(selectedRecipe.recipeId)
    .subscribe(data => {
      selectedRecipe.recipeTitle = data.title;
    });
  }

  loadIngredientsForSelectedRecipes():void {
    this.recipeService.getAllIngredientOForSelectedRecipes()
    .subscribe(data => {
      this.aggregatedIngredients = data;
    })
  }

  onClickDelete(id: number){
    this.recipeService.deleteSelection(id)
    .subscribe(responseData=> {
        this.deleteMsg = 'Successfully deleted';
        this.loadRecipesAndIngredients();
        this.loadIngredientsForSelectedRecipes();
    }, error=>{
        this.deleteMsg = error
    });
  }


  setCodeEdit(i:number){
    this.selectedRecipes.forEach(t => t.canEditCode = false);
    this.selectedRecipes[i].canEditCode=true;
  }


  onClickUpadte(i: number) {
    var selectedId = this.selectedRecipes[i];
    this.recipeService.updateSelection(selectedId.id, this.selectedRecipes[i])
      .subscribe({
        next: (res) => {
          console.log(res);
          this.deleteMsg = 'Successfully updated';
          this.loadIngredientsForSelectedRecipes();
        },
        error: (e) => console.error(e)
      });
      this.selectedRecipes[i].canEditCode=false;
  }

  isValidSelectedNumberOfServings(i: number): boolean {
    if (Number(this.selectedRecipes[i].numberOfServings) <= 0 ||
       this.selectedRecipes[i].numberOfServings == null || 
       Number(this.selectedRecipes[i].numberOfServings) % 1 > 0) {
      return false;
    } else {
      return true;
    }
  }
}
