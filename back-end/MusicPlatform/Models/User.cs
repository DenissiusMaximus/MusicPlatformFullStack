namespace MusicPlatform.Models;

public class User
{
    public int UserId { get; set; }
    public string Login { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public DateTime? BirthDate { get; set; }
    public string? Role { get; set; }
}