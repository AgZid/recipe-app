
import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ingredient } from 'src/app/models/ingredient.model';
import { Preparation } from 'src/app/models/preparation.model';
import { Recipe } from 'src/app/models/recipe.model';
import { Selectedrecipe } from 'src/app/models/selectedrecipe.model';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {

  selectedRecipe: Selectedrecipe = {
    recipeId: 0,
    numberOfServings:1
  };
  
  preparation:Preparation[] = [];

  ingredient: Ingredient = {
    product: '',
    quantity: 0,
    measurementUnit: '',
    canEditCode: false
  };

  measurementUnits: string[] =[
    'G',
    'VNT',
    'ML'
  ]

  columns:string[]=[
    'Product',
    'Quantity',
    'measurementUnit'
  ];

  // currentRecipeIngredients: Ingredient[] = [];
  submitted = false;
  deleteMsg:string = "";

  @Input() viewMode = false;
  @Input() currentRecipe: Recipe = {
    id: this.route.snapshot.params["id"],
    title: '',
    numberOfServings: 1,
    totalTime: '',
    rating: 5,
    ingredients: [],
    preparations: []
  }

  @Input() currentIngredient: Ingredient = {
    id : this.ingredient.id,
    product :'',
    quantity: 1,
    recipe_id: 0,
    measurementUnit: 'G'

  }

  @Input() currentPreparation: Preparation = {
    // id : this.preparation.id,
    stepNo :1,
    stepAction: ''
  }

  // @Input() selectedRecipe: Selectedrecipe = {
  //   recipeId: this.currentRecipe.id,
  //   selectedNumberOfServing: 0
  // }
  
  message = '';
  

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router:Router
  ) { }

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getRecipe(this.route.snapshot.params["id"]);
      // this.ingredients = this.currentRecipe.ingredients;
    }
  }


  getRecipe(id: number) : void {
     const httpOptions = {
        headers: new HttpHeaders({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
    };
    this.recipeService.get(id)
      .subscribe({
        next: (data) => {
          this.currentRecipe = data;
          console.log(data);
        },
        error: (e) => console.error(e)
      });
  }

  updateRecipe(): void {
    this.message = '';
    this.recipeService.update(this.currentRecipe.id, this.currentRecipe)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message ? res.message : 'This recipe was updated successfully!';
          this.getRecipe(this.route.snapshot.params["id"]);
        },
        error: (e) => console.error(e)
      });
  }

  deleteRecipe(): void {
    this.recipeService.delete(this.currentRecipe.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/recipes']);
        },
        error: (e) => console.error(e)
      });
  }

  selectRecipe():void{
    const data = {
      numberOfServings: this.selectedRecipe.numberOfServings,
      recipeId: this.currentRecipe.id
    };

    this.recipeService.selectRecipe(data)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.submitted = true;
        },
        error: (e: any) => console.error(e)
      });
  }

  // addNewIngredientRow(){}


  onClickDeleteIngredient(id:number):void{
    this.recipeService.deleteProduct(id)  
    .subscribe(responseData=> {
        this.deleteMsg = 'Successfully deleted';
          console.log(responseData);
          this.getRecipe(this.route.snapshot.params["id"]);
    }, error=>{
        this.deleteMsg = error
    });
  }


  onClickUpadteIngredient(id:number): void{
    // var ingredientForUpdate = this.currentRecipe.ingredients[id];
    this.recipeService.updateProduct(id, this.currentIngredient)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.deleteMsg = 'Successfully updated';
        this.getRecipe(this.route.snapshot.params["id"]);
      },
      error: (e) => console.error(e)
    });
    // this.ingredient.canEditCode=false;
  }

  onClickUpadtePreparation(id:number): void{
    this.recipeService.updatePreparation(id, this.currentPreparation)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.deleteMsg = 'Successfully updated';
        this.getRecipe(this.route.snapshot.params["id"]);
      },
      error: (e) => console.error(e)
    });
    // this.ingredient.canEditCode=false;
  }

  onClickDeletePreparation(id:number): void{
    this.recipeService.deletePreparation(id)  
    .subscribe(responseData=> {
        this.deleteMsg = 'Successfully deleted';
          console.log(responseData);
          this.getRecipe(this.route.snapshot.params["id"]);
    }, error=>{
        this.deleteMsg = error
    });
  }

  addIngredient(id:number): void{
    this.currentIngredient.recipe_id = Number(this.route.snapshot.params["id"]);
    console.log(this.currentIngredient);
    this.recipeService.saveProduct(id, this.currentIngredient)
    .subscribe({
      next: (res) => {
        console.log("saves ingredient: " + res + " id: " + id);
        this.recipeService.assignIngredientToRecipe(res, id)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.deleteMsg = 'Successfully updated';
            this.getRecipe(this.route.snapshot.params["id"]);
          },
          error: (e) => console.error(e)
        });
        this.deleteMsg = 'Successfully updated';
      },
      error: (e) => console.error(e)
    });
  }

  addPreparationStep(id:number):void {
    this.currentPreparation.recipe_id = Number(this.route.snapshot.params["id"]);
    console.log(this.currentPreparation);
    this.recipeService.savePreparation(id, this.currentPreparation)

   
    .subscribe({
      next: (res) => {
        console.log(res);
        this.recipeService.assignPreparationToRecipe(res, id)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.deleteMsg = 'Successfully updated';
            this.getRecipe(this.route.snapshot.params["id"]);
          },
          error: (e) => console.error(e)
        });
        this.deleteMsg = 'Successfully updated';
      },
      error: (e) => console.error(e)
    });
  }

  isValidSelectedNumberOfServings(): boolean {
    if (Number(this.selectedRecipe.numberOfServings) <= 0 || 
      this.selectedRecipe.numberOfServings == null ||
      Number(this.selectedRecipe.numberOfServings) % 1 > 0) {
      return false;
    } else {
      return true;
    }
  }

  isValidRecipeHeading(): boolean {
    if (Number(this.currentRecipe.numberOfServings) <= 0 || 
      this.currentRecipe.numberOfServings == null || 
      this.currentRecipe.title?.trim().length === 0 ||
      Number(this.selectedRecipe.numberOfServings) % 1 > 0) {
      return false;
    } else {
      return true;
    }
  }

  isValidRecipeIngredient(): boolean {
    if (Number(this.currentIngredient.quantity) <= 0 || this.currentIngredient.quantity == null || this.currentIngredient.product?.trim().length === 0) {
      return false;
    } else {
      return true;
    }
  }

  isValidRecipePreparation(): boolean {
    if (Number(this.currentPreparation.stepNo) <= 0 || 
    this.currentPreparation.stepNo == null || 
    Number(this.currentPreparation.stepNo) % 1 > 0 ||
    this.currentPreparation.stepAction?.trim().length === 0) {
      return false;
    } else {
      return true;
    }
  }

  
}




