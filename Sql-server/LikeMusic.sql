

ALTER PROCEDURE LikeMusic
    @MusicID INT,
    @UserID INT
AS
BEGIN


    IF EXISTS (
        SELECT 1 
        FROM Likes 
        WHERE UserID = @UserID AND MusicID = @MusicID
    )
    BEGIN
        -- If like already exists → remove it
        DELETE FROM Likes
        WHERE UserID = @UserID AND MusicID = @MusicID;
   

        Select 'Unliked' AS Status;
        Update Musics
        set Likes = Likes - 1
        where Id = @MusicID and Users.ID = @UserID;  
   
      
    END
    ELSE
    BEGIN
        -- If like does not exist → add it
        INSERT INTO Likes (UserID, MusicID)
        VALUES (@UserID, @MusicID);
        Select 'Liked' AS Status;
      
      
        update Musics
        set Likes = Likes + 1
        where Id = @MusicID;    
    END

END


CREATE OR ALTER PROCEDURE GetLikedMusics
    @UserID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Musics.ID AS MusicID,
        Musics.Title,
        Musics.AudioFile,
        Musics.Artist,
        Musics.bgPic,
        Musics.Likes
    FROM Likes
    INNER JOIN Musics ON Likes.MusicID = Musics.ID
    WHERE Likes.UserID = @UserID
    select 'Liked Musics' as Status
END
GO


create table Likes(
    Id int primary key identity(1,1),
    MusicId int,
    UserId int
     constraint FK_Likes_MusicID foreign key (MusicID) references Musics(Id),
     constraint FK_Likes_Users foreign key (UserId) references Users(ID)

    
)

CREATE Or Alter PROCEDURE GetLikeMusicByID
    @MusicID INT,
    @UserID INT
AS
BEGIN

    IF EXISTS (
        SELECT 1
        FROM Likes
        WHERE MusicID = @MusicID
          AND UserID = @UserID
    )
    BEGIN
        SELECT 'Liked' as Status;
    END
    ELSE
    BEGIN
        SELECT 'UnLiked' as Status;
    END

END;
GO