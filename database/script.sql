create database MusicPlatform collate Cyrillic_General_CI_AS
go

use MusicPlatform
go

create table dbo.CollectionTypes
(
    CollectionTypeId int identity
        primary key,
    TypeName         varchar(50) not null
)
go

create table dbo.Genres
(
    GenreId int identity
        primary key,
    Name    nvarchar(100) not null
)
go

create table dbo.Users
(
    UserId       int identity
        primary key,
    Login        varchar(50)                    not null
        constraint UQ_Users_Login
            unique,
    Email        varchar(100)                   not null
        unique,
    PasswordHash varchar(255)                   not null,
    BirthDate    datetime,
    Role         nvarchar(20)
        constraint DF_Users_Role default 'User' not null
)
go

create table dbo.Collections
(
    CollectionId  int identity
        primary key,
    UserId        int
        references dbo.Users,
    Name          varchar(100)                       not null,
    Description   text,
    Type          int
        references dbo.CollectionTypes,
    CreatedAt     datetime default getdate(),
    IconLink      varchar(255),
    AverageRating decimal(3, 2),
    IsPublic      bit
        constraint DF_Collections_isPublic default 1 not null
)
go

create index IX_Collections_UserId
    on dbo.Collections (UserId)
go

create index IX_Collections_Type
    on dbo.Collections (Type)
go

create index IX_Collection_Name
    on dbo.Collections (Name)
go

create table dbo.Tracks
(
    TrackId       int identity
        primary key,
    UserId        int
        references dbo.Users,
    Name          varchar(200)  not null,
    Description   varchar(max),
    ReleaseDate   date,
    IsExplicit    bit default 0 not null,
    Duration      int           not null,
    IconLink      varchar(200),
    TrackLink     varchar(200),
    AverageRating decimal
)
go

create table dbo.CollectionTracks
(
    CollectionTrackId int identity
        primary key,
    DateAdded         datetime default getdate() not null,
    TrackId           int
        references dbo.Tracks,
    CollectionId      int
        references dbo.Collections
            on delete cascade
)
go

create index IX_CollectionTracks_CollectionId
    on dbo.CollectionTracks (CollectionId)
go

create index IX_CollectionTracks_TrackId
    on dbo.CollectionTracks (TrackId)
go

create table dbo.Reviews
(
    ReviewID        int identity
        primary key,
    CollectionID    int
        references dbo.Collections,
    TrackID         int
        references dbo.Tracks,
    UserID          int
        references dbo.Users,
    Rating          int
        check ([Rating] >= 1 AND [Rating] <= 10),
    ReviewText      text,
    ReviewDate      datetime default getdate(),
    ReplyToReviewID int
        references dbo.Reviews
)
go

create index IX_Reviews_CollectionId
    on dbo.Reviews (CollectionID)
go

create index IX_Reviews_ReplyTo
    on dbo.Reviews (ReplyToReviewID)
go

create index IX_Reviews_TrackId
    on dbo.Reviews (TrackID)
go

create index IX_Reviews_UserId
    on dbo.Reviews (UserID)
go

create table dbo.TrackGenres
(
    TrackGenreId int identity
        primary key,
    TrackId      int
        references dbo.Tracks
            on delete cascade,
    GenreId      int
        references dbo.Genres
            on delete cascade
)
go

create index IX_TrackGenres_GenreId
    on dbo.TrackGenres (GenreId)
go

create index IX_TrackGenres_TrackId
    on dbo.TrackGenres (TrackId)
go

create index IX_Tracks_UserId
    on dbo.Tracks (UserId)
go

create index IX_Track_Name
    on dbo.Tracks (Name)
go

