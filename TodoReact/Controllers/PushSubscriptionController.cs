using System.Web;
using Lib.AspNetCore.WebPush;
using Lib.Net.Http.WebPush;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TodoReact.Data;
using PushSubscription = TodoReact.Data.PushSubscription;

namespace TodoReact.Controllers;

[ApiController]
[Route("/api/push-subscriptions")]
public class PushSubscriptionController(
    ApplicationDbContext db,
    UserManager<ApplicationUser> userManager,
    IOptions<PushServiceClientOptions> pushOptions
) : ControllerBase
{
    [HttpGet("endpoints"), Authorize]
    public async Task<List<string>> GetHashes()
    {
        var userId = userManager.GetUserId(User)!;
        return await db
            .PushSubscriptions
            .Where(x => x.UserId == userId)
            .Select(x => x.Endpoint)
            .ToListAsync();
    }

    [HttpPut, Authorize]
    // no csrf validation needed as this implicitly only accepts Content-Type: application/json
    public async Task<IActionResult> Put([FromBody] Lib.Net.Http.WebPush.PushSubscription dto)
    {

        string userId = userManager.GetUserId(User)!;

        PushSubscription? subscription = await db.PushSubscriptions
            .FirstOrDefaultAsync(s => s.Endpoint == dto.Endpoint);

        if (subscription != null && subscription.UserId != userId)
        {
            subscription.UserId = userId;
            await db.SaveChangesAsync();
            return NoContent();
        }

        db.PushSubscriptions.Add(new()
        {
            UserId = userId,
            Endpoint = dto.Endpoint,
            P256DH = dto.GetKey(PushEncryptionKeyName.P256DH),
            Auth = dto.GetKey(PushEncryptionKeyName.Auth),
        });

        await db.SaveChangesAsync();
        return Created();
    }

    [HttpDelete("{endpoint}")]
    public async Task<IActionResult> Delete(string endpoint)
    {
        endpoint = HttpUtility.UrlDecode(endpoint);

        PushSubscription? subscription = await db.PushSubscriptions.FirstOrDefaultAsync(s => s.Endpoint == endpoint);
        if (subscription == null)
            return NotFound();

        db.PushSubscriptions.Remove(subscription);
        await db.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("public-key")]
    public IActionResult GetVapidPublicKey() => Ok(pushOptions.Value.PublicKey);
}