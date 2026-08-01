import { addmusicInsidAlbum,getNotificationService,EditMusicService,deleteMusicService, createNotificationService,GetMusicByUserIDService,GetalbumService,GetAlbumbyIdService, DeletePlaylistMusicService, GetLikedMusicByIdService, CreateMusicservice, deletePlaylistService, DeleteCommentService, GetCommentsByMusicIdService, DoCommentService, GeAlltMusicService, GetplaylistService, GetMusicBymusicIdService, GetMusicById, LikeMusicservice, AddMusicToPlaylistService, GetplaylistTitleservice, GetLikeMusicService, CreateplaylistService, GetFollowuserIdService, DeletePlaylistService, DeleteMusicFromPlaylistService } from "../services/music.service.js";

// ... existing code ...

export const GetMyMusicController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await GetMusicByUserIDService(userId);
        res.status(200).json({ result });
    } catch (error) {
        console.error("Error fetching my music:", error);
        res.status(500).json({ message: error.message || "Failed to fetch your music" });
    }
}
import getdataUri from "../Utils/URlGenerator.js";
import cloudinary from "cloudinary";
import { resolveGeneratedAudioInput } from "../Utils/generatedAudioResolver.js";

export const CreateMusicController = async (req, res) => {
    try {
        const { title, artist } = req.body;
        const userId = req.user.userId;

        const bgPicFile = req.files?.bgPic?.[0];
        const audioResolution = await resolveGeneratedAudioInput(req);

        if (!audioResolution?.file) {
            return res.status(400).json({ error: "Audio file is required" });
        }

        const audioFile = audioResolution.file;
        const bgPicUri = bgPicFile ? getdataUri(bgPicFile) : null;

        // 1. Generate Data URIs
        const audioUri = getdataUri(audioFile);

        // 2. Upload to Cloudinary
        const uploadedAudio = await cloudinary.v2.uploader.upload(audioUri.content, {
            resource_type: "video", // "video" is used for audio files in Cloudinary
            folder: "music_app/audio"
        });

        let uploadedBgPicUrl = "";
        if (bgPicUri) {
            const uploadedBgPic = await cloudinary.v2.uploader.upload(bgPicUri.content, {
                resource_type: "image",
                folder: "music_app/covers"
            });
            uploadedBgPicUrl = uploadedBgPic.secure_url;
        }

        // 3. Save to Database
        const result = await CreateMusicservice(
            title,
            artist,
            uploadedAudio.secure_url,
            userId,
            uploadedBgPicUrl
        );

        res.status(201).json({ message: "Music added successfully", result });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: error.message || "Failed to upload music" });
    }
};
export const GetAllMusicController = async (req, res) => {
    try {
        const Music = await GeAlltMusicService();
        res.status(200).json({ result: Music });
    }
    catch (error) {
        res.status(500).json({ message: error.message || "Failed to fetch music" });
    }
}
export const GetMusicByIdController = async (req, res) => {
    try {
        const userId = req?.params?.id;
        const recordset = await GetMusicById(userId);
        const music = recordset;
        

        if (!music) {
            return res.status(404).json({ message: "Music not found" });
        }

      

        res.status(200).json({ music });
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to fetch music" });
    }
}
export const LikeMusicController = async (req, res) => {
    const {MusicId,ownerId} = req.body
    const userId = req.user.userId
    
    
    await createNotificationService({
        senderId: ownerId,
        receiverId: userId,
        type: "like",
        MusicId:MusicId,
    });

    const result = await LikeMusicservice(MusicId, userId);
    res.status(201).json({ message: result })
}
export const addmusicInsidAlbumController = async (req, res) => {
    try {
        const { Title, Description, MusicIds } = req.body;
        const bgPic = req.file;
        const userId = req.user.userId;
        let coverImageUrl = "";
        if (bgPic) {
            const formattedPic = getdataUri(bgPic);
            const coverImage = await cloudinary.v2.uploader.upload(formattedPic.content, {
                resource_type: "image",
                folder: "music_app/covers"
            });
            coverImageUrl = coverImage.secure_url;
        }else{
            console.log("BgPic is undefined");
            
        }

        const ides = JSON.parse(MusicIds);
        const ids = JSON.stringify(ides);
        const result = await addmusicInsidAlbum(Title, Description, ids, userId, coverImageUrl);
        res.status(201).json({ message: "Album created successfully", result });
    } catch (error) {
        console.error("Error adding music to album:", error);
        res.status(500).json({ message: error.message || "Failed to add music to album" });
    }
}
export const GetLikeMusicController = async (req, res) => {
    const userId = req.user.userId
    const result = await GetLikeMusicService(userId);
    res.status(201).json({ result })
}

