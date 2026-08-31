using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;


namespace Domain.Entities
{
    public class Lesson
    {

        public Guid Id { get; set; } = Guid.CreateVersion7();
        public string Title { get; set; } = string.Empty;
        public string ProjectName { get; set; } = string.Empty;
        public Guid DepartmentId { get; set; }
        public Department Department { get; set; } = null!;
        public Guid FunctionId { get; set; }
        public Function Function { get; set; } = null!;
        public Guid IndustryId { get; set; }
        public Industry Industry { get; set; } = null!;
        public string ValueProposition { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? PersonToContact { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
