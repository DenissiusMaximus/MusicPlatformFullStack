using GraphQL;
using MusicPlatform.Dto;
using MusicPlatform.Repositories;
using MusicPlatform.Services;

namespace MusicPlatform.Gql;

public class SearchQuery(ISearchRepo repo, FileProvider fileProvider)
{
    public async Task<SearchDto> Search(string query, IResolveFieldContext context)
    {
        var userId = context.GetUserId();
        
        var res = await repo.Search(query, userId);

        foreach (var dto in res.Tracks)
        {
            if(dto.IconLink != null)
                dto.IconLink = fileProvider.SetFullUrl(dto.IconLink);
        }

        foreach (var dto in res.Collections)
        {
            if(dto.IconLink != null)
                dto.IconLink = fileProvider.SetFullUrl(dto.IconLink);
        }

        return res;
    }
}