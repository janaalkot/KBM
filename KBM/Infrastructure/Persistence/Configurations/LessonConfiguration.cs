using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace Infrastructure.Persistence.Configurations
{
    public class LessonConfiguration : IEntityTypeConfiguration<Lesson>
    {
        public void Configure(EntityTypeBuilder<Lesson> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(x => x.ProjectName)
                .IsRequired()
                .HasMaxLength(200);

            builder.Property(x => x.ValueProposition)
                .IsRequired();

            builder.Property(x => x.Description)
                .IsRequired();

            builder.Property(x => x.ImageUrl)
                .HasMaxLength(500);

            builder.Property(x => x.PersonToContact)
                .HasMaxLength(200);

            builder.HasOne(x => x.Department)
                .WithMany(x => x.Lessons)
                .HasForeignKey(x => x.DepartmentId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Function)
                .WithMany(x => x.Lessons)
                .HasForeignKey(x => x.FunctionId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(x => x.Industry)
                .WithMany(x => x.Lessons)
                .HasForeignKey(x => x.IndustryId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
