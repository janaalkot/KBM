using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Configurations
{
    public class DepartmentFunctionConfiguration: IEntityTypeConfiguration<DepartmentFunction>
    {
        public void Configure(
            EntityTypeBuilder<DepartmentFunction> builder)
        {
            builder.HasKey(x => new
            {
                x.DepartmentId,
                x.FunctionId
            });

            builder.HasOne(x => x.Department)
                .WithMany(x => x.DepartmentFunctions)
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Function)
                .WithMany(x => x.DepartmentFunctions)
                .HasForeignKey(x => x.FunctionId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
