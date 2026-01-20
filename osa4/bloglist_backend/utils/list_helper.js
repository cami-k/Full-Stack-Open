const _ = require("lodash")

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.map((blog) => blog.likes)
    const total = likes.reduce((sum, e) => sum + e, 0)
    return total
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    const favorite = blogs.reduce(
        (soFar, e) => e.likes > soFar.likes ? e : soFar
    )
    return favorite
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    const grouped = _.groupBy(blogs, 'author')
    const blogsByAuthor = Object.entries(grouped).map(([author, blogs]) => ({author: author, blogs: blogs.length}))
    return _.maxBy(blogsByAuthor, 'blogs')
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    const grouped = _.groupBy(blogs, 'author')
    const likesByAuthor = Object.entries(grouped).map(([author, blogs]) => ({author: author, likes: totalLikes(blogs)}))
    return _.maxBy(likesByAuthor, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}