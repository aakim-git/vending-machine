import React, { useEffect, useState } from 'react'
import CurrencyAcceptor from './components/CurrencyAcceptor';
import CurrencyInput from './components/CurrencyInput';
import ProductDisplay from './components/ProductDisplay';
import ProductInput from './components/ProductInput';
import Modal from 'react-modal';

import './assets/site.css'

function App() {
    // Maps from Currency/Product name => Currency/Product object
    const [currenciesAvailable, setCurrenciesAvailable] = useState({});
    const [productsAvailable, setProductsAvailable] = useState({});

    // Maps from Currency/Product name => Amount entered
    const [currenciesProposed, setCurrenciesProposed] = useState({}); 
    const [productsProposed, setProductsProposed] = useState({}); 

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [errors, setErrors] = useState(null);


    useEffect(() => {
        initializeState();
        Modal.setAppElement('#root');
    }, []);


    // Returns true if any product is still available in the database. False if not.
    function anyProductAvailable() {
        var result = 0;
        for (let product of Object.values(productsAvailable)) {
            result += product.quantityAvailable;
        }
        if (result === 0) {
            return false;
        }
        return true;
    }

    // Returns the total cost of selected products. 
    function calculateTotalCost() {
        var result = 0;
        for (let [name, quantity] of Object.entries(productsProposed)) {
            if (quantity) {
                result += productsAvailable[name].cost * parseInt(quantity);
            }
        }
        return result;
    }

    // Checks the component state for any obviously invalid input, like 0 products selected.  
    function formSanityCheck() {
        var errors = [];

        // Check that at least one drink is selected. 
        var totalProductsSelected = 0;
        for (let quantity of Object.values(productsProposed)) {
            if (quantity && quantity > 0) {
                totalProductsSelected += quantity;
                break;
            }
        }
        if (totalProductsSelected === 0) {
            errors.push("You must select at least one product");
        }

        // Check that at least one drink is selected. 
        var totalCurrencySelected = 0;
        for (let quantity of Object.values(currenciesProposed)) {
            if (quantity && quantity > 0) {
                totalCurrencySelected += quantity;
                break;
            }
        }
        if (totalCurrencySelected === 0) {
            errors.push("No money has been inserted");
        }

        if (errors.length > 0) {
            setErrors(errors);
            return false;
        }
        else {
            setErrors(null);
            return true;
        }
    }

    // Called on page load. Initializes products and currencies with data from API. 
    function initializeState() {
        fetch('/api/vending-machine')
            .then((response) => response.json())
            .then((responseJson) => {
                // Initialize Currencies
                let _currenciesAvailable = {};
                for (let currency of responseJson.currencies) 
                    _currenciesAvailable[currency.name] = currency;

                setCurrenciesAvailable(_currenciesAvailable);

                // Initialize Products
                let _productsAvailable = {};
                for (let product of responseJson.products)
                    _productsAvailable[product.name] = product;

                setProductsAvailable(_productsAvailable);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function onCurrencyInputChange(e, currency) {
        setCurrenciesProposed({ ...currenciesProposed, [currency.name]: e.target.value });
    }

    function onProductInputChange(e, product) {
        setProductsProposed({ ...productsProposed, [product.name]: e.target.value });
    }

    // When form is submitted, send form data and load any response from the server in the modal. 
    function onSubmitForm(e) {
        e.preventDefault();
        if (formSanityCheck()) {
            fetch('/api/vending-machine' + serializeForm(), { method: "POST" })
                .then((response) => {
                    if (response.ok) {
                        return (response.json());
                    }
                    else {
                        response.json().then((responseJson) => {
                            setModalMessage("Error");
                            setIsModalOpen(true);
                            setErrors(responseJson);
                        });
                    }
                })
                .then((responseJson) => {
                    // List out products purchased and product price. 
                    var modalMessage = "You have successfully purchased ";
                    for (let [name, quantity] of Object.entries(productsProposed)) {
                        if (quantity) {
                            modalMessage += quantity + " " + name + " ";
                        }
                    }

                    modalMessage += "for $" + calculateTotalCost() + ". ";

                    // Display change.
                    if (responseJson && Object.keys(responseJson).length > 0) {
                        modalMessage += "Your change is ";
                        for (let [name, quantity] of Object.entries(responseJson)) {
                            modalMessage += quantity + " " + name + "  ";
                        }
                    }


                    setModalMessage(modalMessage);
                    setIsModalOpen(true);
                    setErrors(null);
                    initializeState();
                });
        }
        else {
            setModalMessage("Error");
            setIsModalOpen(true);
        }
    }

    // Serialize the state/formData into a query string. 
    function serializeForm() {
        var result = "?";
        for (let [key, value] of Object.entries(currenciesProposed)) {
            result += "CurrenciesProposed.Currencies[" + key + "]=" + value + "&";
        }

        for (let [key, value] of Object.entries(productsProposed)) {
            result += "ProductsProposed.Products[" + key + "]=" + value + "&";
        }

        // Cut off last character of result, which is guaranteed to be '&'
        result = result.slice(0, -1);

        return result;
    }

    // Reset form fields. 
    function resetProposals() {
        setCurrenciesProposed({});
        setProductsProposed({});
    }

    return (
        <>
            <div className="home">
                <form>
                    <CurrencyAcceptor>
                        <h1> COINS INFORMATION </h1>

                        <div>
                            {currenciesAvailable && Object.values(currenciesAvailable).map((currency) => (
                                <CurrencyInput
                                    currency={currency}
                                    currenciesProposed={currenciesProposed}
                                    currenciesProposedUpdate={onCurrencyInputChange}
                                    key={currency.name}
                                />
                            ))}
                        </div>
                    </CurrencyAcceptor>

                    <ProductDisplay>
                        <h1> PRODUCTS INFORMATION </h1>

                        <div>
                            <div>
                                {productsAvailable && Object.values(productsAvailable).map((product) => (
                                    <ProductInput
                                        product={product}
                                        productsProposed={productsProposed}
                                        productsProposedUpdate={onProductInputChange}
                                        key={product.name}
                                    />
                                ))}
                            </div>
                            <div className="order-total-container">
                                <h2> ORDER TOTAL: </h2>
                                <p> ${(calculateTotalCost() / 100).toFixed(2)} <span># Cents/Dollars</span></p> 
                            </div>
                        </div>
                    </ProductDisplay>

                    <button value="submit" onClick={function (e) { onSubmitForm(e) }} disabled={!anyProductAvailable()}> GET DRINKS </button>
                </form>
            </div>


            <Modal isOpen={isModalOpen}>
                <button onClick={function () { setIsModalOpen(false) }}>&times;</button>
                <h1> {modalMessage} </h1>
                { errors
                    ?   errors.map((error, index) => (
                            <p key={index}>
                                {error}
                            </p>
                        ))

                    :   <button onClick={function () { resetProposals(); setIsModalOpen(false); }}>
                            Ok
                        </button>
                }
            </Modal>
        </>
        
    );
}

export default App;

