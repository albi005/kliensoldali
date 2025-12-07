using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace TodoReact.Data;

[Index(nameof(Endpoint), IsUnique = true)]
public class PushSubscription
{
    public int Id { get; init; }
    public string UserId { get; set; } = null!;

    [MaxLength(2000)] public required string Endpoint { get; init; }
    [MaxLength(100)] public required string P256DH { get; init; }
    [MaxLength(50)] public required string Auth { get; init; }
    
    public ApplicationUser User { get; set; } = null!;
}
