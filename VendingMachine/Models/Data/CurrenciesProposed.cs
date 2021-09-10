using System.Collections.Generic;

namespace VendingMachine
{
    /// <summary>
    ///     Represents the list of currencies that a user will use for the Vending Machine. 
    /// </summary>
    public class CurrenciesProposed
    {
        // Maps from Currency Name to the count of currency given. 
        public Dictionary<string, int> Currencies { get; set; }


        /// <summary>
        ///     Checks for any invalid entries in CurrenciesProposed. 
        /// </summary>
        /// <returns>True or false.</returns>
        public bool isValid()
        {
            var total = 0;
            foreach(var currency in Currencies)
            {
                // Check that values are not negative
                if(currency.Value < 0)
                {
                    return false;
                }
                total++;
            }

            // Check that the total is greater than 0
            if(total <= 0)
            {
                return false;
            }

            return true;
        }
    }
}
