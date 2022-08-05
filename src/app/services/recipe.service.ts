import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Ingredient } from '../models/ingredient.model';
import { Recipe } from '../models/recipe.model';
import { Selectedrecipe } from '../models/selectedrecipe.model';

const baseUrl = 'http://localhost:8081/app/recipes';

@Injectable({
  providedIn: 'root'
})

export class RecipeService {
  // static create(data: { name: string | undefined; numberOfServings: number | undefined; totalTime: string | undefined; rating: number | undefined; }) {
  //   throw new Error('Method not implemented.');
  // }
  
  constructor(private http:HttpClient) { }

  getAll(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(baseUrl);
  }

  get(id: any): Observable<Recipe> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }
  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  findByTitle(title: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${baseUrl}/title?title=${title}`);
  }

  selectRecipe(data:any): Observable<any> {
    console.log("testas ar selectas veikia")
    console.log(data);
    return this.http.post(`${baseUrl}/selected`, data);
  }
  
  getAllSelectedRecipes(){
    return this.http.get<Selectedrecipe[]>(`${baseUrl}/selected`)
                      .pipe(catchError(this.handleError));
  }

  deleteSelection(id: number):Observable<{}>{
    return this.http.delete(`${baseUrl}/selected/${id}`)
                      .pipe(catchError(this.handleError));
  }

  updateSelection(id: number, data: any ):Observable<any>{
    return this.http.put(`${baseUrl}/selected/${id}`, data)
                      .pipe(catchError(this.handleError));
  }

  deleteProduct(id:number):Observable<{}> {
    console.log("triname id "+ id);
     return this.http.delete(`${baseUrl}/ingredient/${id}`).pipe(catchError(this.handleError));
  }

  updateProduct(id: number, data:any):Observable<any>{
    return this.http.put(`${baseUrl}/ingredient/${id}`, data)
    .pipe(catchError(this.handleError));
  }

  saveProduct(id: number, data:any):Observable<any> {
    console.log("sukuriame nauja ingredienta");
    return this.http.post(`${baseUrl}/ingredient`, data);
  }

  getAllIngredientOForSelectedRecipes():Observable<any>{
    return this.http.get(`${baseUrl}/selected/ingredients`)
                      .pipe(catchError(this.handleError));
  }

  assignIngredientToRecipe(ingredientId:number, recipeId:number):Observable<any> {
    console.log("Susiejame ingredienta su receptu");
    return this.http.put(`${baseUrl}/ingredient/${ingredientId}/recipe/${recipeId}`, null)
      .pipe(catchError(this.handleError));
  }

  savePreparation(id: number, data:any):Observable<any> {
    console.log("sukuriame nauja paruosimo zingsni");
    return this.http.post(`${baseUrl}/preparation`, data);
  }

  updatePreparation(id: number, data:any):Observable<any>{
    return this.http.put(`${baseUrl}/preparation/${id}`, data)
    .pipe(catchError(this.handleError));
  }

  deletePreparation(id:number):Observable<{}> {
    console.log("triname id "+ id);
     return this.http.delete(`${baseUrl}/preparation/${id}`).pipe(catchError(this.handleError));
  }

  assignPreparationToRecipe(preparationId:number, recipeId:number):Observable<any> {
    console.log("Susiejame paruosimo zingsni su receptu");
    return this.http.put(`${baseUrl}/preparation/${preparationId}/recipe/${recipeId}`, null)
      .pipe(catchError(this.handleError));
  }

  private handleError(httpError: HttpErrorResponse) {
    if (httpError.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', httpError.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${httpError.status}, ` +
        `body was: ${httpError.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }

}

