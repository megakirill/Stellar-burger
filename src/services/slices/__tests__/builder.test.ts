import builderSlice, {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  initialState as builderInitialState
} from '../builder';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const mockUUID = 'test-uuid';
Object.defineProperty(global.crypto, 'randomUUID', {
  value: jest.fn().mockReturnValue(mockUUID)
});

describe('builder slice', () => {
  const mockBun: TIngredient = {
    _id: '1',
    name: 'Test Bun',
    type: 'bun',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 100,
    image: 'bun.png',
    image_mobile: 'bun_mobile.png',
    image_large: 'bun_large.png'
  };

  const mockIngredient: TIngredient = {
    _id: '2',
    name: 'Test Ingredient',
    type: 'main',
    proteins: 5,
    fat: 5,
    carbohydrates: 5,
    calories: 50,
    price: 50,
    image: 'ingredient.png',
    image_mobile: 'ingredient_mobile.png',
    image_large: 'ingredient_large.png'
  };

  beforeEach(() => {
    // Clear the mock before each test
    jest.clearAllMocks();
  });

  it('should handle initial state', () => {
    expect(builderSlice(undefined, { type: 'unknown' })).toEqual(builderInitialState);
  });

  it('should handle setBun', () => {
    const actual = builderSlice(undefined, setBun(mockBun));
    expect(actual.bun).toEqual({
      ...mockBun,
      id: mockUUID
    });
    expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
  });

  it('should handle addIngredient', () => {
    const actual = builderSlice(undefined, addIngredient(mockIngredient));
    expect(actual.ingredients).toHaveLength(1);
    expect(actual.ingredients[0]).toEqual({
      ...mockIngredient,
      id: mockUUID
    });
    expect(crypto.randomUUID).toHaveBeenCalledTimes(1);
  });

  it('should handle removeIngredient', () => {
    const initialState = {
      bun: null,
      ingredients: [{ ...mockIngredient, id: '123' }],
      orderRequest: false,
      orderData: null
    };
    const actual = builderSlice(initialState, removeIngredient('123'));
    expect(actual.ingredients).toHaveLength(0);
  });

  it('should handle moveIngredient', () => {
    const initialState = {
      bun: null,
      ingredients: [
        { ...mockIngredient, id: '1', name: 'First' },
        { ...mockIngredient, id: '2', name: 'Second' }
      ],
      orderRequest: false,
      orderData: null
    };
    const actual = builderSlice(
      initialState,
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );
    expect(actual.ingredients[0].name).toBe('Second');
    expect(actual.ingredients[1].name).toBe('First');
  });

  it('should handle resetConstructor', () => {
    const initialState = {
      bun: { ...mockBun, id: 'bun-1' },
      ingredients: [{ ...mockIngredient, id: 'ing-1' }],
      orderRequest: true,
      orderData: { some: 'data' }
    };
    const actual = builderSlice(initialState, resetConstructor());
    expect(actual).toEqual({
      bun: null,
      ingredients: [],
      orderRequest: false,
      orderData: null
    });
  });
});