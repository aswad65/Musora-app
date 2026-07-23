CREATE TABLE Musics(
    Id INT PRIMARY KEY IDENTITY(1,1),
    Title VARCHAR(255) NOT NULL,
    AudioFile VARCHAR(MAX) NOT NULL, 
    Artist VARCHAR(255) NOT NULL,
    userID INT NOT NULL,
    Likes INT NOT NULL DEFAULT 0,
    bgPic VARCHAR(MAX),

    CONSTRAINT FK_Musics_Users
    FOREIGN KEY (userID) REFERENCES Users(ID)
);
ALTER TABLE Musics
ALTER COLUMN bgPic VARCHAR(MAX);
CREATE OR ALTER PROCEDURE MusicWithUser
    @Title VARCHAR(255),
    @AudioFile VARCHAR(MAX),
    @Artist VARCHAR(255),
    @userID INT,
    @bgPic VARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Musics (Title, AudioFile, Artist, userID, bgPic)
    VALUES (@Title, @AudioFile, @Artist, @userID, @bgPic);
    
    SELECT SCOPE_IDENTITY() AS MusicId;
END
select * from Musics
delete from Musics