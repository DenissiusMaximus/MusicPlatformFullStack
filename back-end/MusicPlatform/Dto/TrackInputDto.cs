using GraphQL.Server.Transports.AspNetCore;

namespace MusicPlatform.Dto;

public class TrackInputDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsExplicit { get; set; }
    
    [MediaType("audio/mpeg")] 
    public IFormFile? AudioFile { get; set; }
    
    public List<int>? Genres { get; set; }
}