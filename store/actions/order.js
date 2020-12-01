export const ADD_ORDER = "ADD_ORDER";

export const addOrder = (cartItems, totalAmount) => {
  // console.log(cartItems);
  return {
    type: ADD_ORDER,
    orderData: {
      items: cartItems,
      amount: totalAmount,
    },
  };
};
