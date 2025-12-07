using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
}