import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;

export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

export const selectBuns = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((ingredient) => ingredient.type === 'bun')
);

export const selectMains = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((ingredient) => ingredient.type === 'main')
);

export const selectSauces = createSelector(selectIngredients, (ingredients) =>
  ingredients.filter((ingredient) => ingredient.type === 'sauce')
);
