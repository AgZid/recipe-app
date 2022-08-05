import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { RecipeDetailsComponent } from './components/recipe-details/recipe-details.component';
import { RecipesListComponent } from './components/recipes-list/recipes-list.component';
import { SelectedListComponent } from './components/selected-list/selected-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'recipes', pathMatch: 'full' },
  { path: 'recipes', component: RecipesListComponent },
  { path: 'recipes/:id', component: RecipeDetailsComponent },
  { path: 'add', component: AddRecipeComponent },
  { path: 'selected', component:SelectedListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
