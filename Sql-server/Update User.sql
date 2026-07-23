--Alter PROCEDURE UpdateUserProfile
    @userId INT,
    @name VARCHAR(255) = NULL,
    @profile_pic NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Users
    SET
        Name = CASE
                    WHEN @name IS NULL OR LTRIM(RTRIM(@name)) = ''
                        THEN Name
                    ELSE @name
               END,
        ProfilePicture = CASE
                             WHEN @profile_pic IS NULL OR LTRIM(RTRIM(@profile_pic)) = ''
                                 THEN ProfilePicture
                             ELSE @profile_pic
                         END
    WHERE ID = @userId;

    SELECT
        1 AS Success,
        'Profile updated successfully.' AS Message;
END;