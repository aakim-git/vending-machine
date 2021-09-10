import React, { useState } from 'react';

function ProductInput(props) {
    const [errorMessage, setErrorMessage] = useState("");

    function validateInput(e) {
        if (e.target.value < 0) {
            setErrorMessage("Must be positive");
        }
        else if (e.target.value.match(/[^$,.\d]/)) {
            setErrorMessage("Can only contain numbers");
        }
        else if (props.product.quantityAvailable - e.target.value < 0) {
            setErrorMessage("Not enough supply");
        }
        else {
            setErrorMessage("");
        }
    }

    return (
        <div className="input-container">
            <label htmlFor={props.product.name}> {props.product.name} </label>

            <p>
                {props.product.quantityAvailable - (props.product.name in props.productsProposed ? props.productsProposed[props.product.name] : 0)} drinks available,
                Cost = {props.product.cost}
            </p>

            <input
                id={props.product.name}
                disabled={props.product.quantityAvailable === 0}
                className={errorMessage.length > 0 ? "red" : ""}
                value={props.product.name in props.productsProposed ? props.productsProposed[props.product.name] : ""}
                onFocus={function () { setErrorMessage("") }}
                onBlur={function (e) { validateInput(e) }}
                onChange={function (e) {
                    props.productsProposedUpdate(e, props.product);
                    validateInput(e);
                }}
            />  

            {errorMessage && 
                <p className="error-message"> { errorMessage } </p>
            }
        </div>
    );
}

export default ProductInput;