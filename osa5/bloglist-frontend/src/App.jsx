import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    //console.log('logging in with', username, password)
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('Wrong username or password')
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      returnedBlog.user = user
      setBlogs(blogs.concat(returnedBlog).sort((a, b) => b.likes - a.likes))

      setMessage(`A new blog added: ${returnedBlog.title} by ${returnedBlog.author}`)
      setTimeout(() => { setMessage(null) }, 5000)
      blogFormRef.current.toggleVisibility()
    } catch {
      setErrorMessage('Blog title or URL missing')
      setTimeout(() => { setErrorMessage(null) }, 5000)
    }
  }

  const updateBlog = async (blog) => {
    //console.log(blog)
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    updatedBlog.user = blog.user.id
    //console.log(updatedBlog)
    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    returnedBlog.user = blog.user
    setBlogs(blogs.map(b => (b.id !== blog.id ? b : returnedBlog)).sort((a, b) => b.likes - a.likes))
    //console.log(returnedBlog)
  }

  const deleteBlog = async (blog) => {
    if (window.confirm(`Delete ${blog.title} by ${blog.author}?`)) {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((n => blog.id !== n.id)).sort((a, b) => b.likes - a.likes))
    }
  }


  if (user === null) {
    return(
      <div>
        <h2>Login to application</h2>
        {errorMessage && ( <div className='error'>{errorMessage}</div> )}
        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      {message && ( <div className='success'>{message}</div> )}
      {errorMessage && ( <div className='error'>{errorMessage}</div> )}

      {user.name} logged in  <button onClick={handleLogout}>logout</button>

      <Togglable ref={blogFormRef} >
        <BlogForm createBlog={createBlog} />
      </Togglable>

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          update={() => updateBlog(blog)}
          remove={() => deleteBlog(blog)}
          user={user}
        />
      )}
    </div>
  )
}

export default App