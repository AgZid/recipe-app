import { TimeInterval } from "rxjs/internal/types";
import { Ingredient } from "./ingredient.model";
import { Preparation } from "./preparation.model";


export class Recipe {
    id?: any;
    title?: string;
    numberOfServings?: number;
    totalTime?: string;
    rating?: number;
    preparations?: Preparation[] = [];
    ingredients?: Ingredient[] = [];
    // published?: boolean;
}
