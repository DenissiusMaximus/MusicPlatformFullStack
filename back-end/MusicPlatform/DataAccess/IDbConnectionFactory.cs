using System.Data;

namespace MusicPlatform.DataAccess;

public enum DbRoles
{
    User, Admin
}

public interface IDbConnectionFactory
{
    IDbConnection CreateConnection();
}