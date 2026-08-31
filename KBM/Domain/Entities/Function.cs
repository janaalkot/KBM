using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Entities
{
    public class Function
    {

        public Guid Id { get; set; } = Guid.CreateVersion7();
        public string Name { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
        public ICollection<DepartmentFunction> DepartmentFunctions { get; set; } = new List<DepartmentFunction>();
        public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    }
}
