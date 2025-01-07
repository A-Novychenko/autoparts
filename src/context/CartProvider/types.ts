// Використання цих інтерфейсів у компонентах:

// 1. `CartState` використовується в `useReducer` для опису початкового стану та результату ред'юсера.
// 2. `CartContextProps` використовується для типізації значення, що передається у `CartContext.Provider`.
// 3. `CartItem` використовується для типізації кожного елементу корзини.

// Тип для елемента корзини
export type CartItem = {
  id: number;
  name: string;
  price: number;
  price_promo: number | null;
  quantity: number;
  img: string;
};

// Тип для стану корзини
export type CartState = {
  items: CartItem[];
  totalAmount: number;
};

// Типи дій для ред'юсера
export type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: number } // `id` передається як число
  | { type: 'CLEAR_CART' };

// Типи для контексту
export type CartContextProps = {
  items: CartItem[];
  totalAmount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
};
