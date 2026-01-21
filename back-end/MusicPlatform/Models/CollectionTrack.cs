namespace MusicPlatform.Models;

public class CollectionTrack
{
    public int CollectionTrackId { get; set; }
    public int CollectionId { get; set; }
    public int TrackId { get; set; }
    public DateTime DateAdded { get; set; }
}