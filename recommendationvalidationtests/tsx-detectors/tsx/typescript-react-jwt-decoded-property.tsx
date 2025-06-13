import jwt_decode from "jwt-decode";
import { something } from "foobar";

export const testAuth1 = async () => {
  const { token } = await retrieveToken();
  const decoded = jwt_decode(token);
// ruleid: typescript-react-jwt-decoded-property
  const exp = decoded.exp * 1000;
  return exp;
};

export const testAuth2 = async () => {
  const { token } = await retrieveToken();
  const decodeToken = jwt_decode(token);
// ruleid: typescript-react-jwt-decoded-property
  const userId = decodeToken.userId;
  return userId;
};

export const testAuth3 = async () => {
  const { token } = await retrieveToken();
  const decodeToken = jwt_decode(token);
// ruleid: typescript-react-jwt-decoded-property
  const expiryDate = new Date(decodeToken.exp * 1000)
  return expiryDate;
};

export const testAuth4 = async () => {
  const { encodedData } = await retrieveToken();
  const decodeToken = jwt_decode(encodedData);
// ruleid: typescript-react-jwt-decoded-property
  const userRole = decodeToken.payload.role;
  return userRole;
};

export const okTestAuth1 = async () => {
  const { token } = await retrieveToken();
// ok: typescript-react-jwt-decoded-property
  const decoded = jwt_decode(token);
  foobar(decoded);
};

export const okTestAuth2 = async () => {
  const { token } = await retrieveToken();
  const decodeToken = jwt_decode(token);
// ok: typescript-react-jwt-decoded-property
  processDecoded(decodeToken) 
};