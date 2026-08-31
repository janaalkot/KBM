using Application.Features.Service.Lessons;
using Application.Features.Service.Lessons.DTO;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace KBM.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [Authorize]
    public class LessonController : ControllerBase
    {
        private readonly ILessonService _lessonService;
        public LessonController(ILessonService lessonService)
        {
            _lessonService = lessonService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<LessonDto>>> GetAll()
        {
            var lessons = await _lessonService.GetAllLessons();
            return Ok(lessons);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<LessonDto>> GetById(Guid id)
        {
            var lesson = await _lessonService.GetByIdLesson(id);
            if (lesson is null)
                return NotFound();

            return Ok(lesson);
        }

        [HttpPost]
        public async Task<ActionResult<LessonDto>> Create(
            [FromBody] CreateLessonDto dto)
        {
            var lesson = await _lessonService.CreateLesson(dto);

            return CreatedAtAction(nameof(GetById), new { id = lesson.Id }, lesson);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update( Guid id, [FromBody] UpdateLessonDto dto)
        {
            var updated = await _lessonService.UpdateLesson(id, dto);
            if (!updated)
                return NotFound();

            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _lessonService.DeleteLesson(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
