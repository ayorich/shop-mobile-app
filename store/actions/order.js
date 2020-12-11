import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    try {
      const res = await fetch(
        `https://shopapp-mobile-default-rtdb.firebaseio.com/orders/${userId}.json`
      );

      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const resData = await res.json();
      const loadedOrders = [];

      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        );
      }
      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (err) {
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    // console.log(token);
    // console.log(userId);
    try {
      const date = new Date();
      const res = await fetch(
        `https://shopapp-mobile-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartItems,
            totalAmount,
            date: date.toISOString(),
          }),
        }
      );
      // console.log(res);
      if (!res.ok) {
        throw new Error("Something went wrong!");
      }
      const resData = await res.json();

      dispatch({
        type: ADD_ORDER,
        orderData: {
          id: resData.name,
          items: cartItems,
          amount: totalAmount,
          date: date,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };
};
