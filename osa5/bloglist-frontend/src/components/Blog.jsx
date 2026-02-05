import { useState } from 'react'

const Blog = ({ blog, update, remove, user }) => {

  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    padding: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginTop: 5
  }

  return(
    <div style={blogStyle}>
      <div>{blog.title} {blog.author} <button onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'hide' : 'view'}</button></div>
      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={update}>like</button></div>
          <div>{blog.user.name}</div>
          {blog.user.username === user.username && (
            <button onClick={remove} style={{ backgroundColor: 'blue' }}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog