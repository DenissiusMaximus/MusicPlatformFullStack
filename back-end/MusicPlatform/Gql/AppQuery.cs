using MusicPlatform.Gql.Query;

namespace MusicPlatform.Gql;

public class AppQuery(
    CollectionQuery collection,
    UserQuery user,
    ReviewQuery review,
    TrackQuery tracks,
    SearchQuery search,
    GenreQuery genre,
    ListenQuery listen)
{
    public CollectionQuery Collection => collection;
    public UserQuery User => user;
    public ReviewQuery Review => review;
    public TrackQuery Track => tracks;
    public SearchQuery Search => search;
    public GenreQuery Genre => genre;
    public ListenQuery Listen => listen;
}