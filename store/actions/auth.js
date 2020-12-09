export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";

const apikey = process.env.API_KEY;
export const signup = (email, password) => {
  return async (dispatch) => {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apikey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    if (!res.ok) {
      const errorResData = await res.json();
      const errorId = errorResData.error.message;
      let message = "Something went wrong ";
      if (errorId === "EMAIL_EXISTS") {
        message = "This email exist already!";
      }
      throw new Error(message);
    }
    const resData = await res.json();
    console.log(resData);
    dispatch({
      type: SIGNUP,
      token: resData.idToken,
      userId: resData.localId,
    });
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apikey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );
    // if (!res.ok) {
    //   const errorResData = await res.json();
    //   const errorId = errorResData.error.message;
    //   let message = "Something went wrong ";
    //   if (errorId === "EMAIL_NOT_FOUND") {
    //     message = "This email could not be found!";
    //   } else if (errorId === "INVALID_PASSWORD") {
    //     message = "This password is not valid";
    //   }
    //   throw new Error(message);
    // }
    const resData = await res.json();
    console.log(resData);
    dispatch({ type: LOGIN, token: resData.idToken, userId: resData.localId });
  };
};
