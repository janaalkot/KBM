using Application.Features.Service.Lookups.DTO;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Service.Lookups
{
    public class LookupService : ILookupService
    {
        private readonly IApplicationDbContext _context;

        public LookupService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LookupItemDto>> GetDepartments()
        {
            return await _context.Departments
                .AsNoTracking()
                .OrderBy(x => x.Name)
                .Select(x => new LookupItemDto
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<LookupItemDto>> GetFunctions()
        {
            return await _context.Functions
                .AsNoTracking()
                .OrderBy(x => x.Name)
                .Select(x => new LookupItemDto
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<LookupItemDto>> GetIndustries()
        {
            return await _context.Industries
                .AsNoTracking()
                .OrderBy(x => x.Name)
                .Select(x => new LookupItemDto
                {
                    Id = x.Id,
                    Name = x.Name
                })
                .ToListAsync();
        }
    }
}
