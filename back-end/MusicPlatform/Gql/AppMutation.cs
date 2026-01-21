using GraphQL.Server.Transports.AspNetCore;
using MusicPlatform.Dto;
using MusicPlatform.Gql.Mutation;

namespace MusicPlatform.Gql;

public class AppMutation(
    UserMutation user,
    CollectionMutation collection,
    TrackMutation track,
    ReviewsMutation reviews,
    GenreMutation genre,
    ListenMutation listen)
{
    public UserMutation User => user;
    public CollectionMutation Collection => collection;
    public TrackMutation Track => track;
    public ReviewsMutation Review => reviews;
    public GenreMutation Genre => genre;
    public ListenMutation Listen => listen;
}