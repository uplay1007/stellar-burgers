import {
  constructorSlice,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TConstructorIngredient, TIngredient } from '@utils-types';

const initialState = { bun: null, ingredients: [] };

const bun: TIngredient = {
  _id: 'bun-1',
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
};

const anotherBun: TIngredient = {
  ...bun,
  _id: 'bun-2',
  name: 'Флюоресцентная булка R2-D3',
  price: 988
};

const mainIngredient: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'main.png',
  image_mobile: 'main-mobile.png',
  image_large: 'main-large.png'
};

const sauce: TIngredient = {
  ...mainIngredient,
  _id: 'sauce-1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  price: 90
};

describe('редьюсер constructorSlice', () => {
  it('возвращает начальное состояние при вызове с неизвестным экшеном', () => {
    const state = constructorSlice.reducer(undefined, { type: 'UNKNOWN' });
    expect(state).toEqual(initialState);
  });

  describe('addIngredient', () => {
    it('добавляет булку и присваивает ей уникальный id', () => {
      const state = constructorSlice.reducer(initialState, addIngredient(bun));

      expect(state.bun).toMatchObject(bun);
      expect((state.bun as TConstructorIngredient).id).toEqual(
        expect.any(String)
      );
      expect(state.ingredients).toHaveLength(0);
    });

    it('заменяет ранее выбранную булку новой при повторном добавлении булки', () => {
      const stateWithBun = constructorSlice.reducer(
        initialState,
        addIngredient(bun)
      );

      const state = constructorSlice.reducer(
        stateWithBun,
        addIngredient(anotherBun)
      );

      expect(state.bun?._id).toBe(anotherBun._id);
    });

    it('добавляет начинку в список ingredients, не затрагивая булку', () => {
      const stateWithBun = constructorSlice.reducer(
        initialState,
        addIngredient(bun)
      );

      const state = constructorSlice.reducer(
        stateWithBun,
        addIngredient(mainIngredient)
      );

      expect(state.bun).toMatchObject(bun);
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject(mainIngredient);
    });
  });

  describe('removeIngredient', () => {
    it('удаляет ингредиент из списка по его уникальному id', () => {
      const stateWithMain = constructorSlice.reducer(
        initialState,
        addIngredient(mainIngredient)
      );
      const addedId = stateWithMain.ingredients[0].id;

      const state = constructorSlice.reducer(
        stateWithMain,
        removeIngredient(addedId)
      );

      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('moveIngredient', () => {
    it('меняет местами два соседних ингредиента', () => {
      let state = constructorSlice.reducer(
        initialState,
        addIngredient(mainIngredient)
      );
      state = constructorSlice.reducer(state, addIngredient(sauce));
      const [firstId, secondId] = state.ingredients.map((item) => item.id);

      const moved = constructorSlice.reducer(
        state,
        moveIngredient({ index: 0, direction: 'down' })
      );

      expect(moved.ingredients.map((item) => item.id)).toEqual([
        secondId,
        firstId
      ]);
    });

    it('не меняет состояние, если целевой индекс выходит за границы списка', () => {
      const state = constructorSlice.reducer(
        initialState,
        addIngredient(mainIngredient)
      );

      const moved = constructorSlice.reducer(
        state,
        moveIngredient({ index: 0, direction: 'up' })
      );

      expect(moved).toEqual(state);
    });
  });

  describe('clearConstructor', () => {
    it('сбрасывает булку и список ингредиентов к начальному состоянию', () => {
      let state = constructorSlice.reducer(initialState, addIngredient(bun));
      state = constructorSlice.reducer(state, addIngredient(mainIngredient));

      const cleared = constructorSlice.reducer(state, clearConstructor());

      expect(cleared).toEqual(initialState);
    });
  });
});
