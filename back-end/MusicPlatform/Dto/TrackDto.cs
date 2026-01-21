namespace MusicPlatform.Dto;

public class TrackDto
{
    public int TrackId { get; set; }
    public string Name { get; set; }
    public string AuthorName { get; set; }
    public int AuthorId { get; set; }
    public int? AlbumId { get; set; }
    public string? AlbumName { get; set; }
    public string? TrackLink { get; set; }
    public int DurationSeconds { get; set; }
    public string? IconLink { get; set; }
    public decimal? AverageRating { get; set; }
    public string? Genres { get; set; }
    public int? ListenCount { get; set; }
}