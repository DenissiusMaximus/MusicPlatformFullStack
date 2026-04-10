using MusicPlatform.Dto;

namespace MusicPlatform.Services;

public interface IFileProvider
{
    string SetFullUrl(string relativeUrl);
    TrackDto? SetFullUrl(TrackDto? track);
    Task<(string Url, int Duration)> SaveFileAsync(IFormFile file, string folderName);
}