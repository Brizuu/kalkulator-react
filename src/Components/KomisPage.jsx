import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getProducts, logout } from "../Redux/authSlice.jsx";
import { toast } from "react-toastify";

const redirectMagazine = () => {
    window.location.href = "/magazyn";
};

const KomisPage = () => {
    const role = JSON.parse(localStorage.getItem("role"));
    const userId = JSON.parse(localStorage.getItem("userId"));
    const isSeller = role === 'Seller';

    const dispatch = useDispatch();
    const { items: products, status, error } = useSelector((state) => state.user);

    const [filteredProducts, setFilteredProducts] = useState([]);

    const [filters, setFilters] = useState({
        brand: "",
        model: "",
        fuelType: "",
        mileageFrom: "",
        mileageTo: "",
        priceFrom: "",
        priceTo: "",
    });

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    useEffect(() => {
        if (status === 'failed' && error) {
            toast.error(`Błąd: ${error}`);
        }
    }, [status, error]);

    useEffect(() => {
        if (products.length > 0) {
            const filtered = products.filter(product => product.sellerId !== userId && product.onSale === true);
            setFilteredProducts(filtered);
        }
    }, [products, userId]);

    const applyFilters = () => {
        let filtered = products.filter(product => product.sellerId !== userId && product.onSale === true);

        if (filters.brand) {
            filtered = filtered.filter(product => product.specification.brandName === filters.brand);
        }
        if (filters.model) {
            filtered = filtered.filter(product => product.specification.model === filters.model);
        }
        if (filters.fuelType) {
            filtered = filtered.filter(product => product.specification.fuelType === filters.fuelType);
        }
        if (filters.mileageFrom) {
            filtered = filtered.filter(product => product.specification.mileage >= filters.mileageFrom);
        }
        if (filters.mileageTo) {
            filtered = filtered.filter(product => product.specification.mileage <= filters.mileageTo);
        }
        if (filters.priceFrom) {
            filtered = filtered.filter(product => product.price >= filters.priceFrom);
        }
        if (filters.priceTo) {
            filtered = filtered.filter(product => product.price <= filters.priceTo);
        }

        setFilteredProducts(filtered);
    };

    return (
        <>
            <nav className='navigate bg-gray-200 w-full h-15 border border-gray-200 flex flex-row'>
                <div className='title w-1/2 h-full bg-gray-100 flex items-center'>
                    <div className='p-2 ml-4 font-bold text-xl text-gray-800'>Komis Samochodowy</div>
                </div>
                <div className='buttons w-1/2 h-full bg-gray-100 flex items-center justify-end'>
                    <div
                        className='confirmButton w-60 bg-gray-400 p-2 rounded flex justify-center items-center m-5 text-white font-bold hover:bg-gray-600 cursor-pointer'
                        onClick={() => dispatch(logout())}>
                        Wyloguj się
                    </div>
                    {isSeller && (
                        <div
                            className='confirmButton w-60 bg-blue-500 p-2 rounded flex justify-center items-center m-5 text-white font-bold hover:bg-blue-700 cursor-pointer'
                            onClick={redirectMagazine}>
                            Magazyn
                        </div>
                    )}
                </div>
            </nav>

            <div className='sortingMenu h-auto w-full flex flex-row'>
                <div className='buttons w-full h-full bg-gray-100'>
                    <input
                        className='bg-gray-300 rounded p-2 m-5 w-50'
                        placeholder='Marka samochodu'
                        type='text'
                        onChange={(e) => setFilters({...filters, brand: e.target.value})}
                    />

                    <input
                        className='bg-gray-300 rounded p-2 m-5 w-50'
                        placeholder='Model samochodu'
                        type='text'
                        onChange={(e) => setFilters({...filters, model: e.target.value})}
                    />

                    <select className='bg-gray-300 rounded p-2 m-5 w-40'
                            onChange={(e) => setFilters({...filters, fuelType: e.target.value})}>
                        <option value="">Rodzaj paliwa</option>
                        <option value="Benzyna">Benzyna</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybryda">Hybryda</option>
                        <option value="Benzyna+LPG">Benzyna+LPG</option>
                    </select>
                    <input className='bg-gray-300 rounded p-2 m-5 ml-2 w-40' placeholder='Przebieg od' type='number'
                           onChange={(e) => setFilters({...filters, mileageFrom: Number(e.target.value)})}/>
                    <input className='bg-gray-300 rounded p-2 m-5 ml-2 w-40' placeholder='Przebieg do' type='number'
                           onChange={(e) => setFilters({...filters, mileageTo: Number(e.target.value)})}/>
                    <input className='bg-gray-300 rounded p-2 m-5 ml-2 w-40' placeholder='Cena od' type='number'
                           onChange={(e) => setFilters({...filters, priceFrom: Number(e.target.value)})}/>
                    <input className='bg-gray-300 rounded p-2 m-5 ml-2 w-40' placeholder='Cena do' type='number'
                           onChange={(e) => setFilters({...filters, priceTo: Number(e.target.value)})}/>

                    <div className='w-full flex justify-center items-center'>
                        <div
                            className='confirmButton w-60 bg-blue-500 p-2 rounded flex justify-center items-center m-5 text-white font-bold hover:bg-blue-700 cursor-pointer'
                            onClick={applyFilters}>
                            Zastosuj filtry
                        </div>
                    </div>
                </div>
            </div>

            <div className="shopFloor h-screen w-full bg-white">
                <Grid container spacing={3}>
                    {filteredProducts.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                            <div className="product-container h-auto w-full bg-white flex flex-col m-5 shadow-md">
                                <img
                                    src={"http://127.0.0.1:5001" + product.image}
                                    alt={product.name}
                                    className="h-50 w-full"
                                />
                                <div className="product flex flex-col p-2">
                                    <h3 className="product-name font-bold text-xl">{product.name}</h3>
                                    <p className="product-desc font-light text-xs">
                                        {product.specification.brandName} / {product.specification.model} / {product.specification.fuelType} / {product.specification.productionDate}
                                    </p>
                                    <h1 className="product-price text-xl font-bold text-red-800 pt-5">
                                        {product.price} PLN
                                    </h1>
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </div>

        </>
    );
};

export default KomisPage;
