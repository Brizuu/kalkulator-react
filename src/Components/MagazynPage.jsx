import Grid from "@mui/material/Grid2";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {addProduct, addProductImage, getProducts, logout, SellStateHandler} from "../Redux/authSlice.jsx";


const MagazynPage = () => {

    const dispatch = useDispatch();

    const { items: products, status, error } = useSelector((state) => state.user); // Pobieranie produktów z Redux

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    useEffect(() => {
        if (status === 'failed' && error) {
            toast.error(`Błąd: ${error}`);
        }
    }, [status, error]);

    const [Mileage, setMileage] = useState("");
    const [Price, setPrice] = useState("");
    const [ProductionDate, setProductionDate] = useState("");
    const [fuelType, setFuelType] = useState('');
    const [BrandName, setBrandName] = useState('');
    const [Model, setModel] = useState('');
    const [Image, setImage] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    const handleFuelChange = (e) => {
        setFuelType(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setSelectedImage(URL.createObjectURL(file));
            console.log(file);
        }
    };


    const redirectShop = () => {
        window.location.href = "/";
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleSellStateToggle = async (productId) => {
        try {
            await dispatch(SellStateHandler(productId));

            dispatch(getProducts());

            toast.success("Stan sprzedaży został zaktualizowany.");
        } catch (error) {
            console.error(error);
            toast.error("Coś poszło nie tak podczas zmiany stanu sprzedaży.");
        }
    }


    const addProductHandler = async () => {

        if ( !Mileage || !Price || !ProductionDate || !fuelType || !BrandName || !Model ) {
            toast.error("Wszystkie pola muszą być wypełnione!");
            return;
        }else{
            const Name = `${BrandName} ${Model}`;


            console.table(Mileage, Price, ProductionDate, fuelType, BrandName, Model, Image)

            try {
                await dispatch(addProduct({
                    name: Name,
                    price: Number(Price),
                    onSale: false,
                    specification: {
                        brandName: BrandName,
                        model: Model,
                        fuelType: fuelType,
                        productionDate: String(ProductionDate),
                        mileage: Number(Mileage)
                    }
                })).unwrap();

                if (Image) {
                    await dispatch(addProductImage({
                        file: Image
                    })).unwrap();
                }

                toast.success("Produkt dodany pomyślnie!");
            } catch (error) {
                console.error(error);
                toast.error("Coś poszło nie tak podczas dodawania produktu!");
            }


        }
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
                        onClick={handleLogout}>
                        Wyloguj się
                    </div>
                    <div className='confirmButton w-60 bg-yellow-500 p-2 rounded
                         flex justify-center items-center m-5 text-white font-bold hover:bg-yellow-700 cursor-pointer'
                         onClick={redirectShop}>Strona Sklepu
                    </div>
                </div>
            </nav>
            <div className='sortingMenu h-auto w-full flex flex-row'>
                <div className='buttons w-full h-full bg-gray-100'>
                    <input className='bg-gray-300 rounded p-2 m-5 ml-2 w-50'
                           placeholder='Marka Samochodu' type='text'
                           onChange={(e) => setBrandName(e.target.value)}/>
                    <input className='bg-gray-300 rounded p-2 m-5 ml-2 w-40'
                           placeholder='Model Samochodu' type='text'
                           onChange={(e) => setModel(e.target.value)}/>
                    <select className='bg-gray-300 rounded p-2 m-5 w-40'
                            value={fuelType} onChange={handleFuelChange}>
                        <option value='DEFAULT' disabled>Rodzaj paliwa</option>
                        <option value='Benzyna'>Benzyna</option>
                        <option value='Diesel'>Diesel</option>
                        <option value='Hybryda'>Hybryda</option>
                        <option value='Benzyna+LPG'>Benzyna+LPG</option>
                    </select>
                    <input className='bg-gray-300 rounded p-2 m-5 ml-2 w-40'
                           placeholder='Przebieg' type='number'
                           onChange={(e) => setMileage(e.target.value)}/>
                    <input className='bg-gray-300 rounded p-2 m-5 ml-2 w-40'
                           placeholder='Cena' type='number'
                           onChange={(e) => setPrice(e.target.value)}/>
                    <input className='bg-gray-300 rounded p-2 m-5 ml-2 w-40'
                           placeholder='Rok produkcji' type='number'
                           onChange={(e) => setProductionDate(e.target.value)}/>
                    <input className='bg-gray-300 rounded p-2 m-5 ml-2 w-70 hidden'
                           placeholder='Zdjęcie' type='file' id='file-picker'
                           onChange={handleImageChange}/>
                    <label className='bg-gray-300 rounded p-2 m-5 ml-2 w-70' htmlFor="file-picker">Dodaj obraz produktu</label>
                    {selectedImage && (
                        <div className='w-full flex justify-center items-center mt-4'>
                            <img src={selectedImage} alt="selected" className='w-40 h-auto'/>
                        </div>
                    )}
                    <div className='w-full flex justify-center items-center'>
                        <div className='confirmButton w-60 bg-yellow-500 p-2 rounded
                            flex justify-center items-center m-5 text-white font-bold hover:bg-yellow-700 cursor-pointer
                            ' onClick={addProductHandler}>Dodaj produkt
                        </div>
                    </div>
                </div>
            </div>

            <div className='shopFloor h-screen w-full bg-white'>
                <Grid container>
                    {products.map((product) => (
                        <Grid item key={product.id} xs={12}>
                            <div className='product-container h-auto w-70 bg-white flex flex-col m-5 shadow-md'>
                                <img src={"http://127.0.0.1:5001"+product.image} alt={product.name} className='h-43 w-full'/>
                                <div className='product flex flex-col p-2'>
                                    <h3 className='product-name font-bold text-xl'>
                                        {product.name}
                                    </h3>
                                    <p className='product-desc font-light text-xs'>
                                        {product.specification.brandName} / {product.specification.model} / {product.specification.fuelType} / {product.specification.productionDate}
                                    </p>
                                    <h1 className='product-price text-xl font-bold text-red-800 pt-5'>
                                        {product.price} PLN
                                    </h1>
                                    <div
                                        className={`sellStateButton w-full p-2 rounded flex justify-center items-center mt-5 text-white font-bold 
                                        ${product.onSale ? 'bg-gray-500 hover:bg-gray-700 cursor-pointer' : 'bg-yellow-600 hover:bg-yellow-700 cursor-pointer'}`}
                                        onClick={() => handleSellStateToggle(product.id)}
                                    >
                                        {product.onSale ? 'Zakończ sprzedaż' : 'Wystaw na sprzedaż'}
                                    </div>
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </>
    )
};

export default MagazynPage;
