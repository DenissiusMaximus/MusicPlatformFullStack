namespace MusicPlatform.Models;

public class Collection
 {
     public int CollectionId { get; set; }
     public int UserId { get; set; }
     public string Name { get; set; }
     public string? Description { get; set; }
     public int Type { get; set; } 
     public DateTime CreatedAt { get; set; }
     public string? IconLink { get; set; }
     public decimal AverageRating { get; set; }
     public bool IsPublic { get; set; }
 }