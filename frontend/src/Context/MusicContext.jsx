import axios from 'axios'
import { useContext, createContext } from 'react'
import toast, { Toaster } from 'react-hot-toast'

const MusicContext = createContext()

const API_BASE_URL = "https://musora-app-production.up.railway.app/api/music";

export const MusicProvider = ({ children }) => {

  const LikedMusic = async (MusicId, ownerId) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/like-Music/`, { MusicId, ownerId }, { withCredentials: true })
      return data || []
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  }

  const GetLikeMusic = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/Get-liked-Music`, { withCredentials: true })
      return data || []
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch liked music");
    }
  }

  const createPlaylist = async (title) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/create-playlist`, { title }, { withCredentials: true })
      return data;
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create playlist");
    }
  }

  const GetPlaylist = async (titleId) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-playlist/${titleId}`, { withCredentials: true })
      return data || []
    }
    catch (err) {
      toast.error(err?.response?.data?.message);
    }
  }

  const GetplaylistTitles = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-playlist-title`, { withCredentials: true })
      return data || []
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch playlist titles");
    }
  }

  const GetALLMusic = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-music`, { withCredentials: true })
      return data.result || [];
    } catch (err) {
      console.error("Error fetching music:", err);
      toast.error(err?.response?.data?.message || "Failed to fetch music");
      throw err;
    }
  }

  const addMusicInsidePlaylist = async (musicId, playlistId) => {
    try {
      const result = await axios.post(`${API_BASE_URL}/add-to-playlist/${musicId}`, { playlistId }, {
        withCredentials: true
      })
      return result.data || []
    }
    catch (err) {
      console.log(err);
      throw err;
    }
  }

  const GetMusicById = async (id) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-Music/${id}`, { withCredentials: true })
      console.log("Id", id);
      
      return data || []
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch music");
      throw err;
    }
  }

  const addMusic = async (FormData) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/add`,
        FormData,
        { withCredentials: true }
      )
      return data
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add music")
      throw err;
    }
  }

  const editMusic = async (FormData) => {
    try {
      const { data } = await axios.put(`${API_BASE_URL}/update-Music`,
        FormData,
        { withCredentials: true }
      )
      return data
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update music")
      throw err;
    }
  }

  const GetFollower = async (id) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-followers/${id}`, { withCredentials: true })
      return data || []
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch followers");
      throw err;
    }
  }

  const doComment = async ({ musicId, comment, ownerId }) => {
    try {
      const { data: response } = await axios.post(`${API_BASE_URL}/comment`, { musicId, comment, ownerId }, { withCredentials: true })
      return response || []
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add comment");
      throw err;
    }
  }

  const GetMusicBymusicId = async (musicId) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-MusicById/${musicId}`, { withCredentials: true })
      return data || []
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch music");
      throw err;
    }
  }

  const GetCommentBymusicId = async (musicId) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-comments/${musicId}`, { withCredentials: true })
      return data || []
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch comments");
      throw err;
    }
  }

  const Getalbum = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-albums`, { withCredentials: true })
      return data || []
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch albums");
      throw err;
    }
  }

  const DeleteComment = async (commentId) => {
    try {
      const { data } = await axios.delete(`${API_BASE_URL}/delete-comment`, { data: { commentId }, withCredentials: true })
      return data || []
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete comment");
      throw err;
    }
  }

  const GetlikeMusicbyId = async (id) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-liked-music-by-id/${id}`, {
        withCredentials: true,
        timeout: 5000
      })
      return data || []
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch like music");
      throw err;
    }
  }

  const DeletePlaylist = async (playlistId) => {
    try {
      const { data } = await axios.delete(`${API_BASE_URL}/delete-playlist`, { data: { playlistId }, withCredentials: true })
      return data || []
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete playlist");
      throw err;
    }
  }

  const DeleteMusicFromPlaylist = async (playlistId, musicId) => {
    try {
      const { data } = await axios.delete(`${API_BASE_URL}/delete-playlist-music`, { data: { playlistId, musicId }, withCredentials: true })
      return data || []
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove music from playlist");
      throw err;
    }
  }

  const CreateAlbum = async (FormData) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/add-music-inside-album`, FormData, { withCredentials: true })
      return data || []
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create album");
      throw err;
    }
  }

  const GetMyMusic = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-my-music`, { withCredentials: true })
      return data.result || []
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch your music");
      throw err;
    }
  }

  const GetalbumById = async (albumId) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-albumbyId/${albumId}`, { withCredentials: true })
      return data || []
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch album");
      throw err;
    }
  }

  const getNotification = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/get-notifications`, { withCredentials: true })
      return data.result || []
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to fetch notifications");
      throw err;
    }
  }

  const DeleteMusic = async (musicId) => {
    try {
      const { data } = await axios.delete(`${API_BASE_URL}/delete-music`, { data: { musicId }, withCredentials: true })
      return data || []
    }
    catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete music");
      throw err;
    }
  }

  return (
    <MusicContext.Provider value={{
      editMusic,
      DeleteMusic,
      getNotification,
      GetalbumById,
      GetMyMusic,
      Getalbum,
      CreateAlbum,
      DeletePlaylist,
      DeleteMusicFromPlaylist,
      GetlikeMusicbyId,
      doComment,
      GetMusicBymusicId,
      GetFollower,
      LikedMusic,
      GetALLMusic,
      GetLikeMusic,
      GetPlaylist,
      createPlaylist,
      GetplaylistTitles,
      addMusicInsidePlaylist,
      GetMusicById,
      addMusic,
      GetCommentBymusicId,
      DeleteComment
    }}>
      {children}
      <Toaster position="top-center" reverseOrder={false} />
    </MusicContext.Provider>
  )
}

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  return context;
}