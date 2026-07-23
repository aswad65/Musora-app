import express from "express";
const router = express.Router();
import { CreateMusicController,EditMusicController, deleteMusicController,getNotificationController, GetMyMusicController, GetAlbumbyIdController, GetalbumController, DoCommentController, addmusicInsidAlbumController, GetLikedMusicByIdController, DeletePlaylistMusicController, deletePlaylistController, DeleteCommentController, GetCommentsByMusicIdController, GetMusicBymusicidController, GetAllMusicController, GetFollowuserIdController, GetPlaylistController, GetPlaylistTitlesController, GetMusicByIdController, LikeMusicController, AddMusicToPlaylistController, GetLikeMusicController, CreateplaylistController  } from "../controllers/Music.controller.js";

// ... existing routes ...

router.get("/get-my-music", IsAUTh, GetMyMusicController);
import IsAUTh from "../middlewares/Auth.js";
import uploadFile from "../middlewares/multer.js";
import uploadAlbumPicture from "../middlewares/Multerforalbum.js";

router.post("/add",IsAUTh ,uploadFile,CreateMusicController);  
router.get("/get-Music",IsAUTh, GetAllMusicController);
router.get("/get-Music/:id",IsAUTh, GetMusicByIdController);
router.post("/like-Music/", IsAUTh, LikeMusicController);
router.post("/create-playlist", IsAUTh, CreateplaylistController);
router.post("/add-to-playlist/:id", IsAUTh, AddMusicToPlaylistController);
router.get("/Get-liked-Music", IsAUTh, GetLikeMusicController);
router.get("/get-playlist/:playlistid", IsAUTh, GetPlaylistController);
router.get("/get-playlist-title", IsAUTh, GetPlaylistTitlesController);
router.get("/get-followers/:userId", IsAUTh, GetFollowuserIdController);
router.post("/comment", IsAUTh, DoCommentController);
router.get("/get-MusicById/:musicId", IsAUTh, GetMusicBymusicidController);   
router.get("/get-comments/:musicId", IsAUTh, GetCommentsByMusicIdController);
router.delete("/delete-comment", IsAUTh, DeleteCommentController);
router.delete("/delete-playlist", IsAUTh, deletePlaylistController);
router.delete("/delete-playlist-music", IsAUTh, DeletePlaylistMusicController);
router.get("/get-liked-music-by-id/:musicId", IsAUTh, GetLikedMusicByIdController);
router.post("/add-music-inside-album", IsAUTh, uploadAlbumPicture,addmusicInsidAlbumController);
router.get("/get-albums", IsAUTh, GetalbumController);
router.get("/get-albumbyId/:albumId", IsAUTh, GetAlbumbyIdController);
router.delete("/delete-music", IsAUTh, deleteMusicController);
router.get("/get-notifications", IsAUTh, getNotificationController);
router.put("/update-Music", IsAUTh, uploadFile,EditMusicController);


export default router;