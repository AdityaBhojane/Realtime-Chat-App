
function UserInvite() {
  return (
    <div className='w-full h-screen bg-gray-700 flex justify-center items-center'>
        <div className="text-center">
            <input type="text" placeholder='enter username' className='p-2 bg-slate-500 rounded-xl text-white my-2' />
            <br />
            <button className='px-2 py-1 bg-blue-500 rounded-xl text-white'>Start Chatting</button>
        </div>
    </div>
  )
}

export default UserInvite