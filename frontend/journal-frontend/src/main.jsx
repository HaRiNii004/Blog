import { createRoot } from 'react-dom/client'
import './index.css'
import Write from './pages/write/write.jsx'
import ViewPosts from './pages/write/viewposts/viewposts.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <>
      <Toaster position="top-right" />

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ViewPosts />} />
      <Route path="/createnew" element={<Write />} />
     
      <Route path="/edit/:id" element={<Write />} />
    </Routes>
  </BrowserRouter>
  </>
)
