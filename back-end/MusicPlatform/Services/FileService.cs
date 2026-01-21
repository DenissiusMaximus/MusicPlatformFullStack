using MusicPlatform.Dto;
using NAudio.Wave;

namespace MusicPlatform.Services;

public class FileService(IWebHostEnvironment env, IConfiguration configuration)
{
    public string SetFullUrl(string relativeUrl)
    {
        var baseUrl = configuration["ApiSettings:BaseUrl"];

        if (baseUrl == null) 
            return relativeUrl;
        
        relativeUrl = $"{baseUrl}{relativeUrl}";
        
        return relativeUrl;
    }
    
    public TrackDto? SetFullUrl(TrackDto? track)
    {
        var baseUrl = configuration["ApiSettings:BaseUrl"];

        if (baseUrl == null || track == null) 
            return track;
        
        if(track.TrackLink is not null)
            track.TrackLink = $"{baseUrl}{track.TrackLink}";
        if(track.IconLink is not null)
            track.IconLink = $"{baseUrl}{track.IconLink}";
        
        return track;
    }
    
    public async Task<(string Url, int Duration)> SaveFileAsync(IFormFile file, string folderName)
    {
        var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
        
        var uploadsFolder = Path.Combine(env.WebRootPath, "uploads", folderName);

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var filePath = Path.Combine(uploadsFolder, uniqueFileName);

        await using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(fileStream);
        }
        var duration = 0;
        
        if (folderName is "audio" or "tracks") 
        {
            try 
            {
                await using var reader = new AudioFileReader(filePath);
                duration = (int)reader.TotalTime.TotalSeconds;
            }
            catch (Exception)
            {
                duration = 0;
            }
        }

        return ($"/uploads/{folderName}/{uniqueFileName}", duration);
    }
}