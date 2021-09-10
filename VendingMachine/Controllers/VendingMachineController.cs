using Microsoft.AspNetCore.Mvc;
using System.Linq;
using VendingMachine.Infrastructure;

namespace VendingMachine.Controllers
{
    [ApiController]
    [Route("/api/vending-machine")]
    public class VendingMachineController : ControllerBase
    {
        private VendingMachineService _vmService;

        public VendingMachineController(VendingMachineService vmService)
        {
            _vmService = vmService;
        }

        [HttpGet]
        public ActionResult OnGet()
        {
            return new JsonResult(new {
                currencies = _vmService.GetCurrencies().Values,
                products = _vmService.GetProducts().Values
            });
        }

        [HttpPost]
        public ActionResult OnPost([FromQuery] CurrenciesProposed CurrenciesProposed, [FromQuery] ProductsProposed ProductsProposed)
        {
            if ((CurrenciesProposed.Currencies != null && ProductsProposed.Products != null) && 
                (CurrenciesProposed.isValid() && ProductsProposed.isValid(_vmService.GetProducts())))
            {
                var result = _vmService.PerformTransaction(CurrenciesProposed, ProductsProposed);
                if (result.errors == null || !result.errors.Any())
                {
                    return new OkObjectResult(result.change);
                }
                else
                {
                    return new BadRequestObjectResult(result.errors);
                }
            }
            else
            {
                return new BadRequestResult();
            }
        }
    }
}

