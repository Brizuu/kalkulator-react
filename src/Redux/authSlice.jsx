import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    items: [],
    status: "idle",
    msg: "",
    user: "",
    token: "",
    role: "",
    loading: false,
    productId: null,
    error: ""
}

export const addProduct = createAsyncThunk('addProduct', async (body) => {
    const userData = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    console.log("id użytkownika: " + userData);
    const res = await fetch("http://localhost:5001/api/Account/addProduct", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name: body.name,
            price: body.price,
            onSale: false,
            sellerId: userData,
            specification: {
                brandName: body.specification?.brandName,
                model: body.specification?.model,
                fuelType: body.specification?.fuelType,
                productionDate: body.specification?.productionDate,
                mileage: body.specification?.mileage
            }
        })
    });
    const data = await res.json();
    return data.productId;
});

export const addProductImage = createAsyncThunk('addProductImage', async (body) => {

    const formData = new FormData();
    const userData = localStorage.getItem('productId');
    const token = localStorage.getItem('token');

    console.log("ID produktu: " + userData);
    console.log('Wysyłam plik do backendu:', body.file);

    formData.append('file', body.file);

    if (!body.file) {
        console.error("No file provided");
        return;
    }

    const res = await fetch(`http://localhost:5001/api/Account/uploadImage/${userData}`, {
        method: "POST",
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
    return await res.json()
})

export const getProducts = createAsyncThunk('getProducts', async () => {

    const token = localStorage.getItem('token');

    const res = await fetch("http://localhost:5001/api/Account/getProduct", {
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

export const SellStateHandler = createAsyncThunk('SellStateHandler', async (body) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5001/api/Account/toggleOnSale/${body}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body),
    })
    return await res.json()
})

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
            .addCase(signInUser.fulfilled, (state, { payload: { error, msg, token, user, role, userId } }) => {
                state.loading = false;
                if(error){
                    state.error = error;
                    toast.error(`Błąd logowania: ${error}`);
                }else{
                    state.msg = msg;
                    state.token = token;
                    state.user = user;
                    state.role = role;
                    state.userId = userId;

                    localStorage.setItem("msg", msg)
                    localStorage.setItem("user", JSON.stringify(user))
                    localStorage.setItem("role", JSON.stringify(role))
                    localStorage.setItem("token", token)
                    localStorage.setItem("userId", JSON.stringify(userId))

                    toast.success("Zalogowano pomyślnie! 🎉");
                    window.location.href = "/";
                }
            })
            .addCase(signInUser.rejected, (state) => {
                state.loading = false;
                state.error = "Login failed";
                toast.error("Nie udało się zalogować.");
            })

            // *********** Pobieranie produktów ***************

            .addCase(getProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(getProducts.rejected, (state) => {
                state.status = 'failed';
            })

            // *********** Pobieranie danych usług ***************
            .addCase(getCalculation.fulfilled, (state, action) => {
                state.services = action.payload;
            })

            // *********** Wysyłanie obliczeń ***************
            .addCase(sendCalculation.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendCalculation.fulfilled, (state, action) => {
                state.loading = false;
                state.calculation = action.payload;
                toast.success("Obliczenia zakończone sukcesem! 🎉");
            })
            .addCase(sendCalculation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(`Błąd obliczeń: ${action.error.message}`);
            })

            // *********** Dodawanie produktu ***************

            .addCase(addProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.productId = action.payload;
                localStorage.setItem('productId', action.payload);
                toast.success("Dodanie produktu zakończone sukcesem! 🎉");
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(`Błąd: ${action.error.message}`);
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
                state.loading = false;
                state.error = "Registration failed";
                toast.error("Nie udało się zarejestrować.");
            });
    }
})

export const {addToken, addUser, logout} = authSlice.actions;
export default authSlice.reducer;