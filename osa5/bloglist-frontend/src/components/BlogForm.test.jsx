import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls the event handler with the right details when a new blog is created', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('title:')
  const authorInput = screen.getByLabelText('author:')
  const urlInput = screen.getByLabelText('url:')

  const submitButton = screen.getByText('create')

  await user.type(titleInput, 'React patterns')
  await user.type(authorInput, 'Michael Chan')
  await user.type(urlInput, 'https://reactpatterns.com/')

  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('React patterns')
  expect(createBlog.mock.calls[0][0].author).toBe('Michael Chan')
  expect(createBlog.mock.calls[0][0].url).toBe('https://reactpatterns.com/')
})