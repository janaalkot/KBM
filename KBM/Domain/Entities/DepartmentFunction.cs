using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;


namespace Domain.Entities
{
    public class DepartmentFunction
    {

        public Guid DepartmentId { get; set; }
        public Department Department { get; set; } = null!;
        public Guid FunctionId { get; set; }
        public Function Function { get; set; } = null!;

    }
}
