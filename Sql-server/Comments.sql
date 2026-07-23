Create table Comments (
	IDOfuser int,
	MusicID int,
	Comments varchar(255)
	Constraint fk_IDOfuser_Users
	Foreign Key (IDOfuser) References Users(ID)
);
Alter table Comments
add CommentId int identity(1,1) primary key
Create or alter procedure DoComment
	@UserID int,
	@MusicID int,
	@Comment varchar(255)
	As
	Begin
	Insert into Comments (IDOfuser, MusicID, Comments)
	values (@UserID, @MusicID, @Comment)
	SELECT SCOPE_IDENTITY() AS CommentId
	End

	Create Or Alter PROCEDURE GetCommentsByMusicID
    @MusicID INT
AS
BEGIN
    SELECT 
		Comments.CommentId,
        Comments.comments,
        Comments.IDOfuser,
        Users.Name,
        Users.ProfilePicture,
        Users.Email
    FROM Comments
    JOIN Users 
        ON Comments.IDOfuser = Users.ID
    WHERE Comments.MusicID = @MusicID
END

	select * from Comments

	delete from Comments

Create Or Alter PROCEDURE DeleteComment
    @UserId INT,
    @commentID INT
AS
BEGIN
    DELETE FROM Comments
    WHERE CommentId = @commentID
      AND Comments.IDOfuser = @UserId
END
select * from Comments