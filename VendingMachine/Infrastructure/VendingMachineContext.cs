using System.Collections.Generic;

namespace VendingMachine.Infrastructure
{
    /// <summary>
    ///     In place of a real database, this class mimics a DBContext class 
    ///     like one from Entity Framework. 
    /// </summary>
    public class VendingMachineContext
    {
        public Dictionary<string, Currency> Currencies;
        public Dictionary<string, Product> Products;

        public VendingMachineContext()
        {
            Currencies = new Dictionary<string, Currency>()
            {
                { "Quarter", new Currency{ Name="Quarter", Value=25, Count=25 } },
                { "Dime", new Currency{ Name="Dime", Value=10, Count=5 } },
                { "Nickel", new Currency{ Name="Nickel", Value=5, Count=10 } },
                { "Penny", new Currency{ Name="Penny", Value=1, Count=100 } }
            };

            Products = new Dictionary<string, Product>()
            {
                { "Coke", new Product{ Name="Coke", Cost=25, QuantityAvailable=5 } },
                { "Pepsi", new Product{ Name="Pepsi", Cost=36, QuantityAvailable=13 } },
                { "Soda", new Product{ Name="Soda", Cost=45, QuantityAvailable=3 } }
            };
        }
    }
}
