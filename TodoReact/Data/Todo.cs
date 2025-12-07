namespace TodoReact.Data;

public class Todo
{
    public int Id { get; set; }
    public string UserId { get; set; }
    
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public bool IsDone { get; set; }
    public DateTime? DueDate { get; set; }

    public ApplicationUser User { get; set; } = null!;
}