using GraphQL.Server.Transports.AspNetCore;
using MusicPlatform.Dto;

namespace MusicPlatform.Gql.Mutation;

public class CreateAlbumInput
{
    public string Name { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public List<TrackInputDto>? Tracks { get; set; }
    public bool IsPublic { get; set; } = true;
    public string? Description { get; set; }
    [MediaType("image/png")] public IFormFile? Icon { get; set; }
    public CollectionType Type { get; set; } = CollectionType.Album;
}