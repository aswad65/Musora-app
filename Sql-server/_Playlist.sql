create table playlistTitle(
	Id int primary key identity(1,1),
	Title varchar(255),
	UserId int
)

create table playlistMusics(
	Id int primary key identity(1,1),
	PlaylistId int,
	MusicId int
	constraint FK_PlaylistMusics_PlaylistId foreign key (PlaylistId) references playlistTitle(Id),
	constraint FK_PlaylistMusics_MusicId foreign key (MusicId) references Musics(Id)
)


CREATE OR ALTER PROCEDURE CreatePlaylist
	@Title varchar(255),
	@UserId int
AS
BEGIN
	SET NOCOUNT ON;
	INSERT INTO playlistTitle (Title, UserId)
	VALUES (@Title, @UserId)
	SELECT * FROM playlistTitle
	WHERE UserId = @UserId AND Title = @Title
END
GO
CREATE OR ALTER PROCEDURE AddMusicToPlaylist
    @PlaylistId INT,
    @MusicId INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check for duplicates
    IF EXISTS (
        SELECT 1
        FROM playlistMusics
        WHERE PlaylistId = @PlaylistId AND MusicId = @MusicId
    )
    BEGIN
        -- Custom error message for duplicate
        THROW 50001, 'This song is already in the playlist!', 1;
    END

    INSERT INTO playlistMusics (PlaylistId, MusicId)
    VALUES (@PlaylistId, @MusicId);

    -- Return all songs in this playlist
    SELECT m.*
    FROM playlistMusics pm
    JOIN musics m ON pm.MusicId = m.Id
    WHERE pm.PlaylistId = @PlaylistId;
END
GO

	CREATE OR ALTER PROCEDURE GetPlaylistsTitle
	@UserId int
AS
BEGIN
	SET NOCOUNT ON;
	SELECT * FROM playlistTitle
	WHERE UserId = @UserId
END
GO


CREATE OR ALTER PROCEDURE GetMusicsByPlaylist
    @PlaylistId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        pm.Id,
        m.Id AS MusicId, 
        m.Title, 
        m.AudioFile, 
        m.Artist, 
        m.bgPic
    FROM playlistMusics pm
    JOIN Musics m ON pm.MusicId = m.Id
    WHERE pm.PlaylistId = @PlaylistId;
END
GO

CREATE OR ALTER PROCEDURE DeletePlaylist
    @PlaylistId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Verify ownership before deleting
    IF EXISTS (SELECT 1 FROM playlistTitle WHERE Id = @PlaylistId )
    BEGIN
        -- First delete all associations in playlistMusics
        DELETE FROM playlistMusics WHERE PlaylistId = @PlaylistId;
        -- Then delete the playlist itself
        DELETE FROM playlistTitle WHERE Id = @PlaylistId;
    END
    ELSE
    BEGIN
        THROW 50002, 'You do not have permission to delete this playlist', 1;
    END
END
GO

CREATE OR ALTER PROCEDURE DeleteMusicFromPlaylist
    @PlaylistId INT,
    @MusicId INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if playlist exists
    IF EXISTS (
        SELECT 1 
        FROM playlistTitle 
        WHERE Id = @PlaylistId
    )
    BEGIN
        -- Delete music from playlist
        DELETE FROM playlistMusics
        WHERE PlaylistId = @PlaylistId 
          AND MusicId = @MusicId;

        -- Optional: Check if anything was deleted
        IF @@ROWCOUNT = 0
        BEGIN
            THROW 50004, 'Music not found in this playlist', 1;
        END
    END
    ELSE
    BEGIN
        THROW 50003, 'Playlist not found or permission denied', 1;
    END
END
GO
select * from playlistMusics





