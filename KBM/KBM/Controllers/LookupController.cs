using Application.Features.Service.Lookups;
using Application.Features.Service.Lookups.DTO;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KBM.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [AllowAnonymous]
    public class LookupController : ControllerBase
    {
        private readonly ILookupService _lookupService;

        public LookupController(ILookupService lookupService)
        {
            _lookupService = lookupService;
        }

        [HttpGet("departments")]
        public async Task<ActionResult<IEnumerable<LookupItemDto>>> GetDepartments()
        {
            return Ok(await _lookupService.GetDepartments());
        }

        [HttpGet("functions")]
        public async Task<ActionResult<IEnumerable<LookupItemDto>>> GetFunctions()
        {
            return Ok(await _lookupService.GetFunctions());
        }

        [HttpGet("industries")]
        public async Task<ActionResult<IEnumerable<LookupItemDto>>> GetIndustries()
        {
            return Ok(await _lookupService.GetIndustries());
        }
    }
}
