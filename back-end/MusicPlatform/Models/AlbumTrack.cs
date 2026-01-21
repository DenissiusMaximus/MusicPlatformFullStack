namespace MusicPlatform.Models;

public class AlbumTrack
{
    public int UserId { get; set; } 
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateTime ReleaseDate { get; set; }
    public bool IsExplicit { get; set; }
    public int Duration { get; set; } 
    public string? IconLink { get; set; }
    public string? TrackLink { get; set; }
    public List<int>? Genres { get; set; }
}