import UserIcon from "../assets/User.svg?react"
import {useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import type {LoginInput} from "../types.ts";
import {checkLoginAvailable, login} from "../store/slices/auth.ts";
import {CustomButton} from "../components/customButton.tsx";
import {CustomInput} from "../components/customInput.tsx";

export const LoginPage = () => {
  const dispatch = useAppDispatch();

  const userLogin = useRef<string>("");
  const password = useRef<string>("");

  const er = useAppSelector(state => state.auth.token) == null ? "Неправильний логін чи пароль" : "";

  const [loginError, setLoginError] = useState<string>("");

  const onFormSubmit = (e) => {
    e.preventDefault();

    if (userLogin.current.trim() === "" || password.current.trim() === "")
      return;

    const input: LoginInput = {
      login: userLogin.current,
      password: password.current
    }

    dispatch(login(input));

    setLoginError(er);
  };

  return (
      <div className={'flex flex-col items-center justify-center h-full'}>
        <UserIcon className={'w-24 h-24'}/>
        <div className={'text-4xl'}>Увійти у існуючий акаунт</div>
        <form className={'flex flex-col items-center justify-center w-2/3 gap-4'} onSubmit={onFormSubmit}>
          <CustomInput className={"w-full"} label={"Ім'я"} onChange={(e) => {
            dispatch(checkLoginAvailable(e.target.value));
            userLogin.current = e.target.value;
          }}/>
          <CustomInput className={"w-full"} label={"Пароль"} errorLabel={loginError} onChange={(e) => password.current = e.target.value}/>


          <CustomButton label={"Увійти"} type="submit"/>
        </form>
      </div>
  )
}

