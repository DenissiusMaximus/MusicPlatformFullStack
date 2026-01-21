using GraphQL;

namespace MusicPlatform.Gql;

public static class GraphQlExtensions
{
    public static int GetUserId(this IResolveFieldContext context)
    {
        var userContext = context.UserContext as GraphqlUserContext;

        if (userContext?.UserId == null)
            throw new ExecutionError("User is not authenticated");

        return userContext.UserId.Value;
    }
    
    public static string GetUserRole(this IResolveFieldContext context)
    {
        var userContext = context.UserContext as GraphqlUserContext;

        if (userContext?.UserRole == null)
            return "User";

        return userContext.UserRole;
    }
}