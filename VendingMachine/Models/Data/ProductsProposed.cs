using System.Collections.Generic;

namespace VendingMachine
{
    /// <summary>
    ///     Represents the list of products that a user has requested from the Vending Machine. 
    /// </summary>
    public class ProductsProposed
    {
        // Maps from Product Name to amount requested. 
        public Dictionary<string, int> Products { get; set; }


        /// <summary>
        ///     Checks for any invalid entries in ProductsProposed. 
        /// </summary>
        /// <returns>True or false.</returns>
        public bool isValid(Dictionary<string, Product> availableProducts)
        {
            foreach (var product in Products)
            {
                // Check that values are not negative
                if (product.Value < 0)
                {
                    return false;
                }

                // Check that values do not exceed the quantity available
                if(product.Value > availableProducts[product.Key].QuantityAvailable)
                {
                    return false;
                }
            }

            return true;
        }
    }
}
