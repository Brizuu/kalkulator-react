import '../style.css';
import logo from "../assets/hammer.png";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {getCalculation, logout, sendCalculation} from "../Redux/authSlice.jsx";

const HomePage = () => {
    const [area, setArea] = useState("");
    const [selectedService, setSelectedService] = useState(null);
    const [calculatedCost, setCalculatedCost] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCalculation());
    }, [dispatch]);

    const services = useSelector(state => state.user.services);

    const handleServiceChange = (e) => {
        const serviceId = e.target.value;
        const service = services.find(service => service.id === parseInt(serviceId));
        setSelectedService(service);
    };

    const handleLogout = () => {
        dispatch(logout());
    };


    const sendCalculate = () => {
        if (!area || !selectedService) {
            toast.error("Wszystkie pola muszą być wypełnione!");
            return;
        }

        const totalCost = area * selectedService.price;
        setCalculatedCost(totalCost);

        dispatch(sendCalculation({ area, totalCost, serviceId: selectedService.id }));
    };

    return (
        <div className='main-container flex lg:flex-row flex-col w-screen h-auto'>
            <div
                className='message-container pr-2 bg-gradient-to-r from-purple-900  to-purple-600 lg:w-1/3 w-full lg:h-screen h-80 flex flex-row justify-center items-center'>
                <div className='text-img pr-10'>
                    <img className='img-fluid sm:h-30 h-20 sm:w-30 w-20 min-w-20 sm:min-w-30' src={logo} alt='logo'/>
                </div>
                <div className='text-container text-left'>
                    <div className='header text-white sm:text-4xl text-2xl font-semibold pb-2'>Obliczania cen</div>
                    <div className='sub-header text-gray-200 font-thin sm:text-2xl text-xl'>
                        Wybierz usługę i powierzchnię
                    </div>
                </div>
            </div>
            <div
                className='container lg:w-2/3 w-screen max-w-screen lg:h-screen h-screen bg-white p-10 flex flex-col justify-center text-center lg:rounded-l-3xl'>
                <div className='header pb-10 text-4xl font-bold'>
                    <div className='text text-slate-600'>Obliczanie metrażu</div>
                </div>
                <form>
                    <div className='inputs'>
                        <div className='input pb-5'>
                            <select
                                className='border border-gray-300 p-2 rounded lg:w-xs w-full' onChange={handleServiceChange}
                                value={selectedService ? selectedService.id : ""}>

                                <option value="">Wybierz usługę</option>
                                {services && services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name} - {service.price} zł/m
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='input pb-5'>
                            <input
                                type='number'
                                name='area'
                                placeholder='Powierzchnia w metrach'
                                className='border border-gray-300 p-2 rounded lg:w-xs w-full'
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                            />
                        </div>
                    </div>

                    {calculatedCost !== null && (
                        <div className='output text-xl font-medium pt-5'>
                            Całkowity koszt: <b className='font-bold'>{calculatedCost} zł</b>
                        </div>
                    )}

                    <div className='buttons flex flex-col justify-center items-center'>
                        <div className='register button flex justify-center bg-purple-900 mb-5 mt-15 rounded
                        h-10 lg:w-md w-full flex items-center text-white font-semibold text-lg hover:bg-purple-600
                        cursor-pointer' onClick={sendCalculate}>
                            Oblicz
                        </div>
                        <div className='register button flex justify-center bg-red-400 mb-5  rounded
                        h-10 lg:w-md w-full flex items-center text-white font-semibold text-lg hover:bg-red-500
                        cursor-pointer' onClick={handleLogout}>
                            Wyloguj się
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomePage;
