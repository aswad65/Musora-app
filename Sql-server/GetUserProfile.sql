create Procedure GetUserProfileData
@UserID int
as
begin
select * from dbo.Users where ID = @UserID
End