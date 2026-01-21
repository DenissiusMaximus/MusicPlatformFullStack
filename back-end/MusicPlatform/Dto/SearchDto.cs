namespace MusicPlatform.Dto;

public class SearchDto
{
    public List<TrackDto> Tracks { get; set; } = new();
    public List<ArtistsDto> Artists { get; set; } = new();
    public List<CollectionDto> Collections { get; set; } = new();
}