import toast from 'react-hot-toast'
export const ok = (msg) => toast.success(msg)
export const oops = (msg) => toast.error(msg || 'Something went wrong')
