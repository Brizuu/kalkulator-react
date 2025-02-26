
import '../style.css'
import logo from '../assets/login-avatar.png';
import {useState} from "react";
import {useDispatch} from "react-redux";
import {signInUser} from "../Redux/authSlice.jsx";
import {toast} from "react-toastify";


const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const loginHandler = () => {
        if (!username || !password) {
            toast.error("Wszystkie pola muszą być wypełnione!");
            return;
        }else{
            console.table(username, password)
            dispatch(signInUser({username, password}))
        }
    };

    const redirectRegister = () => {
        window.location.href = "/register";
    };

    return (
        <div className='main-container flex lg:flex-row flex-col w-screen h-auto'>
            <div className='message-container pr-2 bg-gradient-to-r from-purple-900  to-purple-600 lg:w-1/2 w-full lg:h-screen h-80 flex flex-row justify-center items-center'>
                <div className='text-img pr-10'>
                    <img className='img-fluid sm:h-30 h-20 sm:w-30 w-20 min-w-20 sm:min-w-30' src={logo} alt='logo' />
                </div>
                <div className='text-container text-left'>
                    <div className='header text-white sm:text-4xl text-2xl font-semibold pb-2'>Witaj w panelu dostępowym</div>
                    <div className='sub-header text-gray-200 font-thin sm:text-2xl text-xl'>Zaloguj się / Zarejestruj się aby zacząć</div>
                </div>
            </div>
            <div className='container lg:w-1/2 w-screen max-w-screen lg:h-screen bg-white p-10 flex flex-col justify-center text-center lg:rounded-l-3xl'>
                <div className='header pb-10 text-4xl font-bold'>
                    <div className='text text-slate-600'>Logowanie</div>
                </div>
                <form>
                    <div className='inputs'>
                        <div className='input pb-5'>
                            <input type='text' name='username' placeholder='Nazwa użytkownika'
                                   className='border border-gray-300 p-2 rounded lg:w-xs w-full'
                                   value={username} onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className='input pb-5'>
                            <input type='password' name='password' placeholder='Hasło'
                                   className='border border-gray-300 p-2 rounded lg:w-xs w-full'
                                   value={password} onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </div>
                    <div className='buttons flex flex-col justify-center items-center'>
                        <div className='register button flex justify-center bg-purple-900 mb-5 mt-15 rounded
                    h-10 lg:w-md w-full flex items-center text-white font-semibold text-lg hover:bg-purple-600 cursor-pointer'
                             onClick={redirectRegister}>Zarejestruj
                        </div>
                        <div className='login button flex flex justify-center bg-purple-900 mb-5 rounded
                    h-10 lg:w-md w-full flex items-center text-white font-semibold text-lg hover:bg-purple-600 cursor-pointer'
                            onClick={loginHandler}>Zaloguj
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginPage