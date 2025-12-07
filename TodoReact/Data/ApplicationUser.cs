using Microsoft.AspNetCore.Identity;

namespace TodoReact.Data;

// Add profile data for application users by adding properties to the ApplicationUser class
public class ApplicationUser : IdentityUser
{
    public List<PushSubscription> PushSubscriptions { get; } = [];
    public List<Todo> Todos { get; } = [];
}

