import React, { useState } from 'react';
import useDoComment from '../Hooks/MusicHooks/DoComments';
import useGetCommentBymusicId from '../Hooks/MusicHooks/GetCommentBymusicId';
import useDeleteComment from '../Hooks/MusicHooks/DeleteComments';
import { Trash2 } from 'lucide-react';
import { useGetUser } from '../Hooks/GetUsers';

const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(30, 41, 59, 0.5);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #818cf8 0%, #6366f1 100%);
    border-radius: 10px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #a5b4fc 0%, #818cf8 100%);
  }
`;

export const CommentSection = ({musicId,ownerId}) => {


  const {data:User}=useGetUser();  
  const [input, setInput] = useState('');
  const {mutate}=useDoComment()
  const {data:commentData, refetch}=useGetCommentBymusicId(musicId)
  const comment=commentData?.comments?.[0] || []
  const {mutate:deleteComment}=useDeleteComment()

  const handleDeleteComment = async (commentId) => {
    deleteComment(commentId);
    
  };

  
 
  const handleAddComment = () => {
    if (!input.trim()) return;
    if (!ownerId) return;

    mutate({
    musicId: musicId,
    ownerId:ownerId,
    comment: input
    });
  

    setInput('');
  };
  

  return (
    <div className="space-y-8">
      <style>{scrollbarStyles}</style>

      <section className="bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-800/50 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">
            Comments
          </h3>
        </div>

        {/* Input Bar */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a song or comment..."
            className="flex-1 px-4 py-2 rounded-xl bg-slate-800 text-white text-sm outline-none border border-slate-700 focus:border-indigo-500"
          />

          <button
            onClick={() => handleAddComment(comment?.CommentId)}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition"
          >
            Post
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {comment?.map((comment) => (
            <div
              key={comment?.userId}

              className="flex items-center gap-4 p-3 rounded-2xl border border-slate-800 bg-slate-800/30"
            >
              {/* Avatar */}
              <img
                src={comment?.ProfilePicture||` https://api.dicebear.com/7.x/avataaars/svg?seed=${comment?.Name}`}
                className="w-10 h-10 rounded-full border border-slate-700"
                alt={comment.Email}
              />

              {/* Text */}
              <div className="flex-1">
                <p className="text-[11px] font-bold text-white">
                  {comment.Name}
                </p>
                <p className="text-[15px] text-indigo-400">
                  {comment?.comments}
                </p>
              </div>

              {/* Delete Button */}
             {User?.userId===comment?.IDOfuser && <button
                onClick={() => handleDeleteComment(comment?.CommentId)}
                className="p-2 hover:bg-slate-700 rounded-lg transition text-red-400 hover:text-red-300"
                title="Delete comment"
              >
                 <Trash2 size={18} />
              </button>}
            </div>
          ))}
        </div>

      </section>
    </div>
  );
};