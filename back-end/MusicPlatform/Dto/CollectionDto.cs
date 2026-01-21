namespace MusicPlatform.Dto;

public class CollectionDto
{
    public int CollectionId { get; set; }
    public int AuthorId { get; set; }
    public string Name { get; set; }
    public string AuthorName { get; set; } 
    public string? Description { get; set; }
    public int SongsCount { get; set; }
    public string CollectionType { get; set; }
    public string? IconLink { get; set; }
    public decimal AverageRating { get; set; }
    
    public List<TrackDto>? Songs { get; set;}
}