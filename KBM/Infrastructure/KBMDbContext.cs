using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
namespace Infrastructure
{
    public class KBMDbContext : IdentityDbContext<ApplicationUser>, IApplicationDbContext
    {
        public KBMDbContext( DbContextOptions<KBMDbContext> options) : base(options)
        {}

        public DbSet<Lesson> Lessons => Set<Lesson>();
        public DbSet<Department> Departments => Set<Department>();
        public DbSet<Function> Functions => Set<Function>();
        public DbSet<Industry> Industries => Set<Industry>();
        public DbSet<DepartmentFunction> DepartmentFunctions => Set<DepartmentFunction>();
        protected override void OnModelCreating( ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(KBMDbContext).Assembly);
        }
    }
}
