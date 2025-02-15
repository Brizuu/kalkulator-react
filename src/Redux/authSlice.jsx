import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    msg: "",
    user: "",
    token: "",
    loading: false,
    error: ""
}

export const signUpUser = createAsyncThunk('signUpUser', async (body) => {
    const res = await fetch("http://localhost:5001/api/Account/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    })
    return await res.json()
})

export const signInUser = createAsyncThunk('signInUser', async (body) => {
    const res = await fetch("http://localhost:5001/api/Account/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    })
    return await res.json()
})

export const sendCalculation = createAsyncThunk('sendCalculation', async (body) => {

    const token = localStorage.getItem('token');

    const res = await fetch("http://localhost:5001/api/Account/calculate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body),
    })
    return await res.json()
})

export const getCalculation = createAsyncThunk('getCalculation', async () => {

    const token = localStorage.getItem('token');

    const res = await fetch("http://localhost:5001/api/Account/calculate", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Błąd podczas pobierania danych");
    }

    return await res.json();
});



const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addToken: (state) => {
            state.token = localStorage.getItem("token")
        },
        addUser: (state) => {
            state.user = localStorage.getItem("user")
        },
        logout: (state) => {
            state.token = null;
            state.user = "";
            localStorage.clear();
            toast.info("Zostałeś wylogowany.");
            window.location.href = "/login";
        }
    },
    extraReducers: (builder) => {
        builder
            // *********** Logowanie ***************
            .addCase(signInUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(signInUser.fulfilled, (state, { payload: { error, msg, token, user } }) => {
                state.loading = false;
                if(error){
                    state.error = error;
                    toast.error(`Błąd logowania: ${error}`);
                }else{
                    state.msg = msg;
                    state.token = token;
                    state.user = user;

                    localStorage.setItem("msg", msg)
                    localStorage.setItem("user", JSON.stringify(user))
                    localStorage.setItem("token", token)

                    toast.success("Zalogowano pomyślnie! 🎉");
                    window.location.href = "/";
                }
            })
            .addCase(signInUser.rejected, (state) => {
                state.loading = false; // Set to false, since request is finished
                state.error = "Login failed"; // Add meaningful error message
                toast.error("Nie udało się zalogować.");
            })

            // *********** Pobieranie danych usług ***************
            .addCase(getCalculation.fulfilled, (state, action) => {
                state.services = action.payload;
            })

            // *********** Wysyłanie obliczeń ***************
            .addCase(sendCalculation.pending, (state) => {
                state.loading = true; // Ustawienie stanu ładowania, aby użytkownik widział proces
            })
            .addCase(sendCalculation.fulfilled, (state, action) => {
                state.loading = false;
                state.calculation = action.payload; // Zapisujemy wynik obliczeń
                toast.success("Obliczenia zakończone sukcesem! 🎉");
            })
            .addCase(sendCalculation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; // Przechwytujemy błąd, jeśli wystąpił
                toast.error(`Błąd obliczeń: ${action.error.message}`);
            })

            // *********** Rejestracja ***************

            .addCase(signUpUser.pending, (state) => {
                    state.loading = true;
                })
            .addCase(signUpUser.fulfilled, (state, { payload: { error, msg } }) => {
                state.loading = false;
                if (error) {
                    state.error = error;
                    toast.error(`Błąd rejestracji: ${error}`);
                } else {
                    state.msg = msg;
                    toast.success("Rejestracja zakończona sukcesem! 🎉");
                    window.location.href = "/login";
                }
            })
            .addCase(signUpUser.rejected, (state) => {
                state.loading = false; // Set to false, since request is finished
                state.error = "Registration failed"; // Add meaningful error message
                toast.error("Nie udało się zarejestrować.");
            });
    }
})

export const {addToken, addUser, logout} = authSlice.actions;
export default authSlice.reducer;