// Temporary localStorage-only cart implementation
// Since backend cart API is not available on deployed server

const getLocalCart = () => JSON.parse(localStorage.getItem('cart') || '[]');
const setLocalCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));

export const cartApiSlice = {
  // Mock query hook for cart
  useGetCartQuery: () => ({
    data: { items: getLocalCart() },
    isLoading: false,
    error: null
  }),
  
  // Mock mutation hooks
  useAddToCartMutation: () => [
    (item) => {
      const cart = getLocalCart();
      const existingItem = cart.find(cartItem => cartItem._id === item._id);
      if (existingItem) {
        existingItem.qty += item.qty || 1;
      } else {
        cart.push({ ...item, qty: item.qty || 1 });
      }
      setLocalCart(cart);
      window.dispatchEvent(new Event('cartUpdated'));
      return Promise.resolve();
    },
    { isLoading: false }
  ],
  
  useUpdateCartMutation: () => [
    (items) => {
      setLocalCart(items);
      window.dispatchEvent(new Event('cartUpdated'));
      return Promise.resolve();
    },
    { isLoading: false }
  ],
  
  useClearCartMutation: () => [
    () => {
      setLocalCart([]);
      window.dispatchEvent(new Event('cartUpdated'));
      return Promise.resolve();
    },
    { isLoading: false }
  ]
};

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useClearCartMutation,
} = cartApiSlice;
