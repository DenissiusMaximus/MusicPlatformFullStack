import UserIcon from "../assets/User.svg?react"
import {useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import type {RegisterInput} from "../types.ts";
import {checkLoginAvailable, register, selectLoginExists} from "../store/slices/auth.ts";
import {CustomButton} from "../components/customButton.tsx";
import {CustomInput} from "../components/customInput.tsx";

export const RegisterPage = () => {
  const dispatch = useAppDispatch();

  const login = useRef<string>("");
  const email = useRef<string>("");
  const password = useRef<string>("");
  const repeatPassword = useRef<string>("");
  const birthDate = useRef<string>("");

  const [passwordError, setPasswordPasswordError] = useState<string>("");

  const checkPasswordCoincidence = () => {
    return password.current === repeatPassword.current;
  }

  const loginAvailable = useAppSelector(selectLoginExists);

  const loginErrorMessage = loginAvailable === true ? "" : "Це ім'я вже зайняте";

  const onFormSubmit = (e) => {
    e.preventDefault();


    if (!checkPasswordCoincidence()){
      setPasswordPasswordError("Паролі не збігаються")
      return;
    }

    if (login.current.trim() === "" || email.current.trim() === "" || password.current.trim() === "")
      return;

    const input: RegisterInput = {
      login: login.current,
      email: email.current,
      password: password.current,
      birthDate: new Date(birthDate.current).toISOString()
    }

    console.log(input);

    dispatch(register(input));
  };

  return (
      <div className={'flex flex-col items-center justify-center h-full'}>
        <UserIcon className={'w-24 h-24'}/>
        <div className={'text-4xl'}>Створіть акаунт</div>
        <form className={'flex flex-col items-center justify-center w-2/3 gap-4'} onSubmit={onFormSubmit}>
          <CustomInput className={"w-full"} label={"Ім'я"} errorLabel={loginErrorMessage} onChange={(e) => {
            dispatch(checkLoginAvailable(e.target.value));
            login.current = e.target.value;
          }}/>
          <CustomInput className={"w-full"} label={"Електронна пошта"} onChange={(e) => email.current = e.target.value}/>

          <div className={'flex flex-row justify-between w-full gap-4'}>
            <CustomInput className={"w-full"} label={"Пароль"} errorLabel={passwordError} onChange={(e) => password.current = e.target.value}/>
            <CustomInput className={"w-full"} label={"Повторіть пароль "} onChange={(e) => repeatPassword.current = e.target.value}/>
          </div>

          <div className={'flex flex-row justify-between w-full gap-4 items-end'}>
            <CustomInput className={"w-full"} label={"Дата народження"} type="date"
                         onChange={(e) => birthDate.current = e.target.value}/>

            <CustomButton className={"w-full"} label={"Створити акаунт"} type="submit"/>
          </div>
        </form>
      </div>
  )
}

