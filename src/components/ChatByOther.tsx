

interface ChatByOtherProps {
    timestamp: string
    msg: string
    initial: string
}


const ChatByOther = ({timestamp, msg, initial}: ChatByOtherProps) => {
  return (
    <>
      <div className='chat chat-start '>
        <div className='chat-image avatar'>
          <div className='w-10 rounded-full'>
            {/* <img
              alt='Tailwind CSS chat bubble component'
              src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
            /> */}
            <div className="h-full w-full rounded-full flex justify-center items-center bg-slate-200">
              <span className="text-sm font-mono font-semibold">{initial}</span>
            </div>
          </div>
        </div>
        <div className='chat-header'>
      
          <time className='text-xs opacity-50'>{new Date(timestamp).toLocaleTimeString()}</time>
        </div>
        <div className='chat-bubble chat-bubble-accent'>{msg}</div>
      </div>
    </>
  );
};

export default ChatByOther;
