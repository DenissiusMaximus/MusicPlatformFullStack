using GraphQL.Server.Transports.AspNetCore;

namespace MusicPlatform.Gql.Mutation;

public class CreateCollectionInput
{
    public string Name { get; set; }
    public DateTime? CreatedAt { get; set; }
    public CollectionType Type { get; set; } = CollectionType.Playlist;
    public bool IsPublic { get; set; } = true;
    public string? Description { get; set; }
    [MediaType("image/png")] public IFormFile? Icon { get; set; }
}