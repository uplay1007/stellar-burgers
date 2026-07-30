import { ingredientsSlice, fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const initialState = {
  ingredients: [],
  isLoading: false,
  error: null
};

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'bun.png',
    image_mobile: 'bun-mobile.png',
    image_large: 'bun-large.png'
  }
];

describe('редьюсер ingredientsSlice', () => {
  it('возвращает начальное состояние при вызове с неизвестным экшеном', () => {
    const state = ingredientsSlice.reducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  it('при fetchIngredients.pending включает загрузку и сбрасывает ошибку', () => {
    const startState = { ...initialState, error: 'старая ошибка' };
    const action = fetchIngredients.pending('requestId', undefined);

    const state = ingredientsSlice.reducer(startState, action);

    expect(state).toEqual({
      ingredients: [],
      isLoading: true,
      error: null
    });
  });

  it('при fetchIngredients.fulfilled сохраняет полученные ингредиенты и выключает загрузку', () => {
    const startState = { ...initialState, isLoading: true };
    const action = fetchIngredients.fulfilled(
      mockIngredients,
      'requestId',
      undefined
    );

    const state = ingredientsSlice.reducer(startState, action);

    expect(state).toEqual({
      ingredients: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  it('при fetchIngredients.rejected сохраняет текст ошибки и выключает загрузку', () => {
    const startState = { ...initialState, isLoading: true };
    const action = fetchIngredients.rejected(
      new Error('Не удалось загрузить ингредиенты'),
      'requestId',
      undefined
    );

    const state = ingredientsSlice.reducer(startState, action);

    expect(state).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Не удалось загрузить ингредиенты'
    });
  });

  it('при fetchIngredients.rejected без текста ошибки подставляет запасное сообщение', () => {
    const startState = { ...initialState, isLoading: true };
    const action = { type: fetchIngredients.rejected.type, error: {} };

    const state = ingredientsSlice.reducer(startState, action);

    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});
