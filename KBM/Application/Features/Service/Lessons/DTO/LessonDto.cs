using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Application.Features.Service.Lessons.DTO
{
    public class LessonDto
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = string.Empty;
        public string ProjectName { get; set; } = string.Empty;

        public Guid DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;

        public Guid FunctionId { get; set; }
        public string FunctionName { get; set; } = string.Empty;

        public Guid IndustryId { get; set; }
        public string IndustryName { get; set; } = string.Empty;

        public string ValueProposition { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }
        public string? PersonToContact { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
