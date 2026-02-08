import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('<Blog /> renders title', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('React patterns', { exact: false })
  expect(element).toBeDefined()
})


test('renders url, likes and user after clicking the view-button', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      name: 'Jack Smith',
      username: '_jack_'
    }
  }

  const testUser = {
    username: '_jack_'
  }

  render(<Blog blog={blog} user={testUser} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.getByText('React patterns', { exact: false })
  screen.getByText('https://reactpatterns.com/')
  screen.getByText('7', { exact: false })
  screen.getByText('Jack Smith')
})

test('clicking the like-button twice calls event handler twice', async () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      name: 'Jack Smith',
      username: '_jack_'
    }
  }

  const testUser = {
    username: '_jack_'
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} user={testUser} update={mockHandler} />)

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})