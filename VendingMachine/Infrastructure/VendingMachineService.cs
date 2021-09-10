using System.Collections.Generic;
using System.Linq;

namespace VendingMachine.Infrastructure
{
    public class VendingMachineService
    {

        private VendingMachineContext _dbContext;

        public VendingMachineService(VendingMachineContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Dictionary<string, Currency> GetCurrencies()
        {
            return _dbContext.Currencies;
        }

        public Dictionary<string, Product> GetProducts()
        {
            return _dbContext.Products;
        }

        /// <summary>
        ///     Receives a list of proposed product names and amounts and list of proposed currency names and amounts. 
        ///     If valid, subtracts the proposed products and any given change in the database. 
        /// </summary>
        /// <returns> A list of errors. Empty list if none. </returns>
        public TransactionResult PerformTransaction(CurrenciesProposed currenciesProposed, ProductsProposed productsProposed)
        {
            var result = new TransactionResult();

            // Get Total Price of Products
            double totalPrice = 0;
            var availableProducts = _dbContext.Products;
            foreach (var product in productsProposed.Products)
            {
                totalPrice += availableProducts[product.Key].Cost * product.Value;
            }

            // Get Total Money Received
            double totalInput = 0;
            var availableCurrencies = _dbContext.Currencies;
            foreach (var currency in currenciesProposed.Currencies)
            {
                totalInput += availableCurrencies[currency.Key].Value * currency.Value;
            }

            // If the given money is greater than the price of the products, we continue with the transaction. 
            if (totalPrice <= totalInput)
            {
                var remainingInput = totalInput - totalPrice;
                var remainingCurrency = CalculateChange(remainingInput, availableCurrencies.Values.ToList());
                if (remainingCurrency != null)
                {
                    // Update currency counts in the database
                    foreach (var currency in remainingCurrency)
                    {
                        _dbContext.Currencies.Values.First(x => x.Name == currency.Key).Count -= currency.Value;
                    }

                    // Update product counts in the database
                    foreach (var product in productsProposed.Products)
                    {
                        _dbContext.Products.Values.First(x => x.Name == product.Key).QuantityAvailable -= product.Value;
                    }
                }
                else
                {
                    result.errors.Add("Not sufficient change in the inventory");
                    return result;
                }

                result.change = remainingCurrency;
            }
            else
            {
                result.errors.Add("Not enough money was provided");
                return result;
            }

            return result;
        }

        /// <summary>
        ///     Calculates which currencies could be used to meet the given target value.  
        /// </summary>
        /// <returns> Returns a dictionary of currency names to amount. Returns null if the available currencies are not sufficient. </returns>
        public Dictionary<string, int> CalculateChange(double amount, List<Currency> currencies)
        {
            var result = new Dictionary<string, int>();
            var remainingAmount = amount;
            var sortedCurrencies = currencies.OrderByDescending(x => x.Value).ToList();

            foreach(var currency in sortedCurrencies)
            {
                // While the current denomination is still the largest, and while that currency is still available
                while((remainingAmount >= currency.Value) && (currency.Count - (result.ContainsKey(currency.Name) ? result[currency.Name] : 0) >= 0))
                {
                    result[currency.Name] = result.ContainsKey(currency.Name) ? result[currency.Name] + 1 : 1;
                    remainingAmount -= currency.Value;
                }
            }

            // If we weren't able to complete the change, return null
            if(remainingAmount > 0)
            {
                return null;
            }
            return result;
        }
    }
}
