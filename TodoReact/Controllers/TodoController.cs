using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.JSInterop.Infrastructure;
using TodoReact.Data;

namespace TodoReact.Controllers;

[ApiController]
public class TodoController(
    ApplicationDbContext db,
    UserManager<ApplicationUser> userManager
) : ControllerBase
{
    [HttpGet("/api/todos"), Authorize]
    public async Task<IActionResult> GetTodos()
    {
        var userId = userManager.GetUserId(User);
        return Ok(
            await db.Todos
                .Where(t => t.UserId == userId)
                .ToListAsync()
        );
    }

    [HttpPut("/api/todos"), Authorize]
    public async Task<IActionResult> Put([FromBody] TodoDto dto)
    {
        Todo? todo = dto.Id == 0
            ? db.Todos.Add(new()).Entity
            : await db.Todos.FirstOrDefaultAsync(t => t.Id == dto.Id);
        if (todo == null)
            return NotFound();
        var userId = userManager.GetUserId(User);
        if (todo.UserId != userId)
            return Unauthorized();
        todo.Title = dto.Title;
        todo.Description = dto.Description;
        todo.IsDone = dto.IsDone;
        todo.DueDate = dto.DueDate;
        await db.SaveChangesAsync();
        return Ok(todo.Id);
    }
}

public record TodoDto(
    int Id,
    string Title,
    string? Description,
    bool IsDone,
    DateTime? DueDate
);