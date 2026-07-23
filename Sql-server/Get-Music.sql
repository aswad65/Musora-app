
CREATE OR ALTER PROCEDURE GetAllMusic
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Musics.*, Users.Name as OwnerName, Users.Email as OwnerEmail
    FROM Musics
    JOIN Users ON Musics.userId = Users.ID
END
GO

CREATE OR ALTER PROCEDURE GetMusicByUserID
   @UserID  int
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Musics.*, Users.Name as OwnerName, Users.Email as OwnerEmail
    FROM Musics
    JOIN Users ON Musics.userId = Users.ID
    WHERE Musics.userId = @UserID
END
GO

CREATE OR ALTER PROCEDURE GetMusicBymusicId
    @MusicID int
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Musics.*, Users.Name as OwnerName, Users.Email as OwnerEmail
    FROM Musics
    JOIN Users ON Musics.userId = Users.ID
    WHERE Musics.Id = @MusicID
END
GO
delete from Musics
```sql id="a2u6md"
```sql id="u1m8kp"
CREATE Or Alter PROCEDURE DeleteMusic
    @MusicId INT,
    @UserId INT
AS
BEGIN

    BEGIN TRY

        BEGIN TRANSACTION;

        -- =========================
        -- Delete Likes
        -- =========================

        DELETE FROM Likes
        WHERE MusicId = @MusicId;

        -- =========================
        -- Delete Notifications
        -- =========================

        DELETE FROM Notifications
        WHERE MusicId = @MusicId;

        -- =========================
        -- Delete Playlist Music References
        -- =========================

        DELETE FROM playlistMusics
        WHERE MusicId = @MusicId;
           -- =========================
        -- Delete Album Music References
        -- =========================
        DELETE FROM albumMusic
        WHERE MusicId = @MusicId
        -- =========================
        -- Delete Music
        -- =========================

        DELETE FROM Musics
        WHERE Id = @MusicId
        AND UserId = @UserId;


        -- Check if music deleted
        IF @@ROWCOUNT = 0
        BEGIN

            ROLLBACK TRANSACTION;

            SELECT
                0 AS Success,
                'Music not found or unauthorized user'
                AS Message;

            RETURN;

        END

        COMMIT TRANSACTION;

        SELECT
            1 AS Success,
            'Music deleted successfully'
            AS Message;

    END TRY

    BEGIN CATCH

        ROLLBACK TRANSACTION;

        SELECT
            0 AS Success,
            ERROR_MESSAGE() AS Message;

    END CATCH

END
```

```

select * from Musics
Alter PROCEDURE EditMusic
    @MusicId INT,
    @UserId INT,
    @Title VARCHAR(255),
    @Artist VARCHAR(255),
    @AudioFile VARCHAR(MAX) = NULL,
    @bgPic VARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1
        FROM Musics
        WHERE Id = @MusicId
          AND UserId = @UserId
    )
    BEGIN
        UPDATE Musics
        SET
            Title = @Title,
            Artist = @Artist,
            AudioFile = CASE
                            WHEN @AudioFile IS NULL OR LTRIM(RTRIM(@AudioFile)) = ''
                                THEN AudioFile
                            ELSE @AudioFile
                        END,
            bgPic = CASE
                        WHEN @bgPic IS NULL OR LTRIM(RTRIM(@bgPic)) = ''
                            THEN bgPic
                        ELSE @bgPic
                    END
        WHERE
            Id = @MusicId
            AND UserId = @UserId;

        SELECT
            1 AS Success,
            'Music updated successfully.' AS Message;
    END
    ELSE
    BEGIN
        SELECT
            0 AS Success,
            'Music not found or you are not authorized to edit it.' AS Message;
    END
END;