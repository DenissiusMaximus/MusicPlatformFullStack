using System.Data;
using Microsoft.Data.SqlClient;

namespace MusicPlatform.DataAccess;

public class SqlDbConnectionFactory(IConfiguration config) : IDbConnectionFactory
{
    public DbRoles role;
    
    private readonly string _connectionStringUser = config.GetConnectionString("ConnectionUser")
        ?? throw new Exception("Connection string not found");
    
    private readonly string _connectionStringAdmin = config.GetConnectionString("ConnectionAdmin")
        ?? throw new Exception("Connection string not found");

    public IDbConnection CreateConnection()
    {
        var conn = new SqlConnection(role switch
        {
            DbRoles.Admin => _connectionStringAdmin,
            _ => _connectionStringUser
        });
        
        conn.Open();
        
        return conn;
    }
}