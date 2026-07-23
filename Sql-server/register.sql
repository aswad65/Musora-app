

Create Or Alter PROCEDURE RegisterUser
    @name VARCHAR(150),
    @email VARCHAR(150),
    @password VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Users (Name, Email, Password)
    VALUES (@name, @email, @password);

    SELECT SCOPE_IDENTITY() AS UserId;
    
END
GO
select * from Users;
delete from Users 