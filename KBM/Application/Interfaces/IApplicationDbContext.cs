using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Lesson> Lessons { get; }
        DbSet<Department> Departments { get; }
        DbSet<Function> Functions { get; }
        DbSet<Industry> Industries { get; }
        DbSet<DepartmentFunction> DepartmentFunctions { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
