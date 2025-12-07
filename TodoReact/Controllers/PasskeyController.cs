using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TodoReact.Data;

namespace TodoReact.Controllers;

[ApiController, EnableCors]
public class PasskeyController(
    SignInManager<ApplicationUser> signInManager,
    UserManager<ApplicationUser> userManager
)
    : ControllerBase
{
    [HttpGet("/api/me")]
    public IActionResult GetMe()
    {
        if (User.Identity is not { IsAuthenticated: true })
            return NoContent();
        return Ok(User.Identity.Name);
    }

    [HttpPost("/api/logout")]
    public async Task<IActionResult> LogOut()
    {
        await signInManager.SignOutAsync();
        return NoContent();
    }
}