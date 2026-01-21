namespace MusicPlatform.Gql;

public class GraphqlUserContext : Dictionary<string, object>
{
    public int? UserId { get; set; }
    public string? UserRole { get; set; }
}