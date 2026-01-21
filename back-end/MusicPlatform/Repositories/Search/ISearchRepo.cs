using MusicPlatform.Dto;

namespace MusicPlatform.Repositories;

public interface ISearchRepo
{
    Task<SearchDto> Search(string query, int currentUserId);
}