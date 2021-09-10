import React from 'react';

function ProductDisplay(props) {
    return (
        <section className="product-display">
            {props.children}
        </section>
    );
}

export default ProductDisplay;