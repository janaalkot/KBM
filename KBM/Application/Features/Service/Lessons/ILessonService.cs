using Application.Features.Service.Lessons.DTO;

namespace Application.Features.Service.Lessons
{
    public interface ILessonService
    {
        Task<IEnumerable<LessonDto>> GetAllLessons();
        Task<LessonDto?> GetByIdLesson(Guid id);
        Task<LessonDto> CreateLesson(CreateLessonDto dto);
        Task<bool> UpdateLesson(Guid id, UpdateLessonDto dto);
        Task<bool> DeleteLesson(Guid id);
    }
}