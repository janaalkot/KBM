using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Features.Service.Lessons.DTO
{
    public class CreateLessonDto
    {
        public string Title { get; set; } = string.Empty;
        public string ProjectName { get; set; } = string.Empty;
        public Guid DepartmentId { get; set; }
        public Guid FunctionId { get; set; }
        public Guid IndustryId { get; set; }
        public string ValueProposition { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? PersonToContact { get; set; }
    }
}
