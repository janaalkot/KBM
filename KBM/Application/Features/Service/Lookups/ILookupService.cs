using Application.Features.Service.Lookups.DTO;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Service.Lookups
{
    public interface ILookupService
    {
        Task<IEnumerable<LookupItemDto>> GetDepartments();
        Task<IEnumerable<LookupItemDto>> GetFunctions();
        Task<IEnumerable<LookupItemDto>> GetIndustries();
    }
}
