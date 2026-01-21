namespace MusicPlatform.Models;

public class Listen
{
    public int ListenId { get; set; }
    public int UserId { get; set; }
    public int TrackId { get; set; }
    public DateTime ListenedAt { get; set; }
}