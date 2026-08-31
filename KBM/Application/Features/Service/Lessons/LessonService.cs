using Application.Features.Service.Lessons.DTO;
using Application.Interfaces;
using Domain.Entities;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Features.Service.Lessons
{
    public class LessonService : ILessonService
    {
        private readonly IApplicationDbContext _context;
        private readonly ILogger<LessonService> _logger;

        public LessonService(
            IApplicationDbContext context,
            ILogger<LessonService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<LessonDto>> GetAllLessons()
        {
            _logger.LogInformation("Fetching all lessons.");

            return await _context.Lessons
                .AsNoTracking()
                .OrderByDescending(x => x.CreatedDate)
                .Select(x => new LessonDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    ProjectName = x.ProjectName,

                    DepartmentId = x.DepartmentId,
                    DepartmentName = x.Department.Name,

                    FunctionId = x.FunctionId,
                    FunctionName = x.Function.Name,

                    IndustryId = x.IndustryId,
                    IndustryName = x.Industry.Name,

                    ValueProposition = x.ValueProposition,
                    Description = x.Description,

                    ImageUrl = x.ImageUrl,
                    PersonToContact = x.PersonToContact,

                    CreatedDate = x.CreatedDate,
                    ModifiedDate = x.ModifiedDate
                })
                .ToListAsync();
        }

        public async Task<LessonDto?> GetByIdLesson(Guid id)
        {
            _logger.LogInformation(
                "Fetching lesson with ID: {LessonId}",
                id);

            return await _context.Lessons
                .AsNoTracking()
                .Where(x => x.Id == id)
                .Select(x => new LessonDto
                {
                    Id = x.Id,
                    Title = x.Title,
                    ProjectName = x.ProjectName,

                    DepartmentId = x.DepartmentId,
                    DepartmentName = x.Department.Name,

                    FunctionId = x.FunctionId,
                    FunctionName = x.Function.Name,

                    IndustryId = x.IndustryId,
                    IndustryName = x.Industry.Name,

                    ValueProposition = x.ValueProposition,
                    Description = x.Description,

                    ImageUrl = x.ImageUrl,
                    PersonToContact = x.PersonToContact,

                    CreatedDate = x.CreatedDate,
                    ModifiedDate = x.ModifiedDate
                })
                .FirstOrDefaultAsync();
        }

        public async Task<LessonDto> CreateLesson(CreateLessonDto dto)
        {
            _logger.LogInformation("Creating a new lesson.");

            var departmentExists = await _context.Departments
                .AnyAsync(x => x.Id == dto.DepartmentId);

            if (!departmentExists)
                throw new ArgumentException("Selected department does not exist.");

            var functionExists = await _context.Functions
                .AnyAsync(x => x.Id == dto.FunctionId);

            if (!functionExists)
                throw new ArgumentException("Selected function does not exist.");

            var industryExists = await _context.Industries
                .AnyAsync(x => x.Id == dto.IndustryId);

            if (!industryExists)
                throw new ArgumentException("Selected industry does not exist.");

            var lesson = new Lesson
            {
                Id = Guid.CreateVersion7(),

                Title = dto.Title.Trim(),
                ProjectName = dto.ProjectName.Trim(),

                DepartmentId = dto.DepartmentId,
                FunctionId = dto.FunctionId,
                IndustryId = dto.IndustryId,

                ValueProposition = dto.ValueProposition.Trim(),
                Description = dto.Description.Trim(),

                ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl)
                    ? null
                    : dto.ImageUrl.Trim(),

                PersonToContact = string.IsNullOrWhiteSpace(dto.PersonToContact)
                    ? null
                    : dto.PersonToContact.Trim(),

                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };

            _context.Lessons.Add(lesson);

            await _context.SaveChangesAsync();

            _logger.LogInformation(
                "Successfully created lesson with ID: {LessonId}",
                lesson.Id);

            return (await GetByIdLesson(lesson.Id))!;
        }

        public async Task<bool> UpdateLesson(
            Guid id,
            UpdateLessonDto dto)
        {
            var lesson = await _context.Lessons
                .FirstOrDefaultAsync(x => x.Id == id);

            if (lesson == null)
                return false;

            lesson.Title = dto.Title.Trim();
            lesson.ProjectName = dto.ProjectName.Trim();

            lesson.DepartmentId = dto.DepartmentId;
            lesson.FunctionId = dto.FunctionId;
            lesson.IndustryId = dto.IndustryId;

            lesson.ValueProposition = dto.ValueProposition.Trim();
            lesson.Description = dto.Description.Trim();

            lesson.ImageUrl = string.IsNullOrWhiteSpace(dto.ImageUrl)
                ? null
                : dto.ImageUrl.Trim();

            lesson.PersonToContact = string.IsNullOrWhiteSpace(dto.PersonToContact)
                ? null
                : dto.PersonToContact.Trim();

            lesson.ModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeleteLesson(Guid id)
        {
            var lesson = await _context.Lessons
                .FirstOrDefaultAsync(x => x.Id == id);

            if (lesson == null)
                return false;

            _context.Lessons.Remove(lesson);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}