namespace MusicPlatform.Gql.Mutation;

public class NotificationContext
{
    private readonly List<Notification> _notifications = new List<Notification>();
    public IReadOnlyCollection<Notification> Notifications => _notifications;
    public bool HasNotifications => _notifications.Any();
    
    public void AddNotification(Notification notification)
    {
        _notifications.Add(notification);
    }
    
    public void AddNotification(string message, StatusCode statusCode)
    {
        var notification = new Notification
        {
            Message = message,
            StatusCode = statusCode
        };
        
        _notifications.Add(notification);
    }
}