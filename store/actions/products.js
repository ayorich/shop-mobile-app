import Product from "../../models/product";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;

    try {
      const res = await fetch(
        "https://shopapp-mobile-default-rtdb.firebaseio.com/products.json"
      );

      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const resData = await res.json();
      const loadedProducts = [];
      console.log(userId);
      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].ownerPushToken,

            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter((prod) => prod.ownerId === userId),
      });
    } catch (err) {
      throw err;
    }
  };
};
export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const res = await fetch(
      `https://shopapp-mobile-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,

      {
        method: "DELETE",
      }
    );

    if (!res.ok) {
      throw new Error("Something went wrong");
    }
    dispatch({
      type: DELETE_PRODUCT,
      pid: productId,
    });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    let pushToken;
    let statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (statusObj.status !== "granted") {
      statusObj = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    }

    if (statusObj.status !== "granted") {
      pushToken = null;
    } else {
      pushToken = (await Notifications.getExpoPushTokenAsync()).data;
    }

    const token = getState().auth.token;
    const userId = getState().auth.userId;

    const res = await fetch(
      `https://shopapp-mobile-default-rtdb.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId,
          ownerPushToken: pushToken,
        }),
      }
    );
    const resData = await res.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title,
        description,
        imageUrl,
        price,
        ownerId: userId,
        pushToken: pushToken,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const res = await fetch(
      `https://shopapp-mobile-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );
    // console.log("res");
    if (!res.ok) {
      throw new Error("Something went wrong");
    }
    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};
