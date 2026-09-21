import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'finwiseCart';

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      if (state.items.some(item => item.id === action.payload.id)) {
        return state;
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, items: state.items.filter(item => item.id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

// Read the saved cart synchronously so the "save" effect below can't wipe it on first render
const loadInitialCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return { items: Array.isArray(saved) ? saved : [] };
  } catch {
    return { items: [] };
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (item) => dispatch({ type: 'ADD_TO_CART', payload: item });
  const removeFromCart = (itemId) => dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const getCartTotal = () => state.items.reduce((total, item) => total + item.price, 0);
  const getCartSavings = () =>
    state.items.reduce((total, item) => total + Math.max(0, (item.originalPrice || item.price) - item.price), 0);

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartSavings,
    cartCount: state.items.length
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
