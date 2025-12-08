using Lib.Net.Http.WebPush;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoReact.Data;
using JsonSerializer = System.Text.Json.JsonSerializer;
using PushSubscription = TodoReact.Data.PushSubscription;

namespace TodoReact.Controllers;

[ApiController]
public class TodoController(
    ApplicationDbContext db,
    PushServiceClient pushServiceClient,
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
        var userId = userManager.GetUserId(User)!;
        Todo? todo = dto.Id == 0
            ? db.Todos.Add(new() { UserId = userId }).Entity
            : await db.Todos.FirstOrDefaultAsync(t => t.Id == dto.Id);
        if (todo == null)
            return NotFound();
        if (todo.Id != 0 && todo.UserId != userId)
            return Unauthorized();
        todo.Title = dto.Title;
        todo.Description = dto.Description;
        todo.IsDone = dto.IsDone;
        todo.DueDate = dto.DueDate;

        var subscriptions = await db.PushSubscriptions.Where(p => p.UserId == userId)
            .ToListAsync();
        if (todo.Id == 0)
            _ = SendPush(subscriptions, todo.Title);

        await db.SaveChangesAsync();
        return Ok(todo.Id);
    }

    private async Task SendPush(List<PushSubscription> subscriptions, string title)
    {
        await Task.Delay(1000);
        foreach (PushSubscription subscription in subscriptions)
        {
            Lib.Net.Http.WebPush.PushSubscription pushSubscription = new() { Endpoint = subscription.Endpoint };
            pushSubscription.SetKey(PushEncryptionKeyName.Auth, subscription.Auth);
            pushSubscription.SetKey(PushEncryptionKeyName.P256DH, subscription.P256DH);
            await pushServiceClient.RequestPushMessageDeliveryAsync(
                pushSubscription,
                new(JsonSerializer.Serialize(new { title }))
                {
                    TimeToLive = 100
                });
        }
    }
}

public record TodoDto(
    int Id,
    string Title,
    string? Description,
    bool IsDone,
    DateTime? DueDate
);