import React from 'react';

function CurrencyAcceptor(props) {
    return (
        <section className="currency-acceptor">
            {props.children}
        </section>
    );
}

export default CurrencyAcceptor;