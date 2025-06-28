import ingredientsSlice, {
  fetchIngredients,
  initialState as ingredientsInitialState
} from '../ingredients';
import { TIngredient } from '@utils-types';
import * as api from '@api';

jest.mock('@api');

describe('ingredients slice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Ingredient 1',
      type: 'main',
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      price: 100,
      image: 'img1.png',
      image_mobile: 'img1_mobile.png',
      image_large: 'img1_large.png'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle initial state', () => {
    expect(ingredientsSlice(undefined, { type: 'unknown' })).toEqual(ingredientsInitialState);
  });

  describe('async thunks', () => {
    it('should handle successful ingredients fetch', async () => {
      (api.getIngredientsApi as jest.Mock).mockResolvedValue(mockIngredients);

      const dispatch = jest.fn();
      const thunk = fetchIngredients();
      await thunk(dispatch, () => ({}), {});

      const [start, end] = dispatch.mock.calls.map(call => call[0].type);
      expect(start).toBe('ingredients/fetch/pending');
      expect(end).toBe('ingredients/fetch/fulfilled');
    });

    // Add more async thunk tests...
  });
});