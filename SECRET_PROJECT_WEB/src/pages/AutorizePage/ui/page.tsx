import { useState } from "react";
import { Login } from "../Login";
import { Register } from "../Register";

export const Page = () => {
  const [isAutorize, setIsAutorize] = useState(true);
  if (!isAutorize)
    return <Register onAutorize={setIsAutorize.bind(null, true)} />;
  return <Login onRegister={setIsAutorize.bind(null, false)} />;
};
