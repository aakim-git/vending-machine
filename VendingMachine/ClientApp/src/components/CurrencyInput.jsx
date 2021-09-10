import React, { useState } from 'react';

function CurrencyInput(props) {
    const [errorMessage, setErrorMessage] = useState("");

    function validateInput(e) {
        if (e.target.value < 0) {
            setErrorMessage("Must be positive");
        }
        else if (e.target.value.match(/[^$,.\d]/)) {
            setErrorMessage("Can only contain numbers");
        }
        else {
            setErrorMessage("");
        }
    }

    return (
        <div className="input-container" key={props.currency.name}>
            <label htmlFor={props.currency.name}> {props.currency.name} </label>
            <input
                id={props.currency.name}
                value={props.currency.name in props.currenciesProposed ? props.currenciesProposed[props.currency.name] : ""}
                className={errorMessage.length > 0 ? "red" : ""}
                onFocus={function () { setErrorMessage("") }}
                onBlur={function (e) { validateInput(e) }}
                onChange={
                    function (e) {
                        props.currenciesProposedUpdate(e, props.currency);
                        validateInput(e);
                    }
                }
            />

            {errorMessage && 
                <p className="error-message"> { errorMessage } </p>
            }
        </div>
    );
}

export default CurrencyInput;