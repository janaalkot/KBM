using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Service.Lookups.DTO
{
    public class LookupItemDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
