import React, { useState, useContext, createContext } from "react";

const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  /**
  {
    "imeUporabnika": "Mark",
    "idUporabnika": "628a82ee114b6b460b53ddc8",
    "barvaUporabnika": "333444",
    "DStoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZFVwb3JhYm5pa2EiOiI2MjhhODJlZTExNGI2YjQ2MGI1M2RkYzgiLCJlbWFpbCI6Im1hcmtAZ21haWwuY29tIiwiaW1lIjoiTWFyayIsImV4cCI6MzE3MTI1NTk4MDcxLCJpYXQiOjE2NjAxMjgxNTh9.xAJnuf7z1Vp_lWZnaWnHZUyYObSwdhVl5_4674YH8kY"
  }
  {
    user: null,
    userId: null,
    userColor: "",
  }
   */

  const [userInfo, setUserInfo] = useState();

  return (
    <AuthContext.Provider value={[userInfo, setUserInfo]}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const values = useContext(AuthContext);
  if (!values) {
    throw new Error("Context used outside Provider");
  }
  return values;
};