export const CreateplaylistController = async (req, res) => {
    try {
        const userId = req.user.userId
        const { title } = req.body
        const result = await CreateplaylistService(userId, title);
        res.status(201).json({ message: "Playlist created successfully", result })
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Failed to create playlist" })
    }
}
export const AddMusicToPlaylistController = async (req, res) => {
    try {
        const MusicId = req.params.id;
        const PlaylistId = req.body.playlistId
        const result = await AddMusicToPlaylistService(PlaylistId, MusicId);
        res.status(201).json({ message: result })
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to add music to playlist" })
    }
}
export const GetPlaylistController = async (req, res) => {
    try {
        const playlistId = req.params.playlistid
        const result = await GetplaylistService(playlistId);
        res.status(201).json({ result })
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to fetch playlist" })
    }
}
export const GetPlaylistTitlesController = async (req, res) => {
    try {
        const userId = req.user.userId
        const result = await GetplaylistTitleservice(userId);
        res.status(201).json({ result })
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to fetch playlist titles" })
    }
}
export const GetFollowuserIdController = async (req, res) => {
    try {
        const userId = req.user.userId
        const result = await GetFollowuserIdService(userId);
        res.status(201).json({ result })
    }
    catch (err) {
        res.status(500).json({ message: err.message || "Failed to fetch followers" })
    }   
}

export const DoCommentController = async (req, res) => {
    try {
        const userId = req.user.userId
        const { musicId, comment, ownerId } = req.body

        const result = await DoCommentService(userId, musicId, comment);
        const commentId = result?.[0]?.CommentId;                
        await createNotificationService({
            senderId: ownerId,
            receiverId: userId,
            commentId:commentId,
            type: "comment",
            MusicId:musicId,
        });

        res.status(201).json({ message: "Comment added successfully", result })


    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to add comment" })
    }
}
export const GetMusicBymusicidController = async (req, res) => {
    try {
        const musicId = req.params.musicId;
        
        const recordset = await GetMusicBymusicIdService(musicId);
        const music = recordset;
        if (!music) {
            return res.status(404).json({ message: "Music not found" });
        }
        res.status(200).json({ music });
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to fetch music" });
    }
}
export const GetCommentsByMusicIdController = async (req, res) => {
    try {
        const musicId = req.params.musicId;
        
        const recordset = await GetCommentsByMusicIdService(musicId);
        const comments = recordset;
        if (!comments) {
            return res.status(404).json({ message: "Comments not found" });
        }

        res.status(200).json({ comments });
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to fetch comments" });
    }
}  
export const DeleteCommentController = async (req, res) => {
    try {
        const {commentId} = req.body
        const userId = req.user.userId
        const result = await DeleteCommentService(userId, commentId);
        res.status(200).json({ message: "Comment deleted successfully", result });
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to delete comment" });
    }
}
export const deletePlaylistController = async (req, res) => {
    try {
        const {playlistId} = req.body
        const result = await deletePlaylistService(playlistId);
        res.status(200).json({ message: "Playlist deleted successfully", result });
    }   
    catch (err) {
        res.status(500).json({ message: err.message || "Failed to delete playlist" });
    }
}

export const GetLikedMusicByIdController = async (req, res) => {
    try {
        const userId = req.user.userId
        const musicId = req.params.musicId;
      
        
        const recordset = await GetLikedMusicByIdService(musicId, userId);
        const likedMusic = recordset;
        res.status(200).json({ likedMusic });
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to fetch liked music" });
    }
}



