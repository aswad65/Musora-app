CREATE TABLE Follows
(
    Id INT IDENTITY PRIMARY KEY,

    UserId INT NOT NULL,
    FollowingId INT NOT NULL,

    CreatedAt DATETIME DEFAULT GETDATE(),

    CONSTRAINT UC_Follow UNIQUE(UserId, FollowingId),

    CONSTRAINT FK_Follows_User
        FOREIGN KEY(UserId)
        REFERENCES Users(Id),

    CONSTRAINT FK_Follows_Following
        FOREIGN KEY(FollowingId)
        REFERENCES Users(Id)
);

Create PROCEDURE FollowUser
    @UserId INT,
    @FollowingId INT
AS
BEGIN
    SET NOCOUNT ON;

    -- ❌ Prevent self-follow
    IF (@UserId = @FollowingId)
    BEGIN
        SELECT 
            0 AS Success,
            'You cannot follow yourself' AS Message;
        RETURN;
    END

    BEGIN TRANSACTION;

    BEGIN TRY

        -- ✅ Check if already following
        IF EXISTS (
            SELECT 1 
            FROM Follows
            WHERE UserId = @UserId 
            AND FollowingId = @FollowingId
        )
        BEGIN
            -- 🔴 UNFOLLOW
            DELETE FROM Follows
            WHERE UserId = @UserId 
            AND FollowingId = @FollowingId;

            -- Update counts
           UPDATE Users
        SET Following = ISNULL(Following, 0) - 1
        WHERE Id = @UserId;

        UPDATE Users
        SET Followers = ISNULL(Followers, 0) - 1
        WHERE Id = @FollowingId;

            SELECT 
                1 AS Success,
                'Unfollowed' AS Message;
        END
        ELSE
        BEGIN
            -- 🟢 FOLLOW
            INSERT INTO Follows (UserId, FollowingId)
            VALUES (@UserId, @FollowingId);

            -- Update counts
            UPDATE Users
        SET Following = ISNULL(Following, 0) + 1
        WHERE Id = @UserId;

        UPDATE Users
        SET Followers = ISNULL(Followers, 0) + 1
        WHERE Id = @FollowingId;
            SELECT 
                1 AS Success,
                'Followed' AS Message;
        END

        COMMIT TRANSACTION;

    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        SELECT 
            0 AS Success,
            ERROR_MESSAGE() AS Message;
    END CATCH
END
select * from Follows

Create Or Alter procedure GetFollowers
    @UserId INT
    AS
    BEGIN
    If Exists  (Select 1 from Follows where @UserId=Follows.UserId)
    Begin
    Select 'Follow' as Status, FollowingId from Follows where @UserId=Follows.UserId
    End
    End

