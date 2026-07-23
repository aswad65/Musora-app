import { sql } from "../database/db.js";
import { connectDB } from "../database/db.js";

export const CreateMusicservice = async (title, artist, AudioFile, userId, bgPic) => {
    const pool = await connectDB();

    try {
        const result = pool.request()
            .input("Title", sql.VarChar(255), title)
            .input("AudioFile", sql.VarChar(sql.MAX), AudioFile)
            .input("Artist", sql.VarChar(255), artist)
            .input("userID", sql.Int, userId)
            .input("bgPic", sql.VarChar(sql.MAX), bgPic)
            .execute("MusicWithUser");
        return result;
    }
    catch (error) {
        console.error("Error creating music:", error);
        throw error;
    }
}
export const GeAlltMusicService = async () => {
    try {
        const pool = await connectDB();
        const result = await pool.request().execute("GetAllMusic");

        return result.recordset;
    }
    catch (error) {
        console.error("Error in GeAlltMusicService:", error);
        throw error;
    }
}


export const GetMusicByUserIDService = async (userId) => {
    const pool = await connectDB();
    const result = await pool.request()
        .input("UserID", sql.Int, userId)
        .execute("GetMusicByUserID");
    return result.recordset;
}

export const GetMusicById = async (userId) => {
    const pool = await connectDB();
    const result = await pool.request()
        .input("UserID", sql.Int, userId)
        .execute("GetMusicByUserID");
    return result.recordset;
}

export const LikeMusicservice = async (MusicId, userId) => {
    const pool = await connectDB();
    const result = await pool.request().input("MusicID", sql.Int, MusicId).input("UserID", sql.Int, userId).execute("LikeMusic");
    return result.recordset;
}

export const addmusicInsidAlbum = async (Title, Description, MusicIds, UserId, coverImage) => {
    const pool = await connectDB();
    const results = await pool.request()
        .input("Title", sql.VarChar(255), Title)
        .input("Description", sql.VarChar(255), Description)
        .input("CoverImage", sql.VarChar(sql.MAX), coverImage)
        .input("UserID", sql.Int, UserId)
        .input("MusicIDs", sql.VarChar(sql.MAX), MusicIds)
        .execute("CreateAlbumWithMusics");






    return results;
}


export const GetLikeMusicService = async (UserId) => {
    const pool = await connectDB();
    const result = await pool.request().input("UserId", sql.Int, UserId).execute("GetLikedMusics");
    return result.recordsets;
}
export const CreateplaylistService = async (userId, title) => {
    const pool = await connectDB();
    const result = await pool.request().input("UserId", sql.Int, userId).input("Title", sql.VarChar(255), title).execute("CreatePlaylist");
    return result.recordset;
}

export const AddMusicToPlaylistService = async (PlaylistId, MusicId) => {
    const pool = await connectDB();
    const result = await pool.request().input("PlaylistId", sql.Int, PlaylistId).input("MusicId", sql.Int, MusicId).execute("AddMusicToPlaylist");
    return result.recordset;
}
export const GetplaylistService = async (playlistId) => {
    const pool = await connectDB();
    const result = await pool.request().input("PlaylistId", sql.Int, playlistId).execute("GetMusicsByPlaylist");
    return result.recordsets;
}
export const GetplaylistTitleservice = async (userId) => {
    const pool = await connectDB();
    const result = await pool.request().input("UserId", sql.Int, userId).execute("GetPlaylistsTitle");
    return result.recordset;
}

export const DeletePlaylistService = async (playlistId, userId) => {
    const pool = await connectDB();
    const result = await pool.request()
        .input("PlaylistId", sql.Int, playlistId)
        .input("UserId", sql.Int, userId)
        .execute("DeletePlaylist");
    return result;
}

