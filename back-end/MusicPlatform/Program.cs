using GraphQL;
using GraphQL.Types;
using MusicPlatform.DataAccess;
using MusicPlatform.Gql;
using MusicPlatform.Gql.Mutation;
using MusicPlatform.Gql.Query;
using MusicPlatform.Repositories;
using MusicPlatform.Repositories.Genre;
using MusicPlatform.Repositories.Listen;
using MusicPlatform.Repositories.Review;
using MusicPlatform.Repositories.Track;
using MusicPlatform.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpContextAccessor();

builder.Services.AddScoped<IUserRepo, UserRepo>();
builder.Services.AddScoped<ICollectionRepo, CollectionRepo>();
builder.Services.AddScoped<ITrackRepo, TrackRepo>();
builder.Services.AddScoped<ISearchRepo, SearchRepo>();
builder.Services.AddScoped<IReviewRepo, ReviewRepo>();
builder.Services.AddScoped<IListenRepo, ListenRepo>();
builder.Services.AddScoped<IGenreRepo, GenreRepo>();

builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<FileService>();

builder.Services.AddScoped<CollectionQuery>();
builder.Services.AddScoped<UserQuery>();
builder.Services.AddScoped<TrackQuery>();
builder.Services.AddScoped<SearchQuery>();
builder.Services.AddScoped<ReviewQuery>();
builder.Services.AddScoped<GenreQuery>();
builder.Services.AddScoped<ListenQuery>();
builder.Services.AddScoped<AppQuery>();

builder.Services.AddScoped<UserMutation>();
builder.Services.AddScoped<CollectionMutation>();
builder.Services.AddScoped<TrackMutation>();
builder.Services.AddScoped<ReviewsMutation>();
builder.Services.AddScoped<GenreMutation>();
builder.Services.AddScoped<ListenMutation>();
builder.Services.AddScoped<AppMutation>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()!)
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddScoped<IDbConnectionFactory, SqlDbConnectionFactory>(sp =>
{
    var httpContextAccessor = sp.GetRequiredService<IHttpContextAccessor>();
    var jwtService = sp.GetRequiredService<IJwtService>();
    
    var context = httpContextAccessor.HttpContext;
    
    var dbFactory = new SqlDbConnectionFactory(builder.Configuration);
    
    if (context == null) return dbFactory;
    
    var token = context.Items["JwtToken"] as string;
    
    dbFactory.role = DbRoles.User;
    
    if (token == null) return dbFactory;
    var userRole = jwtService.ValidateToken(token).Result?.Role;
    

    if(userRole == "Admin")
        dbFactory.role = DbRoles.Admin;
    
    return dbFactory;
});

builder.Services.AddGraphQL(b => b
    .AddAutoSchema<AppQuery>(a => a.WithMutation<AppMutation>())
    .AddDataLoader()
    .AddGraphTypes()
    .AddSystemTextJson()
    .AddFormFileGraphType()
    .AddErrorInfoProvider(opt => opt.ExposeExceptionDetails = true)
    .AddUserContextBuilder(async sp =>
    {
        var requestServices = sp.RequestServices;

        var http = requestServices.GetRequiredService<IHttpContextAccessor>();
        
        var token = http.HttpContext?.Items["JwtToken"] as string;
        
        var jwtService = requestServices.GetRequiredService<IJwtService>();

        if (token == null) return null;
        
        var userId = (await jwtService.ValidateToken(token))?.Id;
        var userRole = (await jwtService.ValidateToken(token))?.Role;

        return new GraphqlUserContext
        {
            UserId = userId,
            UserRole = userRole
        };
    })
    .ConfigureExecutionOptions(options =>
    {
        var type = options.Query?.Split("{");

        if (type is not null && type[0].Trim().StartsWith("mutation", StringComparison.OrdinalIgnoreCase))
            options.Root = options.RequestServices!.GetRequiredService<AppMutation>();
        else
            options.Root = options.RequestServices!.GetRequiredService<AppQuery>();
    })
);

var app = builder.Build();

app.UseCors();

app.Use(async (context, next) =>
{
    var authHeader = context.Request.Headers["Authorization"];  

    if (authHeader.Count > 1)
        throw new UnauthorizedAccessException();

    var authHeaderValue = authHeader.FirstOrDefault();

    if (!string.IsNullOrEmpty(authHeaderValue) && authHeaderValue.StartsWith("Bearer "))
    {
        var token = authHeaderValue.Substring("Bearer ".Length);
        context.Items["JwtToken"] = token;
    }
    
    await next();
});


app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseGraphQL(configureMiddleware: options => 
{
    options.ReadFormOnPost = true;
});

app.UseGraphQLGraphiQL();
app.UseGraphQLAltair();

app.UseRouting();

app.Run();