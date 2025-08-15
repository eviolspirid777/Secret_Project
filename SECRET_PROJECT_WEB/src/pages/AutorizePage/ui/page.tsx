import { useState } from "react";
import { Login } from "../Login/ui";
import { Register } from "../Register/ui";

export const Page = () => {
  const [isAutorize, setIsAutorize] = useState(true);
  if (!isAutorize)
    return <Register onAutorize={setIsAutorize.bind(null, true)} />;
  return <Login onRegister={setIsAutorize.bind(null, false)} />;
};