export const DeletePlaylistMusicController = async (req, res) => {
    try {
        const { playlistId, musicId } = req.body;
        if (!playlistId || !musicId) {
            return res.status(400).json({ message: "Playlist ID and music ID are required" });
        }
        const result = await DeletePlaylistMusicService(playlistId, musicId);
        res.status(200).json({ message: "Music removed from playlist successfully", result });
    } catch (err) {
        console.error("Remove music from playlist error:", err);
        res.status(500).json({ message: err.message || "Failed to remove music from playlist" });
    }
};
export const GetalbumController=async(_,res)=>{
    const result=await GetalbumService();
    res.status(200).json({ result });
}
export const GetAlbumbyIdController=async(req,res)=>{
    const albumId=req.params.albumId;
    
    const result=await GetAlbumbyIdService(albumId);
    res.status(200).json({ result });
}
export const getNotificationController = async (req, res) => {
    try {
        const userId = req.user.userId;
        const result = await getNotificationService(userId);
        
        res.status(200).json({ result });
    } catch (err) {
        res.status(500).json({ message: err.message || "Failed to fetch notifications" });
    }
}

export const deleteMusicController = async (req, res) => {
    try {
        const {musicId} = req.body;
        const userId = req.user.userId;
        

        // Get Existing Music
        const music = await GetMusicBymusicIdService(musicId);
        if (!music) {
            return res.status(404).json({
                success: false,
                message: "Music not found",
            });
        }

        // Delete Audio From Cloudinary
        if (music.audiourl) {
            await cloudinary.v2.uploader.destroy(
                music.audiourl,
                {
                    resource_type: "video",
                }
            );
        }

        // Delete Image From Cloudinary
        if (music.bgPic) {
            await cloudinary.v2.uploader.destroy(
                music.bgPic
            );
        }

        // Delete Music From Database
        const result = await deleteMusicService(musicId, userId);
        console.log(result);
        

        return res.status(200).json({
            success: true,
            message: "Music deleted successfully",
            result,
        });

    } catch (err) {
        console.error("Delete music error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Failed to delete music",
        });
    }
};

export const EditMusicController = async (req, res) => {
    try {
        const { MusicId, Title, Artist } = req.body;
        console.log(MusicId, Title, Artist);
        
        const UserId = req.user.userId;

        // Get old music data - use existing service to maintain consistency
        const oldMusicRecord = await GetMusicBymusicIdService(MusicId);
        if (!oldMusicRecord) {
            return res.status(404).json({ success: false, message: "Music not found" });
        }

        let audioUrl = oldMusicRecord.audiourl;
        let bgPicUrl = oldMusicRecord.bgPic || "";
        let audioPublicId = oldMusicRecord.audiopublicid;
        let bgPicPublicId = oldMusicRecord.bgPic;

        // =========================
        // Update Audio File if provided
        // =========================
        if (req.files?.audio?.[0]) {
            // Delete old audio from Cloudinary if it exists
            if (audioPublicId) {
                await cloudinary.v2.uploader.destroy(audioPublicId, {
                    resource_type: "video"
                });
            }

            // Generate data URI and upload new audio (matches CreateMusicController pattern)
            const audioUri = getdataUri(req.files.audio[0]);
            const newAudioUpload = await cloudinary.v2.uploader.upload(audioUri.content, {
                resource_type: "video",
                folder: "music_app/audio"
            });

            audioUrl = newAudioUpload.secure_url;
            audioPublicId = newAudioUpload.public_id;
        }

        // =========================
        // Update Background Image if provided
        // =========================
        if (req.files?.bgPic?.[0]) {
            // Delete old background image from Cloudinary if it exists
            if (bgPicPublicId) {
                await cloudinary.v2.uploader.destroy(bgPicPublicId);
            }

            // Generate data URI and upload new image (matches CreateMusicController pattern)
            const bgPicUri = getdataUri(req.files.bgPic[0]);
            const newBgPicUpload = await cloudinary.v2.uploader.upload(bgPicUri.content, {
                resource_type: "image",
                folder: "music_app/covers"
            });

            bgPicUrl = newBgPicUpload.secure_url;
            bgPicPublicId = newBgPicUpload.public_id;
        }

        // Update database with new values
        const result = await EditMusicService({
            MusicId,
            UserId,
            Title,
            Artist,
            AudioFile: audioUrl,
            bgPic: bgPicUrl,
            AudioPublicId: audioPublicId,
            bgPicPublicId: bgPicPublicId
        });

        return res.status(200).json({ success: true, message: result.Message });
    } catch (error) {
        console.error("Error updating music:", error);
        return res.status(500).json({ success: false, message: error.message || "Failed to update music" });
    }
};