export const DeleteMusicFromPlaylistService = async (playlistId, musicId, userId) => {
    const pool = await connectDB();
    const result = await pool.request()
        .input("PlaylistId", sql.Int, playlistId)
        .input("MusicId", sql.Int, musicId)
        .input("UserId", sql.Int, userId)
        .execute("DeleteMusicFromPlaylist");
    return result;
}
export const GetFollowuserIdService = async (userId) => {
    const pool = await connectDB();
    const result = await pool.request().input("UserId", sql.Int, userId).execute("GetFollowers");
    return result.recordset;
}
export const DoCommentService = async (userId, musicId, comment) => {
    const pool = await connectDB();
    const result = await pool.request().input("UserId", sql.Int, userId).input("MusicId", sql.Int, musicId).input("Comment", sql.VarChar(sql.MAX), comment).execute("DoComment");
    return result.recordset;
}
export const GetMusicBymusicIdService = async (musicId) => {
    const pool = await connectDB();
    const result = await pool.request().input("MusicId", sql.Int, musicId).execute("GetMusicBymusicId");
    return result.recordset;
}
export const GetCommentsByMusicIdService = async (musicId) => {
    const pool = await connectDB();
    const result = await pool.request().input("MusicId", sql.Int, musicId).execute("GetCommentsByMusicID");
    return result.recordsets;
}
export const DeleteCommentService = async (userId, commentId) => {
    const pool = await connectDB();
    const result = await pool.request().input("UserId", sql.Int, userId).input("CommentId", sql.Int, commentId).execute("DeleteComment");
    return result.recordset;
}
export const deletePlaylistService = async (playlistId) => {
    const pool = await connectDB();
    const result = await pool.request().input("PlaylistId", sql.Int, playlistId).execute("DeletePlaylist");
    return result.recordset;
}
export const DeletePlaylistMusicService = async (playlistId, musicId) => {
    const pool = await connectDB();
    const result = await pool.request().input("PlaylistId", sql.Int, playlistId).input("MusicId", sql.Int, musicId).execute("DeleteMusicFromPlaylist");
    return result.recordset;
}
export const GetLikedMusicByIdService = async (musicId, userId) => {
    const pool = await connectDB();
    const result = await pool.request().input("MusicId", sql.Int, musicId).input("UserId", sql.Int, userId).execute("GetLikeMusicByID");
    return result.recordset;
}
export const GetalbumService = async () => {
    const pool = await connectDB();
    const result = await pool.request().execute("Getalbum");
    return result.recordsets;
}
export const GetAlbumbyIdService = async (albumId) => {

    const pool = await connectDB();
    const result = await pool.request().input("albumId", sql.Int, albumId).execute("GetAlbumbyId");
    return result.recordset;
}
export const createNotificationService = async ({
    senderId,
    receiverId,
    type,
    MusicId = null,
    commentId = null,
}) => {

    const pool = await connectDB();

    const result = await pool.request()
        .input("SenderId", sql.Int, senderId)
        .input("ReceiverId", sql.Int, receiverId)
        .input("Type", sql.VarChar, type)
        .input("MusicId", sql.Int, MusicId)
        .input("CommentId", sql.Int, commentId)
        .execute("CreateNotification");

    return result
};

export const getNotificationService = async (userId) => {
    const pool = await connectDB();
    const result = await pool.request()
        .input("UserId", sql.Int, userId)
        .execute("GetNotifications");
    return result.recordsets;
}
export const deleteMusicService = async (musicId,userId) => {
    console.log(musicId,userId);
    
    const pool = await connectDB();
    const result = await pool.request()
        .input("UserId", sql.Int, userId)
        .input("MusicId", sql.Int, musicId).execute("DeleteMusic");
    return result.recordset;
}
export const EditMusicService = async ({ MusicId, UserId, Title, Artist, AudioFile, bgPic }) => {
    const pool = await connectDB();
    try {
        const result = await pool.request()
            .input("MusicId", sql.Int, MusicId)
            .input("UserId", sql.Int, UserId)
            .input("Title", sql.VarChar(255), Title)
            .input("Artist", sql.VarChar(255), Artist)
            .input("AudioFile", sql.VarChar(sql.MAX), AudioFile)
            .input("bgPic", sql.VarChar(sql.MAX), bgPic)
            .execute("EditMusic");
        return result.recordset;
    } catch (error) {
        console.error("Error editing music:", error);
        throw error;
    }
};
