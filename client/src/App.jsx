import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { getProfileThunk } from './store/slice/user/user.thunk'
function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    (async()=>{
      await dispatch(getProfileThunk())

    })()
  }, [])

  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
    </>
  )
}

export default App
