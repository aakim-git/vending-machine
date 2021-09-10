using System.Collections.Generic;

namespace VendingMachine
{
    /// <summary>
    ///     Contains the result of a Vending Machine Transaction.
    /// </summary>
    public class TransactionResult
    {
        public Dictionary<string, int> change { get; set; }
        public List<string> errors { get; set; } = new List<string>();
    }
}
