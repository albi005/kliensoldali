using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace TodoReact.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<PushSubscription> PushSubscriptions => Set<PushSubscription>();
    public DbSet<Todo> Todos => Set<Todo>();
}
