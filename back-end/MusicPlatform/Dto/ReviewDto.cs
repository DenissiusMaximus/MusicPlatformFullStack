namespace MusicPlatform.Models;

public class ReviewDto
{
    public int ReviewID { get; set; }
    public int UserID { get; set; }
    public int? TrackID { get; set; }
    public int? CollectionID { get; set; }
        
    public int? Rating { get; set; }
    public string? ReviewText { get; set; }
    public DateTime ReviewDate { get; set; }
    
    public int? ReplyToReviewID { get; set; }
    
    public string? AuthorLogin { get; set; }
    
    public bool? IsCurrentUserOwner { get; set; }
}