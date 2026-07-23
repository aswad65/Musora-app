create table Albums(
	Id int primary key identity(1,1),
	Title varchar(Max),
	Description varchar(Max),
	CoverImage varChar(max),
	CreatedAt DATETIME DEFAULT GETDATE()
)
ALTER TABLE Comments
DROP CONSTRAINT Fk_userId_Users;
Alter table albums
add constraint Fk_userId_Users
foreign key (userId) References Users(ID)
create table albumMusic (
	AlbumId int,
	MusicId int
	constraint fk_AlbumId_albums
	foreign Key (AlbumId) References Albums(Id),
	constraint FK_MusicId_Musics
	foreign Key (MusicId) References Musics(Id)
)

CREATE OR ALTER PROCEDURE CreateAlbumWithMusics
(
    @UserId INT,
    @Title NVARCHAR(200),
    @Description NVARCHAR(MAX) = NULL,
    @CoverImage NVARCHAR(500) = NULL,
    @MusicIds NVARCHAR(MAX)
)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @AlbumId INT;

    -- Step 1: Create Album linked to user
    INSERT INTO Albums
    (
        UserId,
        Title,
        Description,
        CoverImage
    )
    VALUES
    (
        @UserId,
        @Title,
        @Description,
        @CoverImage
    );

    -- Step 2: Get created Album ID
    SET @AlbumId = SCOPE_IDENTITY();

    -- Step 3: Insert musics into album
    INSERT INTO AlbumMusic
    (
        AlbumId,
        MusicId
    )
    SELECT
        @AlbumId,
        CAST(value AS INT)
    FROM STRING_SPLIT(@MusicIds, ',')
    WHERE value <> '';

    -- Step 4: Return album id
    SELECT @AlbumId AS AlbumId;
END

create or alter procedure Getalbum
  as
  begin
   select * from albums
  End
CREATE OR ALTER PROCEDURE GetAlbumbyId
    @albumId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        am.*,
        m.*
    FROM albumMusic am
    JOIN Musics m 
        ON am.MusicId = m.Id
    WHERE am.AlbumId = @albumId;
END
GO

select * from albumMusic
SELECT name
FROM sys.objects
WHERE name = 'Fk_userId_Users';
SELECT
    fk.name AS ConstraintName,
    OBJECT_NAME(fk.parent_object_id) AS TableName
FROM sys.foreign_keys fk
WHERE fk.name = 'Fk_userId_Users';